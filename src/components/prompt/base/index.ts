import Prompt from './prompt.vue';
import { createApp,h } from 'vue';

const newInstance = (properties:Record<string,any>) => {
    const _props = properties || {};
    console.log(Prompt)
    const Instance = createApp({
        ...Prompt,
        props:_props
    })
    const parent = document.createElement('div');
    const Instance_ = Instance.mount(parent);
    document.body.appendChild(Instance_.$el);
    const notification:any = Instance_;

    return {
        noitce(noticeProps:any) {
            notification.add(noticeProps)
        },
        remove(name:string) {
            notification.remove(name);
        },
        component: notification,
        destory(element:string) {
            notification.closeAll();
            setTimeout(() => {
                document.body.removeChild(document.getElementsByClassName(element)[0])
            }, 500)
        }
    }

}

const defaults = {
    top: 84,
    duration: 3 * 1000
};

let messageInstance:any;
let name = 1;
const prefixKey = 'wb_message_key_';
const showType = 'single'; //single/ multiple 展示方式 单个/多个


function getMessageInstance() {
    messageInstance = messageInstance || newInstance({
        styles: {
            top: `${defaults.top}px`
        }
    });
    return messageInstance;
}

type TypeNames = 'info' | 'warning' | 'error' | 'success';
function notice(type:TypeNames, { content = '', styles = {}, duration = defaults.duration, onClose = function () { } }) {
    const instance = getMessageInstance();

    instance.noitce({
        name: `${prefixKey}${name++}`,
        type,
        content,
        duration: duration,
        onClose,
        styles,
        showType
    })
}
type options = string | Record<string,any>;
const prompt = {
    name: 'Prompt',
    info(options:options, ...args:any[]) {
        return this.message('info', options, ...args);
    },
    error(options:options, ...args:any[]) {
        return this.message('error', options, ...args);
    },
    warning(options:options, ...args:any[]) {
        return this.message('warning', options, ...args);
    },
    success(options:options, ...args:any[]) {
        return this.message('success', options, ...args);
    },
    message(type:TypeNames, options:options, ...args:any[]) {
        if (typeof options === 'string') {
            options = {
                content: options,
                duration: args[0]
            };
        }
        return notice(type, options);
    }
}

export default prompt;