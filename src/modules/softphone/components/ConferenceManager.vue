<script>
import {mapState}  from "vuex"
import {mapActions}  from "vuex"
import { mapGetters } from 'vuex'

console.log('conference manager mounted');
export default {
  data() {
    return {
      containerStyle: {
        background: "#333333",
        flexDirection: "column",
        minHeight: "211px",
        borderRadius: "5px",
        paddingTop: "10px",
        marginLeft: "0px",
        marginRight: "0px",
        paddingLeft: "5px",
      },

      recordButtonStyle: {
        right: "0px",
        position: "absolute",
        marginRight: "20px",
      },
      listContactStyle: {
        overflowY: "overlay",
        borderRadius: "5px",
        maxWidth: "-webkit-fill-available",
        marginRight: "5px",
        marginBotton: "5px",
      },
    };
  },
  filters: {
    formatTime(value) {
      let date = new Date(value);
      let hours =
        String(date.getHours()).length == 1
          ? "0" + String(date.getHours())
          : String(date.getHours());
      let minutes =
        String(date.getMinutes()).length == 1
          ? "0" + String(date.getMinutes())
          : String(date.getMinutes());
      let seconds =
        String(date.getSeconds()).length == 1
          ? "0" + String(date.getSeconds())
          : String(date.getSeconds());
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  methods: {
    ...mapActions('softphone_store',["toggleConferenceRecord","removeConferenceMember"]),
    removeMember(member) {
      this.removeConferenceMember(member);
    },
    closeOptions() {
      //Ajustar las actions
      // vueApp.$store.commit("SET_PHONE_STATE", {
      //   phoneVar: "showConferenceOptions",
      //   phoneState: false,
      // });
    },
  },
  computed: {
    ...mapState('softphone_store',[
      "userConferenceRole",
      "snackbarMessage",
      "conferenceMembers",
      "recordConference",
      "pjsipAccount",
      "conferenceRecordDuration",
      "isMobileDevice",
    ]),
    ...mapGetters('softphone_store',["recordDurationFormat"]),
  },
};
</script>
<template>
  <v-row :style="[containerStyle, { height: isMobileDevice ? '75%' : '' }]">
    <v-col
      :style="{
        padding: '0px',
        maxHeight: '35px',
        marginBotton: '35px',
        marginTop: isMobileDevice ? '' : '-10px',
        marginBottom: isMobileDevice ? '10px' : '',
      }"
    >
      <v-btn
        icon
        title="Cerrar panel conferencia"
        @click="closeOptions"
      >
        <v-icon
          color="grey lighten-1"
          :style="{
            transform: 'rotate(180deg)',
            fontSize: isMobileDevice ? '5.5vh' : '',
          }"
          >mdi-exit-to-app</v-icon
        >
      </v-btn>
      <v-btn
        icon
        v-if="userConferenceRole == 'owner'"
        :style="[
          recordButtonStyle,
          {
            color: recordConference ? 'red' : 'white',
            fontSize: isMobileDevice ? '5.5vh' : '',
          },
        ]"
        :title="recordConference ? 'Pausar grabación' : 'Grabar conferencia'"
        @click="toggleConferenceRecord"
      >
        <v-icon
          color="grey lighten-1"
          :style="{ fontSize: isMobileDevice ? '5.5vh' : '' }"
          >mdi-radio</v-icon
        >
        <span
          v-if="conferenceRecordDuration != 0"
          :style="{ fontWeight: '600' }"
          >{{ recordDurationFormat }}</span
        >
      </v-btn>
    </v-col>
    <v-list
      :style="[
        listContactStyle,
        {
          minHeight: isMobileDevice ? '56vh' : '18.5vh',
          maxHeight: isMobileDevice ? '56vh' : '18.5vh',
        },
      ]"
    >
      <v-list-item
        v-for="(user, i) in conferenceMembers"
        :key="i"
        :style="{ paddingLeft: '3px', paddingRight: '5px' }"
      >
        <v-list-item-avatar>
          <v-img
            :src="user.avatar"
            :style="isMobileDevice ? '7vh' : '30px'"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content :style="{ marginLeft: '3px' }">
          <v-list-item-title
            :style="{ fontSize: isMobileDevice ? '3vh' : '14px' }"
            >{{ user.name }} - {{ user.extension }}</v-list-item-title
          >
          <v-list-item-subtitle
            :style="{ fontSize: isMobileDevice ? '2.5vh' : '12px' }"
          >
            <v-icon x-small>mdi-timer</v-icon> {{ user.joined || formatTime }}
            <v-icon v-if="user.invited" x-small :title="user.invited"
              >mdi-contact-phone</v-icon
            >
            {{ user.invited }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action
          v-if="userConferenceRole == 'owner' && pjsipAccount != user.endpoint"
        >
          <v-btn
            icon
            title="Retirar miembro"
            @click="removeMember(user.extension)"
          >
            <v-icon
              color="grey lighten-1"
              small
              :style="{ fontSize: isMobileDevice ? '4.5vh' : '' }"
              >mdi-delete</v-icon
            >
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-row>
</template>
