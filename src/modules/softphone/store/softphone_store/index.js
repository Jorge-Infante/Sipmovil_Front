import state from "./state";
import * as actions from "./actions";
import * as mutations from "./mutations";
import * as getters from "./getters";

const softphone_module = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state
}

export default softphone_module 