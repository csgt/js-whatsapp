"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function concatIntArray() {
    var arrs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrs[_i] = arguments[_i];
    }
    if (arrs.length > 0) {
        var finalArr = arrs[0];
        for (var i = 1; i < arrs.length; i++) {
            var arr = arrs[i];
            var tmp = new Uint8Array(finalArr.length + arr.length);
            tmp.set(finalArr, 0);
            tmp.set(arr, finalArr.length);
            finalArr = tmp;
        }
        return finalArr;
    }
    return new Uint8Array();
}
exports.concatIntArray = concatIntArray;
function arraysEqual(arr1, arr2) {
    if (arr1 === arr2)
        return true;
    if (arr1 === null || arr2 === null)
        return false;
    if (arr1.length !== arr2.length)
        return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}
exports.arraysEqual = arraysEqual;
//# sourceMappingURL=arrays.js.map