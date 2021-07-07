import React from 'react'
import ReactDOM from 'react-dom'
import { ReactDialog } from '../../src'

describe('render ReactDialog', () => {
  
  it('uses the provided background', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true, background: 'rgba(255,255,255,0.9)' }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        cy.get('.ReactDialogBackground').should('have.css', 'background-color', 'rgba(255, 255, 255, 0.9)')
      })
    })
  })
})
