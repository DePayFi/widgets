import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { mock, confirm, resetMocks } from 'depay-web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { routers, plugins } from 'depay-web3-payments'
import { Token } from 'depay-web3-tokens'

describe('approve Payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))
  afterEach(resetMocks)
  afterEach(closeWidget)

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
  
  it('asks me to approve the token for the payment router before I can execute it', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DAI,
        api: Token[blockchain].DEFAULT,
        method: 'approve',
        params: [routers[blockchain].address, CONSTANTS[blockchain].MAXINT]
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Allow DAI to be used as payment').click()
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary.wide').should('contain.text', 'Approving...').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary.wide').invoke('attr', 'title').should('eq', 'Approving payment token - please wait')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary.wide').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.Card.disabled', { includeShadowDom: true }).should('not.exist')
            cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).should('not.exist')
            cy.get('.ButtonPrimary.wide', { includeShadowDom: true }).should('not.exist')
          })
        })
      })
    })
  })

  it('does not require approval for direct token transfers', () => {
    
    mock({ blockchain, call: { to: DEPAY, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: CONSTANTS[blockchain].ZERO } })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').then(()=>{
          cy.get('.ButtonPrimary.wide', { includeShadowDom: true }).should('not.exist')
        })
      })
    })
  })
  
  it('resets back to overview if I decline the approval (e.g. reject metamask)', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        delay: 1000,
        from: fromAddress,
        to: DAI,
        api: Token[blockchain].DEFAULT,
        method: 'approve',
        params: [routers[blockchain].address, CONSTANTS[blockchain].MAXINT],
        return: Error('MetaMask Tx Signature: User denied transaction signature.')
      }
    })
    cy.document().then((document)=>{
      DePayWidgets.Payment({ ...defaultArguments, document })
      cy.wait(500).then(()=>{ // wait for dialog
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Allow DAI to be used as payment').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary.wide').should('contain.text', 'Approving...').then(()=>{
          cy.wait(1000).then(()=>{
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.Card.disabled', { includeShadowDom: true }).should('not.exist')
            cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).should('exist')
            cy.get('.ButtonPrimary.wide', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Allow DAI to be used as payment')
          })
        })
      })
    })
  })
})
