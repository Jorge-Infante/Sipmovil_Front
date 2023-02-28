import { createStore } from "vuex";
import softphone_store from '@/modules/softphone/store/softphone_store';
import auth_store from '@/modules/auth/store/auth_store';
console.log('sssssssssstoooooreeeeeee');

const store = createStore({
    modules:{
        softphone_store,
        auth_store
    }
})

export default store