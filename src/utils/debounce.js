/**
 * 防抖函数(可用于防止重复提交), 就是指触发事件后在 n 秒内函数只能执行一次
 * 节流函数, 就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率
 *
 * @param func 执行函数
 * @param time 执行时间间隔
 * @param isDebounce 是否防抖或者节流
 * @param ctx event
 */
const debounce = (func, time, isDebounce, ctx) => {
    var timer, lastCall, rtn;
    // 防抖函数
    if (isDebounce) {
        rtn = (...params) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(ctx, params);
            }, time);
        };
    // 节流函数
    } else {
        rtn = (...params) => {
            const now = new Date().getTime();
            if (now - lastCall < time && lastCall) return;
            lastCall = now;
            func.apply(ctx, params);
        };
    }
    return rtn;
};

export default {
    name: 'Debounce',
    abstract: true,
    props: {
        time: {
            type: Number,
            default: 800,
        },
        events: {
            type: String,
            default: 'click',
        },
        isDebounce: {
            type: Boolean,
            default: true,
        },
    },
    created() {
        this.eventKeys = this.events.split(',');
        this.originMap = {};
        this.debouncedMap = {};
    },
    render() {
        const vnode = this.$slots.default[0];
        this.eventKeys.forEach(key => {
            const target = vnode.data.on[key];
            if (target === this.originMap[key] && this.debouncedMap[key]) {
                vnode.data.on[key] = this.debouncedMap[key];
            } else if (target) {
                this.originMap[key] = target;
                this.debouncedMap[key] = debounce(
                    target,
                    this.time,
                    this.isDebounce,
                    vnode
                );
                vnode.data.on[key] = this.debouncedMap[key];
            }
        });
        return vnode;
    },
};