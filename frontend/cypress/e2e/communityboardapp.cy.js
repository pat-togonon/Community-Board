/* global Cypress, cy */

const backendUrl = Cypress.env('BASEURL_BACKEND')
const baseUrl = Cypress.env('BASEURL_FRONTEND')

before(function() {
  cy.request('POST', `${backendUrl}/tests/reset`)
  cy.request('POST', `${backendUrl}/communities`, {
    username: "testCypressAdmin",
    email: "pat.togonon@gmail.com",
    password: "teST1714PW",
    communityName: "Test Community",
    communityDescription: "Community for Cypress E2E Tests",
    chosenSecurityQuestion: "in-what-city-were-you-born",
    securityAnswer: "Test City",
    birthYear: "1994"
  })
})

describe('Community Board App', function() {

  beforeEach(function() {
    cy.visit(baseUrl)
  
  })

  it('homepage can be opened', function() {
    cy.contains('Connect with your local community')
  })
  
  it('login form can be opened', function() {
    cy.contains('Login').click()
  })

  it('user can log in', function() {
    cy.contains('Login').click()
    cy.get('#localCommunity').select('Test Community')
    cy.get('#loginUsername').type('testCypressAdmin')
    cy.get('#loginPassword').type('teST1714PW')
    cy.get('#login-button').click()

    cy.contains('Welcome back testCypressAdmin!')
  })

  describe('when user is logged in', function() {
    beforeEach(function() {
      cy.contains('Login').click()
      cy.get('#localCommunity').select('Test Community')
      cy.get('#loginUsername').type('testCypressAdmin')
      cy.get('#loginPassword').type('teST1714PW')
      cy.get('#login-button').click()
      cy.contains('Welcome back').should('exist')
      cy.window().its('store').invoke('getState').then((state) => {
        expect(state.user.accessToken).to.exist
      })
      cy.window().its('store').invoke('getState').then((state) => {
        expect(state.user.id).to.exist
      })
    })

    it('user can create new posts', function() {
      cy.get('#mainCategory').select('Announcement')
      cy.get('#new-post-button').click()
      cy.get('#subCategory').select('Health and Social Services')
      cy.get('#new-post-title').type("Free dental cleaning on 22 June")
      cy.get('#new-post-description').type("Hi everyone! We'll conduct a free dental cleaning for all who are interested. Come visit our public dental clinic at 12 Test St on Saturday, from 7 am to 3pm. See you there!")
      cy.get('#new-post-submit-button').click()

      cy.contains("Free dental cleaning on 22 June")
      cy.contains("Posted successfully!")
    })
      
    describe('when there is an existing post', function() {
      it('user can view posts', function() {        
        cy.contains('Free dental cleaning on 22 June').click()
        cy.contains("Hi everyone! We'll conduct a free dental cleaning for all")
      })

      beforeEach(function() {
        cy.contains('Free dental cleaning on 22 June').click()
      })

        it('user can edit their own post', function() {
          cy.get('#edit-post-button').click()
          cy.get('#post-edit-textarea').type("EDITED VERSION")
          cy.get('#post-update-submit').click()
          cy.contains("Post updated successfully!").should('exist')

        })

        it('user can comment on post', function() {
          cy.get('#comment-textarea').type("First comment yay!")
          cy.get('#add-comment-button').click()
          cy.contains('First comment yay!').should('exist')

        })

        it('user can add post to favorites', function() {
          cy.get('#add-favorite-icon').click()
          cy.contains('Added to your favorites!').should('exist')
        })

        it('user can see their posts, comments and favorites on their profile', function() {
          cy.visit(`${baseUrl}/user/profile`)
          cy.contains("Hi everyone! We'll conduct a free dental cleaning for all")
          cy.visit(`${baseUrl}/user/profile/comments`)
          cy.contains("First comment yay!")
          cy.visit(`${baseUrl}/user/profile/favorites`)
          cy.contains("Hi everyone! We'll conduct a free dental cleaning for all")
        })

        it('user can edit their own comments', function() {
          cy.visit(baseUrl)
          cy.contains('Free dental cleaning on 22 June').click()
          cy.contains("First comment yay!")
          cy.get('#edit-comment-button').click()
          cy.get('#edit-comment-textarea').type(' EDIT COMMENT VER')
          cy.get('#save-edited-comment-button').click()
          cy.contains('EDIT COMMENT VER').should('exist')
        })

        it('user can delete their own comments', function() {
          cy.get('#delete-comment-button').click()
          cy.get('#confirm-comment-delete-button').click()
          cy.contains('First comment yay!').should('not.exist')
        })

        it('user can remove their favorite post', function() {
          cy.get('#remove-favorite-icon').click()
          cy.contains('Removed from your favorites!').should('exist')
        })

        it('user can delete their own posts', function() {
          cy.get('#delete-post-button').click()
          cy.get('#delete-post-submit-button').click()
          cy.contains('Post is successfully deleted!').should('exist')
        })
    })

    it('users can log out', function() {
      cy.contains('Logout').click()
      cy.url().should('eq', `${baseUrl}/`)

    })

    describe('when user updates their profile details and password', function() {
      beforeEach(function() {
        cy.visit(`${baseUrl}/user/settings`)
        cy.contains('name').should('exist')
      })

      it('user can add their name', function() {
      
        cy.get('#add-name-field').type('Tricia Test')
        cy.get('#add-name-save-button').click()
        cy.contains('Tricia Test').should('exist')  

        cy.contains("Updated your name successfully!").should('exist')
      })
      
      it('user can update their password', function() {
        cy.get('#update-password').click()
        cy.get('#update-password-old').type('teST1714PW')
        cy.get('#update-password-new').type('NeWpAssWorD')
        cy.get('#update-password-save-button').click()
        cy.url().should('eq', `${baseUrl}/`)
      })

    })
  })

  describe('When user forgots their password', function() {
    
    it('user can reset their password', function() {
      cy.visit(`${baseUrl}/password-reset`)
      cy.get('#username-pw-reset').type('testCypressAdmin')
      cy.get('#password-pw-reset').type('NeWpAssWorD')
      cy.get('#securityQuestion').select('in-what-city-were-you-born')
      cy.get('#securityAnswer').type('Test City')
      cy.get('#pw-reset-button').click()
      cy.contains("You've reset your password successfully.").should('exist')
    })
  })

  describe('when there are multiple users', function() {
    it('new users can sign up', function() {
      // sign up
      cy.visit(`${baseUrl}/signup`)
      cy.get('#localCommunity').select('Test Community')
      cy.get('#username-for-signup').type('testUser2')
      cy.get('#email-for-signup').type('togonon.pat@gmail.com')
      cy.get('#password-for-signup').type('pAssForUSer2')
      cy.get('#birthYear').type('1994')
      cy.get('#security-question').select('in-what-city-were-you-born')
      cy.get('#security-answer').type('Test City')
      cy.get('#signup-button').click()
      cy.contains("You've signed up successfully. Log in to continue.").should('exist')
      cy.url().should('eq', `${baseUrl}/login`)
    })

    it('users - non-admin - can delete their own account', function() {
      cy.visit(`${baseUrl}/login`)
      cy.get('#localCommunity').select('Test Community')
      cy.get('#loginUsername').type('testUser2')
      cy.get('#loginPassword').type('pAssForUSer2')
      cy.get('#login-button').click()
      cy.contains('Welcome back testUser2!').should('exist')
      cy.visit(`${baseUrl}/user/settings`)
      cy.contains('testUser2').should('exist')
      cy.get('#delete-account').click()
      cy.get('#username-for-account-deletion').type('testUser2')
      cy.get('#delete-account-submit-button').click()
      cy.url().should('eq', `${baseUrl}/`)
    })
  })
})

after(function() {
  cy.request('POST', `${backendUrl}/tests/reset`)
})