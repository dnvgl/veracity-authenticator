const url = require("url");
const querystring = require("querystring");
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");
const { app, net } = require("electron");
const {
  getRefreshToken,
  setRefreshToken,
  deleteRefreshToken,
  setAccessToken,
} = require("./token-store");

//--clientId=gurbagurba --scope=moregurba

const authDomain =
  "login.veracity.com/te/dnvglb2cprod.onmicrosoft.com/b2c_1a_signinwithadfsidp/oauth2/v2.0";
const clientId =
  app.commandLine.getSwitchValue("clientId") ||
  "44a7ad55-45bd-4e04-b1c0-5bf0aef40ea4";
const scope =
  app.commandLine.getSwitchValue("scope") ||
  "https://dnvglb2cprod.onmicrosoft.com/83054ebf-1d7b-43f5-82ad-b2bde84d7b75/user_impersonation";

const code_verifier = randomstring.generate(128);
const base64Digest = crypto
  .createHash("sha256")
  .update(code_verifier)
  .digest("base64");
const code_challenge = base64url.fromBase64(base64Digest);

const redirectUri = "http://localhost/callback";

let accessToken = "Unauthorized";
let refreshToken = null;

function getAccessToken() {
  return accessToken;
}

//https://login.veracity.com/te/dnvglb2cprod.onmicrosoft.com/b2c_1a_signinwithadfsidp/oauth2/v2.0/authorize?client_id=b480340b-31f0-4179-b5fc-b5fcdf0a511e&response_type=code&scope=offline_access https://dnvglb2cprod.onmicrosoft.com/28b7ec7b-db04-40bb-a042-b7ac5a8b36be/user_impersonation&redirect_uri=https://ecosystem-dev.dnvgl.com/session/auth-callback/veracity

function getAuthenticationURL() {
  return (
    "https://" +
    authDomain +
    "/authorize" +
    `?scope=offline_access ${scope}` +
    "&response_type=code" +
    "&client_id=" +
    clientId +
    "&redirect_uri=" +
    redirectUri +
    "&code_challenge=" +
    code_challenge +
    "&code_challenge_method=S256"
  );
}

async function refreshTokens() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    const refreshOptions = {
      method: "POST",
      url: `https://${authDomain}/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: querystring.stringify({
        grant_type: "refresh_token",
        client_id: clientId,
        //client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    };

    try {
      const requestApi = {
        method: refreshOptions.method,
        headers: refreshOptions.headers,
        url: refreshOptions.url,
      };

      const request = net.request(requestApi);

      const refreshRequestPromise = new Promise((resolve, reject) => {
        request.on("response", (response) => {
          if (response.statusCode !== 200) {
            reject(response.statusMessage);
            return;
          }

          let body = "";

          response.on("data", (chunk) => {
            body += chunk;
          });

          response.on("end", () => {
            const data = JSON.parse(body);
            accessToken = data.access_token;
            setAccessToken(accessToken);
            resolve();
          });
        });
      });

      request.end(refreshOptions.data);

      await refreshRequestPromise;
    } catch (error) {
      console.log(error);

      await logout();
      throw error;
    }
  } else {
    throw new Error("No available refresh token.");
  }
}

async function loadTokens(callbackURL) {
  const urlParts = url.parse(callbackURL, true);
  const query = urlParts.query;

  const exchangeOptions = {
    grant_type: "authorization_code",
    client_id: clientId,
    //client_secret: clientSecret,
    code: query.code,
    redirect_uri: redirectUri,
    code_verifier: code_verifier,
  };

  const options = {
    method: "POST",
    url: `https://${authDomain}/token`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: querystring.stringify(exchangeOptions),
  };

  try {
    const requestApi = {
      method: options.method,
      headers: options.headers,
      url: options.url,
    };

    const request = net.request(requestApi);

    const tokenRequestPromise = new Promise((resolve, reject) => {
      request.on("response", (response) => {
        if (response.statusCode !== 200) {
          reject(response.statusMessage);
          return;
        }

        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          const data = JSON.parse(body);

          accessToken = data.access_token;
          refreshToken = data.refresh_token;

          resolve();
        });
      });
    });

    request.end(options.data);

    await tokenRequestPromise;

    if (refreshToken) {
      await setRefreshToken(refreshToken);
    }

    if (accessToken) {
      await setAccessToken(accessToken);
    }

    console.log("authenticated");
  } catch (error) {
    console.error(error);

    await logout();

    throw error;
  }
}

async function logout() {
  await deleteRefreshToken();
  accessToken = "Unauthorized";
  refreshToken = null;
}

function getLogOutUrl() {
  return `https://${authDomain}/logout`;
}

module.exports = {
  getAccessToken,
  getAuthenticationURL,
  getLogOutUrl,
  loadTokens,
  logout,
  refreshTokens,
};
