import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { provider } from '@depay/web3-client'

describe('set RPC providers', () => {

  it('allows to set RPC providers to use', ()=> {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ document,
          
          providers: {
            ethereum: ['http://localhost:8545'],
            bsc: ['http://localhost:8545']
          },

          accept: [{
            blockchain: 'ethereum',
            amount: 20,
            token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            receiver: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
          }]
        })

        cy.wait(200).then(()=>{
          expect(provider('ethereum').connection.url).to.equal('http://localhost:8545')
          expect(provider('bsc').connection.url).to.equal('http://localhost:8545')
        })
      })
    })
  })
})
