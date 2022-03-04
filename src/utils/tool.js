/**
 * 防抖函数(可用于防止重复提交)
 * 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，
 * 如果设定时间到来之前，又触发了事件，就重新开始延时。也就是说当一个用户一直触发这个函数，
 * 且每次触发函数的间隔小于既定时间，那么防抖的情况下只会执行一次。
 *
 * @param fn 执行函数
 * @param delay 间隔时间
 */
function debounce (fn, delay) {
    let timeout = null;
    return function() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            this[fn](); // 兼容vue函数 
        }, delay);
    };
}


/**
 * 节流函数
 * 当持续触发事件时，保证在一定时间内只调用一次事件处理函数
 * 小于既定值，函数节流会每隔这个时间调用一次
 *
 * @param fn 执行函数
 * @param delay 间隔时间
 */
 function throttle(fn, delay){
    let lastCall = 0;
    let throttled = function() {
        const now = new Date().getTime();
        // remaining 不触发下一次函数的剩余时间
        if (now - lastCall < delay && lastCall) return;
            lastCall = now;
            this[fn].apply(this, arguments);
    }
    return throttled;
}


/**
 * 时间戳转换方法
 *
 * @param timestamp  时间戳
 * @param format 时间格式
 */
function formatDate (timestamp, format = 'YYYY-MM-dd HH:mm:ss') {
    let time = new Date(timestamp)
    // 获取年月日时分秒，使用es6 padStart补0
    let year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const date = (time.getDate()).toString().padStart(2, '0')
    const hours = (time.getHours()).toString().padStart(2, '0')
    const minute = (time.getMinutes()).toString().padStart(2, '0')
    const second = (time.getSeconds()).toString().padStart(2, '0')

    // 替换时间格式
    format = format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('dd', date)
    .replace('HH', hours)
    .replace('mm', minute)
    .replace('ss', second)

    return format
}


// 数组去重
function dedupe (array){
    return Array.from(new Set(array));
}

// 对象深克隆
function deepClone (o) {
    // 判断如果不是引用类型，直接返回数据即可
    if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || typeof o === 'undefined') {
        return o
    } else if (Array.isArray(o)) { // 如果是数组，则定义一个新数组，完成复制后返回
        // 注意，这里判断数组不能用typeof，因为typeof Array 返回的是object
        var _arr = []
        o.forEach(item => { _arr.push(item) })
        return _arr
    } else if (typeof o === 'object') {
        var _o = {}
        for (let key in o) {
            _o[key] = deepClone(o[key])
        }
        return _o
    }
}

export {
    debounce,
    throttle,
    formatDate,
    dedupe,
    deepClone
}