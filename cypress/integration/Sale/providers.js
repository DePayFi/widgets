import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { provider } from 'depay-web3-client'

describe('sets RPC providers for Sale widget', () => {

  it('allows to set RPC providers to use', ()=> {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ document,
          
          providers: {
            ethereum: ['http://localhost:8545'],
            bsc: ['http://localhost:8545']
          },

          amount: {
            start: 20,
            min: 1,
            step: 1
          },
          token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          blockchains: ['ethereum']
        })

        cy.wait(200).then(()=>{
          expect(provider('ethereum').connection.url).to.equal('http://localhost:8545')
          expect(provider('bsc').connection.url).to.equal('http://localhost:8545')
        })
      })
    })
  })
})
