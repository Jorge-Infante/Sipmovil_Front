<script>
import {mapState}  from "vuex"

console.log('phone status bar mounted');
export default{
  data () {
    return {
    }
  },
  methods: {
    closePhone () {
      console.log('Esperando store');
      this.$store.commit('TOGGLE_PHONE')
    },
    toggleCallStatistic () {
      console.log('Esperando store');
      this.$store.commit('TOGGLE_STATISTIC')
    }
  },
  computed: {
    //Esperando vuex
    ...mapState('softphone_store',[
      'isMobileDevice',
      'callQuality',
    ]),
    colorStatus() {
      let color = ''
      if (this.callQuality < 0){
        color = '#ffffff'
      }else if (this.callQuality >= 0 && this.callQuality < 10) {
        color = '#28a745'
      }else if (this.callQuality >= 10 && this.callQuality < 20) {
        color = '#ffc107'
      }else {
        color = '#dc3545'
      }
      return color
    }
  }
}
</script>
<template>
  <v-card-title :style="{ marginBottom: isMobileDevice ? '12px' : '8px', paddingTop: '0px', paddingBottom: '0px'}">
        <span :style="{cursor:'pointer'}" @click="toggleCallStatistic">
          <v-icon dark :style="{fontSize: isMobileDevice ? '3vh' : '1.4vh', color: colorStatus}">mdi-signal</v-icon>
          <span :style="{fontSize: isMobileDevice ? '3vh' : '1.4vh', marginLeft: '-3px', color: colorStatus}">
            SipMóvil
          </span>
        </span>        
        <v-spacer></v-spacer>
        <!-- <v-icon small dark @click="closePhone" :style="{fontSize: isMobileDevice ? '4vh' : ''}">mdi-minus</v-icon> -->
      </v-card-title>
</template>

