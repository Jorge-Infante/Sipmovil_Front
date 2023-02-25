import CallingExtensions from "@hubspot/calling-extensions-sdk";
import vueApp from "@/store";

const options = {
  // Whether to log various inbound/outbound messages to console
  debugMode: true | false,
  // eventHandlers handle inbound messages
  eventHandlers: {
    onReady: () => {
      /* HubSpot is ready to receive messages. */
    },
    onDialNumber: (event) => {
      vueApp.commit("softphone_store/HUBSPOT_DIAL_NUMBER", {phoneNumber:event.phoneNumber, ownerId:event.ownerId});
      vueApp.dispatch("softphone_store/authUser");
      console.log("onDialNumber: ", event); 
      /* Dial a number */
    },
    onEngagementCreated: (event) => {
      console.log("onEngagementCreated: ", event);
      /* HubSpot has created an engagement for this call. */
    },
    onVisibilityChanged: (event) => {
      console.log("onVisibilityChanged: ", event);
      /* Call widget's visibility is changed. */
    },
    userLoggedIn: (event) => {
      console.log("userLoggedIn", event);
      /* Call widget's visibility is changed. */
    },
  },
};

export const extensions = new CallingExtensions(options);
