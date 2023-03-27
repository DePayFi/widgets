import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('Donation Widget: no wallet connected', () => {

  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  let blockchain = 'ethereum'
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let amount = 20
  let defaultArguments = {
    accept:[{
      blockchain,
      token: DEPAY,
      receiver: toAddress
    }]
  }

  it('shows you a list of wallets and allows to connect them', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Connect a wallet')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.CardText', 'Coinbase')
      })
    })
  })
})
