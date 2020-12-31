interface IConfig {
    color?: string;
}
interface IRecord {
    type?: string;
    group?: string;
    name?: string;
    color?: string;
    data?: JSON;
}
interface INog {
    (...args: any[]): any;
    globalConfig: {
        group: String;
        color: String;
    };
    start: () => void;
    record: (obj: IRecord) => void;
    config: (config: IConfig) => void;
    fingerprint: (obj: Object) => String;
}
declare const nog: INog;
export default nog;
/**
// 记录
nog.record()
// 调用
nog()
*/ 
