import vueApp from "@/store";
import { user } from "@/api/softphone_api";
import SIP from "libs/phone/sip.min.js";
import { apiRequest } from "@/api/softphone_api.js";

export const test = () => {
  console.log(user);
  console.log("SIPPPPP:", SIP);
};


export const ctxSip = {
  config: {
    password: user.Pass,
    displayName: user.Display,
    uri: "sip:" + user.User + "@" + user.Realm,
    wsServers: user.WSServer,
    stunServers: ["stun:stun.l.google.com:19302"],
    traceSip: true,
    log: {
      level: 0,
    },
  },
  // ringtone     : document.getElementById('ringtone'),
  // ringbacktone : document.getElementById('ringbacktone'),
  // dtmfTone     : document.getElementById('dtmfTone'),

  Sessions: [],
  callTimers: {},
  callActiveID: null,
  callVolume: 1,
  Stream: null,
  currentSession: null,
  clickToDial: null,

  /**
   * Parses a SIP uri and returns a formatted US phone number.
   *
   * @param  {string} phone number or uri to format
   * @return {string}       formatted number
   */
  formatPhone: function (phone) {
    var num;

    if (phone.indexOf("@")) {
      num = phone.split("@")[0];
    } else {
      num = phone;
    }

    num = num.toString().replace(/[^0-9]/g, "");

    if (num.length === 10) {
      return (
        "(" +
        num.substr(0, 3) +
        ") " +
        num.substr(3, 3) +
        "-" +
        num.substr(6, 4)
      );
    } else if (num.length === 11) {
      return (
        "(" +
        num.substr(1, 3) +
        ") " +
        num.substr(4, 3) +
        "-" +
        num.substr(7, 4)
      );
    } else {
      return num;
    }
  },

  // Sound methods
  startRingTone: function () {
    try {
      ctxSip.ringtone.play();
    } catch (e) {
      console.log("ok");
    }
  },

  stopRingTone: function () {
    try {
      ctxSip.ringtone.pause();
    } catch (e) {
      console.log("ok");
    }
  },

  startRingbackTone: function () {
    //try { ctxSip.ringbacktone.play(); } catch (e) { }
    console.log("telefono sin ring por ahora");
  },

  stopRingbackTone: function () {
    try {
      ctxSip.ringbacktone.pause();
    } catch (e) {
      console.log("ok");
    }
  },

  // Genereates a rendom string to ID a call
  getUniqueID: function () {
    return Math.random().toString(36).substr(2, 9);
  },

  newSession: function (newSess) {
    console.log("Entro funcion newSession: " + newSess.direction);
    console.log(newSess);
    ctxSip.currentSession = { session: newSess };
    newSess.displayName =
      newSess.remoteIdentity.displayName || newSess.remoteIdentity.uri.user;
    newSess.ctxid = ctxSip.getUniqueID();
    var status;

    ctxSip.callActiveID = newSess.ctxid;

    if (newSess.direction === "incoming") {
      let sessionDirection = "incoming";
      console.log(sessionDirection);
      status = "Llamada entrante: " + newSess.displayName;

      // acciones para el sofphone movil
      if (!window.location.pathname.includes("mobile_phone")) {
        let params = { show: "yes" };
        console.log(params);
        // changeView('mobile_phone', params);
      }

      vueApp.$store.dispatch("incommingCall", newSess.displayName);
      ctxSip.callActiveID = newSess.ctxid;
    } else {
      console.log("else");
    }

    ctxSip.setCallSessionStatus(status);

    // EVENT CALLBACKS

    newSess.on("SessionDescriptionHandler-created", function () {
      console.log("ENTRO EVENTO PEERCONNECTION");
      // console.log(newSess)
      // console.log(newSess.sessionDescriptionHandler)
      // var peerConnection = newSess.sessionDescriptionHandler.peerConnection;
      // var remoteStream = peerConnection.getRemoteStreams()[0];
      // console.log(remoteStream)
    });

    newSess.on("progress", function (e) {
      console.log(e);

      // localStorage.setItem('currentObj', JSON.stringify(e));
      // traceLog("Evento progress direccion: "+ e.direction, 1)
      if (newSess.direction === "outgoing") {
        ctxSip.setCallSessionStatus("Llamando");
      }
    });

    newSess.on("connecting", function (e) {
      // traceLog("Evento connecting direccion: "+ newSess.direction, 1)
      console.log(e);
      vueApp;
      // $("#btnCallNow").prop('hidden', true);
      // $('.mobile-phone-container .btnHangup').css('margin-left', '0px');
      if (newSess.direction === "outgoing") {
        ctxSip.setCallSessionStatus("Conectando");
      }
    });

    newSess.on("accepted", function (e) {
      console.log(e);

      // If there is another active call, hold it
      let peerConnection = this.mediaHandler.peerConnection;
      vueApp.commit("softphone_store/SET_PHONE_STATE", {
        phoneVar: "peerConnection",
        phoneState: peerConnection,
      });
      // traceLog("Evento accepted", 1);
      // vueApp.$store.dispatch('convertSDP')
      vueApp.dispatch("softphone_store/answerCall");

      // acciones softphone movil
      // $('.mobile-phone-container .option-icon').prop('disabled', false);
      // $('.mobile-phone-container #numDisplay').prop('disabled', true);
      // $('.mobile-phone-container .phone-backspace').prop('hidden', true);
      // $('.mobile-phone-container #numDisplay').parent().removeClass('col-9').addClass('col-11');

      if (ctxSip.callActiveID && ctxSip.callActiveID !== newSess.ctxid) {
        ctxSip.phoneHoldButtonPressed(ctxSip.callActiveID);
      }

      ctxSip.stopRingTone();
      ctxSip.callActiveID = newSess.ctxid;
    });

    newSess.on("hold", function (e) {
      console.log(e);
      ctxSip.fireHoldEvent();
    });

    newSess.on("unhold", function (e) {
      console.log(e);
      ctxSip.fireUnHoldEvent(newSess);
    });

    newSess.on("muted", function (e) {
      console.log(e);
      ctxSip.fireMuteEvent(newSess);
    });

    newSess.on("unmuted", function (e) {
      console.log(e);
      ctxSip.fireUnMuteEvent(newSess);
    });

    newSess.on("cancel", function (e) {
      console.log(e);
      // traceLog("Evento cancel direccion: ", 1)
      console.log(ctxSip.clickToDial);

      // if call is zoho click to dial and call isnot answer
      if (!ctxSip.clickToDial) {
        apiRequest
          .rejectClickToCall("noanswer")
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      ctxSip.setCallSessionStatus("Cancelada");
      if (this.direction === "outgoing") {
        ctxSip.callActiveID = null;
        newSess = null;
        // restartPhoneControls();
        vueApp.dispatch("finishCall");
      }
    });

    newSess.on("bye", function (e) {
      console.log(e);
      // traceLog(e);
      // traceLog("Evento bye direccion: ", 1);
      vueApp.dispatch("finishCall");
      ctxSip.callActiveID = null;
      newSess = null;
    });

    newSess.on("failed", function (e) {
      vueApp.dispatch("finishCall");
      // traceLog("Evento failed direccion: ", 1);
      console.log(e);
    });

    newSess.on("rejected", function (e) {
      console.log(e);
      // traceLog("Evento rejected direccion: ", 1)
      vueApp.dispatch("finishCall");
      ctxSip.callActiveID = null;
      newSess = null;
    });

    ctxSip.Sessions[newSess.ctxid] = newSess;
  },

  // getUser media request refused or device was not present
  getUserMediaFailure: function (e) {
    console.log("entro funcion getUserMediaFailure");
    window.console.error("getUsstatuserMedia failed:", e);
    ctxSip.setError(
      true,
      "Sin micrófono.",
      "No detectamos tu micrófono, revisa que esté habilitado en tu navegador, revisa la barra de direcciones.",
      true
    );
  },

  getUserMediaSuccess: function (stream) {
    ctxSip.Stream = stream;
  },

  setCallSessionStatus: function (status) {
    console.log(status);
    // $('.txtCallStatus').html(status);
  },

  setStatus: function (status) {
    console.log(status);
    // $("#txtRegStatus").html('<i class="fa fa-signal"></i> '+status);
  },

  fireMuteEvent: function (newSess) {
    ctxSip.Sessions[newSess.ctxid].isMuted = true;
    ctxSip.setCallSessionStatus("Silenciada");
  },

  fireUnMuteEvent: function (newSess) {
    ctxSip.Sessions[newSess.ctxid].isMuted = false;
    ctxSip.setCallSessionStatus("Contestada");
  },

  fireHoldEvent: function () {
    // traceLog("Evento hold", 1)
  },

  fireUnHoldEvent: function (newSess) {
    // traceLog("Evento unhold", 1)
    ctxSip.callActiveID = newSess.ctxid;
  },

  fireDMTFEvent: function (dig) {
    vueApp.$store.commit("SET_PHONE_STATE", {
      phoneVar: "callNumber",
      phoneState: vueApp.$store.state.callNumber + dig,
    });
  },

  fireAnswerEvent: function () {
    // $("#screenHoldOn").hide(1)
    var sessionid = ctxSip.callActiveID;
    ctxSip.phoneCallButtonPressed(sessionid);
  },

  sipCall: function (target) {
    console.log("target sipcall: " + target);
    console.log(ctxSip.Stream);
    try {
      var s = ctxSip.phone.invite(target, {
        media: {
          stream: ctxSip.Stream,
          constraints: { audio: true, video: false },
          render: {
            // remote : $('#audioRemote').get()[0]
          },
          RTCConstraints: { optional: [{ DtlsSrtpKeyAgreement: "true" }] },
        },
        rel100: SIP.C.supported.SUPPORTED,
        earlyMedia: true,
        // inviteWithoutSdp: true
      });
      console.log("asignar stream en sipCall");
      s.direction = "outgoing";
      ctxSip.newSession(s);
    } catch (e) {
      console.log(e);
    }
  },

  sipTransfer: function (sessionid) {
    console.log("Entro funcion sipTransfer");
    var s = ctxSip.Sessions[sessionid],
      target = window.prompt("Ingrese número destino", "");
    console.log("paso var s");
    ctxSip.setCallSessionStatus("<i>Transfering the call...</i>");
    console.log("paso setCallSessionStatus");
    s.refer(target);
    console.log("paso s.refer(target)");
  },

  sipHangUp: function (sessionid) {
    console.log("entro sipHangUp sessionid: " + sessionid);
    var s = ctxSip.Sessions[sessionid];
    // s.terminate();
    if (!s) {
      return;
    } else if (s.startTime) {
      console.log("entro s.startTime: " + s.startTime);
      s.bye();
    } else if (s.reject) {
      console.log("entro s.reject: " + s.reject);
      s.reject();
    } else if (s.cancel) {
      console.log("entro s.cancel: " + s.cancel);
      s.cancel();
    }
  },

  sipSendDTMF: function (digit) {
    // $('#dial-in-call').val($('#dial-in-call').val()+digit);
    try {
      ctxSip.dtmfTone.play();
    } catch (e) {
      console.log(e);
    }

    var a = ctxSip.callActiveID;
    if (a) {
      var s = ctxSip.Sessions[a];
      s.dtmf(digit);
    }
  },

  phoneCallButtonPressed: function (sessionid) {
    // traceLog("Funcion phoneCallButtonPressed sessionid: "+ sessionid, 1)
    var s = ctxSip.Sessions[sessionid],
      target = vueApp.state.softphone_store.callNumber.trim();

    if (!s) {
      // $("#numDisplay").val("");
      ctxSip.sipCall(target);
    } else if (s.accept && !s.startTime) {
      console.log("asignar stream en phoneCallButtonPressed");
      s.accept({
        media: {
          stream: ctxSip.Stream,
          constraints: { audio: true, video: false },
          render: {
            // remote : $('#audioRemote').get()[0]
          },
          RTCConstraints: { optional: [{ DtlsSrtpKeyAgreement: "true" }] },
        },
      });
    }
  },

  phoneMuteButtonPressed: function (sessionid) {
    var s = ctxSip.Sessions[sessionid];

    if (!s.isMuted) {
      s.mute();
    } else {
      s.unmute();
    }
  },

  phoneHoldButtonPressed: function (sessionid) {
    // traceLog("Funcion phoneHoldButtonPressed ", 1)
    console.log("sessionid: " + sessionid);
    var s = ctxSip.Sessions[sessionid];
    console.log(s);
    console.log("s.isOnHold().local: " + s.isOnHold().local);
    if (s.isOnHold().local === true) {
      console.log("entro s.unhold");
      s.unhold();
    } else {
      s.hold();
      console.log("entro s.hold");
    }
  },

  setError: function (err, title, msg, closable) {
    console.log(closable);
    // $('#sophone-error').prop('hidden',false);
    // $('#sophone-error').text(msg);
  },

  removeError: function () {
    // $('#sophone-error').prop('hidden',true);
    // $('#sophone-error').text('');
  },

  /**
   * Tests for a capable browser, return bool, and shows an
   * error modal on fail.
   */
  hasWebRTC: function () {
    if (navigator.webkitGetUserMedia) {
      return true;
    } else if (navigator.mozGetUserMedia) {
      return true;
    } else if (navigator.getUserMedia) {
      return true;
    } else {
      ctxSip.setError(
        true,
        "Navegador no soportado.",
        "Su navegador no soporta comunicaciones RTC. Utilice un navegador compatible."
      );
      window.console.error("WebRTC support not found");
      return false;
    }
  },
};

// Throw an error if the browser can't hack it.
if (!ctxSip.hasWebRTC()) {
  console.log("ok");
}

// only connect when request come from not mobile device
ctxSip.phone = new SIP.UA(ctxSip.config);

ctxSip.phone.on("connected", function (e) {
  console.log(e);
  // traceLog("WEBRTC connected ", 1)
  ctxSip.setStatus("Connected");
  ctxSip.removeError();
});

ctxSip.phone.on("disconnected", function (e) {
  console.log(e);
  // $("#modal-asterisk-call").modal('hide')
  // traceLog("WEBRTC disconnected ", 1)
  ctxSip.setStatus("Disconnected");

  // disable phone
  ctxSip.setError(
    true,
    "Desconectado.",
    "Desconectado. Recargue la página para continuar llamando."
  );

  // remove existing sessions
  // $("#sessions > .session").each(function(i, session) {
  //   ctxSip.removeSession(session, 500);
  // });
});

ctxSip.phone.on("registered", function (e) {
  console.log("Event registered: ", e);
  vueApp.commit("softphone_store/SET_PHONE_STATE", {
    phoneVar: "phoneStatus",
    phoneState: "REGISTERED",
  });
  vueApp.commit("softphone_store/SET_PHONE_STATE", {
    phoneVar: "pjsipAccount",
    phoneState: user.User,
  });

  // var closeEditorWarning = function() {
  //     return 'If you close this window, you will not be able to make or receive calls from your browser.';
  // };

  // var closePhone = function() {
  //   // stop the phone on unload
  //   localStorage.removeItem('ctxPhone');
  //   ctxSip.phone.stop();
  // };

  ctxSip.setStatus("SIPMOVIL");

  // Get the userMedia and cache the stream
  if (SIP.WebRTC.isSupported()) {
    SIP.WebRTC.getUserMedia(
      { audio: true, video: false },
      ctxSip.getUserMediaSuccess,
      ctxSip.getUserMediaFailure
    );
  }

  // remove alert error when phone has been disconnected
  ctxSip.removeError();
});

// TEST RELATED to ASTERISK ARI

ctxSip.phone.on("message", function (e) {
  console.log("ENTRO INTERFAZ MENSAJE");
  console.log(e.body);
  // try {
  let message = JSON.parse(e.body);
  if ("origin" in message && message.origin == "zoho") {
    let data = message.data;

    switch (data.event) {
      case "MUTE":
        vueApp.$store.dispatch("pressMute");
        // addTemporaryAlert('Zoho: teléfono silenciado');
        ctxSip.fireMuteEvent(ctxSip.currentSession.session);
        break;

      case "UNMUTE":
        vueApp.$store.dispatch("pressMute");
        // addTemporaryAlert('Zoho: teléfono con sonido');
        ctxSip.fireUnMuteEvent(ctxSip.currentSession.session);
        break;

      case "HOLD":
        vueApp.$store.dispatch("pressHold");
        // addTemporaryAlert('Zoho: llamada retenida');
        ctxSip.fireHoldEvent();
        break;

      case "UNHOLD":
        vueApp.$store.dispatch("pressHold");
        // addTemporaryAlert('Zoho: llamada liberada');
        ctxSip.fireUnHoldEvent(ctxSip.currentSession.session);
        break;

      case "DTMF":
        ctxSip.fireDMTFEvent(data.digit);
        break;

      case "VOICEMESSAGE":
        // $('.voicemail-count').text(data.message_count)
        // $('.voicemail-count').css('display', 'block')
        vueApp.$store.commit("SHOW_MESSAGE", "Tienes un nuevo correo de voz");
        break;

      case "SNACK_MESSAGE":
        vueApp.$store.commit("SHOW_MESSAGE", data.snack_message);
        break;

      case "ANSWER":
        // addTemporaryAlert('Zoho: llamada contestada');
        vueApp.$store.dispatch("acceptCall");
        break;
      case "CLICK_TO_DIAL":
        ctxSip.clickToDial = {
          channelId: data.channel_id,
          from: data.from,
          to: data.to,
          timeout: data.timeout,
        };
        break;
    }
  }

  if ("origin" in message && message.origin == "sipmovil") {
    let data = message.data;
    console.log(data);
  }
});

ctxSip.phone.on("registrationFailed", function (e) {
  console.log(e);
  ctxSip.setError(
    true,
    "Desconectado.",
    "Recargue la página para continuar realizando llamadas."
  );
  ctxSip.setStatus("Error: Registration Failed");
});

ctxSip.phone.on("unregistered", function (e) {
  console.log(e);
  // traceLog("WEBRTC unregistered ", 1)
  ctxSip.setError(
    true,
    "Desconectado.",
    "Recargue la página para continuar realizando llamadas."
  );
  ctxSip.setStatus("Error: Registration Failed");
});

ctxSip.phone.on("invite", function (incomingSession) {
  // traceLog("WEBRTC invite ", 1)
  console.log(incomingSession);
  var s = incomingSession;

  s.direction = "incoming";
  ctxSip.newSession(s);
});

// Auto-focus number input on backspace.
// $('#sipClient').keydown(function(event) {
//   if (event.which === 8) {
//       $('#numDisplay').focus();
//   }
// });

// $('#numDisplay').keypress(function(e) {
//   // Enter pressed? so Dial.
//   if (e.which === 13) {
//       ctxSip.phoneCallButtonPressed();
//   }
// });

// $('.digit').click(function(event) {
//   event.preventDefault();
//   var num = $('#numDisplay').val(),
//       dig = $(this).data('digit');

//   $('#numDisplay').val(num+dig);

//   ctxSip.sipSendDTMF(dig);
//   return false;
// });

// $('#sldVolume').on('change', function() {
//   var v      = $(this).val() / 100,
//     // player = $('audio').get()[0],
//     btn    = $('#btnVol'),
//     icon   = $('#btnVol').find('i'),
//     active = ctxSip.callActiveID;

//   // Set the object and media stream volumes
//   if (ctxSip.Sessions[active]) {
//     ctxSip.Sessions[active].player.volume = v;
//     ctxSip.callVolume                     = v;
//   }

//   // Set the others
//   $('audio').each(function() {
//     $(this).get()[0].volume = v;
//   });

// if (v < 0.1) {
//   btn.removeClass(function (index, css) {
//          return (css.match (/(^|\s)btn\S+/g) || []).join(' ');
//       })
//       .addClass('btn btn-sm btn-danger');
//   icon.removeClass().addClass('fa fa-fw fa-volume-off');
// } else if (v < 0.8) {
//   btn.removeClass(function (index, css) {
//          return (css.match (/(^|\s)btn\S+/g) || []).join(' ');
//      }).addClass('btn btn-sm btn-info');
//   icon.removeClass().addClass('fa fa-fw fa-volume-down');
// } else {
//   btn.removeClass(function (index, css) {
//          return (css.match (/(^|\s)btn\S+/g) || []).join(' ');
//      }).addClass('btn btn-sm btn-primary');
//   icon.removeClass().addClass('fa fa-fw fa-volume-up');
// }

function connectAsteriskSocket() {
  const asteriskNotificationSocket = new WebSocket(
    "wss://notificator0.sipmovil.com/ws/notifications/109646401685/"
  );
  asteriskNotificationSocket.binaryType = "arraybuffer";
  asteriskNotificationSocket.onopen = (e) => {
    console.log("Open ASTERISK Notification socket");
    console.log(e);
  };

  asteriskNotificationSocket.onmessage = (e) => {
    console.log("Asterisk Notification socket message", e.data);
    let { message } = JSON.parse(e.data);
    let data = message.data;
    let event = message.eventType;

    switch (event) {
      case "CALL_ID":
        ctxSip.currentSession.call_id = data.call_id;
        ctxSip.currentSession.numbers_in_call = data.numbers_in_call;
        vueApp.$store.dispatch("updateSecondUser", data.numbers_in_call);
        vueApp.$store.dispatch("restartCallDuration");
        if ("append_info" in data) {
          // update call info with aditional details
          vueApp.$store.dispatch("setCallEvents", data.append_info);
        }
        break;

      case "UPDATE_CALL_EVENTS":
        vueApp.$store.dispatch("setCallEvents", data.call_events);
        break;

      case "INVITE_TRANFER":
        vueApp.$store.dispatch("setTranferParams", {
          callId: data.call_id,
          transferType: data.transfer_type,
        });
        break;

      case "WARN_TRANSFER_ATTENDED":
        vueApp.$store.commit("ACTIVATE_TRANSFER");
        break;

      case "UPDATE_SOFTPHONE": {
        let labelData = {};
        if (data.label_1 != "no_update") {
          labelData["status"] = data.label_1;
        }
        if (data.label_2 != "no_update") {
          labelData["label"] = data.label_2;
        }
        if (data.label_3 != "no_update") {
          labelData["info"] = data.label_3;
        }
        vueApp.$store.commit("UPDATE_CALL_INFO", labelData);
        break;
      }
      case "UPDATE_CONFERENCE_LABEL": {
        let conferenceLabel = {};
        if (data.label_1 != "no_update") {
          conferenceLabel["status"] = data.label_1;
        }
        if (data.label_2 != "no_update") {
          conferenceLabel["label"] = data.label_2;
        }
        if (data.label_3 != "no_update") {
          conferenceLabel["info"] = data.label_3;
        }
        vueApp.$store.commit("UPDATE_CONFERENCE_INFO", conferenceLabel);
        break;
      }

      case "INIT_CONFERENCE": {
        let phoneData = {};
        phoneData["status"] = data.label_1;
        phoneData["label"] = data.label_2;
        phoneData["info"] = data.label_3;
        vueApp.$store.commit("UPDATE_CALL_INFO", phoneData);
        // update conference info
        let conferenceData = {};
        conferenceData["conferenceId"] = data.conference_id;
        conferenceData["conferenceStarted"] = data.conference_started;
        conferenceData["userConferenceRole"] = data.conference_role;
        vueApp.$store.commit("INIT_CONFERENCE", conferenceData);
        break;
      }

      case "ADD_CONFERENCE_MEMBER": {
        let memberData = {};
        memberData["members"] = data.members;
        memberData["conferenceId"] = data.conference_id;
        memberData["extensionAdded"] = data.extension;
        vueApp.$store.commit("ADD_CONFERENCE_MEMBER", memberData);
        break;
      }

      case "REMOVE_CONFERENCE_MEMBER": {
        console.log("case REMOVE_CONFERENCE_MEMBER");
        let member = data.member;
        let conferenceId = data.conference_id;
        vueApp.$store.commit("REMOVE_CONFERENCE_MEMBER", {
          member,
          conferenceId,
        });
        break;
      }

      // actions for new conference member
      case "SET_INVITED_CHANNEL": {
        let channel_id = data.channel_id;
        vueApp.$store.commit("SET_PHONE_STATE", {
          phoneVar: "invitedChannel",
          phoneState: channel_id,
        });
        break;
      }

      case "INVITED_REJECT": {
        let channel_id = data.channel_id;
        console.log(channel_id);
        vueApp.$store.commit("INVITED_REJECT");
        break;
      }

      case "SEND_CONFERENCE_INVITATION": {
        let invitationData = {};
        invitationData["conferenceId"] = data.conference_id;
        invitationData["invitorChannel"] = data.invitor_channel;
        invitationData["invitedChannel"] = data.invited_channel;
        invitationData["invitorEndpoint"] = data.invitor_endpoint;
        vueApp.$store.commit("RECEIVE_CONFERENCE_INVITATION", invitationData);
        break;
      }

      case "HANGUP_CHANNELS": {
        vueApp.$store.dispatch("hangupCall");
        break;
      }

      case "ENDPOINT_STATE": {
        let strOrder = "";
        switch (data.state) {
          case "offline": {
            strOrder = "3";
            console.log(strOrder);
            let statusColor = "text-danger";
            console.log(statusColor);
            let strTemp = `<span class='badge-danger badge-status'></span>`;
            console.log(strTemp);
            break;
          }
          case "online": {
            strOrder = "1";
            break;
          }
          case "busy": {
            strOrder = "2";
            break;
          }
        }
        break;
      }

      case "VOICEMESSAGE":
        // $('.voicemail-count').text(data.message_count)
        // $('.voicemail-count').css('display', 'block')
        vueApp.$store.commit("SHOW_MESSAGE", "Tienes un nuevo correo de voz");
        break;

      case "ASTERISK_ERROR":
        // alertError(data.message)
        break;
    }
  };
  asteriskNotificationSocket.onerror = (err) => {
    console.error(
      "Socket Asterisk encountered error: ",
      err.message,
      "Closing socket"
    );
    asteriskNotificationSocket.close();
  };
  asteriskNotificationSocket.onclose = (e) => {
    console.log(
      "Socket Asterisk is closed. Reconnect will be attempted in 1 second.",
      e.reason
    );
    setTimeout(function () {
      connectAsteriskSocket();
    }, 1000);
  };
}
connectAsteriskSocket();

// const  processStats=(report)=>{
//   for (var i in report) {
//     var now = report[i]
//     if (now.type == 'outbound-rtp'){
//       console.log(now)
//     }
//   }
// }
