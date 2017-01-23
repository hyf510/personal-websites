/*!
 * Utils utils子模块
 * @module utils
 * @author: huangyanfeng137@163.com
 */
define(['underscore'], function (_) {
    'use strict';

    var Utils = {
        RegexMap: {
            //制表符
            table: /\t/g,
            //换行符
            line: /\n/g,
            //正负整数或浮点数
            intOrFloat: /^(-)?\d+(\.\d+)?$/,
            //10位整数
            intFloatTwo: /^(0|[1-9]\d*)?$/,
            //正整数
            int:/^[0-9]\d*$/,
            //2位正整数
            intTwo:/^[0-9]{1,2}$/,
            //贷款笔数0或1
            loanInt:/^[0,1]$/,
            //组织机构代码
            enterpriseCode: /^[a-zA-Z0-9]{8}\-[a-zA-Z0-9]$/,
            //工商执照注册号
            enterpriseRegCode: /^\d{13}$|^\d{15}$/,  //   以前是13位,08年以后变15位
            //身份证
            idCard: /^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/,
            // 手机号码
            MobileNo: /^1[34587]\d{9}$/,
            //普通座机
            telePhone:/\d{3}-\d{8}|\d{4}-\d{7}/,
            // 银行卡号（大于或等于16位的数字）
            CardNo: /^\d{16,}$/,
            // 短验证码（6位数字以上）
            MobileCode: /^\d{6,}$/,
            // 交易密码(6-16位数字或字母)
            OrderPassword: /^\S{6,16}$/,
            //千分位正则
            parseThousands: /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
            //每4位字符用空格隔开
            bankCardNo: /(\d{4})(?=\d)/g,
            //金额检测
            moneyTest: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            //卡号屏蔽
            parseToStarNumber: /^(\d{4})(\d+)(\d{4})$/,
            // 后四位屏蔽
            parseRightFourStar: /^(\w+)(\w{4})$/,
            //日期格式检测
            parseDateFormat: /\b(\d{4})\b[^\d]+(\d{1,2})\b[^\d]+(\d{1,2})\b(\s(\d{1,2})\:(\d{1,2})\:(\d{1,2}))?[^\d]?/,
            // 出生日期掩码，显示格式（'19**年**月*2日')
            userBirthdayStarRegex: /(\d{2})\d{2}([^\d]+)\d+([^\d]+)\d?(\d)([^\d]+)?/,
            //金额转换
            moneyReplace: /[^0-9\.]/g,
            //POS机编号
            posNumberREG: /^[0123456789]\d{14}$/,
            //lufax's name
            lufaxName: /^[a-zA-Z0-9-_]{4,30}$/g,
            //中文名
            chinaName: /^[\u4e00-\u9fa5]{2,4}$/g,
            //有2位小数的正实数
            number: /^[0-9]+(.[0-9]{2})?$/,
            //中文字符
            chinaWordage:/^[\u4e00-\u9fa5]*$/g,
            // 房产证号
            houseId:/^[a-zA-Z0-9\u4e00-\u9fa5]{0,20}$/
        },
        RegexReplacement: {
            parseThousands: '$1,',
            parseToStarNumber: function ($0, $1, $2, $3) {
                return $1 + $2.replace(/\d/g, '*') + $3;
            },
            parseRightFourStar: function ($0, $1, $2) {
                return $1.replace(/\w/g, '*') + $2;
            }
        },
        /**
         * 日志打印方法
         * @param text 需要打印的日志内容
         */
        logs: function (text) {
            window.console && console.log && console.log(text);
        },
        parseThousands: function (priceVal, num) {
            if(!priceVal){
                return priceVal
            }
            return (parseFloat(priceVal || 0).toFixed(num || 2) + '').replace(Utils.RegexMap.parseThousands, Utils.RegexReplacement.parseThousands);
        },

        /**
         * 本地数据操作
         * @param key
         * @param value
         */
        data: function (key, value) {
            var getItemValue = function () {
                var data = localStorage.getItem(key);
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    Utils.log(e);
                }
                return data;
            };
            if (key && value === undefined) {
                return getItemValue();
            }
            switch (toString.call(value)) {
                case '[object Undefined]':
                    return getItemValue();
                case '[object Null]':
                    localStorage.removeItem(key);
                    break;
                default :
                    localStorage.setItem(key, JSON.stringify(value));
                    break;
            }
        },
        /**
         * 公共方法定义
         * @example: http://xxx.com/a.do?productCode=P001
         *     Result:  C.getParameter('productCode')  // 'P001'
         */
        getParameter: function (param) {
            var reg = new RegExp('[&,?]' + param + '=([^\\&]*)', 'i');
            var value = reg.exec(location.search);
            return value ? decodeURIComponent(decodeURIComponent(value[1])) : '';
        },
        /**
         * 获取URL参数对象
         * @param queryString
         * @returns {{}}
         */
        getQueryMap: function (queryString) {
            var paramObj = {},
                paramList,
                oneQueryMatch,
                regGlobal = /[\?\&][^\?\&]+=[^\?\&#]+/g,
                regOne = /[\?\&]([^=\?]+)=([^\?\&#]+)/;

            queryString = queryString || location.href;
            paramList = queryString.match(regGlobal);

            if (!paramList) {
                return paramObj;
            }

            for (var i = 0, len = paramList.length; i < len; i++) {
                oneQueryMatch = paramList[i].match(regOne);
                if (null === oneQueryMatch) {
                    continue;
                }
                paramObj[oneQueryMatch[1]] = oneQueryMatch[2];
            }

            return paramObj;
        },
        /**
         * 获取填写身份证相关的信息
         * @ param str 截取的出生日期字符串 或 身份证号
         * @ param type 传入第二个值是证明需返回的是string，否则是boolean
         type为true需要返回“年月日”，否则校验是否符合日期格式
         * @ param format 需返回的日期格式，默认：“yyyy年MM月dd日”
         * 检测身份证中的日期是否有效
         */
        strDateTime: function (str, type, format) {
            var isRight = false;
            // 如果传入的是身份证号时，从第6位开始截取8个字符
            if (str.length == 18) {
                str = str.substr(6, 8);
            }
            var r = str.match(/^(\d{1,4})(-|\/)?(\d{1,2})\2(\d{1,2})$/);
            if (r == null)return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            var now = new Date();
            var minDate = new Date('1900-01-01'), maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            // 如果不符合最大当前日期，最小1900年1月1日，则不通过日期校验
            if (d < minDate || d > maxDate) {
                return false;
            }
            isRight = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
            if (type && isRight) {
                return Utils.parseDateFormat(d, format || 'yyyy年MM月dd日');
            }
            return isRight;
        },
        /** 转换日期格式
         * @param date : 日期格式|String类型 (如：'2012-12-12' | '2012年12月12日' | new Date())
         * @param format : String类型 （如: 'yyyy年MM月dd日'或'yyyy年MM月dd日 hh时mm分ss秒',默认'yyyy-MM-dd'）
         * @example C.parseDateFormat(new Date(), 'yyyy年MM月dd日') 输出：'2014年04月29日'
         * @example C.parseDateFormat(new Date()) 输出：'2014-04-29'
         * @exmaple C.parseDateFormat('2014-05-07 16:09:47','yyyy年MM月dd日 hh时mm分ss秒')
         *          输出：'2014年05月07日 16时09分47秒'
         **/
        parseDateFormat: function (date, format) {
            if (!date) {
                return date;
            }
            if (!isNaN(date) && String(date).length == 8) {
                date = (date + '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3');
            }
            var addZero = function (val) {
                return /^\d{1}$/.test(val) ? '0' + val : val;
            };
            format = format || 'yyyy-MM-dd';
            var year = '', month = '', day = '', hours = '', minutes = '', seconds = '';
            if (typeof date == 'string') {
                var dateReg = Utils.RegexMap.parseDateFormat;
                var dateMatch = date.match(dateReg);
                if (dateMatch) {
                    year = dateMatch[1];
                    month = dateMatch[2];
                    day = dateMatch[3];
                    hours = dateMatch[5];
                    minutes = dateMatch[6];
                    seconds = dateMatch[7];
                }
            } else {
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hours = date.getHours();
                minutes = date.getMinutes();
                seconds = date.getSeconds();
            }
            month = addZero(month);
            day = addZero(day);
            hours = addZero(hours);
            minutes = addZero(minutes);
            seconds = addZero(seconds);
            return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('hh', hours).replace('mm', minutes).replace('ss', seconds);
        },
        /**
         * 每4个字符用空格隔开
         */
        formatCardNo: function (num) {
            num = num.toString();
            return num.replace(Utils.RegexMap.bankCardNo, '$1 ').replace(/\s*$/, '');
        },
        /**
         * 转化金额为中文大写
         */
        formatMoneyData: function (n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
                return '数据非法';
            var unit = '千百拾亿千百拾万千百拾元角分', str = '';
            n += '00';
            var p = n.indexOf('.');
            if (p >= 0)
                n = n.substring(0, p) + n.substr(p + 1, 2);
            unit = unit.substr(unit.length - n.length);
            for (var i = 0; i < n.length; i++)
                str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元');
        },
        /**
         * base64编码
         * @param input 需base64解码字符
         * @returns {*} base64解码后的字符
         */
        base64encode:function(str){
            var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out, i, len;
            var c1, c2, c3;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += base64encodechars.charAt(c1 >> 2);
                    out += base64encodechars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += base64encodechars.charAt(c1 >> 2);
                    out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                    out += base64encodechars.charAt((c2 & 0xf) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64encodechars.charAt(c1 >> 2);
                out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
                out += base64encodechars.charAt(c3 & 0x3f);
            }
            return out;
        },
        /**
         * base64解码
         * @param str 需base64解码字符
         * @returns {*} base64解码后的字符
         */
        base64decode: function (str) {
            var base64decodechars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
            var c1, c2, c3, c4;
            var i, len, out;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {

                do {
                    c1 = base64decodechars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1)
                    break;

                do {
                    c2 = base64decodechars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1)
                    break;
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                        return out;
                    c3 = base64decodechars[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1)
                    break;
                out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61)
                        return out;
                    c4 = base64decodechars[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1)
                    break;
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out;
        },
        /**
         * 解码成utf-8
         */
        utf8Decode: function (utftext) {
            var string = '';
            var i = 0;
            var c, c2, c3;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        },
        /**
         * 数组转对象
         * @param array {'090':'n','092':'N'}或[{'k':'n','v':'090'},{'k':'092','v':'N'}]或[2016,2015,2014]
         * @returns {{}} {'090':'n','092':'N'}或{'090':'n','092':'N'}或{2016: 2016, 2015: 2015, 2014: 2014}
         */
        arrayOfObject: function (array,type) {
            var object = {};
            if(!_.isArray(array)){
                return array;
            }
            _.each(array, function (item,i) {
                // 不是对象
                if(!_.isObject(item)){
                    // type为true时，翻转选项框显示顺序。
                    // 小于10，在前加0。日期控件需要
                    object[type?10000-i:item] = item<10 && item >=1?'0'+item:item;
                }else{
                    if (!isNaN(item[_.allKeys(item)[0]])) {
                        object[item[_.allKeys(item)[0]]] = item[_.allKeys(item)[1]];
                    } else {
                        object[item[_.allKeys(item)[1]]] = item[_.allKeys(item)[0]];
                    }
                }
            });
            return object;
        },
        /**
         * map根据key找value
         * @param map
         * @param key
         * @returns value
         */
        mapOfValue: function (map, key) {
            return map[key];
        },
        /**
         * 根据年和月份获取相应的天数
         * @param year
         * @param month
         * @returns {string}
         */
        monthToDate: function (year, month) {
            return new Date(year, parseInt(month), 0).getDate();
        },
        /**
        *金额格式化
        */
        formatMoney: function(s, n) {
            if (!s) return s
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            var t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },
        /**
         *为界面金额添加分隔逗号
         */
        regMoneyAndDou: function(money) {
            if (money == '0') {
                return '0';
            }
            money = money.toString();
            var source = money.replace(/,/g, '').split('.');
            source[0] = source[0].replace(/(\d)(?=(\d{3})+$)/ig, '$1,');
            if (source[1]) {
                money = source[0] + "." + source[1];
            } else {
                money = source[0];
            }
            return money;
        },
        /**
         * 费率小数换算
         * 如：后台返回费率均是%之前的返回数据，即：如果费率为0.78%，后台实际返回0.0078.前端要做%处理。
         * 0.07--->0.0070--->00.70--->0.70
         * 0.0078--->0.0070--->00.70--->0.70
         * 0.00792--->0.0079--->00.79--->0.79
         * 0.1278--->0.1270--->12.70--->12.70
         */
        toChangeXS: function(num) {
            var temp = num.toString();
            if (temp.length <= 5) {
                var cha = 6 - temp.length;
                for (var i = 0; i < cha; i++) {
                    temp = temp + "0";
                }
            } else if (temp.length <= 6) {
                temp = temp.substring(0, 5) + "0";
            } else {
                temp = temp.substring(0, 6);
            }
            var index = temp.indexOf(".");
            var start = temp.substring(2, 4);
            var end = temp.substring(4, 6);
            if (start.indexOf(0) == "0") {
                start = start.substring(1);
            }
            return start + "." + end;
        },
        /**
         * 小数加法运算，并保证小数点保留两位小数
         */
        accAdd: function(arg1, arg2) {
            var r1, r2, m;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            var value = (arg1 * m + arg2 * m) / m;
            if (value.toString().indexOf(".") == -1) {
                value = value + ".00";
            } else {
                var afterDoitLen = value.toString().substring(value.toString().indexOf("."), value.toString().length).length;
                if (afterDoitLen < 3) {
                    var cha = 3 - afterDoitLen;
                    for (var i = 0; i < cha; i++) {
                        value = value + "0";
                    }
                }
            }
            return value;
        }
    };
    return  Utils;
});
