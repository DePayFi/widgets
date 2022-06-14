import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from '@depay/web3-constants'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('Donation Widget: style', () => {

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
    accept:[{
      blockchain,
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
        }
      ],
      
      toAddress,

      exchange: 'uniswap_v2',
      NATIVE_Balance: 1.1,

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
  
  it('allows you to style the widget', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({ ...defaultArguments, document,
          style: {
            colors: {
              primary: '#ffd265',
              buttonText: '#000000',
            },
            css: `
              @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

              .Dialog {
                border-radius: 0;
              }
            `
          }
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('have.css', 'background-color', 'rgb(255, 210, 101)')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('have.css', 'color', 'rgb(0, 0, 0)')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('style').should('contain.text', 'https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('style').should('contain.text', 'border-radius: 0')
      })
    })
  })
})
