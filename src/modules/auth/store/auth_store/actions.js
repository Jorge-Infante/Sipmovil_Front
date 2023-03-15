import { apiClientForm } from "@/api/softphone_api.js";
export const authUser = async ({ commit, rootState }) => {
  let ownerId = rootState.softphone_store.ownerId.toString();
  console.log("MY OWNER_ID ID: ", ownerId);
  let data = new FormData();
  data.append("owner_id", ownerId);
  const res = await apiClientForm.post("login_hubspot/", data);
  let user = res.data.value;
  console.log("All data request: ", user);
  console.log('hereeee');

  let userInfo = {
    Display: user.sipData.extension,
    Pass: user.sipData.password,
    Realm: user.asteriskServer.serverName,
    User: user.sipData.account,
    WSServer: `wss://${user.asteriskServer.serverName}:${user.asteriskServer.serverPort}/ws`,
    Token: user.token,
    User_id:user.userId
  };

  
  console.log("My user info: ", userInfo);
  commit("AUTH_USER_INFO", userInfo);
};
