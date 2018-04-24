var exports = exports || {};
var ByteBuffer = ByteBuffer || require("bytebuffer");
exports.Long = ByteBuffer.Long;

(function(undefined) {

  function pushTemporaryLength(buffer) {
    var length = buffer.readVarint32();
    var limit = buffer.limit;
    buffer.limit = buffer.offset + length;
    return limit;
  }

  function skipUnknownField(buffer, type) {
    switch (type) {
      case 0: while (buffer.readByte() & 0x80) {} break;
      case 2: buffer.skip(buffer.readVarint32()); break;
      case 5: buffer.skip(4); break;
      case 1: buffer.skip(8); break;
      default: throw new Error("Unimplemented type: " + type);
    }
  }

  function coerceLong(value) {
    if (!(value instanceof ByteBuffer.Long) && "low" in value && "high" in value)
      value = new ByteBuffer.Long(value.low, value.high, value.unsigned);
    return value;
  }

  exports["encodeRequestType"] = {
    "SUBSCRIBE": 0,
    "UNSUBSCRIBE": 1
  };

  exports["decodeRequestType"] = {
    "0": "SUBSCRIBE",
    "1": "UNSUBSCRIBE"
  };

  exports["encodeMessageType"] = {
    "REQUESTRET": 0,
    "CANDLES": 1
  };

  exports["decodeMessageType"] = {
    "0": "REQUESTRET",
    "1": "CANDLES"
  };

  exports["encodeErrorType"] = {
    "ERR_SYSTEM": 0
  };

  exports["decodeErrorType"] = {
    "0": "ERR_SYSTEM"
  };

  exports["encodeRequest"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional RequestType type = 1;
    var value = message["type"];
    if (value !== undefined) {
      buffer.writeVarint32(8);
      buffer.writeVarint32(exports["encodeRequestType"][value]);
    }

    // optional bytes buf = 2;
    var value = message["buf"];
    if (value !== undefined) {
      buffer.writeVarint32(18);
      buffer.writeVarint32(value.length), buffer.append(value);
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeRequest"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional RequestType type = 1;
      case 1:
        message["type"] = exports["decodeRequestType"][buffer.readVarint32()];
        break;

      // optional bytes buf = 2;
      case 2:
        message["buf"] = buffer.readBytes(buffer.readVarint32()).toBuffer();
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeChannel"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional string symbol = 1;
    var value = message["symbol"];
    if (value !== undefined) {
      buffer.writeVarint32(10);
      var nested = new ByteBuffer(undefined, true);
      nested.writeUTF8String(value), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }

    // optional string channel = 2;
    var value = message["channel"];
    if (value !== undefined) {
      buffer.writeVarint32(18);
      var nested = new ByteBuffer(undefined, true);
      nested.writeUTF8String(value), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeChannel"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string symbol = 1;
      case 1:
        message["symbol"] = buffer.readUTF8String(buffer.readVarint32(), "b");
        break;

      // optional string channel = 2;
      case 2:
        message["channel"] = buffer.readUTF8String(buffer.readVarint32(), "b");
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeReq_Subscribe"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // repeated Channel channels = 1;
    var values = message["channels"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = exports["encodeChannel"](value);
        buffer.writeVarint32(10);
        buffer.writeVarint32(nested.byteLength), buffer.append(nested);
      }
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeReq_Subscribe"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Channel channels = 1;
      case 1:
        var limit = pushTemporaryLength(buffer);
        var values = message["channels"] || (message["channels"] = []);
        values.push(exports["decodeChannel"](buffer));
        buffer.limit = limit;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeReq_Unsubscribe"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // repeated Channel channels = 1;
    var values = message["channels"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = exports["encodeChannel"](value);
        buffer.writeVarint32(10);
        buffer.writeVarint32(nested.byteLength), buffer.append(nested);
      }
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeReq_Unsubscribe"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Channel channels = 1;
      case 1:
        var limit = pushTemporaryLength(buffer);
        var values = message["channels"] || (message["channels"] = []);
        values.push(exports["decodeChannel"](buffer));
        buffer.limit = limit;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeMessage"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional MessageType type = 1;
    var value = message["type"];
    if (value !== undefined) {
      buffer.writeVarint32(8);
      buffer.writeVarint32(exports["encodeMessageType"][value]);
    }

    // optional bytes buf = 2;
    var value = message["buf"];
    if (value !== undefined) {
      buffer.writeVarint32(18);
      buffer.writeVarint32(value.length), buffer.append(value);
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeMessage"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional MessageType type = 1;
      case 1:
        message["type"] = exports["decodeMessageType"][buffer.readVarint32()];
        break;

      // optional bytes buf = 2;
      case 2:
        message["buf"] = buffer.readBytes(buffer.readVarint32()).toBuffer();
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeChannelInfo"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional Channel channel = 1;
    var value = message["channel"];
    if (value !== undefined) {
      buffer.writeVarint32(10);
      var nested = exports["encodeChannel"](value);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }

    // optional uint32 decimal_digits = 2;
    var value = message["decimal_digits"];
    if (value !== undefined) {
      buffer.writeVarint32(16);
      buffer.writeVarint32(value);
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeChannelInfo"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional Channel channel = 1;
      case 1:
        var limit = pushTemporaryLength(buffer);
        message["channel"] = exports["decodeChannel"](buffer);
        buffer.limit = limit;
        break;

      // optional uint32 decimal_digits = 2;
      case 2:
        message["decimal_digits"] = buffer.readVarint32() >>> 0;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeMsg_RequestRet"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional bool isok = 1;
    var value = message["isok"];
    if (value !== undefined) {
      buffer.writeVarint32(8);
      buffer.writeByte(value ? 1 : 0);
    }

    // optional ErrorType err = 2;
    var value = message["err"];
    if (value !== undefined) {
      buffer.writeVarint32(16);
      buffer.writeVarint32(exports["encodeErrorType"][value]);
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeMsg_RequestRet"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool isok = 1;
      case 1:
        message["isok"] = !!buffer.readByte();
        break;

      // optional ErrorType err = 2;
      case 2:
        message["err"] = exports["decodeErrorType"][buffer.readVarint32()];
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeCandle"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional uint64 open = 1;
    var value = message["open"];
    if (value !== undefined) {
      buffer.writeVarint32(8);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional uint64 close = 2;
    var value = message["close"];
    if (value !== undefined) {
      buffer.writeVarint32(16);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional uint64 high = 3;
    var value = message["high"];
    if (value !== undefined) {
      buffer.writeVarint32(24);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional uint64 low = 4;
    var value = message["low"];
    if (value !== undefined) {
      buffer.writeVarint32(32);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional uint64 volume = 5;
    var value = message["volume"];
    if (value !== undefined) {
      buffer.writeVarint32(40);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional uint32 timestamp = 6;
    var value = message["timestamp"];
    if (value !== undefined) {
      buffer.writeVarint32(48);
      buffer.writeVarint32(value);
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeCandle"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint64 open = 1;
      case 1:
        message["open"] = buffer.readVarint64().toUnsigned();
        break;

      // optional uint64 close = 2;
      case 2:
        message["close"] = buffer.readVarint64().toUnsigned();
        break;

      // optional uint64 high = 3;
      case 3:
        message["high"] = buffer.readVarint64().toUnsigned();
        break;

      // optional uint64 low = 4;
      case 4:
        message["low"] = buffer.readVarint64().toUnsigned();
        break;

      // optional uint64 volume = 5;
      case 5:
        message["volume"] = buffer.readVarint64().toUnsigned();
        break;

      // optional uint32 timestamp = 6;
      case 6:
        message["timestamp"] = buffer.readVarint32() >>> 0;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  exports["encodeMsg_Candle"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // repeated Candle candles = 1;
    var values = message["candles"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = exports["encodeCandle"](value);
        buffer.writeVarint32(10);
        buffer.writeVarint32(nested.byteLength), buffer.append(nested);
      }
    }

    return buffer.flip().toBuffer();
  };

  exports["decodeMsg_Candle"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Candle candles = 1;
      case 1:
        var limit = pushTemporaryLength(buffer);
        var values = message["candles"] || (message["candles"] = []);
        values.push(exports["decodeCandle"](buffer));
        buffer.limit = limit;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

})();
