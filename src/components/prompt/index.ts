import prompt from './base';
import { App } from 'vue';
const install = (app:App,options={}) => {
    app.config.globalProperties.$Message = prompt;
}

export default {
    install
}
