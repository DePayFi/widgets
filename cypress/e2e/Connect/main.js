import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, resetMocks } from '@depay/web3-mock'

describe('Connect wallet', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)

  it('rejects if user just closes the dialog', () => {
    cy.document().then(async (document)=>{
      let rejectionReason
      DePayWidgets.Connect({ document }).catch((error)=>{
        rejectionReason = error
      }).catch(()=>{})
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Connect a wallet')
      cy.wait(1000).then(()=>{
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click().then(()=>{
          cy.wait(1000).then(()=>{
            expect(rejectionReason).to.eq('USER_CLOSED_DIALOG')
          })
        })
      })
    })
  })

  describe('detected wallets', ()=>{

    beforeEach(()=>{
      mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    })

    it('suggest detected wallets', () => {
      cy.document().then(async (document)=>{
        DePayWidgets.Connect({ document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Connect a wallet')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'detected').click()
      })
    })
  })

  describe('search for wallet', ()=>{

    it('allows to search for a wallet', () => {
      cy.document().then(async (document)=>{
        DePayWidgets.Connect({ document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Connect a wallet').then(()=>{
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Trust', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Trust Wallet')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'TrustVault')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Trustee Wallet')
            })
          })
        })
      })
    })
  })
})
