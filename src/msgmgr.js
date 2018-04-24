"use strict";

const proto = require('../proto/tradingview');

class MessageMgr {
    constructor() {
        this.mapMsg = {};
    }

    encodeMsg(type, msg) {
        if (this.mapMsg.hasOwnProperty(type)) {
            let buf = this.mapMsg[type].encode(msg);
            return proto.encodeMessage({type: type, buf: buf});
        }

        return undefined;
    }

    regMessage(type, funcEncode) {
        this.mapMsg[type] = {
            encode: funcEncode
        };
    }
};

exports.MessageMgr = MessageMgr;