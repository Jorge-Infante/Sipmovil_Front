import CallingExtensions from "@hubspot/calling-extensions-sdk";

const options = {
  // Whether to log various inbound/outbound messages to console
  debugMode: true | false,
  // eventHandlers handle inbound messages
  eventHandlers: {
    onReady: () => {
      /* HubSpot is ready to receive messages. */
    },
    onDialNumber: event => {
        console.log(event);
      /* Dial a number */
    },
    onEngagementCreated: event => {
        console.log(event);
      /* HubSpot has created an engagement for this call. */
    },
    onVisibilityChanged: event => {
        console.log(event);
      /* Call widget's visibility is changed. */
    }
  }
};

export const extensions = new CallingExtensions(options);