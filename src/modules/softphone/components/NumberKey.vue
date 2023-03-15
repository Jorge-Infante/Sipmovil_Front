<script>
import { mapState, mapActions } from "vuex";

console.log("Number key mounted");

export default {
  props: {
    keyData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mobileButtonStyle: {
        height: "100%",
        width: "98%",
        fontSize: "3.5vh",
      },
    };
  },
  methods: {
    ...mapActions("softphone_store", ["pressDigit"]),
    appendDigit() {
      console.log("appendDigit", this.digit);
      this.pressDigit(this.digit);
    },
  },
  computed: {
    digit() {
      if (this.keyData) {
        return String(this.keyData.digit);
      }
      //Sino no retornará nada
      return null;
    },
    smallSize() {
      return this.$store.state.phoneSmall;
    },
    ...mapState("softphone_store", ["isMobileDevice"]),
  },
  directives: {
    longpressed: {
      bind: function (el, binding, vNode) {
        // Make sure expression provided is a function
        if (typeof binding.value !== "function") {
          // Fetch name of component
          const compName = vNode.context.name;
          // pass warning to console
          let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`;
          if (compName) {
            warn += `Found in component '${compName}' `;
          }

          console.warn(warn);
        }

        // Define variable
        let pressTimer = null;
        let initEvent = null;
        let finishEvent = null;

        // Define funtion handlers
        // Create timeout ( run function after 1s )
        const start = (e) => {
          finishEvent = null;
          initEvent = new Date();
          if (e.type === "click" && e.button !== 0) {
            console.log("entro evento click");
            return;
          }

          if (pressTimer === null) {
            pressTimer = setTimeout(() => {
              // Run function
              handler();
            }, 1000);
          }
        };

        // Cancel Timeout
        const cancel = (e) => {
          console.log(e);
          // Check if timer has a value or not
          finishEvent = new Date();
          if (pressTimer !== null) {
            let diffTime = Math.abs(finishEvent - initEvent);
            if (diffTime < 1000) {
              //cuadrar action
              this.pressDigit(binding.value.number);
            }
            clearTimeout(pressTimer);
            pressTimer = null;
          }
        };
        // Run Function
        const handler = (e) => {
          console.log(e);
          // binding.value(e)
          //Cuadrar action
          this.pressDigit(binding.value.symbol);
        };

        // Add Event listeners
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);
        // Cancel timeouts if this events happen
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
      },
    },
  },
};
</script>
<template>
  <v-col cols="4" :style="{ padding: '0px', paddingTop: '2px' }">
    <v-btn
      elevation="3"
      :small="smallSize"
      :medium="!smallSize"
      @click="appendDigit(digit)"
      v-if="digit != '0'"
      :style="isMobileDevice ? mobileButtonStyle : {}"
      >{{ digit }}</v-btn
    >
    <v-btn
      v-else
      elevation="3"
      :small="smallSize"
      :medium="!smallSize"
      @click="appendDigit(digit)"
      v-longpressed="{ symbol: '+', number: '0' }"
      :style="isMobileDevice ? mobileButtonStyle : {}"
      >{{ digit }}</v-btn
    >
  </v-col>
</template>