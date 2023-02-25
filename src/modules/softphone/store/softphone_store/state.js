export default () => ({
  userInCall: false,
  callNumber: "",
  callInProgress: false,
  callDuration: 0,
  callTimer: null,
  callInfo: { status: "", label: "", info: "" },
  userInfo: {
    name: "Usuario Pbx",
    avatar: "/static/images/male.png",
    extension: "???",
  },
  seconduserInfo: {
    name: "Usuario Pbx",
    avatar: "/static/images/male.png",
    extension: "???",
  },
  callDirection: "",
  phoneSmall: false,
  showPhone: false,
  pjsipAccount: "",
  phoneStatus: "UNREGISTERED",
  isMuted: false,
  isHold: false,
  keyboardActive: true,
  showCallButton: true,
  showHangupButton: false,
  currentCallSession: false,
  callEvents: [],
  // call actions states
  disableInput: false,
  disableCallAnswer: false,
  disableCallHangUp: false,
  // Tranfer conference
  warnTransfer: false,
  isTransferInvited: false,
  transferCallId: "",
  transferType: "",
  // Conference parameters
  userInConference: false,
  conferenceMembers: [],
  userConferenceRole: "",
  showConferenceOptions: false,
  conferenceId: "",
  conferenceStarted: null,
  conferenceRecordDuration: 0,
  recordConference: false,
  recordTimer: null,
  conferenceCallInfo: { status: "", label: "", info: "" },
  conferenceCallDuration: 0,
  isAddingMember: false,
  extensionAdded: "",
  invitationData: null,
  targetConferenceEndpoint: "",

  // states for ContactBrowser Component
  showBrowser: false,
  browserTitle: "",
  browserContacts: [],
  choosenNumber: "",
  browserAction: "",
  pjsipContacts: [],

  // states for snackbar notification
  snackbarMessage: "",
  showSnackbar: false,

  // state for mobile UI
  isMobileDevice: false,

  // states for call status
  showCallStatistics: false,
  inCallPeers: [],
  peerConnection: null,
  localIp: "",
  RTCStatisticTimer: null,
  localDescription: null,
  remoteDescription: null,
  callQuality: -1,
  ownerId:''
});
