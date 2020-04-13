"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function doesFileExist(pathname) {
    return new Promise(function (resolve) {
        fs_1.exists(pathname, function (exists) {
            resolve(exists);
        });
    });
}
exports.doesFileExist = doesFileExist;
//# sourceMappingURL=path.js.map