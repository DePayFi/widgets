import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { mock, resetMocks } from 'depay-web3-mock'
import { Token } from 'depay-web3-tokens'

describe('Payment', () => {

  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  let blockchain = 'ethereum'
  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let defaultArguments

  beforeEach(()=>{
    
    defaultArguments = {
      blockchain,
      amount: 20,
      token: DEPAY,
      receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
    }

    mockBasics({
      blockchain: 'ethereum',

      fromAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
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
      
      toAddress: defaultArguments.toAddress,

      exchange: 'uniswap_v2',
      NATIVE_Balance: 0,

      TOKEN_A: DEPAY,
      TOKEN_A_Decimals: 18,
      TOKEN_A_Name: 'DePay',
      TOKEN_A_Symbol: 'DEPAY',
      TOKEN_A_Amount: defaultArguments.amount,
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
    })
  })
  
  describe('change payment', () => {

    describe('while loading', ()=> {

      beforeEach(()=>{
        mock({ blockchain, call: { delay: 3000, to: DAI, api: Token[blockchain].DEFAULT, method: 'name', return: 'Dai Stablecoin' } })
      })

      it.only('shows an animated skeleton while loading the change payment dialog', ()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Skeleton')
          })
        })
      })
    })

    it('allows me to change the payment', ()=> {
    })

    it('allows me to navigate back to the payment overview', ()=> {
    })

    it('allows me to close the dialog', ()=> {
    })
  })
})
