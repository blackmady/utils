var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./store", "./image"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const store_1 = __importDefault(require("./store"));
    exports.store = store_1.default;
    var image_1 = require("./image");
    exports.base64ToBlob = image_1.base64ToBlob;
    exports.compressImg = image_1.compressImg;
    exports.convertImgToBase64 = image_1.convertImgToBase64;
    exports.getOrientation = image_1.getOrientation;
    exports.previewImg = image_1.previewImg;
    exports.resetImgOrientation = image_1.resetImgOrientation;
    exports.resetOrientation = image_1.resetOrientation;
    exports.default = './utils';
});
