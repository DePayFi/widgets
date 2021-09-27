import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { mock, confirm, increaseBlock, resetMocks, anything } from 'depay-web3-mock'
import { resetCache, provider } from 'depay-web3-client'
import { routers, plugins } from 'depay-web3-payments'
import { supported } from 'depay-web3-wallets'
import { Token } from 'depay-web3-tokens'

describe('having no wallet and opening the Payment widget', () => {

  let blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']

  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let fromAddress = accounts[0]
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let amount = 20
  let defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }

  it('allows to connect wallet via wallet connect', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasics({
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
          })

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '20')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DEPAY')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          
        })
      })
    })
  })
})
