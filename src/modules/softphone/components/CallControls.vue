<script>
import { mapState, mapActions } from "vuex";
import vueApp from "@/store";
console.log("CallControls mounted");
export default {
  data() {
    return {
      controlContainerStyle: {
        marginTop: "12px",
        marginLeft: "0px",
        marginRight: "-4px",
        marginBottom: "0px",
      },

      transferControlContainerStyle: {
        marginLeft: "0px",
        marginRight: "-4px",
        marginTop: "0px",
        marginBottom: "0px",
      },

      baseContainerStyle: {
        marginTop: "18px",
        background: "gray",
        borderRadius: "5px",
      },
      containerStyle: {
        paddingTop: "0px",
      },
      mobileContainerStyle: {
        height: "auto",
        minHeight: "11vh",
        paddingBottom: "20px",
      },
      buttonsStyle: {
        paddingBottom: "0px",
        paddingLeft: "0px",
        paddingTop: "5px",
      },
      inCallButtonStyle: {
        background: "#272727",
        cursor: "pointer",
        paddingTop: "5px",
        paddingBottom: "5px",
        paddingLeft: "10px",
        paddingRight: "10px",
      },
      // inCallContainerStyle: {
      //   marginTop: '12px',
      //   marginLeft: '0px',
      //   marginRight: '-4px',
      //   marginBottom: '0px',
      //   height: this.$store.state.isMobileDevice ? '6vh' : '',
      // },
      answerButton: {
        backgroundColor: "#28a745",
        outline: "none",
      },
      hangupButton: {
        backgroundColor: "#dc3545",
        outline: "none",
      },
      mobileButtonStyle: {
        width: "20vw",
        height: "20vw",
      },
      iconMobileStyle: {
        fontSize: "3.5vh",
        paddingLeft: "6px",
        paddingTop: "5px",
      },
    };
  },
  computed: {
    ...mapState("softphone_store", [
      "userInCall",
      "callInProgress",
      "callNumber",
      "warnTransfer",
      "callDirection",
      "showHangupButton",
      "showCallButton",
      "isMuted",
      "isHold",
      "userInConference",
      "invitationData",
      "isTransferInvited",
      "isMobileDevice",
      "disableCallAnswer",
      "disableCallHangUp",
    ]),
    keyboardActive() {
      console.log("keyboard active");
      return this.$store.state.keyboardActive ? "#007bff" : "#272727";
    },
  },
  methods: {
    ...mapActions("softphone_store", [
      "getLastNumber",
      "preTranslateNumber",
      "outgoingCall",
      "hangupCall",
      "showDialog",
      "warnTranferAction",
      "pressMute",
      "pressHold",
      "acceptCall"
    ]),
    toggleMute() {
      console.log("toogle mute");
      this.pressMute()
    },
    toggleHold() {
      console.log("toggle hold");
      this.pressHold()
    },
    toggleKeyboard() {
      console.log("toogle keyboard");
      const keyboardState = !this.$store.state.keyboardActive;
      this.$store.commit("SET_PHONE_STATE", {
        phoneVar: "keyboardActive",
        phoneState: keyboardState,
      });
    },
    doCall() {
      console.log("do call enter VUE boton answer");
      // disable answer button to prevent multiple actions
      if (this.callNumber != "") {
        vueApp.commit("softphone_store/SET_PHONE_STATE", {
          phoneVar: "disableCallAnswer",
          phoneState: true,
        });
      }

      if (vueApp.state.softphone_store.callDirection == "INCOMING") {
        this.acceptCall()
        // set vue state to indicate asterisk that it is the session that holds the call
        vueApp.commit("softphone_store/SET_PHONE_STATE", {
          phoneVar: "currentCallSession",
          phoneState: true,
        });
        if (this.isTransferInvited == true) {
          vueApp.commit("softphone_store/SET_PHONE_STATE", {
            phoneVar: "isTransferInvited",
            phoneState: false,
          });
          vueApp.commit("softphone_store/SET_PHONE_STATE", {
            phoneVar: "transferCallId",
            phoneState: "",
          });
          vueApp.commit("softphone_store/SET_PHONE_STATE", {
            phoneVar: "transferType",
            phoneState: "",
          });
        }
      } else {
        if (this.callNumber == "") {
          console.log("entro callNumber componnete");
          this.getLastNumber()
        } else {
          this.preTranslateNumber()
          this.outgoingCall()
        }
      }
    },
    hangup() {
      // disable hangup button to prevent multiple actions
      vueApp.commit("softphone_store/SET_PHONE_STATE", {
        phoneVar: "disableCallHangUp",
        phoneState: true,
      });

      // send event to notify invitor that agent reject the invitation
      // if (this.invitationData) {
      //   this.$store.dispatch('rejectConferenceInvitation')
      // }
      // send event to notify invitor that agent reject the invitation to tranfer
      // if (this.isTransferInvited == true) {
      //   this.$store.dispatch('rejecttranferInvitation')
      // }
      this.hangupCall()
    },
    showDialog(type) {
      if (
        (type == "blind" || type == "warn") &&
        this.userInConference == true
      ) {
        // alertError(
        //   "No se pueden realizar transferencias mientras este en conferencia."
        // );
        return;
      }
      this.showDialog(type)
    },
    warnTranferAction(phase) {
      this.warnTranferAction(phase)
    },
  },
};
</script>
<template>
  <v-container
    :style="[
      baseContainerStyle,
      isMobileDevice ? mobileContainerStyle : containerStyle,
    ]"
  >
    <v-row color="gray">
      <v-col
        cols="4"
        v-if="
          (showHangupButton && !showCallButton) ||
          (!showHangupButton && showCallButton)
        "
      ></v-col>
      <v-col cols="4" :style="buttonsStyle" v-if="showCallButton">
        <v-btn
          :disabled="disableCallAnswer"
          class="mx-2"
          fab
          :style="[answerButton, isMobileDevice ? mobileButtonStyle : {}]"
          @click="doCall"
        >
          <v-icon dark> mdi-phone </v-icon>
        </v-btn>
      </v-col>
      <v-spacer v-if="showHangupButton && showCallButton"></v-spacer>
      <v-col cols="4" :style="buttonsStyle" v-if="showHangupButton">
        <v-btn
          :disabled="disableCallHangUp"
          class="mx-2"
          fab
          :style="[hangupButton, isMobileDevice ? mobileButtonStyle : {}]"
          @click="hangup"
        >
          <v-icon dark :style="{ transform: 'rotate(135deg)' }">
            mdi-phone
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="userInCall" :style="controlContainerStyle">
      <v-col
        cols="2"
        :style="inCallButtonStyle"
        v-ripple
        @click="showDialog('blind')"
        title="Transferencia Ciega"
      >
        <span
          ><v-icon :style="isMobileDevice ? iconMobileStyle : {}" dark small
            >mdi-shuffle</v-icon
          ></span
        >
      </v-col>
      <v-col
        cols="2"
        :style="[
          inCallButtonStyle,
          { background: isMuted ? '#007bff' : '#272727' },
        ]"
        v-ripple
        @click="toggleMute"
        :title="isMuted ? 'Activar' : 'Silenciar'"
      >
        <span
          ><v-icon :style="isMobileDevice ? iconMobileStyle : {}" dark small
            >mdi-microphone</v-icon
          ></span
        >
      </v-col>
      <v-col
        cols="2"
        :style="[inCallButtonStyle, { background: keyboardActive }]"
        v-ripple
        @click="toggleKeyboard"
        title="Teclado"
      >
        <span
          ><v-icon :style="isMobileDevice ? iconMobileStyle : {}" dark small
            >mdi-dialpad</v-icon
          ></span
        >
      </v-col>
      <v-col
        cols="2"
        :style="[
          inCallButtonStyle,
          { background: isHold ? '#007bff' : '#272727' },
        ]"
        v-ripple
        @click="toggleHold"
        :title="isHold ? 'Reanudar' : 'Pausar'"
      >
        <span
          ><v-icon :style="isMobileDevice ? iconMobileStyle : {}" dark small
            >mdi-pause</v-icon
          ></span
        >
      </v-col>
      <v-col
        cols="2"
        :style="inCallButtonStyle"
        v-ripple
        @click="showDialog('warn')"
        title="Transferencia Atendida"
      >
        <span
          ><v-icon :style="isMobileDevice ? iconMobileStyle : {}" dark small
            >mdi-cached</v-icon
          ></span
        >
      </v-col>
      <v-col
        cols="2"
        :style="inCallButtonStyle"
        v-ripple
        @click="showDialog('conference')"
        title="Conferencia"
      >
        <span
          ><v-icon :style="isMobileDevice ? iconMobileStyle : {}" dark small
            >mdi-plus-one</v-icon
          ></span
        >
      </v-col>
    </v-row>
    <v-row v-if="warnTransfer" :style="transferControlContainerStyle">
      <v-col
        :style="inCallButtonStyle"
        v-ripple
        @click="warnTranferAction('resume')"
      >
        <span
          :style="{
            color: 'white',
            fontSize: isMobileDevice ? '2.5vh' : '12px',
          }"
          ><v-icon dark :style="isMobileDevice ? iconMobileStyle : {}" small
            >mdi-undo</v-icon
          >
          Regresar</span
        >
      </v-col>
      <v-col
        :style="inCallButtonStyle"
        v-ripple
        @click="warnTranferAction('transfer')"
      >
        <span
          :style="{
            color: 'white',
            fontSize: isMobileDevice ? '2.5vh' : '12px',
          }"
          ><v-icon dark :style="isMobileDevice ? iconMobileStyle : {}" small
            >mdi-redo</v-icon
          >
          Transferir</span
        >
      </v-col>
    </v-row>
  </v-container>
</template>
