import '@testing-library/cypress/add-commands'
// require('cypress-grep')();

Cypress.Commands.add('fcpazureCreateBasicAccount', (token, account_name) => {
    cy.fixture('fcp-azure-basic-account.json').then((body) => {
        body.accountData.accountTag = account_name;

        cy.request({
            method: 'POST',
            url: `/account/aws/url`,
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
            },
            body: body
          }).then((response) => {
            const request_id = response.body.requestId;
      
            return request_id;
        })
    })
})
    
Cypress.Commands.add('getAllStepFunction', (token, request_id) => {
    const stepStatus = []
    cy.request({
        method: 'GET',
        url: `/status?request-id=${request_id}`,
        headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
        }
    }).then((response) => {

        const arrayLength = response.body.length;

        for(let i=0; i<arrayLength; i++){
            const step_status = response.body[i].Step;
            stepStatus.push(step_status);
        }
        
        return stepStatus;
    })
})
    
    
Cypress.Commands.add('getAzureAccountByPrefix', (token, prefix) => {
    const accountName = []
    const accountId = []
    cy.request({
        method: 'GET',
        url: `/account?cloud-provider=azure&prefix=${prefix}`,
        headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
        }
    }).then((response) => {
        const arrayLength = response.body.length;

        for(let i=0; i<arrayLength; i++){
            const account = response.body[i]['account-name'];
            const accountid = response.body[i]['account-id'];
            accountName.push(account);
            accountId.push(accountid);
        }
        
        return accountName, accountId;
    })
})

Cypress.Commands.add('createVnet', (token, account_id, network_name) => {
    cy.fixture('fcp-azure-network-creation.json').then((body) => {
        body.subscriptionId = account_id;
        body.networkData.resourceGroupName = network_name;

        cy.request({
            method: 'POST',
            url: `/network/azure/url`,
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
            },
            body: body
          }).then((response) => {
            const request_id = response.body.requestId;
      
            return request_id;
        })
    })
})



Cypress.Commands.add('deleteVnet', (token, account_id, network_name, request_id) => {

    cy.fixture('fcp-azure-network-deletion.json').then((body) => {
        body['request-id'] = request_id;

        cy.request({
            method: 'POST',
            url: `/network?cloud-provider=azure&account-id=${account_id}`,
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
            },
            body: body
          }).then((response) => {
            const request_id = response.body.requestId;
      
            return request_id;
        })
    })
})

Cypress.Commands.add('deleteFCPAzureAccount', (token, account_id) => {
    cy.request({
        method: 'DELETE',
        url: `/account/azure/url?subscription-id=${account_id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
        },
        body: {
            "dry-run": false
        }
    }).then((response) => {
        const delete_request_id = response.body.requestId;
        return delete_request_id;
    })
})

Cypress.Commands.add('isStepIncluded', (stepFunctions, step) => {
    try {
      expect(stepFunctions).to.include(step);
      return true;
    } catch (error) {
      return false;
    }
  });

