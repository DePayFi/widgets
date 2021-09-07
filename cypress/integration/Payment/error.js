import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider, resetCache } from 'depay-web3-client'
import { Token } from 'depay-web3-tokens'

describe('Payment widget error', () => {
  
  const blockchain = 'ethereum'
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let fromAddress = accounts[0]
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let amount = 20
  let TOKEN_A_AmountBN
  let defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }

  beforeEach(()=>{

    ({ TOKEN_A_AmountBN } = mockBasics({
      provider: provider(blockchain),
      blockchain,

      fromAddress,
      fromAddressAssets: [
        {
          "name": "Ether",
          "symbol": "ETH",
          "address": ETH,
          "type": "NATIVE"
        }, {
          "name": "Dai Stablecoin",
          "symbol": "DAI",
          "address": DAI,
          "type": "ERC20"
        }, {
          "name": "DePay",
          "symbol": "DEPAY",
          "address": DEPAY,
          "type": "ERC20"
        }
      ],
      
      toAddress,

      exchange: 'uniswap_v2',
      NATIVE_Balance: 0,

      TOKEN_A: DEPAY,
      TOKEN_A_Decimals: 18,
      TOKEN_A_Name: 'DePay',
      TOKEN_A_Symbol: 'DEPAY',
      TOKEN_A_Amount: amount,
      TOKEN_A_Balance: 30,
      
      TOKEN_B: DAI,
      TOKEN_B_Decimals: 18,
      TOKEN_B_Name: 'Dai Stablecoin',
      TOKEN_B_Symbol: 'DAI',
      TOKEN_B_Amount: 33,
      TOKEN_B_Balance: 50,

      TOKEN_A_TOKEN_B_Pair: CONSTANTS[blockchain].ZERO,
      TOKEN_B_WRAPPED_Pair: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
      TOKEN_A_WRAPPED_Pair: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d',

      WRAPPED_AmountIn: 0.01,
      USD_AmountOut: 33,

      timeZone: 'Europe/Berlin',
      stubTimeZone: (timeZone)=> {
        cy.stub(Intl, 'DateTimeFormat', () => {
          return { resolvedOptions: ()=>{
            return { timeZone }
          }}
        })
      },

      currency: 'EUR',
      currencyToUSD: '0.85'
    }))
  })

  it('calls error callback with a critical error if widgets fails initialization', () => {

    let criticalCalled
    let criticalError

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          critical: (error)=>{
            criticalError = error
            criticalCalled = true
          }
        })
        cy.wait(1000).then(()=>{
          expect(criticalError.toString()).to.eq("TypeError: Cannot read property 'forEach' of undefined")
          expect(criticalCalled).to.eq(true)
        })
      })
    })
  })

  it.only('renders an error dialog if internal error was not critical and can be handled by the widget', ()=> {

    let errorCalled
    let passedError
    
    mock({ provider: provider(blockchain), blockchain, call: { to: DEPAY, api: Token[blockchain].DEFAULT, method: 'symbol', return: Error('something failed') } })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          accept: [{
            blockchain: 'ethereum',
            amount: 20,
            token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
          }],
          error: (error)=> {
            console.log('error callback')
            errorCalled = true
            passedError = error
          }
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Oops, Something Went Wrong')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong.FontItalic', 'Error: something failed')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'If this keeps happening, please report it.')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
        cy.get('.ReactShadowDOMOutsideContainer').should('not.exist').then(()=>{
          expect(errorCalled).to.eq(true)
          expect(passedError.toString()).to.eq('Error: something failed')
        })
      })
    })
  })
})
