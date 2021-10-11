import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, resetMocks } from 'depay-web3-mock'
import { wallets } from 'depay-web3-wallets'

describe('WalletConnect Payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)

  it('allows to connect wallet via WalletConnect', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let connectedAccount, connectedWallet
        DePayWidgets.Connect({ document }).then(({ account, wallet })=>{
          connectedAccount = account
          connectedWallet = wallet
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: wallets.WalletConnect.connector
          })

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click().then(()=>{
            cy.wait(1000).then(()=>{
              expect(connectedAccount).to.equal(accounts[0])
              expect(connectedWallet.name).to.equal('WalletConnect')
            })
          })
        })
      })
    })
  })
})
