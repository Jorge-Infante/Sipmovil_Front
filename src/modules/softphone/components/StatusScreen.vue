<script>
import { mapState } from "vuex";

console.log("status screen mounted");
// &lt; remplazo de <
export default {
  data() {
    return {
      baseContainerStyle: {
        background: "#283447",
        flexDirection: "column",
        borderRadius: "5px",
        paddingTop: "10px",
        marginLeft: "12px",
        marginRight: "12px",
        paddingLeft: "0px",
        position: "fixed",
        zIndex: "10",
      },
      listPeersStyle: {
        background: "#283447!important",
        width: "inherit",
        overflowY: "overlay",
      },
      badgeStatusStyle: {
        padding: "5px",
        fontSize: "30px",
        background: "#28a745",
        color: "white",
        borderRadius: "5px",
      },
      connectionType: "",
    };
  },
  created() {
    var connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    this.connectionType = connection.effectiveType;
  },
  methods: {
    toggleCallStatistic() {
      console.log("togglecallstatistic");
      this.$store.commit("TOGGLE_STATISTIC");
    },
  },
  computed: {
    ...mapState('softphone_store',[
      "showCallStatistics",
      "inCallPeers",
      "isMobileDevice",
      "userInCall",
      "callQuality",
    ]),
    callStat() {
      let strcall = "";
      let strStyle =
        'style="padding:1px; padding-bottom:4px; font-size:27px; background:currentColor; color:white; border-radius:5px; border: 2px solid white"';
      if (this.callQuality < 0) {
        strStyle = strStyle.replace("", "#6c757d");
        strcall = `<span style="font-size:20px; color:white;"><i class="fas fa-signal-alt-slash" ${strStyle}></i> Sin datos (${this.connectionType})</span>`;
      } else if (this.callQuality >= 0 && this.callQuality < 10) {
        strStyle = strStyle.replace("currentColor", "#28a745");
        strcall = `<span style="font-size:20px; color:white;"><i class="fas fa-signal-alt-3" ${strStyle}></i> Buena (${this.connectionType})</span>`;
      } else if (this.callQuality >= 10 && this.callQuality < 20) {
        strStyle = strStyle.replace("currentColor", "#ffc107");
        strcall = `<span style="font-size:20px; color:white;"><i class="fas fa-signal-alt-2" ${strStyle}></i> Regular (${this.connectionType})</span>`;
      } else {
        strStyle = strStyle.replace("currentColor", "#dc3545");
        strcall = `<span style="font-size:20px; color:white;"><i class="fas fa-signal-alt-1" ${strStyle}></i> Mala (${this.connectionType})</span>`;
      }
      return strcall;
    },
  },
};
</script>
<template>
  <transition name="move-down">
    <v-row
      v-if="showCallStatistics && userInCall"
      :style="[
        baseContainerStyle,
        {
          minHeight: isMobileDevice ? '93%' : '300px',
          width: isMobileDevice ? '94%' : '226px',
        },
      ]"
    >
      <v-list
        two-line
        :style="[
          listPeersStyle,
          { maxHeight: isMobileDevice ? '90%' : '270px' },
        ]"
      >
        <v-list-subheader
          innerHTML="callStat"
          :style="{ height: 'fit-content', paddingLeft: '5px' }"
        ></v-list-subheader>

        <template v-for="(item, index) in inCallPeers" :key="item.extension">
          <v-divider
            v-if="index > 0"
            :key="index"
            :style="{ background: 'rgb(255,255,255,0.5)' }"
          ></v-divider>

          <v-list-item :style="{ paddingLeft: '5px' }">
            <v-avatar
              >v-list-item-content
              <v-img
                :src="item.avatar"
                :style="{
                  width: isMobileDevice ? '3vh' : '40px',
                  height: isMobileDevice ? '6vh' : '40px',
                }"
              ></v-img>
            </v-avatar>

            <v-list-item-title
              >{{ item.name }} &lt;{{ item.extension }}></v-list-item-title
            >
            <v-list-item-subtitle :style="{ fontSize: '12px' }">
              <span class="text--primary" v-if="index == 0"
                >Local Address : {{ item.localIp }}</span
              ><br v-if="index == 0" />
              <span class="text--primary"
                >Packet
                {{
                  item.statDirection == "outbound" ? "Sent" : "Received"
                }}</span
              >
              :
              {{
                item.statDirection == "outbound"
                  ? item.packetsSent
                  : item.packetsReceived
              }}
              <br />
              <span class="text--primary">Packets Rate</span> :
              {{ item.packetsRate }} p/s<br />
              <span class="text--primary"
                >Bytes
                {{
                  item.statDirection == "outbound" ? "Sent" : "Received"
                }}</span
              >
              :
              {{
                item.statDirection == "outbound"
                  ? item.bytesSent
                  : item.bytesReceived
              }}
              <br />
              <span class="text--primary">Byte Rate</span> :
              {{ item.byteRate }} bytes/s<br />
              <span class="text--primary" v-if="item.statDirection == 'inbound'"
                >Packet Loss</span
              ><span v-if="item.statDirection == 'inbound'">
                : {{ !!item.packetLoss ? item.packetLoss : 0 }} </span
              ><br v-if="item.statDirection == 'inbound'" />
              <span class="text--primary" v-if="item.statDirection == 'inbound'"
                >Jitter</span
              ><span v-if="item.statDirection == 'inbound'">
                : {{ item.jitter }} </span
              ><br v-if="item.statDirection == 'inbound'" />
              <span class="text--primary">AudioSSRC</span> : {{ item.ssrc }}
              <br />
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
    </v-row>
  </transition>
</template>
