const assert = require("assert");
const { getLicenseFileDirectories } = require("../src/license-file");

describe("license-file", function() {
  describe("#getLicenseFileDirectory", function() {
    it("should return C:\\flexlm by default", function() {
      const licenseFileDirectories = getLicenseFileDirectories();
      assert.deepStrictEqual(licenseFileDirectories, [
        "c:\\flexlm",
        "c:\\programdata\\dnvgl\\license files",
      ]);
    });

    it("should return all the directories when supplied a key", function() {
      const licenseFileDirectories = getLicenseFileDirectories(
        "27000@localhost;C:\\flexlm2\\dnvs_any.lic;",
        ";"
      );
      assert.deepStrictEqual(licenseFileDirectories, [
        "c:\\flexlm2",
        "c:\\flexlm",
        "c:\\programdata\\dnvgl\\license files",
      ]);
    });

    it("should return all the directories when supplied a key", function() {
      const licenseFileDirectories = getLicenseFileDirectories(
        "27000@localhost;C:\\Program FilesDNVGL;C:\\flexlm3;C:\\flexlm2\\dnvs_any.lic;",
        ";"
      );
      assert.deepStrictEqual(licenseFileDirectories, [
        "c:\\flexlm3",
        "c:\\flexlm2",
        "c:\\flexlm",
        "c:\\programdata\\dnvgl\\license files",
      ]);
    });
  });
});
