import '@testing-library/cypress/add-commands'
// require('cypress-grep')();

Cypress.Commands.add('fcpawsCreateBasicAccount', (token, account_name) => {
    cy.fixture('fcp-aws-basic-account.json').then((body) => {
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
    
    
Cypress.Commands.add('getAccountByPrefix', (token, prefix) => {
    cy.request({
        method: 'GET',
        url: `/account?cloud-provider=aws&prefix=${prefix}`,
        headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
        }
    }).then((response) => {
        const account_name = response.body.accountName;
        return account_name;
    })
})

Cypress.Commands.add('createVPC', (token, account_id, network_name) => {
    cy.fixture('fcp-aws-network-creation.json').then((body) => {
        body.accountId = account_id;
        body.networkData.cloudNetworkName = network_name;

        cy.request({
            method: 'POST',
            url: `/network/aws/url`,
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

Cypress.Commands.add('Delete Network', (token, account_id, network_name, request_id, vpc_id) => {

    cy.fixture('fcp-aws-network-deletion.json').then((body) => {
        body['virtual-network-name'] = network_name;
        body['request-id'] = request_id;
        body['virtual-network-id'] = vpc_id;
        

        cy.request({
            method: 'POST',
            url: `/network?cloud-provider=aws&account-id=${account_id}`,
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

Cypress.Commands.add('deleteFCPAWSAccount', (token, account_id) => {
    cy.request({
        method: 'DELETE',
        url: `/account?cloud-provider=aws&account-id=${account_id}`,
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

