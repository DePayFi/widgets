import DePayWidgets from '../../dist/cjs/index.js'
import React from 'react'
import ReactDOM from 'react-dom'

describe('Payment', () => {

  let defaultArguments = {
    amount: '20',
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02',
  }
  
  it('renders and opens a styled Payment dialog in a shadow dom', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then(async (document)=> {

        await DePayWidgets.Payment({
          ...defaultArguments,
          document
        })
        
        cy.get('#test').get('.ReactShadowDOMOutsideContainer').should(element => {
          const [container] = element.get()
          expect(
            container.shadowRoot.querySelector('style').innerHTML
          ).to.contain('.DePayWidgetDialog')
        })
      })
    })
  })
})
