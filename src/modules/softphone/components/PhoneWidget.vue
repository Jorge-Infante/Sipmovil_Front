<script>
import {mapState}  from "vuex"

console.log('phone widget mounted');
export default {
  data() {
    return {
      number: this.$store.state.callNumber,
      widgetStyle: {
        cursor: "pointer",
        position: "fixed",
        bottom: "0px",
        right: "0px",
        marginRight: "10px",
        padding: "3px",
        background: "#007bff",
        color: "white",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderTopRightRadius: "7px",
        borderTopLeftRadius: "7px",
        width: "fit-content",
        zIndex: "1500",
      },
      mobileWidgetStyle: {
        position: "fixed",
        display: "block",
        bottom: "12vh",
        right: "0px",
        color: "white",
        zIndex: "1500",
      },
      badgeStyle: {
        width: "10px",
        height: "10px",
        display: "inline-block",
        borderRadius: "5px",
      },
    };
  },
  methods: {
    showPhone() {
      this.$store.commit("TOGGLE_PHONE");
    },
  },
  computed: {
    ...mapState('softphone_store',["userInCall", "isMobileDevice", "userInConference"]),
    callDuration() {
      return this.$store.getters.callDurationFormat;
    },
    badgeColor() {
      const phoneStatus = this.$store.state.phoneStatus;
      let badgeStyle = null;
      switch (phoneStatus) {
        case "UNREGISTERED":
          badgeStyle = { background: "lightgray" };
          break;
        case "REGISTERED":
          badgeStyle = { background: "#28a745" };
          break;
        case "BUSY":
          badgeStyle = { background: "#ffc107" };
          break;
        case "IN_CALL":
          badgeStyle = { background: "#dc3545" };
          break;
        default:
          badgeStyle = { background: "lightgray" };
          break;
      }
      return badgeStyle;
    },
  },
};
</script>
<!-- <template>
  <div>
    <div v-if="!isMobileDevice" :style="widgetStyle" @click="showPhone">
      <span :style="[badgeStyle, badgeColor]"></span>
      <b>Teléfono</b>
      <b v-if="userInCall">{{ callDuration }}</b>
    </div>
    <v-btn
      v-else
      class="mx-2"
      fab
      :style="[
        mobileWidgetStyle,
        { background: userInCall || userInConference ? '#ffc107' : '#007bff' },
      ]"
      @click="showPhone"
    >
      <v-icon dark> mdi-phone </v-icon>
    </v-btn>
  </div>
</template> -->


