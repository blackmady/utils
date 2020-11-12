export declare const filters: {
    '': (val: any) => any;
    /**姓名脱敏**/
    tmName: (name: string) => string;
    /**邮箱脱敏**/
    tmEmail: (mail?: string) => string;
    /**银行卡脱敏**/
    tmBankCard: (str?: string) => string;
    tmIdCard: (str?: string) => string;
    /**电话或银行卡脱敏
     ***规则为隐藏银行卡号或手机号的倒数第二个四位数
     **/
    tmTel: (tel?: string) => string;
    tmCall: (tel?: string) => string;
    /**格式化*/
    /**格式化时间*/
    formatTime(d?: Date, fmt?: boolean | string): string;
    /**格式化如下格式的时间201601080952134*/
    formatTime2(d: string | number, fmt?: string): string;
    /**格式化金额值，带逗号,u为单位字符串*/
    formatMoney: (v: any, l?: number, u?: string) => any;
    /**格式化以分为单位的金额.*/
    formatMoney2: (v: any, l?: number, u?: string) => any;
    /**格式化卡号，四位一空格*/
    formatCard: (cardNo: string) => string;
    /**
     * @description: 补零(前置)
     * @param {number|string} num   原数据
     * @param {number} len  总长度:默认2
     * @param {string} str  填补字符串:默认'0'
     * @return: string
     */
    zeroize: (num: number | string, len?: number, str?: string) => string;
};
