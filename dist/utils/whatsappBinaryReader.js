"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var whatsappTokens_1 = require("./whatsappTokens");
var arrays_1 = require("./arrays");
var WABinaryReader = /** @class */ (function () {
    function WABinaryReader(data) {
        this.data = data;
        this.index = 0;
    }
    WABinaryReader.prototype.checkEOS = function (length) {
        if (this.index + length > this.data.length) {
            throw Error("End of stream reached");
        }
    };
    WABinaryReader.prototype.readByte = function () {
        this.checkEOS(1);
        var ret = this.data[this.index];
        this.index++;
        return ret;
    };
    WABinaryReader.prototype.readIntN = function (n, littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        this.checkEOS(n);
        var ret = 0;
        for (var i = 0; i < n; i++) {
            var currShift = littleEndian ? i : n - 1 - i;
            ret |= this.data[this.index + i] << (currShift * 8);
        }
        this.index += n;
        return ret;
    };
    WABinaryReader.prototype.readInt16 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        return this.readIntN(2, littleEndian);
    };
    WABinaryReader.prototype.readInt20 = function () {
        this.checkEOS(3);
        var ret = ((this.data[this.index] & 15) << 16) +
            (this.data[this.index + 1] << 8) +
            this.data[this.index + 2];
        this.index += 3;
        return ret;
    };
    WABinaryReader.prototype.readInt32 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        return this.readIntN(4, littleEndian);
    };
    WABinaryReader.prototype.readInt64 = function (littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        return this.readIntN(8, littleEndian);
    };
    WABinaryReader.prototype.readPacked8 = function (tag) {
        var startByte = this.readByte();
        var ret = "";
        for (var i = 0; i < (startByte & 127); i++) {
            var currByte = this.readByte();
            ret +=
                this.unpackByte(tag, (currByte & 0xf0) >> 4) +
                    this.unpackByte(tag, currByte & 0x0f);
        }
        if (startByte >> 7 !== 0) {
            ret = ret.substr(0, ret.length - 1);
        }
        return ret;
    };
    WABinaryReader.prototype.unpackByte = function (tag, value) {
        if (tag === whatsappTokens_1.WATags.NIBBLE_8) {
            return this.unpackNibble(value);
        }
        else if (tag === whatsappTokens_1.WATags.HEX_8) {
            return this.unpackHex(value);
        }
        throw new Error("unpackByte with unknown tag " + tag);
    };
    WABinaryReader.prototype.unpackNibble = function (value) {
        if (value >= 0 && value <= 9) {
            return "" + value;
        }
        else if (value === 10) {
            return "-";
        }
        else if (value === 11) {
            return ".";
        }
        else if (value === 15) {
            return "\0";
        }
        throw new Error("Invalid nibble to unpack: " + value);
    };
    WABinaryReader.prototype.unpackHex = function (value) {
        if (value < 0 || value > 15) {
            throw new Error("Invalid hex to unpack: " + value);
        }
        if (value < 10) {
            return "" + value;
        }
        return String.fromCharCode("A".charCodeAt(0) + value - 10);
    };
    WABinaryReader.prototype.isListTag = function (tag) {
        return (tag === whatsappTokens_1.WATags.LIST_EMPTY ||
            tag === whatsappTokens_1.WATags.LIST_8 ||
            tag === whatsappTokens_1.WATags.LIST_16);
    };
    WABinaryReader.prototype.readListSize = function (tag) {
        if (tag === whatsappTokens_1.WATags.LIST_EMPTY) {
            return 0;
        }
        else if (tag === whatsappTokens_1.WATags.LIST_8) {
            return this.readByte();
        }
        else if (tag === whatsappTokens_1.WATags.LIST_16) {
            return this.readInt16();
        }
        throw new Error("Invalid tag for list size: " + tag + " at position " + this.index);
    };
    WABinaryReader.prototype.readString = function (tag) {
        if (tag >= 3 && tag <= whatsappTokens_1.WASingleByteTokens.length) {
            var token = this.getToken(tag);
            if (token === "s.whatsapp.net") {
                return new TextEncoder().encode("c.us");
            }
            return new TextEncoder().encode(token);
        }
        if (tag === whatsappTokens_1.WATags.DICTIONARY_0 ||
            tag === whatsappTokens_1.WATags.DICTIONARY_1 ||
            tag === whatsappTokens_1.WATags.DICTIONARY_2 ||
            tag === whatsappTokens_1.WATags.DICTIONARY_3) {
            return this.getDoubleToken(tag - whatsappTokens_1.WATags.DICTIONARY_0, this.readByte());
        }
        else if (tag === whatsappTokens_1.WATags.LIST_EMPTY) {
            return new TextEncoder().encode("");
        }
        else if (tag === whatsappTokens_1.WATags.BINARY_8) {
            return this.readStringFromChars(this.readByte());
        }
        else if (tag === whatsappTokens_1.WATags.BINARY_20) {
            return this.readStringFromChars(this.readInt20());
        }
        else if (tag === whatsappTokens_1.WATags.BINARY_32) {
            return this.readStringFromChars(this.readInt32());
        }
        else if (tag === whatsappTokens_1.WATags.JID_PAIR) {
            var i = this.readString(this.readByte());
            var j = this.readString(this.readByte());
            if (!i || !j) {
                throw new Error("Invalid jid pair: " + i + ", " + j);
            }
            return arrays_1.concatIntArray(i, new TextEncoder().encode("@"), j);
        }
        else if (tag === whatsappTokens_1.WATags.NIBBLE_8 || tag === whatsappTokens_1.WATags.HEX_8) {
            return new TextEncoder().encode(this.readPacked8(tag));
        }
        else if (tag === whatsappTokens_1.WATags.UNKNOWN) {
            return new TextEncoder().encode(this.readPacked8(tag));
        }
        else {
            throw new Error("Invalid string with tag " + tag);
        }
    };
    WABinaryReader.prototype.readStringFromChars = function (length) {
        this.checkEOS(length);
        var ret = this.data.slice(this.index, this.index + length);
        this.index += length;
        return ret;
    };
    WABinaryReader.prototype.readAttributes = function (n) {
        var ret = {};
        if (n === 0) {
            return;
        }
        for (var i = 0; i < n; i++) {
            var index = new TextDecoder().decode(this.readString(this.readByte()));
            ret[index] = new TextDecoder().decode(this.readString(this.readByte()));
        }
        return ret;
    };
    WABinaryReader.prototype.readList = function (tag) {
        var listSize = this.readListSize(tag);
        var ret = [];
        for (var i = 0; i < listSize; i++) {
            ret.push(this.readNode());
        }
        return ret;
    };
    WABinaryReader.prototype.readNode = function () {
        var listSize = this.readListSize(this.readByte());
        var descrTag = this.readByte();
        if (descrTag === whatsappTokens_1.WATags.STREAM_END) {
            throw new Error("Unexpected stream end");
        }
        var description = new TextDecoder().decode(this.readString(descrTag));
        if (listSize === 0 || description === "") {
            throw new Error("Invalid node");
        }
        var attributes = this.readAttributes((listSize - 1) >> 1);
        if (listSize % 2 === 1) {
            return { description: description, attributes: attributes };
        }
        var tag = this.readByte();
        if (this.isListTag(tag)) {
            return {
                description: description,
                attributes: attributes,
                content: this.readList(tag)
            };
        }
        else if (tag === whatsappTokens_1.WATags.BINARY_8) {
            return {
                description: description,
                attributes: attributes,
                content: this.readBytes(this.readByte())
            };
        }
        else if (tag === whatsappTokens_1.WATags.BINARY_20) {
            return {
                description: description,
                attributes: attributes,
                content: this.readBytes(this.readInt20())
            };
        }
        else if (tag === whatsappTokens_1.WATags.BINARY_32) {
            return {
                description: description,
                attributes: attributes,
                content: this.readBytes(this.readInt32())
            };
        }
        return {
            description: description,
            attributes: attributes,
            content: this.readString(tag)
        };
    };
    WABinaryReader.prototype.readBytes = function (n) {
        var ret = [];
        for (var i = 0; i < n; i++) {
            ret.push(this.readByte());
        }
        return Uint8Array.from(ret);
    };
    WABinaryReader.prototype.getToken = function (index) {
        if (index < 3 || index >= whatsappTokens_1.WASingleByteTokens.length) {
            throw new Error("Invalid token index: " + index);
        }
        return whatsappTokens_1.WASingleByteTokens[index];
    };
    WABinaryReader.prototype.getDoubleToken = function (index1, index2) {
        var n = 256 * index1 + index2;
        if (n < 0 || n >= whatsappTokens_1.WADoubleByteTokens.length) {
            throw new Error("Invalid token index: " + n);
        }
        return whatsappTokens_1.WADoubleByteTokens[n];
    };
    return WABinaryReader;
}());
exports.WABinaryReader = WABinaryReader;
function whatsappReadMessageArray(msgs) {
    return __awaiter(this, void 0, void 0, function () {
        var ret, _i, _a, msg, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!Array.isArray(msgs)) {
                        return [2 /*return*/, msgs];
                    }
                    ret = [];
                    _i = 0, _a = msgs;
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    msg = _a[_i];
                    _c = (_b = ret).push;
                    if (!(msg.description === "message")) return [3 /*break*/, 3];
                    return [4 /*yield*/, whatsappTokens_1.WAWebMessageInfo.decode(msg.content)];
                case 2:
                    _d = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _d = msg;
                    _e.label = 4;
                case 4:
                    _c.apply(_b, [_d]);
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, ret];
            }
        });
    });
}
exports.whatsappReadMessageArray = whatsappReadMessageArray;
function whatsappReadBinary(data, withMessages) {
    if (withMessages === void 0) { withMessages = false; }
    return __awaiter(this, void 0, void 0, function () {
        var node, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    node = new WABinaryReader(data).readNode();
                    if (!(withMessages &&
                        node &&
                        node.attributes &&
                        node.content &&
                        node.description === "action")) return [3 /*break*/, 2];
                    _a = node;
                    return [4 /*yield*/, whatsappReadMessageArray(node.content).then(function (res) { return res; })];
                case 1:
                    _a.content = _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/, node];
            }
        });
    });
}
exports.whatsappReadBinary = whatsappReadBinary;
//# sourceMappingURL=whatsappBinaryReader.js.map