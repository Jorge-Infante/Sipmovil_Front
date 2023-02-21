<template>
  <v-app>
    <Phone />
  </v-app>
</template>

<script>
import Phone from './modules/softphone/components/Phone.vue';


export default {
  name: 'App',

  components: {
    Phone
  },

  data: () => ({
  
  }),
}
</script>
