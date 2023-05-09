<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import vueApp from "@/store";

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
    ...mapState("softphone_store", [
      "browserTitle",
      "browserContacts",
      "browserAction",
      "userInConference",
      "showBrowser",
    ]),
    show_browser: {
      get() {
        return this.showBrowser;
      },
      set(newValue) {
        return vueApp.commit("softphone_store/SET_PHONE_STATE", {
          phoneVar: "showBrowser",
          phoneState: newValue,
        });
      },
    },
  },
  methods: {
    ...mapActions("softphone_store", [
      "setContacts",
      "closeDialog",
      "callConferenceMember",
      "addConferenceMember",
      "initTransfer",
    ]),
    filterContacts() {
      let query = this.query.toLowerCase();
      console.log("Valor del query: ", query);
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
      this.filteredContacts.map(function (dato) {
        let media = dato.avatar;
        console.log("---> MEDIA VALUE --->: ", media);
        if (dato.avatar.includes("https")) {
          return
        }else{
          dato.avatar = `https://test.sipmovil.com${media}`;
        }
        return dato;
      });
      console.log("Los contactos filtrados: ", this.filteredContacts);
    },
    chooseContact(number) {
      if (number == "") {
        return;
      }

      if (this.browserAction == "conference") {
        this.callConferenceMember(number);
        let targetAccount = number;
        if (number.length == 3) {
          targetAccount = this.browserContacts.filter(
            (c) => c.type == "ext" && c.extension == number
          )[0].unique_id;
        }
        vueApp.commit("softphone_store/SET_PHONE_STATE", {
          phoneVar: "targetConferenceEndpoint",
          phoneState: targetAccount,
        });
      }

      if (this.userInConference == true) {
        this.addConferenceMember(number);
      } else {
        this.initTransfer({
          transferType: this.browserAction,
          transferTarget: number,
        });
      }

      this.closeDialog();
      this.filteredContacts = [];
      this.query = "";
    },
  },
  watch: {
    showBrowser(newUserInfo, oldUserInfo) {
      this.setContacts();
      console.log("---- > Nuevo: ", newUserInfo, "---- >Viejo: ", oldUserInfo);
    },
  },
};
</script>
<template>
  <div class="text-center">
    <v-dialog v-model="show_browser" width="300">
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

              <v-list-item-title>{{ contact.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                contact.extension
              }}</v-list-item-subtitle>
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
