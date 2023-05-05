import axios from "axios";

export const user = {
  Display: "107",
  Pass: "77WIY1Q7",
  Realm: "pbxhost0.sipmovil.com",
  Token: "8ef5e709a35dea0d1a5a4f394984369c1e62ec9d",
  User: "100108480086",
  User_id: 226,
  WSServer: "wss://pbxhost0.sipmovil.com:8089/ws",
};

export const apiClient = axios.create({
  baseURL: "https://test.sipmovil.com/",
  withCredentials: false,
});
export const apiClientForm = axios.create({
  baseURL: "https://test.sipmovil.com/",
  withCredentials: false,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

export const apiRequest = {
  getLabel(callDirection, number, userId, optionPush,token) {
    console.log('----> token: ',token, '<----');
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
    return apiClient.get(
      `/api/pbx/get_call_info?call_direction=${callDirection}&number=${number}&user_id=${userId}&option_push=${optionPush}`
    );
  },
  getExtensionInfo(extension) {
    return apiClient.get(`/api/pbx/get_extension_info?number=${extension}`);
  },
  convertSDP(localDescription, remoteDescription) {
    return apiClient.post(
      `/api/pbx/translate_sdp?local=${localDescription}&remote=${remoteDescription}`
    );
  },
  getLastNumber(token,user) {
    console.log('----> token: ',token, '<----');
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
    return apiClient.get(`/api/webrtc/last_call?endpoint=${user}`);
  },
  preTranslateNumber(token,callNumber) {
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
    return apiClient.post(`/api/pbx/pre_translate?number=${callNumber}`);
  },
    pbxTransfer(transferType, transferTarget,call_id,user, token) {
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
      return apiClient.post(
        `/zoho/api/zoho_transfer?endpoint=${user.User}&target=${transferTarget}&call_id=${call_id}&type=${transferType}`
      );
    },
  //   warnTransfer(transferPhase) {
  //     return apiClient.post(
  //       `/zoho/api/transfer_event?endpoint=${user.User}&phase=${transferPhase}&call_id=${ctxSip.currentSession.call_id}`
  //     );
  //   },
  //   rejectClickToCall(reason) {
  //     let from = ctxSip.clickToDial.from;
  //     let to = ctxSip.clickToDial.to;
  //     return apiClient.post(
  //       `/zoho/api/reject_call?endpoint=${user.User}&from=${from}&to=${to}&reason=${reason}`
  //     );
  //   },
  getContacts() {
    return apiClient.get("/api/webrtc/get_contacts");
  },
  removeConferenceMember(conferenceId, memberExtension) {
    return apiClient.post(
      `/zoho/api/remove_member?endpoint=${user.User}&conference_id=${conferenceId}&member=${memberExtension}`
    );
  },
  addConferenceMember(conferenceId, memberExtension) {
    return apiClient.post(
      `/zoho/api/add_member?endpoint=${user.User}&conference_id=${conferenceId}&member=${memberExtension}`
    );
  },
  toggleConferenceRecord(conferenceId, state) {
    return apiClient.post(
      `/zoho/api/toggle_record?endpoint=${user.User}&conference_id=${conferenceId}&state=${state}`
    );
  },
  removeInvitedChannel(conferenceId, targetEndpoint) {
    return apiClient.post(
      `/zoho/api/remove_invited?endpoint=${user.User}&conference_id=${conferenceId}&target_endpoint=${targetEndpoint}`
    );
  },
  // rejectConferenceInvitation(invitationData) {
  //   return apiClient.post(`/zoho/api/reject_invitation?invitor_endpoint=${invitationData.invitorEndpoint}&conference_id=${invitationData.conferenceId}&invitor_channel_id=${invitationData.invitorChannel}&invited_channel=${invitationData.invitedChannel}`)
  // },
  rejecttranferInvitation(transferCallId, transferType) {
    return apiClient.post(
      `/zoho/api/reject_transfer?call_id=${transferCallId}&transfer_type=${transferType}&endpoint=${user.User}`
    );
  },
  getPjsipContacts() {
    return apiClient.get("/api/webrtc/pjsip_contacts");
  },
};
