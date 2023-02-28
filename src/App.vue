<template>
  <Phone />
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState } from "vuex";
// import Phone from "./modules/softphone/components/Phone.vue";
export default {
  name: "App",

  components: {
    Phone:defineAsyncComponent(()=>import('./modules/softphone/components/Phone.vue'))
  },

  data: () => ({}),
  mounted() {
    console.log("#### user info: ", this.userInfo);
  },
  computed: {
    ...mapState("auth_store", ["userInfo"]),
    user() {
      if (this.userInfo.User!='') {
        console.log("### retornando false");
        return true;
      } else {
        console.log("### retornando true");
        return false;
      }
    },
  },
  updated() {
    console.log("#### user info: ", this.userInfo);
  },
  watch: {
    userInfo(nuevo, viejo) {
      console.log("viejo", viejo, ":", "nuevo", nuevo);
    },
  },
};
</script>
