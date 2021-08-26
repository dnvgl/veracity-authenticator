const path = require("path");

function getLicenseFileDirectories(envVariable) {
  let result = [];

  if (envVariable) {
    const dirs = envVariable.split(";");
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      if (dir.indexOf("@") === -1 && dir.indexOf("Program Files") === -1) {
        result.push(!path.extname(dir) ? dir : path.win32.dirname(dir));
      }
    }
  }

  result = result.map((r) => r.toLowerCase());

  if (!result.includes("c:\\flexlm")) {
    result.push("c:\\flexlm");
  }

  if (!result.includes("c:\\programdata\\dnvgl\\license files")) {
    result.push("c:\\programdata\\dnvgl\\license files");
  }

  console.log("license file locations:");
  console.log(result);

  return result.filter((r) => r.length);
}

module.exports = { getLicenseFileDirectories };
