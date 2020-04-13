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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var protobufjs_1 = __importDefault(require("protobufjs"));
exports.WATags = {
    LIST_EMPTY: 0,
    STREAM_END: 2,
    DICTIONARY_0: 236,
    DICTIONARY_1: 237,
    DICTIONARY_2: 238,
    DICTIONARY_3: 239,
    LIST_8: 248,
    LIST_16: 249,
    JID_PAIR: 250,
    HEX_8: 251,
    BINARY_8: 252,
    BINARY_20: 253,
    BINARY_32: 254,
    NIBBLE_8: 255,
    SINGLE_BYTE_MAX: 256,
    PACKED_MAX: 254
};
exports.WAMetrics = {
    DEBUG_LOG: 1,
    QUERY_RESUME: 2,
    QUERY_RECEIPT: 3,
    QUERY_MEDIA: 4,
    QUERY_CHAT: 5,
    QUERY_CONTACTS: 6,
    QUERY_MESSAGES: 7,
    PRESENCE: 8,
    PRESENCE_SUBSCRIBE: 9,
    GROUP: 10,
    READ: 11,
    CHAT: 12,
    RECEIVED: 13,
    PIC: 14,
    STATUS: 15,
    MESSAGE: 16,
    QUERY_ACTIONS: 17,
    BLOCK: 18,
    QUERY_GROUP: 19,
    QUERY_PREVIEW: 20,
    QUERY_EMOJI: 21,
    QUERY_MESSAGE_INFO: 22,
    SPAM: 23,
    QUERY_SEARCH: 24,
    QUERY_IDENTITY: 25,
    QUERY_URL: 26,
    PROFILE: 27,
    CONTACT: 28,
    QUERY_VCARD: 29,
    QUERY_STATUS: 30,
    QUERY_STATUS_UPDATE: 31,
    PRIVACY_STATUS: 32,
    QUERY_LIVE_LOCATIONS: 33,
    LIVE_LOCATION: 34,
    QUERY_VNAME: 35,
    QUERY_LABELS: 36,
    CALL: 37,
    QUERY_CALL: 38,
    QUERY_QUICK_REPLIES: 39,
    QUERY_CALL_OFFER: 40,
    QUERY_RESPONSE: 41,
    QUERY_STICKER_PACKS: 42,
    QUERY_STICKERS: 43,
    ADD_OR_REMOVE_LABELS: 44,
    QUERY_NEXT_LABEL_COLOR: 45,
    QUERY_LABEL_PALETTE: 46,
    CREATE_OR_DELETE_LABELS: 47,
    EDIT_LABELS: 48
};
exports.WAFlags = {
    IGNORE: 1 << 7,
    ACK_REQUEST: 1 << 6,
    AVAILABLE: 1 << 5,
    NOT_AVAILABLE: 1 << 4,
    EXPIRES: 1 << 3,
    SKIP_OFFLINE: 1 << 2
};
exports.WAMediaAppInfo = {
    image: "WhatsApp Image Keys",
    sticker: "WhatsApp Image Keys",
    video: "WhatsApp Video Keys",
    audio: "WhatsApp Audio Keys",
    document: "WhatsApp Document Keys"
};
exports.WASingleByteTokens = [
    "",
    "",
    "",
    "200",
    "400",
    "404",
    "500",
    "501",
    "502",
    "action",
    "add",
    "after",
    "archive",
    "author",
    "available",
    "battery",
    "before",
    "body",
    "broadcast",
    "chat",
    "clear",
    "code",
    "composing",
    "contacts",
    "count",
    "create",
    "debug",
    "delete",
    "demote",
    "duplicate",
    "encoding",
    "error",
    "false",
    "filehash",
    "from",
    "g.us",
    "group",
    "groups_v2",
    "height",
    "id",
    "image",
    "in",
    "index",
    "invis",
    "item",
    "jid",
    "kind",
    "last",
    "leave",
    "live",
    "log",
    "media",
    "message",
    "mimetype",
    "missing",
    "modify",
    "name",
    "notification",
    "notify",
    "out",
    "owner",
    "participant",
    "paused",
    "picture",
    "played",
    "presence",
    "preview",
    "promote",
    "query",
    "raw",
    "read",
    "receipt",
    "received",
    "recipient",
    "recording",
    "relay",
    "remove",
    "response",
    "resume",
    "retry",
    "s.whatsapp.net",
    "seconds",
    "set",
    "size",
    "status",
    "subject",
    "subscribe",
    "t",
    "text",
    "to",
    "true",
    "type",
    "unarchive",
    "unavailable",
    "url",
    "user",
    "value",
    "web",
    "width",
    "mute",
    "read_only",
    "admin",
    "creator",
    "short",
    "update",
    "powersave",
    "checksum",
    "epoch",
    "block",
    "previous",
    "409",
    "replaced",
    "reason",
    "spam",
    "modify_tag",
    "message_info",
    "delivery",
    "emoji",
    "title",
    "description",
    "canonical-url",
    "matched-text",
    "star",
    "unstar",
    "media_key",
    "filename",
    "identity",
    "unread",
    "page",
    "page_count",
    "search",
    "media_message",
    "security",
    "call_log",
    "profile",
    "ciphertext",
    "invite",
    "gif",
    "vcard",
    "frequent",
    "privacy",
    "blacklist",
    "whitelist",
    "verify",
    "location",
    "document",
    "elapsed",
    "revoke_invite",
    "expiration",
    "unsubscribe",
    "disable",
    "vname",
    "old_jid",
    "new_jid",
    "announcement",
    "locked",
    "prop",
    "label",
    "color",
    "call",
    "offer",
    "call-id"
];
exports.WADoubleByteTokens = [];
var specPath = path_1.resolve(__dirname, "../../spec/def.proto");
var WAWebMessageInfo = /** @class */ (function () {
    function WAWebMessageInfo() {
    }
    WAWebMessageInfo.decode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protobufjs_1.default.load(specPath).then(function (root) {
                            var msgType = root.lookupType("proto.WebMessageInfo");
                            var msg = msgType.decode(data);
                            return msg.toJSON();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    WAWebMessageInfo.encode = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protobufjs_1.default.load(specPath).then(function (root) {
                            var msgType = root.lookupType("proto.WebMessageInfo");
                            var data = msgType.fromObject(msg);
                            return msgType.encode(data).finish();
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return WAWebMessageInfo;
}());
exports.WAWebMessageInfo = WAWebMessageInfo;
//# sourceMappingURL=whatsappTokens.js.map