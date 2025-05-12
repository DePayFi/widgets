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

describe('Payment Widget: reset approval', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  const defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }
  
  let provider
  let TOKEN_A_AmountBN
  let WRAPPED_AmountInBN
  let exchange

  afterEach(closeWidget)

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)

    ;({ TOKEN_A_AmountBN, WRAPPED_AmountInBN, exchange } = mockBasics({
      
      provider,
      blockchain,

      fromAddress,
      fromAddressAssets: [
        {
          "name": "Ether",
          "symbol": "ETH",
          "address": ETH,
          "type": "NATIVE"
        }, {
          "name": "USDT",
          "symbol": "USDT",
          "address": USDT,
          "type": "20"
        }, {
          "name": "DePay",
          "symbol": "DEPAY",
          "address": DEPAY,
          "type": "20"
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
      
      TOKEN_B: USDT,
      TOKEN_B_Decimals: 6,
      TOKEN_B_Name: 'USDT',
      TOKEN_B_Symbol: 'USDT',
      TOKEN_B_Amount: 33,
      TOKEN_B_Balance: 50,

      TOKEN_A_TOKEN_B_Pair: Blockchains[blockchain].zero,
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

    mock({ blockchain, provider, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: '100000' } })
  })
  
  it('asks me to approve the token for the payment router before I can execute it', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: USDT,
        api: Token[blockchain].DEFAULT,
        method: 'approve',
        params: [routers[blockchain].address, "0"]
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select USDT as payment"]').click()
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reset USDT approval').click()
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Resetting...').then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'title').should('eq', 'Resetting current approval - please wait')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
            mock({ blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: 0 } })
            confirm(mockedTransaction)
            cy.wait(5000).then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.contains('.ButtonPrimary', 'Approve', { includeShadowDom: true }).should('exist')
            })
          })
        })
      })
    })
  })

  it('does not require approval for direct token transfers', () => {
    
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').then(()=>{
          cy.contains('.ButtonPrimary', 'Reset USDT approval', { includeShadowDom: true }).should('not.exist')
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
        to: USDT,
        api: Token[blockchain].DEFAULT,
        method: 'approve',
        params: [routers[blockchain].address, 0],
        return: Error('MetaMask Tx Signature: User denied transaction signature.')
      }
    })
    cy.document().then((document)=>{
      DePayWidgets.Payment({ ...defaultArguments, document })
      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
      cy.wait(500).then(()=>{ // wait for dialog
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select USDT as payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reset USDT approval').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Resetting...').then(()=>{
          cy.wait(1000).then(()=>{
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.Card.disabled', { includeShadowDom: true }).should('not.exist')
            cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).should('exist')
            cy.get('.ButtonPrimary', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reset USDT approval')
          })
        })
      })
    })
  })

  it('does not reload prices while reseting token (but right after!)', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: USDT,
        api: Token[blockchain].DEFAULT,
        method: 'approve',
        params: [routers[blockchain].address, 0]
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select USDT as payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reset USDT approval').click()
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Resetting...').then(()=>{
          let NEW_TOKEN_B_AmountBN = ethers.utils.parseUnits('35', 6)
          let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 6)
          mockAmountsOut({ provider, blockchain, exchange, amountInBN: TOKEN_A_AmountBN, path: [DEPAY, WETH, USDT], amountsOut: [ TOKEN_A_AmountBN, WRAPPED_AmountInBN, NEW_USD_AmountOutBN ]})
          mock({ provider, blockchain, block: 2, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('20', 18), [USDT, Blockchains[blockchain].wrapped.address, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('20', 18), [USDT, Blockchains[blockchain].wrapped.address, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          mock({ blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: 0 } })
          cy.wait(16000).then(()=>{
            confirm(mockedTransaction)
            cy.wait(1000).then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.get('.Card.disabled', { includeShadowDom: true }).should('not.exist')
              cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).should('not.exist')
              cy.contains('.ButtonPrimary', 'Approve', { includeShadowDom: true }).should('not.exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reload').click()
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'First, approve use of USDT')
              })
            })
          })
        })
      })
    })
  })
})
