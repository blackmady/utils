export declare function base64ToBlob(base64: any): Blob;
/**
 * @description: 获取图片信息
 * @param {string|File|HTMLImageElement} img 图片
 * @param {number} quality 图片质量
 * @param {string} imgExt 图片类型
 * @return: Promise<{image:HTMLImageElement,dataURL:string,size:number,width:number,height:number}>
 */
export declare function imageInfo(img: string | File | HTMLImageElement, quality?: number, imgExt?: string): Promise<unknown>;
/** 压缩图片
 * @param {Object} file 上传对象files[0]
 * @param {Object} options 压缩设置对象
 * @param {Function} callback 回调函数
 * @result {Object} 返回blob文件对象
 * */
export declare function compressImg(file: File, options: {
    size: number;
    scale: number;
}, callback: Function): void;
/**
 * 图片预览
 * @param {Object} $fileInput 文件上传file
 * @param {Object} $previewImg 预览图片的image元素
 */
export declare function previewImg($fileInput: any, $previewImg: any): void;
/**
 * 将图片旋转到正确的角度
 * （解决移动端上传的图片角度不正确的问题）
 * （旋转后返回的是base64，可以参照本目录下的convertBase64ToBlob.js，将base64还原为file input读取得到的文件对象）
 * @param {Dom Object} $fileInput 文件上传输入框
 * @param {Function} callback 旋转完成后的回调函数
 */
export declare function resetImgOrientation($fileInput: any, callback: any): void;
export declare function getOrientation(file: any, callback: any): void;
export declare function resetOrientation(srcBase64: any, srcOrientation: any, callback: any): void;
export declare function convertImgToBase64(image: any, callback: any, outputFormat: any): string | undefined;
