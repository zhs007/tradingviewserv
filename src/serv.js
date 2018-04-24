"use strict";

const WebSocketServer = require('ws').Server;
const { RequestList } = require('./reqlist');
const { RequestMgr } = require('./reqmgr');
const { MessageMgr } = require('./msgmgr');

class TradingViewServer {
    constructor(host, port) {
        this.port = port;
        this.host = host;

        this.wss = undefined;
        this.mgrRequest = new RequestMgr();
        this.mgrMessage = new MessageMgr();
    }

    init() {
        let wss = new WebSocketServer({host: this.host, port: this.port});
        this.wss = wss;

        wss.on('connection', (ws) => {
            this.onConnect(ws);

            ws.on('message', (msg) => {
                this.onMessage(ws, msg);
            });

            ws.on('close', (code, msg) => {
                this.onClose(ws);
            });

            ws.on('error', (err) => {
                this.onError(err);
            });
        });
    }

    onConnect(ws) {
        ws.lstRequest = new RequestList();
    }

    onMessage(ws, buf) {
        let obj = this.mgrRequest.onMessage(ws, buf);
        if (obj) {
            ws.lstRequest.onRequest(ws, obj.type, obj.req, this.mgrRequest);
        }
    }

    onClose(ws) {
    }

    onError(ws) {
    }

    sendMsg(ws, type, msg) {
        let buf = this.mgrMessage.encodeMsg(type, msg);
        ws.send(buf);
    }
};

exports.TradingViewServer = TradingViewServer;