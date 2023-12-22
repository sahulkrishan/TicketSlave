describe('Authentication Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })
  const adminUser = "admin@example.com";
  const user = "user@example.com";
  const unverifiedUser = "unverified@example.com";
  const lockedUser = "locked@example.com";
  const unknownUser = "unknown@example.com";
  const password = "TestPassword123!"

  it('login - attempt unknown email', function () {
    login(unknownUser, password)

    // UI should reflect this user being logged in
    cy.get('div').should('contain', 'E-mailadres niet bekend')
    cy.get('div').should('contain', 'Het ingevoerde e-mailadres is niet bekend.')
  })
  it('login - attempt wrong password', function () {
    login(user, "wrongpassword")

    // UI should reflect this user being logged in
    cy.get('div').should('contain', 'Wachtwoord onjuist')
    cy.get('div').should('contain', 'Het ingevoerde wachtwoord is onjuist.')
  })

  it('login - attempt admin', function () {
    login(adminUser, password)

    // UI should reflect this user being logged in
    cy.get('div').should('contain', 'Ingelogd')
    cy.get('div').should('contain', 'Je wordt over enkele ogenblikken doorgestuurd.')
  })

  it('login - attempt unverified user', function () {
    login(unverifiedUser, password)

    // UI should reflect this user being logged in
    cy.get('div').should('contain', "Account niet geactiveerd")
    cy.get('div').should('contain', "Uw account is nog niet geactiveerd. Controleer uw e-mail voor de activatielink.")
  })

  it('login - attempt locked user', function () {
    login(lockedUser, password)

    // UI should reflect this user being logged in
    cy.get('div').should('contain', "Account geblokkeerd")
    cy.get('div').should('contain', "Uw account is geblokkeerd. Wacht een paar minuten of neem contact op met de beheerder.")
  })

  it('login - show password', function () {
    // Attempt login
    login(lockedUser, password)

    // Check if password field exists
    cy.get('input[name=password]').should('exist');

    // Check if the password input field is hidden
    cy.get('input[name=password]').should('have.attr', 'type', 'password');

    // Unhide password
    cy.contains('visibility_off').click()

    // Check if the password input field is visible
    cy.get('input[name=password]').should('have.attr', 'type', 'text');

    // Hide password
    cy.contains('visibility').click()

    // Check if the password input field is hidden
    cy.get('input[name=password]').should('have.attr', 'type', 'password');
  })


  it('register - attempt existing email', function () {
    navigateRegister()
    cy.get('input[formcontrolname=firstName]').type("Firstname" ,{force: true})
    cy.get('input[formcontrolname=lastName]').type("Lastname",{force: true})
    cy.get('input[formcontrolname=email]').type(user,{force: true})
    cy.get('input[formcontrolname=password]').type(password,{force: true})
    cy.get('input[formcontrolname=confirmPassword]').type(password,{force: true})
    cy.get('mat-checkbox[formControlName=acceptedTerms').find('input').check();
    cy.get('button[type=submit]').click()
  })

  it('register - attempt empty', function () {
    navigateRegister()
    cy.get('input[formcontrolname=firstName]').click({force: true})
    cy.get('input[formcontrolname=lastName]').click({force: true})
    cy.get('input[formcontrolname=email]').click({force: true})
    cy.get('input[formcontrolname=password]').click({force: true})
    cy.get('input[formcontrolname=confirmPassword]').click({force: true})
    cy.get('body').click()
    cy.get('mat-error').should('contain', "Voornaam is vereist")
    cy.get('mat-error').should('contain', "Achternaam is vereist")
    cy.get('mat-error').should('contain', "E-mailadres is vereist")
    cy.get('mat-error').should('contain', "Wachtwoord is vereist")
    cy.get('mat-error').should('contain', "Wachtwoord herhalen is vereist")
    cy.get('button[type=submit]').should('be.disabled')
  })

  function navigateRegister() {
    cy.visit('/')
    cy.contains('Nog geen account?').click()
    cy.get('div').should('contain', "Registreren")
    cy.get('div').should('contain', "Word vandaag nog lid en profiteer van alle voordelen die TicketSlave te bieden heeft!")
  }

  function login(user: string, password: string) {
    cy.visit('/')
    cy.get('input[name=email]').type(user)
    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`)
  }
})
