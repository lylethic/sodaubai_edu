// describe('navigation tests', () => {
// 	it('passes', () => {
// 		cy.visit('/');
// 	});
// });

describe('Login Flow', () => {
	it('logs in successfully', () => {
		cy.visit('/login');
		cy.get('input[name="email"]').type('phungminhtu11@gmail.com');
		cy.get('input[name="password"]').type('123123');
		cy.get('button[type="submit"]').click();
		cy.url().should('include', '/dashboard');
	});
});
