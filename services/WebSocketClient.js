const WebSocket = require('ws');

// https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect

function WebSocketClient(eventEmitter) {
  this.number = 0;	// Message number
  this.autoReconnectInterval = 2 * 1000;	// ms
  this.eventEmitter = eventEmitter;
}

WebSocketClient.prototype.open = function (url) {
  this.url = url;
  this.instance = new WebSocket(this.url);
  this.instance.on('open', () => {
    this.onopen();
  });
  this.instance.on('message', (data, flags) => {
    this.number++;
    this.onmessage(data, flags, this.number);
  });
  this.instance.on('close', (e) => {
    switch (e) {
      case 1000:	// CLOSE_NORMAL
        console.log("WebSocket: closed");
        break;
      default:	// Abnormal closure
        this.reconnect(e);
        break;
    }
    this.onclose(e);
  });
  this.instance.on('error', (e) => {
    switch (e.code) {
      case 'ECONNREFUSED':
        this.reconnect(e);
        break;
      default:
        this.onerror(e);
        break;
    }
  });

  if (!this.pingInterval) {
    this.pingInterval = setInterval(()=> {
      this.pingCount = (this.pingCount || 0) + 1;
      console.log('doing ping', this.pingCount);
      this.instance.ping((err)=>{
      console.log('ping callback');
      if (err) {
        console.log('Error in ping callback')
        console.log(err);
        //todo: should we reconnect here
      }
    })}, 5000);
  }
  this.instance.on('pong', ()=> {
    this.pingCount -= 1;
    this.eventEmitter.emit('pingCount');
    console.log('doing pong', this.pingCount);
  });
}

WebSocketClient.prototype.send = function (data, option) {
  try {
    console.log('sending message - ', data);
    this.instance.send(data, option);
  } catch (e) {
    this.instance.emit('error', e);
  }
}

WebSocketClient.prototype.reconnect = function (e) {
  console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
  this.instance.removeAllListeners();
  var that = this;
  setTimeout(function () {
    console.log("WebSocketClient: reconnecting...");
    that.open(that.url);
  }, this.autoReconnectInterval);
}

WebSocketClient.prototype.onopen = function (e) { console.log("WebSocketClient: open", arguments); }
WebSocketClient.prototype.onmessage = function (data, flags, number) { console.log("WebSocketClient: message", arguments); }
WebSocketClient.prototype.onerror = function (e) { console.log("WebSocketClient: error", arguments); }
WebSocketClient.prototype.onclose = function (e) { console.log("WebSocketClient: closed", arguments); }

module.exports = WebSocketClient;
