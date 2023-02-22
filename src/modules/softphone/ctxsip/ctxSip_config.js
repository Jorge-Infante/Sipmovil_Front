// import vueApp from "@/store";
import { user } from "@/api/softphone_api";
import  SIP from "libs/phone/sip.min.js"

export const test = () => {
  console.log(user);
  console.log('SIPPPPP:',SIP);
};

// var ctxSip;
// var pbx_contacts = [];
// ctxSip.phone = new SIP.UA(ctxSip.config);
// function connectAsteriskSocket() {
//   const asteriskNotificationSocket = new WebSocket('wss://{{NOTIFICATION_SERVER}}/ws/notifications/{{USER_ACCOUNT}}/');
//   asteriskNotificationSocket.binaryType = "arraybuffer";
//   asteriskNotificationSocket.onopen = (e) => {
//     console.log('Open ASTERISK Notification socket');
//     console.log(e);
//   }

//   asteriskNotificationSocket.onmessage = (e) => {
//     console.log('Asterisk Notification socket message', e.data);
//     let {message} = JSON.parse(e.data)
//     let data = message.data
//     let event = message.eventType

//     switch (event){
//       case 'CALL_ID':
//         ctxSip.currentSession.call_id = data.call_id;
//         ctxSip.currentSession.numbers_in_call = data.numbers_in_call;
//         vueApp.$store.dispatch('updateSecondUser', data.numbers_in_call)
//         vueApp.$store.dispatch('restartCallDuration')
//         if ('append_info' in data) {
//           // update call info with aditional details
//           vueApp.$store.dispatch('setCallEvents', data.append_info)
//         }
//         break;

//       case 'UPDATE_CALL_EVENTS':
//         vueApp.$store.dispatch('setCallEvents', data.call_events)
//         break;

//       case 'INVITE_TRANFER':
//         vueApp.$store.dispatch('setTranferParams', {
//           'callId': data.call_id,
//           'transferType': data.transfer_type
//         })
//         break

//       case 'WARN_TRANSFER_ATTENDED':
//         vueApp.$store.commit('ACTIVATE_TRANSFER')
//         break;

//       case 'UPDATE_SOFTPHONE':{
//         let labelData = {}
//         if (data.label_1 != 'no_update') {
//           labelData['status'] = data.label_1
//         }
//         if (data.label_2 != 'no_update') {
//           labelData['label'] = data.label_2
//         }
//         if (data.label_3 != 'no_update') {
//           labelData['info'] = data.label_3
//         }
//         vueApp.$store.commit('UPDATE_CALL_INFO', labelData)
//         break;
//       }
//       case 'UPDATE_CONFERENCE_LABEL':{
//         let conferenceLabel = {}
//         if (data.label_1 != 'no_update') {
//           conferenceLabel['status'] = data.label_1
//         }
//         if (data.label_2 != 'no_update') {
//           conferenceLabel['label'] = data.label_2
//         }
//         if (data.label_3 != 'no_update') {
//           conferenceLabel['info'] = data.label_3
//         }
//         vueApp.$store.commit('UPDATE_CONFERENCE_INFO', conferenceLabel)
//         break;
//       }

//       case 'INIT_CONFERENCE':{
//         let phoneData = {}
//         phoneData['status'] = data.label_1
//         phoneData['label'] = data.label_2
//         phoneData['info'] = data.label_3
//         vueApp.$store.commit('UPDATE_CALL_INFO', phoneData)
//         // update conference info
//         let conferenceData = {}
//         conferenceData['conferenceId'] = data.conference_id
//         conferenceData['conferenceStarted'] = data.conference_started
//         conferenceData['userConferenceRole'] = data.conference_role
//         vueApp.$store.commit('INIT_CONFERENCE', conferenceData)
//         break;
//       }

//       case 'ADD_CONFERENCE_MEMBER':{
//         let memberData = {}
//         memberData['members'] = data.members
//         memberData['conferenceId'] = data.conference_id
//         memberData['extensionAdded'] = data.extension
//         vueApp.$store.commit('ADD_CONFERENCE_MEMBER', memberData)
//         break;
//       }

//       case 'REMOVE_CONFERENCE_MEMBER':{
//         console.log('case REMOVE_CONFERENCE_MEMBER')
//         let member = data.member
//         let conferenceId = data.conference_id
//         vueApp.$store.commit('REMOVE_CONFERENCE_MEMBER', { member, conferenceId })
//         break;
//       }

//       // actions for new conference member
//       case 'SET_INVITED_CHANNEL':{
//         let channel_id = data.channel_id
//         vueApp.$store.commit('SET_PHONE_STATE', { phoneVar: 'invitedChannel', phoneState: channel_id })
//         break
//       }

//       case 'INVITED_REJECT':{
//         let channel_id = data.channel_id
//         console.log(channel_id);
//         vueApp.$store.commit('INVITED_REJECT')
//         break
//       }

//       case 'SEND_CONFERENCE_INVITATION':{
//         let invitationData = {}
//         invitationData['conferenceId'] = data.conference_id
//         invitationData['invitorChannel'] = data.invitor_channel
//         invitationData['invitedChannel'] = data.invited_channel
//         invitationData['invitorEndpoint'] = data.invitor_endpoint
//         vueApp.$store.commit('RECEIVE_CONFERENCE_INVITATION',
//           invitationData)
//         break
//       }

//       case 'HANGUP_CHANNELS':{
//         vueApp.$store.dispatch('hangupCall')
//         break}

//       case 'ENDPOINT_STATE':{
//         let strOrder = ""
//         switch(data.state) {
//           case 'offline':
//             {
//             strOrder = '3'
//             console.log(strOrder);
//             let statusColor = 'text-danger'
//             console.log(statusColor);
//             let strTemp = `<span class='badge-danger badge-status'></span>`
//             console.log(strTemp);
//             break}
//           case 'online':
//             {strOrder = '1'
//             break}
//           case 'busy':
//             {strOrder = '2'
//             break}
//         }

//         let contactIndex = pbx_contacts.findIndex((obj => obj.account == data.endpoint))
//         pbx_contacts[contactIndex].status = data.state
//         pbx_contacts[contactIndex].weight = strOrder
//         if (pbx_contacts) {
//           // renderPeople(pbx_contacts)
//         }
//         break;
//       }

//       case 'VOICEMESSAGE':
//         // $('.voicemail-count').text(data.message_count)
//         // $('.voicemail-count').css('display', 'block')
//         vueApp.$store.commit('SHOW_MESSAGE', 'Tienes un nuevo correo de voz')
//         break;

//       case 'ASTERISK_ERROR':
//         // alertError(data.message)
//         break
//     }
//   }
//   asteriskNotificationSocket.onerror = err => {
//     console.error('Socket Asterisk encountered error: ', err.message, 'Closing socket');
//     asteriskNotificationSocket.close();
//   }
//   asteriskNotificationSocket.onclose = e => {
//     console.log('Socket Asterisk is closed. Reconnect will be attempted in 1 second.', e.reason);
//     setTimeout(function() {
//       connectAsteriskSocket();
//     }, 1000);
//   }
// }
// connectAsteriskSocket();
