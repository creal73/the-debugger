describe('Draw a bug and delete it', () => {

    it('Visits The Debugger web app', () => {
        cy.visit('localhost:5000')
    });

    it('Draws a bug', () => {

        cy.get('[data-game]')
            .trigger('mousedown', { clientX: 50, clientY: 100 })
            .trigger('mousemove', { clientX: 200, clientY: 300 })
            .trigger('mouseup', { clientX: 200, clientY: 300 })
            .get('div.bug').should('have.length', 1);
    });

    it('Double click on the bug', () => {
        cy.get('div.bug')
            .dblclick();

        cy.get('div.bug')
            .should('have.length', 0);
    });
});