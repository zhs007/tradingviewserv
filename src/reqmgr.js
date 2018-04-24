"use strict";

const proto = require('../proto/tradingview');

class RequestMgr {
    constructor() {
        this.mapReq = {};
    }

    onMessage(ws, buf) {
        let req = proto.decodeRequest(buf);
        if (req.hasOwnProperty('type') && this.mapReq.hasOwnProperty(req.type)) {
            let reqobj = this.mapReq[req.type].decode(req.buf);
            return {type: req.type, req: reqobj};
        }

        return undefined;
    }

    regRequest(type, funcDecode, funcOnRequest) {
        this.mapReq[type] = {
            decode: funcDecode,
            onRequest: funcOnRequest
        };
    }

    // callback(isok)
    onRequest(ws, type, req, callback) {
        if (this.mapReq.hasOwnProperty(type)) {
            try {
                this.mapReq[type].onRequest(ws, type, req, callback);
            }
            catch (err) {
                callback(false);
            }

            return ;
        }

        callback(false);
    }
};

exports.RequestMgr = RequestMgr;