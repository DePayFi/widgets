import React from 'react'
import ReactDOM from 'react-dom'
import { ReactDialog } from '../../src'

describe('render ReactDialog', () => {
  
  it('attaches a dialog to the given container and opens the dialog', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        expect(
          document.querySelector('h1').innerHTML
        ).to.equal('I am a dialog!')
      })
    })
  })

  it('renders only 1 dialog at a time (removes the previous one)', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true }, React.createElement('h1', {}, 'I am another dialog!')),
          document.getElementById('app')
        );

        cy.get('.ReactDialog').its('length').should('eq', 1);

        expect(
          document.querySelector('h1').innerHTML
        ).to.equal('I am another dialog!')
      })
    })
  })

  it('injects styles into the dialog to animate opening', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        )

        cy.get('.ReactDialog style').its('length').should('eq', 1)
      })
    })
  })
})
