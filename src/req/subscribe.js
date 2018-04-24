"use strict";

const proto = require('../../proto/tradingview');

function onRequest(serv, ws, type, req, callback) {
    callback(true);
}

function regRequest(serv) {
    serv.mgrRequest.regRequest(proto.encodeRequestType.SUBSCRIBE, proto.decodeReq_Subscribe, onRequest);
}

exports.regRequest = regRequest;
