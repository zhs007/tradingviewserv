"use strict";

const subscribe = require('./req/subscribe');

function regAllRequest(serv) {
    subscribe.regRequest(serv);
}

exports.regAllRequest = regAllRequest;