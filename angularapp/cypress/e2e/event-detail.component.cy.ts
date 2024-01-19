// Maak een bestand aan in je Cypress-testmap, bijvoorbeeld eventDetail.spec.js

// Voorbeeld Cypress-test voor het controleren van EventDetailComponent

describe('Event Detail Page', () => {
  it('should display event details', () => {
    // Bezoek de pagina met de juiste URL waar de EventDetailComponent wordt weergegeven
    cy.visit('details/dc772706-1826-4768-94d3-8088f3a656d3'); // Verander de URL naar de werkelijke route voor het weergeven van evenementdetails

    // Controleer of de beschrijving van het evenement wordt weergegeven
    cy.contains('h3', 'Description').should('be.visible');
    cy.contains('p', 'Sample Description').should('be.visible'); // Verander 'Sample Description' naar de werkelijke beschrijving

    // Controleer of de plaats en datum van het evenement worden weergegeven
    cy.contains('h3', 'Place and Date').should('be.visible');
    // Voeg hier extra checks toe afhankelijk van wat er op de pagina wordt weergegeven

    // Controleer of de koopknop aanwezig is
    cy.get('button').contains('Buy now').should('be.visible');

    // Voer eventueel extra interacties uit, zoals het klikken op de koopknop en controleren van het gedrag
    // cy.get('button').contains('Buy now').click();
    // Voeg andere interacties toe en controleer hun resultaat indien nodig
  });
});
