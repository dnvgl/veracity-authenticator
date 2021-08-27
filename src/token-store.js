import os from "os";
import keytar from "keytar";
import { app } from "electron";

const refreshTokenKey =
  app.commandLine.getSwitchValue("refreshToken") ||
  "dnv-veracity-authenticator-refreshToken";
const accessTokenKey =
  app.commandLine.getSwitchValue("accessToken") ||
  "dnv-veracity-authenticator-accessToken";
const keytarAccount = os.userInfo().username;

export function getRefreshToken() {
  return keytar.getPassword(refreshTokenKey, keytarAccount);
}
export function setRefreshToken(refreshToken) {
  keytar.setPassword(refreshTokenKey, keytarAccount, refreshToken);
}
export function deleteRefreshToken() {
  keytar.deletePassword(refreshTokenKey, keytarAccount);
}
export function setAccessToken(token) {
  keytar.setPassword(accessTokenKey, keytarAccount, token);
}
