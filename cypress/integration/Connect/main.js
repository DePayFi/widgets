import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, resetMocks } from 'depay-web3-mock'

describe('execute Payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

  it('opens a connect widget ', () => {
    cy.document().then(async (document)=>{
      let accountsReturned, accountReturned, walletReturned
      DePayWidgets.Connect({ document }).then(({ accounts, account, wallet })=>{
        accountsReturned = accounts
        accountReturned = account
        walletReturned = wallet
      })
      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet')
      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect MetaMask"]').click().then(()=>{
        expect(accountsReturned).to.eq(accounts)
        expect(accountReturned).to.eq(accounts[0])
        expect(walletReturned.name).to.eq('MetaMask')
      })
    })
  })
})
