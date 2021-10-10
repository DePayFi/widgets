import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { mock, confirm, increaseBlock, resetMocks, anything } from 'depay-web3-mock'
import { resetCache, provider } from 'depay-web3-client'
import { routers, plugins } from 'depay-web3-payments'
import { Token } from 'depay-web3-tokens'

describe('having no wallet and opening the Payment widget', () => {

  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  let blockchain = 'ethereum'
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let amount = 20
  let defaultArguments = {
    amount: {
      start: 20,
      min: 1,
      step: 1
    },
    token: DEPAY,
    blockchains: [blockchain]
  }

  it('shows you a list of wallets and allows to connect them', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.CardText', 'WalletConnect')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').find('.CardImage img')
      })
    })
  })

  it('allows you to read a little decription about what crypto wallets are', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('button', 'What is a wallet?').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('p', 'Wallets are used to send, receive, and store digital assets. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone.')
      })
    })
  })
})
