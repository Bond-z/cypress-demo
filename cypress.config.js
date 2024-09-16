const cypress = require("cypress");
const { defineConfig } = require("cypress");
// import registerCypressGrep from '@cypress/grep/src/support';       //Use import in .js  when the project is configured as an ES module ("type": "module" in package.json).
// const registerCypressGrep = require('@cypress/grep/src/support');    //Use require in .cjs files.
// const registerCypressGrep = require('cypress-grep/src/support');
const cypressGrep = require('cypress-grep/src/plugin');

// @type {Cypress.PluginConfig}

// const grep = require('cypress-grep');

module.exports = defineConfig({
  projectId: '1ueihg',
  e2e: {
    // env: {
    //   username: process.env.USERNAME || 'default-username',
    //   password: process.env.PASSWORD || 'default-password'
    // },
    baseUrl: 'https://example.cypress.io',
    setupNodeEvents(on, config) {
    //   // implement node event listeners here
    //   require('@cypress/grep/src/plugin')(config);
    //   return config;
      cypressGrep(on, config);    // Add this line to set up cypress-grep
      return config;
    }
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
});


