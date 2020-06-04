"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var sharp_1 = __importDefault(require("sharp"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var ws_1 = __importDefault(require("ws"));
var crypto_1 = __importDefault(require("crypto"));
var qrcode_1 = __importDefault(require("qrcode"));
var curve25519_js_1 = require("curve25519-js");
var path_2 = require("./utils/path");
var encryption_1 = require("./utils/encryption");
var whatsappBinaryReader_1 = require("./utils/whatsappBinaryReader");
var whatsappBinaryWriter_1 = require("./utils/whatsappBinaryWriter");
var arrays_1 = require("./utils/arrays");
var whatsappTokens_1 = require("./utils/whatsappTokens");
var WhatsApp = /** @class */ (function () {
    function WhatsApp(parameters) {
        var _this = this;
        if (parameters === void 0) { parameters = {}; }
        this.messageSentCount = 0;
        this.clientToken = null;
        this.serverToken = null;
        this.encKey = new Uint8Array();
        this.macKey = new Uint8Array();
        this.chatList = [];
        this.contactList = [];
        this.isLoggedIn = false;
        this.messageListeners = [];
        this.messageStubListeners = [];
        this.noNetworkListeners = [];
        this.loggedOutListeners = [];
        this.eventListeners = {};
        this.readyListeners = [];
        this.qrCodeListeners = [];
        var loginMsgId = "" + Date.now();
        this.apiSocket = new ws_1.default("wss://web.whatsapp.com/ws", {
            headers: { Origin: "https://web.whatsapp.com" }
        });
        this.keyPair = null;
        this.parameters = __assign({
            keysPath: "./keys.json",
            qrPath: "./qrcode.png",
            clientName: "WhatsApp forwarder",
            clientShortName: "WhatsAppForwarder",
            restoreSession: false
        }, parameters);
        console.log("contruct", this.parameters);
        this.parameters.qrPath = path_1.resolve(".", this.parameters.qrPath);
        if (this.parameters.restoreSession) {
            this.parameters.keysPath = path_1.resolve(".", this.parameters.keysPath);
        }
        this.apiSocket.onopen = this.init(loginMsgId, this.parameters.restoreSession);
        this.loginMsgId = loginMsgId;
        console.log('back in constructor');
        if (this.parameters.restoreSession) {
            path_2.doesFileExist(this.parameters.keysPath).then(function (doesExist) {
                if (!doesExist) {
                    _this.apiSocket.onmessage = _this.onMessage(loginMsgId);
                }
            });
        }
        else {
            console.log('onMessage in constructor');
            this.apiSocket.onmessage = this.onMessage(loginMsgId);
        }
    }
    WhatsApp.prototype.on = function (event, cb) {
        switch (event) {
            case "message":
                this.messageListeners.push(cb);
                break;
            case "stubMessage":
                this.messageStubListeners.push(cb);
                break;
            case "ready":
                this.readyListeners.push(cb);
                break;
            case "qrCode":
                this.qrCodeListeners.push(cb);
            case "noNetwork":
                this.noNetworkListeners.push(cb);
            case "loggedOut":
                this.loggedOutListeners.push(cb);
            default:
                break;
        }
    };
    WhatsApp.prototype.addEventListener = function (cb, id) {
        this.eventListeners[id] = cb;
    };
    WhatsApp.prototype.saveKeys = function () {
        fs_1.writeFile(this.parameters.keysPath, JSON.stringify({
            clientId: this.clientId,
            clientToken: this.clientToken,
            serverToken: this.serverToken,
            macKey: Array.from(this.macKey),
            encKey: Array.from(this.encKey)
        }), function (err) { return console.error(err); });
    };
    WhatsApp.prototype.getKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("getKeys");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_1.readFile(_this.parameters.keysPath, "utf-8", function (err, data) {
                            if (err)
                                reject(err);
                            var _a = JSON.parse(data), clientId = _a.clientId, clientToken = _a.clientToken, serverToken = _a.serverToken, macKey = _a.macKey, encKey = _a.encKey;
                            _this.encKey = Uint8Array.from(encKey);
                            _this.macKey = Uint8Array.from(macKey);
                            _this.clientId = clientId;
                            _this.clientToken = clientToken;
                            _this.serverToken = serverToken;
                            resolve();
                        });
                    })];
            });
        });
    };
    WhatsApp.prototype.restoreSession = function (loginMsgId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("restoreSession", loginMsgId);
                this.apiSocket.send(loginMsgId + ",[\"admin\",\"login\",\"" + this.clientToken + "\",\"" + this.serverToken + "\",\"" + this.clientId + "\",\"takeover\"]");
                this.apiSocket.onmessage = function (e) {
                    if (typeof e.data === "string") {
                        var receivedMessageId = e.data.substring(0, e.data.indexOf(","));
                        if (receivedMessageId === loginMsgId && e.data !== loginMsgId + ",") {
                            var data = JSON.parse(e.data.substring(e.data.indexOf(",") + 1));
                            if (data.status === 200) {
                                _this.apiSocket.onmessage = _this.onMessage(loginMsgId);
                            }
                            else {
                                _this.loggedOutListeners.forEach(function (func) { return func(); });
                            }
                        }
                    }
                };
                return [2 /*return*/];
            });
        });
    };
    WhatsApp.prototype.keepAlive = function () {
        console.log("keepalive");
        if (this.apiSocket) {
            this.apiSocket.send("?,,");
            setTimeout(this.keepAlive.bind(this), 20 * 1000);
        }
    };
    WhatsApp.prototype.disconnect = function () {
        console.log("disconnect");
        this.apiSocket.send("goodbye,,[\"admin\",\"Conn\",\"disconnect\"]");
    };
    WhatsApp.prototype.sendSocketAsync = function (messageTag, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.apiSocket.send(data);
                        _this.addEventListener(function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var receivedMessageId, data_1;
                            return __generator(this, function (_a) {
                                if (typeof e.data === "string") {
                                    receivedMessageId = e.data.substring(0, e.data.indexOf(","));
                                    if (receivedMessageId === messageTag && e.data !== messageTag + ",") {
                                        data_1 = JSON.parse(e.data.substring(e.data.indexOf(",") + 1));
                                        delete this.eventListeners[messageTag];
                                        resolve(data_1);
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); }, messageTag);
                    })];
            });
        });
    };
    WhatsApp.prototype.onMessage = function (loginMsgId) {
        var _this = this;
        return function (e) { return __awaiter(_this, void 0, void 0, function () {
            var messageTag, data, _a, clientToken, serverToken, str, decoded, signed, encoded, _b, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        Object.values(this.eventListeners).forEach(function (func) { return func(e); });
                        if (!(typeof e.data === "string")) return [3 /*break*/, 7];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        messageTag = e.data.substring(0, e.data.indexOf(","));
                        data = JSON.parse(e.data.substring(e.data.indexOf(",") + 1));
                        if (!(messageTag === loginMsgId && !this.clientToken)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setupQrCode(data)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (Array.isArray(data) &&
                            data.length >= 2 &&
                            data[0] === "Conn" &&
                            data[1].secret) {
                            this.isLoggedIn = true;
                            this.myWid = data[1].wid;
                            this.setupEncryptionKeys(data);
                            setTimeout(this.keepAlive.bind(this), 20 * 1000);
                            if (this.parameters.keysPath) {
                                this.saveKeys();
                            }
                        }
                        else if (Array.isArray(data) &&
                            data.length >= 2 &&
                            data[0] === "Conn" &&
                            data[1].clientToken) {
                            _a = data[1], clientToken = _a.clientToken, serverToken = _a.serverToken;
                            this.isLoggedIn = true;
                            this.clientToken = clientToken;
                            this.serverToken = serverToken;
                            this.myWid = data[1].wid;
                            setTimeout(this.keepAlive.bind(this), 20 * 1000);
                            if (this.parameters.keysPath) {
                                this.saveKeys();
                            }
                        }
                        else if (Array.isArray(data) &&
                            data.length >= 2 &&
                            data[0] === "Cmd" &&
                            data[1].type === "challenge") {
                            str = data[1].challenge;
                            decoded = Buffer.from(str, "base64");
                            signed = encryption_1.HmacSha256(this.macKey, Uint8Array.from(decoded));
                            encoded = Buffer.from(signed).toString("base64");
                            this.apiSocket.send(messageTag + ", [\"admin\", \"challenge\", \"" + encoded + "\", \"" + this.serverToken + "\", \"" + this.clientId + "\"]");
                        }
                        else if (data.status &&
                            !data.ref &&
                            messageTag === loginMsgId) {
                        }
                        _c.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        _b = _c.sent();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        if (!Buffer.isBuffer(e.data)) return [3 /*break*/, 9];
                        result = new Uint8Array(e.data);
                        return [4 /*yield*/, this.decryptMessage(result)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        }); };
    };
    WhatsApp.prototype.decryptMessage = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var delimPos, messageContent, hmacValidation, data, allMsgs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delimPos = result.indexOf(44);
                        messageContent = result.slice(delimPos + 1);
                        hmacValidation = encryption_1.HmacSha256(this.macKey, messageContent.slice(32));
                        if (!arrays_1.arraysEqual(hmacValidation, messageContent.slice(0, 32))) {
                            throw new Error("hmac mismatch\n      " + Buffer.from(hmacValidation).toString("hex") + ",\n      " + Buffer.from(messageContent.slice(0, 32)).toString("hex"));
                        }
                        data = encryption_1.AESDecrypt(this.encKey, messageContent.slice(32));
                        return [4 /*yield*/, whatsappBinaryReader_1.whatsappReadBinary(data, true)];
                    case 1:
                        allMsgs = _a.sent();
                        if (allMsgs.description === "action") {
                            this.readyListeners.forEach(function (func) { return func(); });
                            this.readyListeners = [];
                        }
                        allMsgs.content.forEach(function (node) { return __awaiter(_this, void 0, void 0, function () {
                            var msg_1, remoteJid_1, userJid_1, contact, userJid_2, contact, chat, _a, _b, _c, _d, _e, msg_2, chat, i, chat_1, chat;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!(node.description === "user" &&
                                            node.attributes.jid.endsWith("c.us"))) return [3 /*break*/, 1];
                                        this.contactList.push(node.attributes);
                                        return [3 /*break*/, 19];
                                    case 1:
                                        if (!(node.description === "chat" &&
                                            node.attributes.jid.endsWith("g.us"))) return [3 /*break*/, 2];
                                        this.chatList.push(node.attributes);
                                        return [3 /*break*/, 19];
                                    case 2:
                                        if (!node.message) return [3 /*break*/, 13];
                                        msg_1 = node;
                                        remoteJid_1 = msg_1.key.remoteJid.replace("@s.whatsapp.net", "@c.us");
                                        if (msg_1.participant) {
                                            userJid_1 = msg_1.participant.replace("@s.whatsapp.net", "@c.us");
                                            contact = this.contactList.find(function (contact) { return contact.jid.replace("\0", "") === userJid_1; });
                                            if (contact) {
                                                msg_1.author = contact.name
                                                    ? contact.name
                                                    : contact.vname || contact.notify;
                                            }
                                        }
                                        else {
                                            userJid_2 = msg_1.key.remoteJid.replace("@s.whatsapp.net", "@c.us");
                                            contact = this.contactList.find(function (contact) { return contact.jid.replace("\0", "") === userJid_2; });
                                            if (contact) {
                                                msg_1.author = contact.name
                                                    ? contact.name
                                                    : contact.vname || contact.notify;
                                            }
                                        }
                                        chat = this.chatList.find(function (chat) { return chat.jid.replace("\0", "") === remoteJid_1; });
                                        if (chat) {
                                            msg_1.key.name = chat.name;
                                        }
                                        if (!msg_1.message.stickerMessage) return [3 /*break*/, 4];
                                        _a = msg_1.message;
                                        return [4 /*yield*/, this.decryptMedia(msg_1.message.stickerMessage, "sticker").catch(function (err) {
                                                throw err;
                                            })];
                                    case 3:
                                        _a.decryptedMediaMessage = _f.sent();
                                        return [3 /*break*/, 12];
                                    case 4:
                                        if (!msg_1.message.imageMessage) return [3 /*break*/, 6];
                                        _b = msg_1.message;
                                        return [4 /*yield*/, this.decryptMedia(msg_1.message.imageMessage, "image").catch(function (err) {
                                                throw err;
                                            })];
                                    case 5:
                                        _b.decryptedMediaMessage = _f.sent();
                                        return [3 /*break*/, 12];
                                    case 6:
                                        if (!msg_1.message.videoMessage) return [3 /*break*/, 8];
                                        _c = msg_1.message;
                                        return [4 /*yield*/, this.decryptMedia(msg_1.message.videoMessage, "video").catch(function (err) {
                                                throw err;
                                            })];
                                    case 7:
                                        _c.decryptedMediaMessage = _f.sent();
                                        return [3 /*break*/, 12];
                                    case 8:
                                        if (!msg_1.message.audioMessage) return [3 /*break*/, 10];
                                        _d = msg_1.message;
                                        return [4 /*yield*/, this.decryptMedia(msg_1.message.audioMessage, "audio").catch(function (err) {
                                                throw err;
                                            })];
                                    case 9:
                                        _d.decryptedMediaMessage = _f.sent();
                                        return [3 /*break*/, 12];
                                    case 10:
                                        if (!msg_1.message.documentMessage) return [3 /*break*/, 12];
                                        _e = msg_1.message;
                                        return [4 /*yield*/, this.decryptMedia(msg_1.message.documentMessage, "document").catch(function (err) {
                                                throw err;
                                            })];
                                    case 11:
                                        _e.decryptedMediaMessage = _f.sent();
                                        _f.label = 12;
                                    case 12:
                                        this.messageListeners.forEach(function (func) { return func(msg_1, allMsgs.description); });
                                        return [3 /*break*/, 19];
                                    case 13:
                                        if (!node.messageStubType) return [3 /*break*/, 19];
                                        msg_2 = node;
                                        if (!(msg_2.messageStubType === "GROUP_PARTICIPANT_ADD" &&
                                            msg_2.messageStubParameters.includes(this.myWid.replace("c.us", "s.whatsapp.net")))) return [3 /*break*/, 17];
                                        chat = this.chatList.find(function (chat) { return chat.jid === msg_2.key.remoteJid; });
                                        if (!chat) return [3 /*break*/, 14];
                                        i = this.chatList.indexOf(chat);
                                        chat.read_only = "false";
                                        this.chatList[i] = chat;
                                        return [3 /*break*/, 16];
                                    case 14: return [4 /*yield*/, this.getGroupMetadata(msg_2.key.remoteJid)];
                                    case 15:
                                        chat_1 = _f.sent();
                                        this.chatList.push({
                                            name: chat_1.subject,
                                            jid: msg_2.key.remoteJid,
                                            spam: "false",
                                            count: "0",
                                            t: "" + chat_1.creation
                                        });
                                        _f.label = 16;
                                    case 16: return [3 /*break*/, 18];
                                    case 17:
                                        if (msg_2.messageStubType === "GROUP_PARTICIPANT_REMOVE" &&
                                            msg_2.messageStubParameters.includes(this.myWid.replace("c.us", "s.whatsapp.net"))) {
                                            chat = this.chatList.find(function (chat) { return chat.jid === msg_2.key.remoteJid; });
                                            if (chat) {
                                                this.chatList.splice(this.chatList.indexOf(chat), 1);
                                            }
                                        }
                                        _f.label = 18;
                                    case 18:
                                        this.messageStubListeners.forEach(function (func) { return func(msg_2); });
                                        _f.label = 19;
                                    case 19: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    WhatsApp.prototype.sendAdminTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id, timeout;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = encryption_1.randHex(10).toUpperCase();
                        timeout = setTimeout(function () {
                            _this.noNetworkListeners.forEach(function (func) { return func(); });
                        }, 10 * 1000);
                        return [4 /*yield*/, this.sendSocketAsync(id, ["admin", "test"]).then(function (data) {
                                if (data[0] === "Pong" && data[1]) {
                                    clearTimeout(timeout);
                                    return true;
                                }
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendProto = function (msgData, id, metric) {
        if (metric === void 0) { metric = "MESSAGE"; }
        return __awaiter(this, void 0, void 0, function () {
            var encoder, cipher, _a, _b, encryptedMsg, payload, timeout;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        encoder = new TextEncoder();
                        _a = encryption_1.AESEncrypt;
                        _b = [this.encKey];
                        return [4 /*yield*/, whatsappBinaryWriter_1.whatsappWriteBinary(msgData)];
                    case 1:
                        cipher = _a.apply(void 0, _b.concat([_c.sent()]));
                        encryptedMsg = arrays_1.concatIntArray(encryption_1.HmacSha256(this.macKey, cipher), cipher);
                        payload = arrays_1.concatIntArray(encoder.encode(id), encoder.encode(","), Uint8Array.from([whatsappTokens_1.WAMetrics[metric]]), Uint8Array.from([whatsappTokens_1.WAFlags.IGNORE]), encryptedMsg);
                        this.messageSentCount++;
                        timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.sendAdminTest().then(function (isLoggedIn) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                this.isLoggedIn = isLoggedIn;
                                                return [2 /*return*/];
                                            });
                                        }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 2 * 1000);
                        return [4 /*yield*/, this.sendSocketAsync(id, payload)
                                .then(function (data) {
                                clearTimeout(timeout);
                                return data;
                            })];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendMessage = function (content, remoteJid, msgId) {
        return __awaiter(this, void 0, void 0, function () {
            var id, msgParams, msgData, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('sendMessage init');
                        id = msgId ? msgId : "3EB0" + encryption_1.randHex(8).toUpperCase();
                        msgParams = {
                            key: {
                                id: id,
                                remoteJid: remoteJid,
                                fromMe: true
                            },
                            messageTimestamp: Math.round(Date.now() / 1000),
                            status: 1,
                            message: content
                        };
                        console.log('sendMessage after msgParams');
                        _a = {
                            description: "action",
                            attributes: {
                                type: "relay",
                                epoch: "" + this.messageSentCount
                            }
                        };
                        _b = {
                            description: "message"
                        };
                        return [4 /*yield*/, whatsappTokens_1.WAWebMessageInfo.encode(msgParams)];
                    case 1:
                        msgData = (_a.content = [
                            (_b.content = _c.sent(),
                                _b)
                        ],
                            _a);
                        console.log('sendMessage after WAMessageNode');
                        return [4 /*yield*/, this.sendProto(msgData, id)];
                    case 2:
                        _c.sent();
                        console.log('sendMessage after sendProto');
                        return [2 /*return*/, { id: id, content: content }];
                }
            });
        });
    };
    WhatsApp.prototype.getGroupMetadata = function (remoteJid) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = encryption_1.randHex(10).toUpperCase();
                        return [4 /*yield*/, this.sendSocketAsync(id, id + ",,[\"query\",\"GroupMetadata\",\"" + remoteJid + "\"]")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.getGroupParticipants = function (remoteJid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroupMetadata(remoteJid).then(function (data) {
                            return data.participants;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.getGroupSubject = function (remoteJid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroupMetadata(remoteJid).then(function (data) {
                            return data.subject;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.setGroupPhoto = function (image, remoteJid) {
        return __awaiter(this, void 0, void 0, function () {
            var id, content, msgData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Math.round(Date.now() / 1000) + ".--" + this.messageSentCount;
                        content = {
                            description: "picture",
                            attributes: {
                                id: id,
                                jid: remoteJid,
                                type: "set"
                            },
                            content: [
                                {
                                    description: "image",
                                    content: Uint8Array.from(image)
                                },
                                {
                                    description: "preview",
                                    content: Uint8Array.from(image)
                                }
                            ]
                        };
                        msgData = {
                            description: "action",
                            attributes: {
                                type: "set",
                                epoch: "" + this.messageSentCount
                            },
                            content: [content]
                        };
                        return [4 /*yield*/, this.sendProto(msgData, id, "PIC")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { id: id, content: content }];
                }
            });
        });
    };
    WhatsApp.prototype.sendTextMessage = function (text, remoteJid, mentionedJid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!mentionedJid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sendMessage({
                                conversation: text
                            }, remoteJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.sendMessage({
                            extendedTextMessage: {
                                contextInfo: {
                                    mentionedJid: mentionedJid
                                },
                                text: text
                            }
                        }, remoteJid)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendQuotedMessage = function (content, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid) {
        return __awaiter(this, void 0, void 0, function () {
            var contextInfo, quotingContent_1, innerContent;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contextInfo = {
                            mentionedJid: mentionedJid
                                ? quotedMsg.extendedTextMessage
                                    ? quotedMsg.extendedTextMessage.contextInfo
                                        ? quotedMsg.extendedTextMessage.contextInfo.mentionedJid
                                            ? quotedMsg.extendedTextMessage.contextInfo.mentionedJid.concat(mentionedJid)
                                            : mentionedJid
                                        : mentionedJid
                                    : mentionedJid
                                : [],
                            stanzaId: quotedMsgId,
                            participant: quotedAuthorJid,
                            quotedMessage: quotedMsg.extendedTextMessage
                                ? {
                                    conversation: quotedMsg.extendedTextMessage.text
                                }
                                : quotedMsg
                        };
                        if (!content.conversation) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sendMessage({
                                extendedTextMessage: {
                                    contextInfo: contextInfo,
                                    text: content.conversation
                                }
                            }, remoteJid)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        quotingContent_1 = Object.assign({}, content);
                        innerContent = Object.keys(quotingContent_1)
                            .map(function (_key) {
                            var key = _key;
                            return key !== "decryptedMediaMessage" && key !== "conversation"
                                ? { key: key, content: quotingContent_1[key] }
                                : undefined;
                        })
                            .filter(function (obj) { return obj !== undefined; })[0];
                        return [4 /*yield*/, this.sendMessage((_a = {},
                                _a[innerContent.key] = __assign({ contextInfo: contextInfo }, innerContent.content),
                                _a), remoteJid)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendQuotedTextMessage = function (text, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendQuotedMessage({ conversation: text }, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendQuotedMediaMessage = function (file, mimetype, msgType, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, caption, duration, isGif, mentionedJid) {
        if (caption === void 0) { caption = undefined; }
        if (duration === void 0) { duration = undefined; }
        if (isGif === void 0) { isGif = false; }
        return __awaiter(this, void 0, void 0, function () {
            var media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.encryptMedia(file, mimetype, msgType, caption, duration, isGif)];
                    case 1:
                        media = _a.sent();
                        return [4 /*yield*/, this.sendQuotedMessage(media, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendQuotedContactVCard = function (vcard, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid) {
        return __awaiter(this, void 0, void 0, function () {
            var fullName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullName = vcard.slice(vcard.indexOf("FN:") + 3, vcard.indexOf("\n", vcard.indexOf("FN:")));
                        return [4 /*yield*/, this.sendQuotedMessage({
                                contactMessage: {
                                    vcard: vcard,
                                    displayName: fullName
                                }
                            }, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendQuotedContact = function (phoneNumber, firstName, lastName, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid) {
        if (lastName === void 0) { lastName = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var fullName, vcard;
            return __generator(this, function (_a) {
                fullName = lastName.length > 0 ? firstName + " " + lastName : firstName;
                vcard = "BEGIN:VCARD\nVERSION:3.0\nN:" + lastName + ";" + firstName + ";;\nFN:" + fullName + "\nTEL;TYPE=VOICE:" + phoneNumber + "\nEND:VCARD";
                this.sendQuotedContactVCard(vcard, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid);
                return [2 /*return*/];
            });
        });
    };
    WhatsApp.prototype.sendQuotedLocation = function (latitude, longitude, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendQuotedMessage({
                            locationMessage: {
                                degreesLatitude: latitude,
                                degreesLongitude: longitude
                            }
                        }, remoteJid, quotedAuthorJid, quotedMsg, quotedMsgId, mentionedJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.uploadMedia = function (uploadUrl, body) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(uploadUrl, {
                            body: body,
                            method: "POST",
                            headers: {
                                Origin: "https://web.whatsapp.com",
                                Referer: "https://web.whatsapp.com/"
                            }
                        })
                            .then(function (res) { return res.json(); })
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, res];
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.queryMediaConn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var messageTag;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    messageTag = encryption_1.randHex(12).toUpperCase();
                                    return [4 /*yield*/, this.sendSocketAsync(messageTag, messageTag + ",[\"query\", \"mediaConn\"]").then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                resolve({
                                                    hostname: data.media_conn.hosts[0].hostname,
                                                    auth: data.media_conn.auth,
                                                    ttl: data.media_conn.ttl
                                                });
                                                return [2 /*return*/];
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    WhatsApp.prototype.encryptMedia = function (file, mimetype, msgType, caption, duration, isGif, fileName) {
        if (caption === void 0) { caption = undefined; }
        if (duration === void 0) { duration = undefined; }
        if (isGif === void 0) { isGif = false; }
        if (fileName === void 0) { fileName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var messageTag, mediaKey, mediaKeyExpanded, iv, cipherKey, macKey, enc, mac, fileSha256, fileEncSha256, type, _a, hostname, auth, token, path, mediaObj, _b, _c, media;
                        var _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    messageTag = encryption_1.randHex(12).toUpperCase();
                                    mediaKey = Uint8Array.from(crypto_1.default.randomBytes(32));
                                    mediaKeyExpanded = encryption_1.HKDF(mediaKey, 112, whatsappTokens_1.WAMediaAppInfo[msgType]);
                                    iv = mediaKeyExpanded.slice(0, 16);
                                    cipherKey = mediaKeyExpanded.slice(16, 48);
                                    macKey = mediaKeyExpanded.slice(48, 80);
                                    enc = encryption_1.AESEncrypt(cipherKey, Uint8Array.from(file), iv, false);
                                    mac = encryption_1.HmacSha256(macKey, arrays_1.concatIntArray(iv, enc)).slice(0, 10);
                                    fileSha256 = encryption_1.Sha256(file);
                                    fileEncSha256 = encryption_1.Sha256(arrays_1.concatIntArray(enc, mac));
                                    type = msgType === "sticker" ? "image" : msgType;
                                    return [4 /*yield*/, this.queryMediaConn()];
                                case 1:
                                    _a = _e.sent(), hostname = _a.hostname, auth = _a.auth;
                                    token = Buffer.from(fileEncSha256).toString("base64");
                                    path = "mms/" + type;
                                    mediaObj = {
                                        mimetype: mimetype,
                                        mediaKey: mediaKey,
                                        caption: caption,
                                        url: "",
                                        fileSha256: fileSha256,
                                        fileEncSha256: fileEncSha256,
                                        fileLength: file.byteLength,
                                        fileName: fileName
                                    };
                                    if (!(msgType === "sticker")) return [3 /*break*/, 3];
                                    _b = mediaObj;
                                    return [4 /*yield*/, sharp_1.default(file)
                                            .resize(100)
                                            .png()
                                            .toBuffer()];
                                case 2:
                                    _b.pngThumbnail = _e.sent();
                                    return [3 /*break*/, 6];
                                case 3:
                                    if (!(msgType === "image")) return [3 /*break*/, 5];
                                    _c = mediaObj;
                                    return [4 /*yield*/, sharp_1.default(file)
                                            .resize(100)
                                            .jpeg()
                                            .toBuffer()];
                                case 4:
                                    _c.jpegThumbnail = _e.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    if (msgType === "audio") {
                                        if (duration) {
                                            mediaObj.seconds = duration;
                                        }
                                        else {
                                            throw new Error("Audio messages require duration");
                                        }
                                    }
                                    else if (msgType === "video") {
                                        mediaObj.gifPlayback = isGif;
                                    }
                                    _e.label = 6;
                                case 6: return [4 /*yield*/, this.uploadMedia("https://" + hostname + "/" + path + "/" + token + "?auth=" + auth + "&token=" + token, arrays_1.concatIntArray(enc, mac))];
                                case 7:
                                    media = _e.sent();
                                    mediaObj.url = media.url;
                                    resolve((_d = {}, _d[msgType + "Message"] = mediaObj, _d));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    WhatsApp.prototype.sendMediaMessage = function (file, mimetype, msgType, remoteJid, caption, duration, isGif, fileName, mentionedJid) {
        if (caption === void 0) { caption = undefined; }
        if (duration === void 0) { duration = undefined; }
        if (isGif === void 0) { isGif = false; }
        if (fileName === void 0) { fileName = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var nextId, mediaProto, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextId = encryption_1.randHex(12).toUpperCase();
                        return [4 /*yield*/, this.encryptMedia(file, mimetype, msgType, caption, duration, isGif, fileName)];
                    case 1:
                        mediaProto = _a.sent();
                        console.log('sendMediaMessage after mediaProto');
                        console.log(mediaProto);
                        return [4 /*yield*/, this.sendMediaProto(mediaProto[(msgType + "Message")], msgType, remoteJid, nextId, mentionedJid)];
                    case 2:
                        media = _a.sent();
                        console.log('sendMediaMessage after sendMediaProto');
                        return [2 /*return*/, { id: nextId, content: media.content }];
                }
            });
        });
    };
    WhatsApp.prototype.sendVCardContact = function (remoteJid, vcard) {
        return __awaiter(this, void 0, void 0, function () {
            var fullName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullName = vcard.slice(vcard.indexOf("FN:") + 3, vcard.indexOf("\n", vcard.indexOf("FN:")));
                        return [4 /*yield*/, this.sendMessage({
                                contactMessage: {
                                    vcard: vcard,
                                    displayName: fullName
                                }
                            }, remoteJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendContact = function (remoteJid, phoneNumber, firstName, lastName) {
        if (lastName === void 0) { lastName = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var fullName, vcard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullName = lastName.length > 0 ? firstName + " " + lastName : firstName;
                        vcard = "BEGIN:VCARD\nVERSION:3.0\nN:" + lastName + ";" + firstName + ";;\nFN:" + fullName + "\nTEL;TYPE=VOICE:" + phoneNumber + "\nEND:VCARD";
                        return [4 /*yield*/, this.sendVCardContact(remoteJid, vcard)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendLocation = function (remoteJid, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendMessage({
                            locationMessage: {
                                degreesLatitude: latitude,
                                degreesLongitude: longitude
                            }
                        }, remoteJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.sendMediaProto = function (mediaFile, msgType, remoteJid, msgId, mentionedJid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('sendMediaProto init');
                        if (!!mentionedJid) return [3 /*break*/, 2];
                        console.log('sendMediaProto no mentionedJid');
                        return [4 /*yield*/, this.sendMessage((_a = {},
                                _a[msgType + "Message"] = mediaFile,
                                _a), remoteJid, msgId)];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        console.log('sendMediaProto mentionedJid');
                        return [4 /*yield*/, this.sendMessage((_b = {},
                                _b[msgType + "Message"] = __assign(__assign({}, mediaFile), { contextInfo: {
                                        mentionedJid: mentionedJid
                                    } }),
                                _b), remoteJid, msgId)];
                    case 3: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.decryptMedia = function (mediaObj, type) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaKey, mediaKeyExpanded, iv, cipherKey, macKey, rawFile, file, mac, hmacValidation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mediaKey = Uint8Array.from(Buffer.from(mediaObj.mediaKey, "base64"));
                        mediaKeyExpanded = encryption_1.HKDF(mediaKey, 112, whatsappTokens_1.WAMediaAppInfo[type]);
                        iv = mediaKeyExpanded.slice(0, 16);
                        cipherKey = mediaKeyExpanded.slice(16, 48);
                        macKey = mediaKeyExpanded.slice(48, 80);
                        return [4 /*yield*/, node_fetch_1.default(mediaObj.url)
                                .then(function (res) { return res.arrayBuffer(); })
                                .then(function (arrayBuffer) { return Buffer.from(arrayBuffer); })
                                .then(function (buffer) { return Uint8Array.from(buffer); })];
                    case 1:
                        rawFile = _a.sent();
                        file = rawFile.slice(0, rawFile.length - 10);
                        mac = rawFile.slice(rawFile.length - 10);
                        hmacValidation = encryption_1.HmacSha256(macKey, arrays_1.concatIntArray(iv, file));
                        if (!arrays_1.arraysEqual(hmacValidation.slice(0, 10), mac)) {
                            throw new Error("Invalid media data");
                        }
                        return [2 /*return*/, {
                                type: type,
                                caption: mediaObj.caption,
                                contextInfo: mediaObj.contextInfo,
                                gifPlayback: mediaObj.gifPlayback,
                                buffer: Buffer.from(encryption_1.AESDecrypt(cipherKey, arrays_1.concatIntArray(iv, file)))
                            }];
                }
            });
        });
    };
    WhatsApp.prototype.deleteMessage = function (remoteJid, msgId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendMessage({
                            protocolMessage: {
                                key: {
                                    remoteJid: remoteJid,
                                    fromMe: true,
                                    id: msgId
                                },
                                type: "REVOKE"
                            }
                        }, remoteJid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WhatsApp.prototype.getProfilePicThumb = function (jid) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var msgId;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    msgId = encryption_1.randHex(12).toUpperCase();
                                    return [4 /*yield*/, this.sendSocketAsync(msgId, msgId + ",[\"query\", \"ProfilePicThumb\", \"" + jid + "\"]").then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                            var _a, _b;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        if (!data.eurl) return [3 /*break*/, 2];
                                                        _a = resolve;
                                                        _b = {
                                                            id: msgId
                                                        };
                                                        return [4 /*yield*/, node_fetch_1.default(data.eurl).then(function (res) { return res.buffer(); })];
                                                    case 1:
                                                        _a.apply(void 0, [(_b.content = _c.sent(),
                                                                _b)]);
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        if (data.status) {
                                                            resolve({ id: msgId, status: data.status });
                                                        }
                                                        _c.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    WhatsApp.prototype.setupEncryptionKeys = function (data) {
        console.log("setting up encryption keys");
        var decodedSecret = Uint8Array.from(Buffer.from(data[1].secret, "base64"));
        var publicKey = decodedSecret.slice(0, 32);
        var sharedSecret = curve25519_js_1.sharedKey(this.keyPair.private, publicKey);
        var sharedSecretExpanded = encryption_1.HKDF(sharedSecret, 80);
        var hmacValidation = encryption_1.HmacSha256(sharedSecretExpanded.slice(32, 64), arrays_1.concatIntArray(decodedSecret.slice(0, 32), decodedSecret.slice(64)));
        if (!arrays_1.arraysEqual(hmacValidation, decodedSecret.slice(32, 64)))
            throw "hmac mismatch";
        var keysEncrypted = arrays_1.concatIntArray(sharedSecretExpanded.slice(64), decodedSecret.slice(64));
        var keysDecrypted = encryption_1.AESDecrypt(sharedSecretExpanded.slice(0, 32), keysEncrypted);
        this.encKey = keysDecrypted.slice(0, 32);
        this.macKey = keysDecrypted.slice(32, 64);
        this.clientToken = data[1].clientToken;
        this.serverToken = data[1].serverToken;
    };
    WhatsApp.prototype.setupQrCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyBase64, qrCode, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("setting up qr code");
                        this.keyPair = curve25519_js_1.generateKeyPair(Uint8Array.from(crypto_1.default.randomBytes(32)));
                        publicKeyBase64 = Buffer.from(this.keyPair.public).toString("base64");
                        _a = encryption_1.dataUrlToBuffer;
                        return [4 /*yield*/, qrcode_1.default.toDataURL(data.ref + "," + publicKeyBase64 + "," + this.clientId)];
                    case 1:
                        qrCode = _a.apply(void 0, [_b.sent()]);
                        fs_1.writeFile(this.parameters.qrPath, qrCode.data, function (err) {
                            if (err)
                                console.error(err);
                            _this.qrCodeListeners.forEach(function (func) { return func(); });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    WhatsApp.prototype.init = function (loginMsgId, restoreSession) {
        var _this = this;
        console.log("init", loginMsgId, restoreSession);
        return function (e) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = !restoreSession;
                        if (_a) return [3 /*break*/, 3];
                        _b = restoreSession;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, path_2.doesFileExist(this.parameters.keysPath)];
                    case 1:
                        _b = !(_d.sent());
                        _d.label = 2;
                    case 2:
                        _a = (_b);
                        _d.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 4];
                        console.log("creating new clientId");
                        this.clientId = crypto_1.default.randomBytes(16).toString("base64");
                        return [3 /*break*/, 6];
                    case 4:
                        console.log("getting keys");
                        return [4 /*yield*/, this.getKeys()];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        console.log('before admin init ', loginMsgId);
                        e.target.send(loginMsgId + ",[\"admin\",\"init\",[0,4,2080],[\"" + this.parameters.clientName + "\",\"" + this.parameters.clientShortName + "\",\"0.1.0\"],\"" + this.clientId + "\",true]");
                        console.log('after admin init');
                        _c = restoreSession;
                        if (!_c) return [3 /*break*/, 8];
                        return [4 /*yield*/, path_2.doesFileExist(this.parameters.keysPath)];
                    case 7:
                        _c = (_d.sent());
                        _d.label = 8;
                    case 8:
                        if (_c) {
                            console.log("restoring session");
                            this.restoreSession(loginMsgId);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
    };
    return WhatsApp;
}());
exports.default = WhatsApp;
//# sourceMappingURL=main.js.map