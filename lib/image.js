(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //base64转blob
    function base64ToBlob(base64) {
        let base64Arr = base64.split(',');
        let imgtype = '';
        let base64String = '';
        if (base64Arr.length > 1) {
            //如果是图片base64，去掉头信息
            base64String = base64Arr[1];
            imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
        }
        // 将base64解码
        let bytes = atob(base64String);
        //let bytes = base64;
        let bytesCode = new ArrayBuffer(bytes.length);
        // 转换为类型化数组
        let byteArray = new Uint8Array(bytesCode);
        // 将base64转换为ascii码
        for (let i = 0; i < bytes.length; i++) {
            byteArray[i] = bytes.charCodeAt(i);
        }
        // 生成Blob对象（文件对象）
        return new Blob([bytesCode], { type: imgtype });
    }
    exports.base64ToBlob = base64ToBlob;
    ;
    //blob转Base64
    // export function blobToDataURL(blob:Blob, callback:Function) {
    //   let a = new FileReader();
    //   a.onload = function (e) { callback(e.target.result); }
    //   a.readAsDataURL(blob);
    // }
    /** 压缩图片
     * @param {Object} file 上传对象files[0]
     * @param {Object} options 压缩设置对象
     * @param {Function} callback 回调函数
     * @result {Object} 返回blob文件对象
     * */
    function compressImg(file, options, callback) {
        let imgname = file.name;
        let imgtype = (imgname.substring(imgname.lastIndexOf('.') + 1)).toLowerCase();
        if (imgtype == 'jpg' || imgtype == 'jpeg') {
            imgtype = 'image/jpeg';
        }
        else {
            imgtype = 'image/png';
        }
        // 用FileReader读取文件
        let reader = new FileReader();
        // 将图片读取为base64
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            let base64 = evt.target.result;
            // 创建图片对象
            let img = new Image();
            // 用图片对象加载读入的base64
            img.src = base64;
            img.onload = function () {
                let that = this, canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
                canvas.setAttribute('width', img.width.toString());
                canvas.setAttribute('height', img.height.toString());
                // 将图片画入canvas
                ctx.drawImage(img, 0, 0, img.width, img.height);
                // 压缩到指定体积以下（M）
                if (options.size) {
                    let scale = 0.9;
                    (function f(scale) {
                        if (base64.length / 1024 / 1024 > options.size && scale > 0) {
                            base64 = canvas.toDataURL(imgtype, scale);
                            scale = scale - 0.1;
                            f(scale);
                        }
                        else {
                            callback(base64);
                        }
                    })(scale);
                }
                else if (options.scale) {
                    // 按比率压缩
                    base64 = canvas.toDataURL(imgtype, options.scale);
                    callback(base64);
                }
            };
        };
    }
    exports.compressImg = compressImg;
    ;
    /**
     * 图片预览
     * @param {Object} $fileInput 文件上传file
     * @param {Object} $previewImg 预览图片的image元素
     */
    function previewImg($fileInput, $previewImg) {
        $fileInput.onchange = function ($event) {
            let $target = $event.target;
            if ($target.files && $target.files[0]) {
                let reader = new FileReader();
                reader.onload = function (evt) {
                    $previewImg.src = evt.target.result;
                };
                reader.readAsDataURL($target.files[0]);
            }
        };
    }
    exports.previewImg = previewImg;
    /**
     * 将图片旋转到正确的角度
     * （解决移动端上传的图片角度不正确的问题）
     * （旋转后返回的是base64，可以参照本目录下的convertBase64ToBlob.js，将base64还原为file input读取得到的文件对象）
     * @param {Dom Object} $fileInput 文件上传输入框
     * @param {Function} callback 旋转完成后的回调函数
     */
    function resetImgOrientation($fileInput, callback) {
        // 绑定change事件
        $fileInput.onchange = function ($event) {
            let $target = $event.target;
            if ($target.files && $target.files[0]) {
                // 获取图片旋转角度
                getOrientation($target.files[0], function (orientation) {
                    let reader = new FileReader();
                    reader.readAsDataURL($target.files[0]);
                    reader.onload = function (evt) {
                        let base64 = evt.target.result;
                        // 将图片旋转到正确的角度
                        resetOrientation(base64, orientation, function (resultBase64) {
                            callback(resultBase64);
                        });
                    };
                });
            }
        };
    }
    exports.resetImgOrientation = resetImgOrientation;
    // 获取图片旋转的角度
    function getOrientation(file, callback) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            let view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8)
                return callback(-2);
            let length = view.byteLength, offset = 2;
            while (offset < length) {
                let marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966)
                        return callback(-1);
                    let little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    let tags = view.getUint16(offset, little);
                    offset += 2;
                    for (let i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
                else if ((marker & 0xFF00) != 0xFF00)
                    break;
                else
                    offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
    }
    exports.getOrientation = getOrientation;
    // 将图片旋转到正确的角度
    function resetOrientation(srcBase64, srcOrientation, callback) {
        let img = new Image();
        img.onload = function () {
            let width = img.width, height = img.height, canvas = document.createElement('canvas'), ctx = canvas.getContext("2d");
            // set proper canvas dimensions before transform & export
            if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
                canvas.width = height;
                canvas.height = width;
            }
            else {
                canvas.width = width;
                canvas.height = height;
            }
            // transform context before drawing image
            switch (srcOrientation) {
                case 2:
                    ctx.transform(-1, 0, 0, 1, width, 0);
                    break;
                case 3:
                    ctx.transform(-1, 0, 0, -1, width, height);
                    break;
                case 4:
                    ctx.transform(1, 0, 0, -1, 0, height);
                    break;
                case 5:
                    ctx.transform(0, 1, 1, 0, 0, 0);
                    break;
                case 6:
                    ctx.transform(0, 1, -1, 0, height, 0);
                    break;
                case 7:
                    ctx.transform(0, -1, -1, 0, height, width);
                    break;
                case 8:
                    ctx.transform(0, -1, 1, 0, 0, width);
                    break;
                default: ctx.transform(1, 0, 0, 1, 0, 0);
            }
            // draw image
            ctx.drawImage(img, 0, 0);
            // export base64
            callback(canvas.toDataURL('image/jpeg'));
        };
        img.src = srcBase64;
    }
    exports.resetOrientation = resetOrientation;
    ;
    function convertImgToBase64(image, callback, outputFormat) {
        let canvas = document.createElement('CANVAS'), ctx = canvas.getContext('2d'), img = image instanceof HTMLImageElement ? image : new Image;
        img.removeAttribute('width');
        img.removeAttribute('height');
        if (typeof image === 'string') {
            let url = image;
            img.crossOrigin = 'Anonymous';
            img.onload = getDataURL;
            img.src = url;
        }
        else {
            return getDataURL();
        }
        function getDataURL() {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            let dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback && callback(dataURL);
            return dataURL;
        }
    }
    exports.convertImgToBase64 = convertImgToBase64;
});
