require('cypress-grep')();     //Use this one
// import 'cypress-grep';      //this one will run all test spec

describe('Store url in env variable', () => {
  beforeEach( () => {
    cy.visit('/')
  })

  it('Verify web page is correct',{ tags: "@test"}, () => {
    cy.findByText('Kitchen Sink')
  })

  it('trigger drop down and click on action', () => {
    cy.get('.dropdown-toggle').click()
    cy.get('.dropdown-menu').findByText('Actions').click()
    cy.get('.action-email').type('abc@email.com')
    cy.get('.action-email').should('have.value', 'abc@email.com')
  })

  it('Verify text is shown correctly', { tags: ['@smoke']}, ()=> {
    cy.get('.dropdown-toggle').click()
    cy.get('.dropdown-menu').findByText('Connectors').click()
    cy.get('.container').invoke('text').then((text)=>{
      cy.log(text)
      expect(text).to.contain('Connectors')
    })
    // cy.get('.container.h1').should('have.text', 'Connectors')
  })
})

// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io/commands/actions')
//     cy.get('.action-email').type('abc@email.com')
//     cy.get('.action-email').should('have.value', 'abc@email.com')
//   })
// })



// describe('Visit website', () => {
//   it('contains the correct website', () => {
//       cy.visit('https://www.google.com');
//   });
// });