import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { provider } from '@depay/web3-client'

describe('sets RPC providers for Donation widget', () => {

  it('allows to set RPC providers to use', ()=> {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({ document,
          
          providers: {
            ethereum: ['http://localhost:8545'],
            bsc: ['http://localhost:8545']
          },

          accept:[{
            blockchain: 'ethereum',
            token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
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
