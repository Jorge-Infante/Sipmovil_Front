<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";

console.log("contact browser mounted");
export default {
  data() {
    return {
      filteredContacts: [],
      query: "",
      avatarStyle: {
        // margin: '0px',
        marginRigth: "7px!important",
      },
      listItemContainerStyle: {
        padding: "0px",
      },
    };
  },
  computed: {
    ...mapState('softphone_store',[
      "browserTitle",
      "browserContacts",
      "browserAction",
      "userInConference",
    ]),
    showBrowser: {
      get() {
        return this.$store.state.showBrowser;
      },
      set(newValue) {
        return this.$store.commit("SET_PHONE_STATE", {
          phoneVar: "showBrowser",
          phoneState: newValue,
        });
      },
    },
  },
  methods: {
    ...mapActions('softphone_store',["setContacts", "closeDialog"]),
    filterContacts() {
      let query = this.query.toLowerCase();
      if (query == "") {
        this.filteredContacts = [];
        return;
      }
      this.filteredContacts = this.browserContacts
        .filter((contact) => {
          return (
            contact.name.toLowerCase().includes(this.query) ||
            contact.extension.toLowerCase().includes(this.query)
          );
        })
        .slice(0, 5);
    },
    chooseContact(number) {
      if (number == "") {
        return;
      }

      if (this.browserAction == "conference") {
        // this.$store.commit('SET_PHONE_STATE', { phoneVar: 'extensionAdded', phoneState: number })
        this.$store.dispatch("callConferenceMember", number);
        let targetAccount = number;
        if (number.length == 3) {
          targetAccount = this.browserContacts.filter(
            (c) => c.type == "ext" && c.extension == number
          )[0].unique_id;
        }
        this.$store.commit("SET_PHONE_STATE", {
          phoneVar: "targetConferenceEndpoint",
          phoneState: targetAccount,
        });
      }

      if (this.userInConference == true) {
        this.$store.dispatch("addConferenceMember", number);
      } else {
        // if (this.browserAction == 'conference') {
        //   this.$store.dispatch('callConferenceMember', number)
        // }
        this.$store.dispatch("initTransfer", {
          transferType: this.browserAction,
          transferTarget: number,
        });
      }

      this.closeDialog();
      this.filteredContacts = [];
      this.query = "";
    },
  },
  created() {
    this.setContacts();
  },
};
</script>
<template>
  <div class="text-center">
    <v-dialog v-model="showBrowser" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ browserTitle }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-text-field
            v-model="query"
            type="text"
            @input="filterContacts"
            @keyup.enter="chooseContact(query)"
          />

          <v-list>
            <v-list-item
              v-for="contact in filteredContacts"
              :key="contact.extension"
              @click="chooseContact(contact.extension)"
              :style="listItemContainerStyle"
            >
              <v-avatar>
                <v-img :src="contact.avatar" :style="avatarStyle"></v-img>
              </v-avatar>

              <v-list-item-title innerHTML="contact.name"></v-list-item-title>
              <v-list-item-subtitle
              innerHTML="contact.extension"
              ></v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="closeDialog"> Cancelar </v-btn>
          <v-btn color="success" text @click="chooseContact(query)">
            Elegir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
