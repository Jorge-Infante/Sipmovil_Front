import axios from "axios";


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
  getLabel(callDirection, number, userId, optionPush, token) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.get(
      `/api/pbx/get_call_info?call_direction=${callDirection}&number=${number}&user_id=${userId}&option_push=${optionPush}`
    );
  },
  getExtensionInfo(extension, token) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.get(`/api/pbx/get_extension_info?number=${extension}`);
  },
  convertSDP(localDescription, remoteDescription, token) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.post(
      `/api/pbx/translate_sdp?local=${localDescription}&remote=${remoteDescription}`
    );
  },
  getLastNumber(token, user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.get(`/api/webrtc/last_call?endpoint=${user}`);
  },
  preTranslateNumber(token, callNumber) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.post(`/api/pbx/pre_translate?number=${callNumber}`);
  },
  pbxTransfer(transferType, transferTarget, call_id, user, token) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.post(
      `/zoho/api/zoho_transfer?endpoint=${user.User}&target=${transferTarget}&call_id=${call_id}&type=${transferType}`
    );
  },
  warnTransfer(transferPhase, call_id, user, token) {
    console.log("WARNTRANFER REQUEST: ", transferPhase, call_id, user, token);
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.post(
      `/zoho/api/transfer_event?endpoint=${user.User}&phase=${transferPhase}&call_id=${call_id}`
    );
  },
  //   rejectClickToCall(reason) {
  //     let from = ctxSip.clickToDial.from;
  //     let to = ctxSip.clickToDial.to;
  //     return apiClient.post(
  //       `/zoho/api/reject_call?endpoint=${user.User}&from=${from}&to=${to}&reason=${reason}`
  //     );
  //   },
  getContacts(token) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    return apiClient.get("/api/webrtc/get_contacts");
  },
  removeConferenceMember(conferenceId, memberExtension, user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${user.Token}`;
    return apiClient.post(
      `/zoho/api/remove_member?endpoint=${user.User}&conference_id=${conferenceId}&member=${memberExtension}`
    );
  },
  addConferenceMember(conferenceId, memberExtension, user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${user.Token}`;
    return apiClient.post(
      `/zoho/api/add_member?endpoint=${user.User}&conference_id=${conferenceId}&member=${memberExtension}`
    );
  },
  toggleConferenceRecord(conferenceId, state, user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${user.Token}`;
    return apiClient.post(
      `/zoho/api/toggle_record?endpoint=${user.User}&conference_id=${conferenceId}&state=${state}`
    );
  },
  removeInvitedChannel(conferenceId, targetEndpoint, user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${user.Token}`;
    return apiClient.post(
      `/zoho/api/remove_invited?endpoint=${user.User}&conference_id=${conferenceId}&target_endpoint=${targetEndpoint}`
    );
  },
  // rejectConferenceInvitation(invitationData) {
  //   return apiClient.post(`/zoho/api/reject_invitation?invitor_endpoint=${invitationData.invitorEndpoint}&conference_id=${invitationData.conferenceId}&invitor_channel_id=${invitationData.invitorChannel}&invited_channel=${invitationData.invitedChannel}`)
  // },
  rejecttranferInvitation(transferCallId, transferType, user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${user.Token}`;
    return apiClient.post(
      `/zoho/api/reject_transfer?call_id=${transferCallId}&transfer_type=${transferType}&endpoint=${user.User}`
    );
  },
  getPjsipContacts(user) {
    apiClient.defaults.headers.common["Authorization"] = `Token ${user.Token}`;
    return apiClient.get("/api/webrtc/pjsip_contacts");
  },
};
