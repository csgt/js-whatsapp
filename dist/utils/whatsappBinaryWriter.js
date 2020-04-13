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
var WABinaryWriter = /** @class */ (function () {
    function WABinaryWriter() {
        this.data = [];
    }
    WABinaryWriter.prototype.getData = function () {
        return Uint8Array.from(this.data);
    };
    WABinaryWriter.prototype.pushByte = function (value) {
        this.data.push(value);
    };
    WABinaryWriter.prototype.pushBytes = function (bytes) {
        this.data = this.data.concat(bytes);
    };
    WABinaryWriter.prototype.pushIntN = function (value, n, littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        for (var i = 0; i < n; i++) {
            var currShift = littleEndian ? i : n - i - 1;
            this.data.push((value >> (currShift * 8)) & 0xff);
        }
    };
    WABinaryWriter.prototype.pushInt8 = function (value) {
        this.pushIntN(value, 1);
    };
    WABinaryWriter.prototype.pushInt16 = function (value) {
        this.pushIntN(value, 2);
    };
    WABinaryWriter.prototype.pushInt20 = function (value) {
        this.pushBytes([(value >> 16) & 0x0f, (value >> 8) & 0xff, value & 0xff]);
    };
    WABinaryWriter.prototype.pushInt32 = function (value) {
        this.pushIntN(value, 4);
    };
    WABinaryWriter.prototype.pushInt64 = function (value) {
        this.pushIntN(value, 8);
    };
    WABinaryWriter.prototype.pushString = function (str) {
        this.pushBytes(Array.from(new TextEncoder().encode(str)));
    };
    WABinaryWriter.prototype.writeByteLength = function (length) {
        if (length >= Number.MAX_VALUE) {
            throw new Error("string too large to encode (len = " + length + ")");
        }
        if (length >= 1 << 20) {
            this.pushByte(whatsappTokens_1.WATags.BINARY_32);
            this.pushInt32(length);
        }
        else if (length >= 256) {
            this.pushByte(whatsappTokens_1.WATags.BINARY_20);
            this.pushInt20(length);
        }
        else {
            this.pushByte(whatsappTokens_1.WATags.BINARY_8);
            this.pushByte(length);
        }
    };
    WABinaryWriter.prototype.writeNode = function (node) {
        if (!node) {
            return;
        }
        if (!node.description && !node.content) {
            throw new Error("Invalid node");
        }
        var numAttributes = node.attributes
            ? Object.keys(node.attributes).filter(function (key) { return node.attributes[key]; }).length
            : 0;
        this.writeListStart(2 * numAttributes + 1 + (node.content ? 1 : 0));
        this.writeString(node.description);
        this.writeAttributes(node.attributes);
        this.writeChildren(node.content);
    };
    WABinaryWriter.prototype.writeString = function (token, i) {
        if (i === void 0) { i = false; }
        if (!i && token === "c.us") {
            this.writeToken(whatsappTokens_1.WASingleByteTokens.indexOf("s.whatsapp.net"));
            return;
        }
        var tokenIndex = whatsappTokens_1.WASingleByteTokens.indexOf(token);
        if (tokenIndex === -1) {
            var jidSepIndex = token.indexOf("@");
            if (jidSepIndex < 1) {
                this.writeStringRaw(token);
            }
            else {
                this.writeJid(token.slice(0, jidSepIndex), token.slice(jidSepIndex + 1));
            }
        }
        else if (tokenIndex < whatsappTokens_1.WATags.SINGLE_BYTE_MAX) {
            this.writeToken(tokenIndex);
        }
        else {
            var singleByteOverflow = tokenIndex - whatsappTokens_1.WATags.SINGLE_BYTE_MAX;
            var dictionaryIndex = singleByteOverflow >> 8;
            if (dictionaryIndex < 0 || dictionaryIndex > 3) {
                throw new Error("Double byte dictionary token out of range " + token + " " + tokenIndex);
            }
            this.writeToken(whatsappTokens_1.WATags.DICTIONARY_0 + dictionaryIndex);
            this.writeToken(singleByteOverflow % 256);
        }
    };
    WABinaryWriter.prototype.writeStringRaw = function (value) {
        this.writeByteLength(value.length);
        this.pushString(value);
    };
    WABinaryWriter.prototype.writeJid = function (jidLeft, jidRight) {
        this.pushByte(whatsappTokens_1.WATags.JID_PAIR);
        if (jidLeft && jidLeft.length > 0) {
            this.writeString(jidLeft);
        }
        else {
            this.writeToken(whatsappTokens_1.WATags.LIST_EMPTY);
        }
        this.writeString(jidRight);
    };
    WABinaryWriter.prototype.writeToken = function (token) {
        if (token < whatsappTokens_1.WASingleByteTokens.length) {
            this.pushByte(token);
        }
        else if (token <= 500) {
            throw new Error("Invalid token");
        }
    };
    WABinaryWriter.prototype.writeAttributes = function (attrs) {
        if (!attrs) {
            return;
        }
        for (var key in attrs) {
            if (attrs[key]) {
                this.writeString(key);
                this.writeString(attrs[key]);
            }
        }
    };
    WABinaryWriter.prototype.writeChildren = function (children) {
        if (children) {
            if (typeof children === "string") {
                this.writeString(children, true);
            }
            else if (children instanceof Uint8Array) {
                this.writeByteLength(children.length);
                this.pushBytes(Array.from(children));
            }
            else if (Array.isArray(children)) {
                this.writeListStart(children.length);
                for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                    var child = children_1[_i];
                    this.writeNode(child);
                }
            }
            else {
                throw new Error("Invalid children");
            }
        }
    };
    WABinaryWriter.prototype.writeListStart = function (listSize) {
        if (listSize === 0) {
            this.pushByte(whatsappTokens_1.WATags.LIST_EMPTY);
        }
        else if (listSize < 256) {
            this.pushBytes([whatsappTokens_1.WATags.LIST_8, listSize]);
        }
        else {
            this.pushBytes([whatsappTokens_1.WATags.LIST_16, listSize]);
        }
    };
    WABinaryWriter.prototype.writePackedBytes = function (value) {
        try {
            this.writePackedBytesImpl(value, whatsappTokens_1.WATags.NIBBLE_8);
        }
        catch (_a) {
            this.writePackedBytesImpl(value, whatsappTokens_1.WATags.HEX_8);
        }
    };
    WABinaryWriter.prototype.writePackedBytesImpl = function (value, dataType) {
        var numBytes = value.length;
        if (numBytes > whatsappTokens_1.WATags.PACKED_MAX) {
            throw new Error("Too many bytes to nibble encode, length: " + numBytes);
        }
        this.pushByte(dataType);
        this.pushByte((numBytes % 2 > 0 ? 128 : 0) | Math.ceil(numBytes / 2));
        for (var i = 0; i < Math.floor(numBytes / 2); i++) {
            this.pushByte(this.packBytePair(dataType, value[2 * i], value[2 * i + 1]));
        }
        if (numBytes % 2 !== 0) {
            this.pushByte(this.packBytePair(dataType, value[numBytes - 1], "\x00"));
        }
    };
    WABinaryWriter.prototype.packBytePair = function (packType, part1, part2) {
        if (packType === whatsappTokens_1.WATags.NIBBLE_8) {
            return (this.packNibble(part1) << 4) | this.packNibble(part2);
        }
        else if (packType === whatsappTokens_1.WATags.HEX_8) {
            return (this.packHex(part1) << 4) | this.packHex(part2);
        }
        else {
            throw new Error("Invalid byte pack type: " + packType);
        }
    };
    WABinaryWriter.prototype.packNibble = function (value) {
        if (value >= "0" && value <= "9") {
            return parseInt(value);
        }
        else if (value === "-") {
            return 10;
        }
        else if (value === ".") {
            return 11;
        }
        else if (value === "\x00") {
            return 15;
        }
        throw new Error("Invalid byte to pack as nibble " + value);
    };
    WABinaryWriter.prototype.packHex = function (value) {
        if ((value >= "0" && value <= "9") ||
            (value >= "A" && value <= "F") ||
            (value >= "a" && value <= "f")) {
            return parseInt(value, 16);
        }
        else if (value === "\x00") {
            return 15;
        }
        throw new Error("Invalid byte to pack as hex: " + value);
    };
    return WABinaryWriter;
}());
function whatsappWriteBinary(node) {
    return __awaiter(this, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            stream = new WABinaryWriter();
            stream.writeNode(node);
            return [2 /*return*/, stream.getData()];
        });
    });
}
exports.whatsappWriteBinary = whatsappWriteBinary;
//# sourceMappingURL=whatsappBinaryWriter.js.map