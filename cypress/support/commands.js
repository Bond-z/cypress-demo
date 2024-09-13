// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands'
// require('cypress-grep')();

// cypress/support/commands.js




Cypress.Commands.add('getAuthToken', () => {
  const username = Cypress.env('USERNAME');
  const password = Cypress.env('PASSWORD');
  const host = Cypress.env('HOST');
  cy.request({
    method:'POST',
    url: '/login',
    headers:{
      'Content-Type': 'application/json',
      'host': host
    },
    body:
      {
        "username": `${username}`,  // Replacing with template literal
        "password": `${password}`
    }
  }).then((response) => {
      
    // Ensure the request was successful
    expect(response.status).to.eq(200);

    // Extract the token from the response
    const token = response.body.token; // Adjust based on the actual response structure

    // Return the token for further use
    return token, username;

  }); 
});

Cypress.Commands.add('getAccountId', (token, requestID) => {
  const accountIds = []
  cy.request({
    method: 'GET',
    url: `/status?request-id=${requestID}`,
    headers:{
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
}
  }).then((response) => {
    response.body.forEach((item) => {
      if(item.Details && item.Details.AccountId){
        accountIds.push(item.Details.AccountId);
        console.log(`${item.Details.AccountId}`)
      }else {
        console.log('AccountID key is missing for one object');
      }
    })
    console.log(accountIds[1]);
        const fcp_accountid = accountIds[0];
        console.log(fcp_accountid);
        return fcp_accountid;
  })
})

Cypress.Commands.add('getWithRetry', (token, request_id, step, retries = 3, delay = 3000) => {
  const attempt = (retries) => {
    cy.request({
        method: 'GET',
        url: `/status?request-id=${request_id}`,
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
        }
    }).then((response) => {
      // Check if the condition is met
      const arrayLength = response.body.length;

      for(let i=0; i<arrayLength; i++){
        console.log(response.body[i]);
        const step_status = response.body[i].Step;
        
        if (step_status === step) {
          console.log(step_status)
          return cy.wrap(step_status);
        } else if (retries > 0) {
          cy.wait(delay);
          attempt(retries - 1 );
        } else {
          console.log('The step status does not exist');
          break;
          // throw new Error('Expected condition not met after maximum retries');
        }
      }
      
    });
  };

  return attempt(retries);
});

Cypress.Commands.add('generateRandomTwoDigitNumber', () => {
  const randomNumber = Math.floor(Math.random() * 90) + 10;
  return cy.wrap(randomNumber);
});


  