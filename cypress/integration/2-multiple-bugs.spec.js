describe('Draw bugs and delete them', () => {

    it('Visits The Debugger web app', () => {
        cy.visit('localhost:5000')
    });

    it('Draws bugs', () => {

        cy.get('[data-game]')
            .trigger('mousedown', { clientX: 50, clientY: 100 })
            .trigger('mousemove', { clientX: 100, clientY: 150 })
            .trigger('mouseup', { clientX: 100, clientY: 150 })
            .get('div.bug').should('have.length', 1);

        cy.get('[data-game]')
            .trigger('mousedown', { clientX: 200, clientY: 200 })
            .trigger('mousemove', { clientX: 280, clientY: 300 })
            .trigger('mouseup', { clientX: 280, clientY: 300 })
            .get('div.bug')
            .should('have.length', 2);

        cy.get('[data-game]')
            .trigger('mousedown', { clientX: 400, clientY: 500 })
            .trigger('mousemove', { clientX: 600, clientY: 570 })
            .trigger('mouseup', { clientX: 600, clientY: 570 })
            .get('div.bug')
            .should('have.length', 3);
    });

    it('Wait the end of animation to remove bugs', () => {
        cy.get('div.bug')
            .debug()
            .should('have.length', 3)
            .then(bugs => {
                cy.wrap(bugs[0]).dblclick();
                cy.wrap(bugs[1]).wait(1000).dblclick();

                cy.get('div.bug')
                    .should('have.length', 1);

                cy.wrap(bugs[2]).wait(3000).dblclick();

                cy.get('div.bug')
                    .should('have.length', 0);
            });        
    });
});