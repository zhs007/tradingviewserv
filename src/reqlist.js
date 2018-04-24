"use strict";

class RequestList {
    constructor() {
        this.lst = [];
        this.curreq = undefined;
    }

    __onNext(ws, mgrRequest) {
        this.curreq = this.pop();
        if (this.curreq != undefined) {
            mgrRequest.onRequest(ws, this.curreq.type, this.curreq.req, (isok) => {
                this.__onNext(ws, mgrRequest);
            });
        }
    }

    onRequest(ws, type, reg, mgrRequest) {
        if (this.lst.length == 0 && this.curreq == undefined) {
            this.curreq = {type: type, req: req};

            mgrRequest.onRequest(ws, type, req, (isok) => {
                this.__onNext(ws, mgrRequest);
            });

            return ;
        }

        this.push(type, reg);
    }

    push(type, req) {
        this.lst.push({
            type: type,
            req: req
        });
    }

    pop() {
        if (this.lst.length <= 0) {
            return undefined;
        }

        let cq = this.lst[0];
        this.lst.splice(0, 1);
        return cq;
    }
};

exports.RequestList = RequestList;