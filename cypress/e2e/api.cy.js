// describe('test api', () => {
//   let auth
//   const accountIds = []
//   let requestID = "3c5a3ac1de234ab487d653db66694e19";

//   it('Get token', () => {
//     cy.request({
//       method:'POST',
//       url: '/login',
//       headers:{
//         'Content-Type': 'application/json',
//         'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'

//       },
//       body:
//         {
//           "username": username,
//           "password": password
//       }
//     }).then((response) => {
//         expect(response.status).to.eq(200);
//         auth = response.body.token;
//         expect(auth).to.not.be.empty;
//     })
//   })

//   it('Get Status', ()=> {
//     cy.request({
//       method:'GET',
//       url: `/status?request-id=${requestID}`,
//       headers:{
//         Authorization: `Bearer ${auth}`,
//         'Content-Type': 'application/json',
//         'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'

//       }
//     }).then((response) => {
//       response.body.forEach((item) => {
//         if(item.Details && item.Details.AccountId){
          
//           accountIds.push(item.Details.AccountId);
//           console.log(`${item.Details.AccountId}`)
//         }else {
//           console.log('AccountID key is missing for one object');
//         }
//       })
//       console.log(accountIds[1]);
//       const fcp_accountid = accountIds[0];
//       console.log(fcp_accountid);
//     })
//   })

  
// })



// describe('Account Creation End to End', () => {

//   let requestID = "3c5a3ac1de234ab487d653db66694e19";

//   it('Get account creation status', () => {
//     // Use the custom command to get the token
//     cy.getAuthToken().then((token) => {
//       // Use the token in the Authorization header to make a GET request
//       cy.request({
//         method: 'GET',
//         url: `/status?request-id=${requestID}`, // Replace with your actual GET endpoint
//         headers:{
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//               'host': 'kszbmz0hj0.execute-api.eu-central-1.amazonaws.com'
//         }
//       }).then((response) => {
//         response.body.forEach((item) => {
//           if(item.Details && item.Details.AccountId){
//             accountIds.push(item.Details.AccountId);
//             console.log(`${item.Details.AccountId}`)
//           }else {
//             console.log('AccountID key is missing for one object');
//           }
//         })
//         console.log(accountIds[1]);
//         const fcp_accountid = accountIds[0];
//         console.log(fcp_accountid);
//       });
//     });
//   });
// });

describe('test custom keywords', () => {
  let requestID = "3c5a3ac1de234ab487d653db66694e19";

  it('Get token and request status', () => {
    cy.getAuthToken().then((token) => {
      cy.getAccountId(token, requestID).then((fcp_accountid) => {
        expect(fcp_accountid).to.not.be.empty;
        console.log(fcp_accountid);
      })
    })
  })
})


