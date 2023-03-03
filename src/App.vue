<template>

  <Phone />
</template>

<script>
import vueApp from "@/store";
import { defineAsyncComponent } from 'vue';
import { mapState } from 'vuex';
import {ctxSipConfig,ctxSipConfigFunc} from '@/modules/softphone/ctxsip/ctxSip_config'
export default {
  name: "App",

  components: {
    Phone:defineAsyncComponent(()=>import('./modules/softphone/components/Phone.vue'))
  },

  data: () => ({}),
  mounted() {
    console.log('USERINFO VALUE: ',this.userInfo);
  },
  computed:{
    ...mapState('auth_store',['userInfo'])
  },
  watch: {
    userInfo (newUserInfo, oldUserInfo) {
      console.log('Nuevo: ',newUserInfo, 'Viejo: ',oldUserInfo);
      let ctxsip=ctxSipConfig(newUserInfo)
      ctxSipConfigFunc(ctxsip,newUserInfo)
      console.log('CTXSIP CONFIG: ',ctxsip.config);
      vueApp.commit('softphone_store/CTXSIP_STATE',ctxsip)
    }
  }
};
</script>
