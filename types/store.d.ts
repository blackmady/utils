declare const _default: {
    getItem(key: string, store?: Storage): any;
    store(key: string, value: any, time?: number, store?: Storage): any;
    local(key: string, value: any, time: number): any;
    session(key: string, value: any, time: number): any;
    clear(store: Storage): void;
    cookie(name: string, value?: string | undefined, hours?: number | undefined, path?: string | undefined, domain?: string | undefined, secure?: string | undefined): string | undefined;
};
export default _default;
