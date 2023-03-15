<script>
import { mapState } from "vuex";

console.log("Phone component mounted");
export default {
  data() {
    return {
      baseStyle: {
        cursor: "grab",
        zIndex: "150",
      },
      phoneStyle: {
        position: "fixed",
        width: "250px",
      },
      mobilePhoneStyle: {
        width: "100%",
        position: "absolute",
        top: "0px",
        left: "0px",
        height: "100%",
      },
    };
  },
  computed: {
    ...mapState("softphone_store", [
      "keyboardActive",
      "userInConference",
      "showConferenceOptions",
      "isMobileDevice",
    ]),
  },
  components: {
    PhoneStatusBar,
    StatusScreen,
    CallScreen,
    ConferenceManager,
    CallControls,
    KeyBoard,
    ContactBrowser,
  },
  mounted() {
    console.log(extensions.onDialNumber);
  },
};
import PhoneStatusBar from "./PhoneStatusBar.vue";
import StatusScreen from "./StatusScreen.vue";
import CallScreen from "./CallScreen.vue";
import ConferenceManager from "./ConferenceManager.vue";
import CallControls from "./CallControls.vue";
import KeyBoard from "./KeyBoard.vue";
import ContactBrowser from "./ContactBrowser.vue";
import { extensions } from "../hubspot/CallingExtensions.js";
</script>

<template>
  <v-card
    elevation="2"
    width="300"
    dark
    :style="[baseStyle, isMobileDevice ? mobilePhoneStyle : phoneStyle]"
  >
    <PhoneStatusBar />
    <StatusScreen />
    <v-card-text :style="isMobileDevice ? { height: '90%' } : {}">
      <KeyBoard v-if="keyboardActive && !showConferenceOptions"></KeyBoard>
      <CallScreen
        v-else-if="!keyboardActive && !showConferenceOptions"
      ></CallScreen>
      <ConferenceManager v-else-if="showConferenceOptions"></ConferenceManager>
      <CallControls> </CallControls>
      <ContactBrowser> </ContactBrowser>
    </v-card-text>
  </v-card>
</template>