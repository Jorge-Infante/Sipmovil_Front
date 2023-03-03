import { apiRequest } from "@/api/softphone_api.js";

export const setCallEvents = ({ commit /*state*/ }, callEvents) => {
  let filteredEvents = callEvents.filter(
    (x) =>
      x.eventType == "RINGING_GROUP" ||
      x.eventType == "RINGING_IVR" ||
      x.eventType == "IVR_DMTF" ||
      x.eventType == "ORIGIN_DID"
  );
  commit("SET_PHONE_STATE", {
    phoneVar: "callEvents",
    phoneState: filteredEvents,
  });
};
export const incommingCall = ({ commit, state }, callNumber) => {
  console.log(state);
  let callDirection = "INCOMING";
  commit("SET_CALL_DIRECTION", callDirection);

  apiRequest
    .getLabel(callDirection, callNumber, "{{request.user.id}}", "call")
    .then(
      (response) => {
        let callInfo = response.data;
        callInfo["status"] = "Llamada entrante";
        commit("SET_PHONE_STATE", { phoneVar: "showPhone", phoneState: true });
        commit("UPDATE_CALL_INFO", callInfo);
        commit("START_CALL");
        state.ctxSip.startRingTone();
      },
      (error) => {
        console.log("Error en incoming call: ", error);
        let callInfo = {
          status: "Llamada entrante",
          label: "Desconocido",
          info: "Número - " + callNumber,
        };
        commit("SET_PHONE_STATE", { phoneVar: "showPhone", phoneState: true });
        commit("UPDATE_CALL_INFO", callInfo);
        commit("START_CALL");
        state.ctxSip.startRingTone();
      }
    );
};
export const convertSDP = ({ commit, state }) => {
  console.log(commit, "converSDP");
  let localDesc =
    '"' +
    state.peerConnection.localDescription.sdp
      .replaceAll(String.fromCharCode(13), "\\r")
      .replaceAll(String.fromCharCode(10), "\\n") +
    '"';
  let remoteDesc = state.peerConnection.remoteDescription.sdp
    .replaceAll(String.fromCharCode(13), "\\r")
    .replaceAll(String.fromCharCode(10), "\\n");
  apiRequest.convertSDP(localDesc, remoteDesc).then(
    (response) => {
      console.log(response.data);
    },
    (error) => {
      console.log(error);
    }
  );
};
export const outgoingCall = ({ commit, state }) => {
  console.log("action outgoingCall");
  let callDirection = "OUTGOING";
  let number = state.callNumber;
  if (number == "") {
    state.showCallButton = true;
    return;
  }
  commit("SET_CALL_DIRECTION", callDirection);
  apiRequest
    .getLabel(callDirection, number, 239, "call")
    .then(
      (response) => {
        let callInfo = response.data;
        callInfo.info = `${callInfo.info.split("-")[0]}- ${state.callNumber}`;
        callInfo["status"] = "Llamando";
        commit("UPDATE_CALL_INFO", callInfo);
        state.showCallButton = false;
        commit("START_CALL");
        state.ctxSip.phoneCallButtonPressed();

        // update second user in outgoing call
        let userInfo = {
          name: callInfo.label,
          avatar: callInfo.avatar,
          extension: callInfo.number,
        };
        console.log(userInfo);
        commit("SET_PHONE_STATE", {
          phoneVar: "seconduserInfo",
          phoneState: userInfo,
        });
        // Vue.set(state.inCallPeers, 0, {})
        // Vue.set(state.inCallPeers, 1, userInfo)
      },
      (error) => {
        let callInfo = {
          status: "Llamando",
          label: "Desconocido",
          info: "Número - " + number,
        };
        commit("UPDATE_CALL_INFO", callInfo);
        state.showCallButton = false;
        commit("START_CALL");
        state.ctxSip.phoneCallButtonPressed();
        console.log(error);
      }
    );
  console.log("after AXIOS");
};
export const updateSecondUser = ({ commit, state }, numbersInCall) => {
  console.log(state);
  let secondExtension = numbersInCall.filter(
    (x) => x != "{{request.user.profile.get_extension}}"
  )[0];
  apiRequest.getExtensionInfo(secondExtension).then(
    (response) => {
      let userInfo = response.data;
      commit("SET_PHONE_STATE", {
        phoneVar: "seconduserInfo",
        phoneState: userInfo,
      });
      //   Vue.set(state.inCallPeers, 1, userInfo);
    },
    (error) => {
      console.log(error);
    }
  );
};
export const getLastNumber = ({ state }) => {
  apiRequest.getLastNumber().then(
    (response) => {
      state.callNumber = response.data.number;
    },
    (error) => {
      console.log(error);
    }
  );
};
export const preTranslateNumber = ({ state }) => {
  console.log("Actions prestraslate: ", state.callNumber);
  console.log(typeof(state.callNumber));
  apiRequest.preTranslateNumber(state.callNumber).then(
    (response) => {
      console.log("ENTRO action preTranslateNumber");
      console.log(response);
      state.callNumber = response.data;
    },
    (error) => {
      console.log(error);
    }
  );
};
export const acceptCall = ({ commit, state }) => {
  state.ctxSip.clickToDial = null;
  state.ctxSip.stopRingTone();
  state.showCallButton = false;
  commit("UPDATE_CALL_INFO", { status: "Conectando..." });
  state.ctxSip.fireAnswerEvent();
};
export const answerCall = ({ commit, state }) => {
  console.log(state);
  state.ctxSip.clickToDial = null;
  commit("ANSWER_CALL");
  commit("INIT_STATISTIC");
  commit("UPDATE_CALL_INFO", { status: "En llamada" });
};
export const hangupCall = ({ commit,state }) => {
  console.log("action hangupCall");
  if (state.ctxSip.clickToDial) {
    // notify zoho click to call rejected
    // vueApp.rejectClickToCall("rejected");
  }
  state.ctxSip.sipHangUp(state.ctxSip.callActiveID);
  state.ctxSip.stopRingTone();
  commit("HANGUP_CALL");
};
export const finishCall = ({state, commit }) => {
  state.ctxSip.stopRingTone();
  state.ctxSip.clickToDial = null;
  const callInfoSurvey = state.ctxSip.currentSession.call_id;
  if (callInfoSurvey) {
    const [, call_idSurvey] = callInfoSurvey.split(":");
    console.log(call_idSurvey);
    // vueApp.lastCallSurvey.call_id = call_idSurvey;
    commit("HANGUP_CALL");
    setTimeout(() => {
      //   vueApp.showModal();
    }, 2000);
  }
  if (!callInfoSurvey) {
    commit("HANGUP_CALL");
  }
};
export const pressDigit = ({ commit, state }, digit) => {
  console.log(state);
  commit("APPEND_DIGIT", digit);
  state.ctxSip.sipSendDTMF(digit);
};
export const pressMute = ({ state }) => {
  state.isMuted = !state.isMuted;
  state.ctxSip.phoneMuteButtonPressed(state.ctxSip.callActiveID);
};
export const pressHold = ({ state }) => {
  state.isHold = !state.isHold;
  state.ctxSip.phoneHoldButtonPressed(state.ctxSip.callActiveID);
};
export const initTransfer = (
  { commit, state },
  { transferType, transferTarget }
) => {
  console.log("commit en init tranfer:", commit);
  // target = window.prompt('Ingrese número destino', '');

  if (state.userInConference == true) {
    let alreadyInConference = state.conferenceMembers.filter(
      (x) => x.extension == transferTarget
    ).length;

    if (alreadyInConference != 0) {
      //   alertError(
      //     `No se puede agregar al número ${transferTarget} porque ya esta en la conferencia`
      //   );
      return;
    }
  }

  if (state.ctxSip.currentSession.numbers_in_call.includes(String(transferTarget))) {
    // alertError(
    //   `No se puede transferir al número ${transferTarget} porque ya esta en la llamada`
    // );
    return;
  }

  apiRequest
    .pbxTransfer(transferType, transferTarget)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      //   alertError(error.response.data.error);
      console.log(error);
    });
};
export const warnTranferAction = ({ commit, state }, transferPhase) => {
  console.log(commit);
  state.warnTransfer = false;
  apiRequest
    .warnTransfer(transferPhase)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      //   alertError("Error al transferir la llamada");
      console.log(error);
    });
};
export const restartCallDuration = ({ state }) => {
  state.callDuration = 0;
};
export const setTranferParams = ({ state }, { callId, transferType }) => {
  state.isTransferInvited = true;
  state.transferCallId = callId;
  state.transferType = transferType;
};
export const rejecttranferInvitation = ({ state, commit }) => {
  console.log(commit);
  apiRequest
    .rejecttranferInvitation(state.transferCallId, state.transferType)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      //   alertError(error.response.data.error);
      console.log(error);
    });
  state.isTransferInvited = false;
  state.transferCallId = "";
  state.transferType = "";
};

// Actions for call conference
export const callConferenceMember = ({ state, commit }, number) => {
  console.log(state);
  console.log("entro accion callConferenceMember");
  let callDirection = "OUTGOING";

  apiRequest
    .getLabel(callDirection, number, "{{request.user.id}}", "call")
    .then(
      (response) => {
        console.log(response);
        let callInfo = response.data;
        callInfo["status"] = "Llamando";
        commit("CALL_CONFERENCE_MEMBER", { callInfo, number });
      },
      (error) => {
        console.log(error);
        let callInfo = {
          status: "Llamando",
          label: "Desconocido",
          info: "Número - " + number,
        };
        commit("CALL_CONFERENCE_MEMBER", { callInfo, number });
      }
    );
};
export const addConferenceMember = ({ state }, member) => {
  apiRequest
    .addConferenceMember(state.conferenceId, member)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      //   alertError("Error al agregar el miembro a la conferencia");
      console.log(error);
      console.log(error);
      console.log(error.message);
    });
};
export const removeConferenceMember = ({ state }, member) => {
  apiRequest
    .removeConferenceMember(state.conferenceId, member)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      //   alertError("Error al agregar el miembro a la conferencia");
      console.log(error);
      console.log(error);
    });
};
export const toggleConferenceRecord = ({ state, commit }) => {
  commit("TOGGLE_CONFERENCE_RECORD");
  apiRequest
    .toggleConferenceRecord(state.conferenceId, state.recordConference)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      //   alertError("Error la grabación de la conferencia");
      console.log(error);
    });
};
export const removeInvitedChannel = ({ state, commit }) => {
  apiRequest
    .removeInvitedChannel(state.conferenceId, state.targetConferenceEndpoint)
    .then((response) => {
      console.log(response);
      commit("REMOVE_INVITED_CHANNEL");
    })
    .catch((error) => {
      //   alertError(error.response.data.error);
      console.log(error);
    });
};
// rejectConferenceInvitation ({ state, commit }) {
//   apiRequest.rejectConferenceInvitation(state.invitationData)
//   .then((response) => {
//     console.log(response)
//   })
//   .catch((error) => {
//     alertError(error.response.data.error)
//   })
// },

// Actions for ContactBrowser Component
export const setContacts = ({ commit }) => {
  apiRequest
    .getContacts()
    .then((response) => {
      commit("SET_CONTACTS", response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const setPjsipContacts = ({ state }) => {
  apiRequest.getPjsipContacts().then(
    (response) => {
      console.log("setPjsipContacts", response.data);
      state.pjsipContacts = response.data;
      // commit('SET_PHONE_STATE', { phoneVar: 'pjsipContacts', phoneState: response.data })
    },
    (error) => {
      console.log(error);
    }
  );
};
export const showDialog = ({ commit }, type) => {
  commit("SHOW_DIALOG", type);
};
export const closeDialog = ({ commit }) => {
  commit("CLOSE_DIALOG");
};

