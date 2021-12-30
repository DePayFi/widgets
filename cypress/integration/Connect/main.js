import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, resetMocks } from '@depay/web3-mock'

describe('Connect wallet', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)
  afterEach(closeWidget)

  it('directly resolves if a wallet is already connected', () => {
    cy.document().then(async (document)=>{
      let accountsReturned, accountReturned, walletReturned
      mock({ blockchain, wallet: 'metamask', accounts: { return: accounts } })
      DePayWidgets.Connect({ document }).then(({ accounts, account, wallet })=>{
        accountsReturned = accounts
        accountReturned = account
        walletReturned = wallet
      }).catch(()=>{})
      cy.wait(1000).then(()=>{
        expect(accountsReturned).to.eq(accounts)
        expect(accountReturned).to.eq(accounts[0])
        expect(walletReturned.name).to.eq('MetaMask')
      })
    })
  })

  it('opens a dialog indicating connection is in progress when wallet connection has been initiated automatically and connection can be reinitalized by clicking connect', () => {
    cy.document().then(async (document)=>{
      let accountsReturned, accountReturned, walletReturned
      mock({ blockchain, wallet: 'metamask', accounts: { return: [] } }) // initialy no accounts connected
      DePayWidgets.Connect({ document }).then(({ accounts, account, wallet })=>{
        accountsReturned = accounts
        accountReturned = account
        walletReturned = wallet
      }).catch(()=>{})
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Connect Wallet')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('p', 'Access to your wallet is required. Please login and authorize access to your account to continue.')
      cy.wait(2000).then(()=>{
        mock({ blockchain, wallet: 'metamask', accounts: { return: accounts } }) // now connected
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary', 'Connect').should('not.exist')
        cy.wait(10000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Connect').click().then(()=>{
            expect(accountsReturned).to.eq(accounts)
            expect(accountReturned).to.eq(accounts[0])
            expect(walletReturned.name).to.eq('MetaMask')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Connect Wallet').should('not.exist')
          })
        })
      })
    })
  })

  it('opens wallet connect if widget was not able to autodetect any wallet', () => {
    cy.document().then(async (document)=>{
      let accountsReturned, accountReturned, walletReturned
      DePayWidgets.Connect({ document }).then(({ accounts, account, wallet })=>{
        accountsReturned = accounts
        accountReturned = account
        walletReturned = wallet
      }).catch(()=>{})
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]')
    })
  })

  it('rejects if user just closes the dialog', () => {
    cy.document().then(async (document)=>{
      let rejectionReason
      DePayWidgets.Connect({ document }).catch((error)=>{
        rejectionReason = error
      }).catch(()=>{})
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet')
      cy.wait(1000).then(()=>{
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click().then(()=>{
          cy.wait(1000).then(()=>{
            expect(rejectionReason).to.eq('USER_CLOSED_DIALOG')
          })
        })
      })
    })
  })

  it('allows you to return to the list of available wallets even if it autodetected one (and still suggests the autodetected one)', () => {
     cy.document().then(async (document)=>{
      let accountsReturned, accountReturned, walletReturned
      mock({ blockchain, wallet: 'metamask', accounts: { return: [] } }) // initialy no accounts connected
      DePayWidgets.Connect({ document }).then(({ accounts, account, wallet })=>{
        accountsReturned = accounts
        accountReturned = account
        walletReturned = wallet
      }).catch(()=>{})
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Connect Wallet')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('p', 'Access to your wallet is required. Please login and authorize access to your account to continue.')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Go back"]').click()
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect MetaMask"]').click()
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('button', 'Connect with another wallet').click()
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet')
    })
  })
})
