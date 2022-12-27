import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { getProvider } from '@depay/web3-client'

describe('Payment Widget: set providers', () => {

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
            receiver: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
          }]
        })

        cy.wait(200).then(async()=>{
          let provider

          provider = await getProvider('ethereum')
          expect(provider.connection.url).to.equal('http://localhost:8545')

          provider = await getProvider('bsc')
          expect(provider.connection.url).to.equal('http://localhost:8545')
        })
      })
    })
  })
})
