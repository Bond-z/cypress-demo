// const cypress = require("cypress");
const { defineConfig } = require('cypress');
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

      cypressGrep(on, config);    // Add this line to set up cypress-grep
      return config;
    },
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
});


