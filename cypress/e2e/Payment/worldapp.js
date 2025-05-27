import Blockchains from '@depay/web3-blockchains'
import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import Exchanges from '@depay/web3-exchanges'
import fetchMock from 'fetch-mock'
import mockAmountsIn from '../../../tests/mocks/evm/amountsIn'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'

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
  let exchange = Exchanges.worldchain.uniswap_v3
  let TOKEN_A_AmountBN = '20000000000000000000'

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

      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'symbol', return: 'WLD' } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'name', return: 'Worldcoin' } })      
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: Blockchains[blockchain].maxInt } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${WLD}?amount=20.0` }, '26.2')


    })
  })
  
  it('auto connects worldapp', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      contentWindow.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'WLD').should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€22.27')
      })
    })
  })

  it.only('does not ask to perform an approval when performing transactions', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      contentWindow.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'WLD').should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€22.27').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            
          })
        })
      })
    })
  })  
})
