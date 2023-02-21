import { createStore } from "vuex";
import softphone_store from '@/modules/softphone/store/softphone_store'

const store = createStore({
    modules:{
        softphone_store
    }
})

export default store