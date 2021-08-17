import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { mock, resetMocks } from 'depay-web3-mock'
import { routers, plugins } from 'depay-web3-payments'

describe('execute Payment', () => {

  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  let blockchain = 'ethereum'
  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let amount = 20
  let TOKEN_A_AmountBN
  let defaultArguments = {
    blockchain,
    amount,
    token: DEPAY,
    receiver: toAddress
  }

  beforeEach(()=>{

    ({ TOKEN_A_AmountBN } = mockBasics({
      blockchain: 'ethereum',

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
  
  it.only('executes a payment', () => {
    let paymentMock = mock({
      blockchain,
      transaction: {
        delay: 2000,
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DEPAY],
          amounts: [TOKEN_A_AmountBN],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].payment.address],
          data: []
        },
        value: 0
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
      })
    })
    // it shows paying...
    // it links to etherscan transaction
  })

  describe('rounds up eth payments', () => {

  })

  describe('rounds up token payments', () => {
  })

  describe('it does not allow me to change the payment while paying', () => {
    // cant click change payment
    // hides chevron
    // no hover
  })

  describe('it does not allow me to close the dialog while paying', () => {
    // hides X
    // no esc to close
    // no background click to close
  })

  describe('resets the payment if user denies confirmation', () => {
    
  })
})
