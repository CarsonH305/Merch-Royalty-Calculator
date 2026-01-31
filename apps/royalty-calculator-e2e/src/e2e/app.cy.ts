describe('Merch Royalty Calculator', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the calculator header', () => {
    cy.contains('Merch Royalty Calculator').should('be.visible');
    cy.contains('Calculate artist royalties, margins, and profitability').should('be.visible');
  });

  it('should have mode toggle (Merch Only / Artist Label)', () => {
    cy.contains('Merch Only').should('be.visible');
    cy.contains('Artist / Label').should('be.visible');
  });

  it('should show input fields', () => {
    cy.contains('Revenue & Costs').should('be.visible');
    cy.contains('Cost per unit (COGS)').should('be.visible');
    cy.contains('Markup %').should('be.visible');
  });

  it('should calculate when cost and markup are entered', () => {
    cy.get('input[type="number"]').first().clear().type('10');
    cy.get('input[type="number"]').eq(1).clear().type('50');
    cy.contains('1,500', { timeout: 5000 }).should('be.visible'); // 10 * 100 * 1.5 = 1500
  });

  it('should show Artist Royalty section when Artist/Label mode selected', () => {
    cy.contains('Artist / Label').click();
    cy.contains('Royalty').should('be.visible');
  });

  it('should have Save scenario and Export CSV buttons', () => {
    cy.contains('Save scenario').should('be.visible');
    cy.contains('Export CSV').should('be.visible');
  });
});
