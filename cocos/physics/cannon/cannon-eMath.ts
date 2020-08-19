/**
 * @author zp
 */
/**
 * 多平台一致精确计算库，比decimal更轻量更快
 * [Math.round、Math.min、Math.max，Math.floor、Math.ceil，这些系统方法一般情况下是可以放心使用的]
 */
export class eMath {
    // 计算精度
    // sin、cos、tan方法的误差小数点后16位
    private static ACCURACY_SIN_ERROR = 1e-16;
    private static ACCURACY_COS_ERROR = 1e-16;
    private static ACCURACY_TAN_ERROR = 1e-16;

    // 角度弧度常量
    private static DEG = 57.29577951308232;
    private static RAD = 0.017453292519943295;

    // 系统常量
    public static readonly PI = 3.141592653589793;
    public static readonly E = 2.718281828459045;
    public static readonly LN2 = 0.6931471805599453;
    public static readonly LN10 = 2.302585092994046;
    public static readonly LOG2E = 1.4426950408889634;
    public static readonly LOG10E = 0.4342944819032518;
    public static readonly SQRT1_2 = 0.7071067811865476;
    public static readonly SQRT2 = 1.4142135623730951;

    /**
     * 链式调用
     * @example
     * const value = exactMath.value(10).add(20.123).mul(2).sqrt().value;
     */
    public static chain = null;
    // public static value(value) {
    //     if (!eMath.chain) {
    //         eMath.chain = {
    //             value: 0,
    //             valueOf() { return eMath.value; },
    //             toString() { return String(eMath.value); }
    //         }
    //         for (const key in eMath) {
    //             if (key !== 'value' && typeof eMath[key] === 'function') {
    //                 eMath.chain[key] = function (...args) {
    //                     eMath.value = eMath[key].call(eMath, eMath.value, ...args);
    //                     return eMath;
    //                 }
    //             }
    //         }
    //     }

    //     eMath.chain.value = value;
    //     return eMath.chain;
    // }

    /****************************************************基础****************************************************/
    /**
     * 获得小数位数
     * @param {Number} num 浮点数
     * @returns {Number}
     */
    public static getDecimalPlace = function (num) {
        if (num && num !== Math.floor(num)) {
            for (let n = 1, m = 10, temp = 0; n < 20; n += 1, m *= 10) {
                temp = num * m;
                if (temp == Math.floor(temp)) return n;
            }
            return 20;
        } else {
            return 0;
        }
    }
    /**
     * 保留n为小数，并四舍五入
     * @example
     * (2.335).toFixed(2)
     * exactMath.toFixed(2.335, 2)
     * @param {Number} num 浮点数
     * @param {Number} n 整数
     * @returns {Number}
     */
    public static toFixed = function (num, n = 0) {
        if (n == 0) {
            return Math.round(num);
        } else {
            const m = Math.pow(10, n);
            return Math.round(num * (m * 10) / 10) / m;
        }
    }

    public static abs = function (x) {
        return Math.abs(x);
    }
    public static round = function (x) {
        return Math.round(x);
    }
    public static ceil = function (x) {
        return Math.ceil(x)
    }
    public static floor = function (x) {
        return Math.floor(x)
    }
    public static min = function (...args) {
        return Math.min(...args);
    }
    public static max = function (...args) {
        return Math.max(...args);
    }

    /**
     * 小数相加
     * @param {Number} num1 浮点数
     * @param {Number} num2 浮点数
     * @returns {Number}
     */
    public static add = function (...args) {
        if (args.length === 2) {
            const num1 = args[0];
            const num2 = args[1];
            const m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));
            return (eMath.toFixed(num1 * m) + eMath.toFixed(num2 * m)) / m;
        } else {
            return args.reduce((a, b) => eMath.add(a, b))
        }
    };
    /**
     * 小数相减
     * @param {Number} num1 浮点数
     * @param {Number} num2 浮点数
     * @returns {Number}
     */
    public static sub = function (...args) {
        if (args.length === 2) {
            const num1 = args[0];
            const num2 = args[1];
            const m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));

            return (eMath.toFixed(num1 * m) - eMath.toFixed(num2 * m)) / m;
        } else {
            return args.reduce((a, b) => eMath.sub(a, b))
        }
    };
    /**
     * 小数相乘
     * @param {Number} num1 浮点数
     * @param {Number} num2 浮点数
     * @returns {Number}
     */
    public static mul = function (...args) {
        if (args.length === 2) {
            let num1 = args[0];
            let num2 = args[1];

            // 方案1：
            // 直接相乘，但是相乘两数小数点过多会导致中间值[(n1 * m1) * (n2 * m2)]过大
            // const n1 = eMath.getDecimalPlace(num1);
            // const n2 = eMath.getDecimalPlace(num2);
            // const m1 = Math.pow(10, n1);
            // const m2 = Math.pow(10, n2);
            // return (n1 * m1) * (n2 * m2) / (m1 * m2);

            // 方案2：
            // 用除法实现乘法，不会存在过大中间值
            let n1 = eMath.getDecimalPlace(num1);
            let n2 = eMath.getDecimalPlace(num2);

            let m = Math.pow(10, n2);
            num2 = m / eMath.toFixed(num2 * m);

            m = Math.pow(10, Math.max(n1, eMath.getDecimalPlace(num2)));
            m = eMath.toFixed(num1 * m) / eMath.toFixed(num2 * m);

            let n = Math.min(eMath.getDecimalPlace(m), n1 + n2);
            return eMath.toFixed(m, n);
        } else {
            return args.reduce((a, b) => eMath.mul(a, b))
        }
    };
    /**
     * 小数相除法
     * @param {Number} num1 浮点数
     * @param {Number} num2 浮点数
     * @returns {Number}
     */
    public static div = function (...args) {
        if (args.length === 2) {
            const num1 = args[0];
            const num2 = args[1];

            const m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));
            return eMath.toFixed(num1 * m) / eMath.toFixed(num2 * m);
        } else {
            return args.reduce((a, b) => eMath.div(a, b))
        }
    };
    /**
     * 取余
     * @param {Number} num1 浮点数
     * @param {Number} num2 浮点数
     * @returns {Number}
     */
    public static rem = function (...args) {
        if (args.length === 2) {
            const num1 = args[0];
            const num2 = args[1];
            const m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));

            return eMath.toFixed(num1 * m) % eMath.toFixed(num2 * m) / m;
        } else {
            return args.reduce((a, b) => eMath.rem(a, b))
        }
    };

    /**
     * n次方，仅支持整数次方(正负都可以)
     * @param {Number} num 浮点数
     * @param {Number} n 整数
     */
    public static pow = function (num, n) {
        if (num == 0 && n == 0) {
            return 1;
        }
        if (num == 0 && n > 0) {
            return 0
        }
        if (num == 0 && n < 0) {
            return Infinity;
        }
        // num为负数，n为负小数，返回NaN
        if (num < 0 && n < 0 && Math.round(n) != n) {
            return NaN;
        }

        if (Math.round(n) != n) {
            throw new Error('n must be an integer');
        }

        let result = 1;

        if (n > 0) {
            for (let index = 0; index < n; index++) {
                result = eMath.mul(result, num);
            }
        } else if (n < 0) {
            for (let index = 0, len = Math.abs(n); index < len; index++) {
                result = eMath.div(result, num);
            }
        }

        return result;
    };
    /**
     * 开方运算【牛顿迭代法】
     * 
     * @param {Number} n
     * @returns 
     */
    public static sqrt = function (n) {
        if (n < 0) return NaN;
        if (n === 0) return 0;
        if (n === 1) return 1;
        let last = 0;
        let res = 1;
        let c = 50;
        while (res != last && --c >= 0) {
            last = res;
            res = eMath.div(eMath.add(res, eMath.div(n, res)), 2)
        }
        return res;
    };

    /****************************************************随机****************************************************/
    public static getSeed(seed) {
        if (isNaN(seed)) {
            seed = Math.floor(Math.random() * 233280);
        } else {
            seed = Math.floor(seed % 233280);
        }
        return seed;
    }

    public static randomSeed;

    /**
     * 设置随机种子
     */
    public static setSeed = function (seed) {
        eMath.randomSeed = eMath.getSeed(seed);
    };

    /**
     * 随机
     */
    public static andom = function () {
        eMath.randomSeed = (eMath.randomSeed * 9301 + 49297) % 233280;
        return eMath.randomSeed / 233280.0;
    };

    /**
     * 根据随机种子随机
     * @param {number} seed
     */
    public static randomBySeed = function (seed) {
        seed = eMath.getSeed(seed);
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280.0;
    };

    /****************************************************角度弧度转换****************************************************/
    /**
     * 弧度数转角度数
     * @param {Number} radians 浮点数
     * @returns {Numbe} 浮点数
     */
    public static radiansToDegrees = function (radians) {
        return eMath.div(radians, eMath.RAD);
    };
    /**
     * 角度数转弧度数
     * @param {Number} degrees 浮点数
     * @returns {Numbe} 浮点数
     */
    public static degreesToRadians = function (degrees) {
        return eMath.div(degrees, eMath.DEG);
    };
    /**
     * 将角度值转换到[0, 360)范围内
     * @param {Number} angle 浮点数
     * @returns {Number} 整数
     */
    public static get0To360Angle = function (angle) {
        if (angle === 0) {
            return 0;
        } else if (angle < 0) {
            return eMath.add(eMath.rem(angle, 360), 360);
        } else {
            return eMath.rem(angle, 360);
        }
    };
    /****************************************************三角函数****************************************************/
    /**
     * 查表
     */
    private static _sin = {};
    private static _cos = {};
    private static _tan = {};

    /**
     * 3个三角函数，根据需求自行添加
     * 为了效率，应该尽量使用查表法
     * 表内查不到的，目前使用系统方法的结果并取前4位小数
     */
    public static sin = function (x) {
        if (eMath._sin.hasOwnProperty(x)) {
            return eMath._sin[x];
        }
        return eMath.toFixed(Math.sin(x), 4);
    };
    public static cos = function (x) {
        if (eMath._cos.hasOwnProperty(x)) {
            return eMath._cos[x];
        }

        return eMath.toFixed(Math.cos(x), 4);
    };
    public static tan = function (x) {
        if (eMath._tan.hasOwnProperty(x)) {
            return eMath._tan[x];
        }

        return eMath.toFixed(Math.tan(x), 4);
    };
}
window.eMath = eMath;

