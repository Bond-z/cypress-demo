import yaml from 'yaml';
require('cypress-grep')();

describe('Create account and verify status', ()=> {
  let account_name;
  let requestId_account_creation;
  let requestId_network_creation;
  let fcpaws_account_id;
  let delete_network_requestId;
  let delete_account_requestId;
  
  // 01-Create FCP AWS Account
  it('Create FCP AWS Basic Account',{ tags: ['@smoke', '@account_creation']}, () => {
    cy.generateRandomTwoDigitNumber().then((number) => {
      account_name = `delwfcp${number}`;
      cy.log(account_name);

      cy.getAuthToken().then((token) => {
        cy.fcpawsCreateBasicAccount(token, account_name).then((request_id) => {
          expect(request_id).to.not.be.empty;
          console.log(request_id);
          requestId_account_creation = request_id;
        })
      })
    })
  })

  // 02-Check Step Status while waiting for account creating
  it('Verify Step Status is created successfully', { tags: ['@smoke', '@account_creation', '@status']}, ()=> {
    cy.getAuthToken().then((token) => {
      cy.fixture('fcpaws_steps_func.yaml').then((data) => {
        const fcpaws_steps = yaml.parse(data).fcpaws_steps;
        fcpaws_steps.forEach((step) => {
          cy.getWithRetry(token, fcp_aws_request_id, step).then((step_status) => {
          console.log(step_status)
          })
        })
      })
    })
      
  })

  // 03-Compare and validate step fucntions are completely matches
  it('Get all FCP AWS Step Status',{ tags: ['@smoke', '@account_creation', '@status']}, ()=> {
    // let stepFunctions = []
    cy.getAuthToken().then((token) => {
      cy.getAllStepFunction(token, requestId_account_creation).then((stepFunctions) => {
        console.log(`Here are the fcp aws account creation steps status: ${stepFunctions}`);
        cy.fixture('fcpaws_steps_func.yaml').then((data => {
          const fcpaws_steps = yaml.parse(data).fcpaws_steps;
          fcpaws_steps.forEach((step) => {
            expect(stepFunctions).to.include(step);
            console.log(`${step} is in ${stepFunctions}`);
          });
        }))
      })
    })
  })

  // 04-If the account is created successful, there should be returned an account id
  it('Get FCP AWS Account ID',{ tags: ['@smoke', '@account_creation', '@get_accountId', '@status']}, () => {
    cy.getAuthToken().then((token) => {
      cy.getAccountId(token, requestId_account_creation).then((accountid) => {
        expect(accountid).to.not.be.empty;
        fcpaws_account_id = accountid;
        console.log(fcpaws_account_id);
      })
    })
  })

  // 05-Using the account id from previous test case to create VPC
  it('Create VPC network', { tags: ['@smoke', '@create_network']}, () => {
    const vpc_name = `${account_name}a`;
    cy.getAuthToken().then((token) => {
      cy.createVPC(token, fcpaws_account_id, vpc_name).then((request_id) => {
        expect(request_id).to.not.be.empty;
        requestId_network_creation = request_id;
        cy.log(requestId_network_creation);
      }) 
    })
  })

  // 06-Validate network creation step functions
  it('Verify network creation status', { tags: ['@smoke', '@create_network', '@network_status']}, () => {
    cy.getAuthToken().then((token) => {
      cy.getAllStepFunction(token, requestId_network_creation).then((stepFunctions) => {
        cy.fixture('fcpaws_network_step_func.yaml').then((data) => {
          const fcpaws_network_steps = yaml.parse(data).fcpaws_network_steps;
          fcpaws_network_steps.forEach((step) => {
            expect(stepFunctions).to.include(step);
            console.log(`${step} is in ${stepFunctions}`);
          })
        })
      })
    })
  })

  // 07-Delete all network after successful created
  it('Network Deletion', { tags: ['@smoke', '@network_deletion']}, () => {
    cy.getAuthToken().then((token) => {
      const vpc_id = getVPCID(token, requestId_network_creation);
      cy.deleteVPC(token, fcpaws_account_id, network_name, request_id, vpc_id).then((delete_request_id) => {
        expect(delete_request_id).to.not.be.empty;
        delete_network_requestId = delete_request_id;
        console.log(delete_network_requestId);
      })
    })
  })

  // 08-Verify network deletion steps
  it('Verify network deletion step', { tags: ['@smoke', '@network_deletion']}, () => {
    cy.getAuthToken().then((token) => {
      cy.fixture('fcpaws_network_deletion_steps_func.yaml').then((data) => {
        const fcpaws_steps = yaml.parse(data).fcpaws_steps;
        fcpazure_steps.forEach((step) => {
          cy.getWithRetry(token, delete_network_requestId, step).then((step_status) => {
          console.log(step_status)
          })
        })
      })
    })
  })

  // 09-Delete account
  it('Delete Fcp Aws Account',{ tags: ['@smoke', '@account_deletion']}, () => {
    cy.getAuthToken().then((token) => {
      cy.deleteFCPAWSAccount(token, fcpaws_account_id).then((delete_request_id) => {
        expect(delete_request_id).to.not.be.empty;
        delete_account_requestId = delete_request_id;
        console.log(delete_account_requestId);
      })
    })
  })

  // 10-Verify account deletion steps
  it('Verify account deletion step', { tags: ['@smoke', '@account_deletion']}, () => {
    cy.getAuthToken().then((token) => {
      cy.fixture('fcpaws_account_deletion_steps_func.yaml').then((data) => {
        const fcpaws_steps = yaml.parse(data).fcpaws_steps;
        fcpaws_steps.forEach((step) => {
          cy.getWithRetry(token, delete_account_requestId, step).then((step_status) => {
          console.log(step_status)
          })
        })
      })
    })
  })

  // 11-Verify the account deletion is successful deleted
  it('Get all FCP AWS Delete Step Status',{ tags: '@status'}, ()=> {
    let retry = 0
    let max_retries = 3
    let delay = 30000
    let textFound = false
    cy.getAuthToken().then((token) => {
      cy.fixture('fcpaws_delete_steps.yaml').then((data) => {
        const fcpaws_delete_steps = yaml.parse(data).fcpaws_delete_steps;
        fcpaws_delete_steps.forEach((step) => {
          for(retry; retry<max_retries; retry++){
            if(retry < max_retries && !textFound){
              cy.getAllStepFunction(token, delete_request_id).then((stepFunctions) => {
              
                const isIncluded = isStepIncluded(stepFunctions, step);
                if(isIncluded){
                  console.log(`${step} has been found in ${stepFunctions}`);
                  textFound = true;
                  
                }else{
                  console.log(`${step} Not Found`);
                  cy.wait(delay);
                  retry = retry+1;
                }
              })
            }else{
              console.log(`${step} is Found`);
            }
            break;
          }
        })
      
      })
    })
  })



})


function isStepIncluded(stepFunctions, step) {
  try {
      expect(stepFunctions).to.include(step);
      return true;
  } catch (error) {
      return false;
  }
}

