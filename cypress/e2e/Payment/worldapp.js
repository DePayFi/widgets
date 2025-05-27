import Blockchains from '@depay/web3-blockchains'
import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import mockAmountsIn from '../../../tests/mocks/evm/amountsIn'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

describe('Payment Widget: WorldApp', () => {

  const blockchain = 'worldchain'
  const WLD = '0x2cFc85d8E48F8EAB294be644d9E25C3030863003'
  const USDC = '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1'
  const fromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  const accept = [{
    amount,
    blockchain,
    receiver: toAddress,
    token: WLD,
  }]
  const defaultArguments = { accept }
  
  let provider
  let TOKEN_A_AmountBN = '20000000000000000000'
  let WRAPPED_AmountInBN
  let exchange

  afterEach(closeWidget)

  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()

    cy.stub(Intl, 'DateTimeFormat', () => {
      return { resolvedOptions: ()=>{
        return { timeZone: 'Europe/Berlin' }
      }}
    })

    fetchMock.get({
      url: `https://public.depay.com/currencies/EUR`,
      overwriteRoutes: true
    }, "0.85")

    fetchMock.post({
      url: "https://public.depay.com/routes/best",
      body: {
        accounts: { [blockchain]: fromAddress },
        accept,
      },
    }, {
        blockchain,
        fromToken: WLD,
        fromDecimals: 18,
        fromName: "Worldcoin",
        fromSymbol: "WLD",
        toToken: WLD,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "Worldcoin",
        toSymbol: "WLD"
    })

    fetchMock.post({
      url: "https://public.depay.com/routes/all",
      body: {
        accounts: { [blockchain]: fromAddress },
        accept,
      },
    }, [
      {
        blockchain,
        fromToken: WLD,
        fromDecimals: 18,
        fromName: "Worldcoin",
        fromSymbol: "WLD",
        toToken: WLD,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "Worldcoin",
        toSymbol: "WLD"
      }
    ])

    cy.then(() => getProvider(blockchain)).then((provider) => {

      
    })
  })
  
  it('auto connects worldapp', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      contentWindow.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        throw('Pending')
        // cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        // cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        // cy.wait(1000).then(()=>{
        //   cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click()
        //   cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
        //   cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
        //   cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Approving DAI for spending...').then(()=>{
        //     cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
        //     mock({ blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
        //     cy.wait(5000).then(()=>{
        //       cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        //       cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small').should('contain.text', 'Approved DAI for spending')
        //       cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Perform payment')
        //       cy.contains('.ButtonPrimary', 'Pay', { includeShadowDom: true }).should('exist')
        //     })
        //   })
        // })
      })
    })
  })

  it('does not ask to perform an approval', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      contentWindow.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        throw('Pending')
        // cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        // cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        // cy.wait(1000).then(()=>{
        //   cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click()
        //   cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
        //   cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
        //   cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Approving DAI for spending...').then(()=>{
        //     cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
        //     mock({ blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
        //     cy.wait(5000).then(()=>{
        //       cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        //       cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small').should('contain.text', 'Approved DAI for spending')
        //       cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Perform payment')
        //       cy.contains('.ButtonPrimary', 'Pay', { includeShadowDom: true }).should('exist')
        //     })
        //   })
        // })
      })
    })
  })  
})
