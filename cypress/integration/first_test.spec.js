describe('Visit website', () => {
    it('contains the correct website', () => {
        cy.visit('https://www.google.com');
    });
});