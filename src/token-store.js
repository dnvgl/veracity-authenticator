import os from "os";
import keytar from "keytar";

const keytarService = "dnv-license-manager-openid-oauth";
const keytarAccount = os.userInfo().username;

export function getRefreshToken() {
  return keytar.getPassword(keytarService, keytarAccount);
}
export function setRefreshToken(refreshToken) {
  keytar.setPassword(keytarService, keytarAccount, refreshToken);
}
export function deleteRefreshToken() {
  keytar.deletePassword(keytarService, keytarAccount);
}
