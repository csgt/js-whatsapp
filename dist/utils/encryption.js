"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var arrays_1 = require("./arrays");
var AES_BLOCK_SIZE = 16;
function dataUrlToBuffer(dataString) {
    var matches = dataString.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    var type = matches[1];
    var data = Buffer.from(matches[2], "base64");
    return { type: type, data: data };
}
exports.dataUrlToBuffer = dataUrlToBuffer;
function randHex(n) {
    if (n <= 0) {
        return "";
    }
    var rs = "";
    try {
        rs = crypto_1.default
            .randomBytes(Math.ceil(n / 2))
            .toString("hex")
            .slice(0, n);
        /* note: could do this non-blocking, but still might fail */
    }
    catch (ex) {
        /* known exception cause: depletion of entropy info for randomBytes */
        console.error("Exception generating random string: " + ex);
        /* weaker random fallback */
        rs = "";
        var r = n % 8, q = (n - r) / 8, i;
        for (i = 0; i < q; i++) {
            rs += Math.random()
                .toString(16)
                .slice(2);
        }
        if (r > 0) {
            rs += Math.random()
                .toString(16)
                .slice(2, i);
        }
    }
    return rs;
}
exports.randHex = randHex;
function AESPad(src) {
    var pad = AES_BLOCK_SIZE - (src.length % AES_BLOCK_SIZE);
    return arrays_1.concatIntArray(src, repeatedNumToBits(pad, pad));
}
exports.AESPad = AESPad;
function AESUnpad(src) {
    return src
        .slice(0, src.length - src[src.length - 1])
        .filter(function (_, i) { return (i + 1) % 4 === 0; });
}
exports.AESUnpad = AESUnpad;
function AESEncrypt(key, plaintext, _iv, includeIv) {
    if (_iv === void 0) { _iv = null; }
    if (includeIv === void 0) { includeIv = true; }
    var iv = _iv ? _iv : Uint8Array.from(crypto_1.default.randomBytes(AES_BLOCK_SIZE));
    var cipher = crypto_1.default.createCipheriv("aes-256-cbc", key, iv);
    var encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    return includeIv
        ? arrays_1.concatIntArray(iv, Uint8Array.from(encrypted))
        : Uint8Array.from(encrypted);
}
exports.AESEncrypt = AESEncrypt;
function AESDecrypt(key, cipherbits) {
    var iv = cipherbits.slice(0, AES_BLOCK_SIZE);
    var prp = crypto_1.default.createDecipheriv("aes-256-cbc", key, iv);
    prp.setAutoPadding(false);
    var decrypted = Buffer.concat([
        prp.update(cipherbits.slice(AES_BLOCK_SIZE)),
        prp.final()
    ]);
    return Uint8Array.from(decrypted);
}
exports.AESDecrypt = AESDecrypt;
function numToBits(n) {
    return Uint8Array.from(Buffer.from((n < 16 ? "0" : "") + n.toString(16), "hex"));
}
exports.numToBits = numToBits;
function repeatedNumToBits(n, repeats) {
    var nBits = numToBits(n);
    var ret = new Uint8Array();
    for (var i = 0; i < repeats; i++) {
        ret = arrays_1.concatIntArray(ret, nBits);
    }
    return ret;
}
exports.repeatedNumToBits = repeatedNumToBits;
function HmacSha256(keyBits, signBits) {
    return Uint8Array.from(crypto_1.default
        .createHmac("sha256", keyBits)
        .update(signBits)
        .digest());
}
exports.HmacSha256 = HmacSha256;
function Sha256(signBits) {
    return Uint8Array.from(crypto_1.default
        .createHash("sha256")
        .update(signBits)
        .digest());
}
exports.Sha256 = Sha256;
function HKDF(_key, length, appInfo) {
    if (appInfo === void 0) { appInfo = ""; }
    var key = HmacSha256(repeatedNumToBits(0, 32), _key);
    var keyStream = new Uint8Array();
    var keyBlock = new Uint8Array();
    var blockIndex = 1;
    while (keyStream.length < length) {
        keyBlock = HmacSha256(key, arrays_1.concatIntArray(keyBlock, new TextEncoder().encode(appInfo), numToBits(blockIndex)));
        blockIndex += 1;
        keyStream = arrays_1.concatIntArray(keyStream, keyBlock);
    }
    return keyStream.slice(0, length);
}
exports.HKDF = HKDF;
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
exports.toArrayBuffer = toArrayBuffer;
//# sourceMappingURL=encryption.js.map