'use strict';

var addonManifest = require('../addon_manifest.json');


module.exports = {
  heroku: {
    sso_salt: process.env.HEROKU_SSO || addonManifest.api.sso_salt,
    legacy_salt: process.env.LEGACY_SSO || addonManifest.api.sso_salt,
    id: process.env.HEROKU_ID || addonManifest.id,
    password: process.env.HEROKU_PASSWORD || addonManifest.api.password
  }
};

