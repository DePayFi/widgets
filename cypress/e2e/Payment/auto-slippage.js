import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import mockAmountsOut from '../../../tests/mocks/amountsOut'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from '@depay/web3-constants'
import { ethers } from 'ethers'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('Payment Widget: auto slippage', () => {
  
  const blockchain = 'ethereum'
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))
  afterEach(closeWidget)

  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let fromAddress = accounts[0]
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let amount = 20
  let defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }
  let exchange
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN

  beforeEach(()=>{

    ({ 
      exchange,
      TOKEN_A_AmountBN,
      TOKEN_B_AmountBN,
      WRAPPED_AmountInBN 
    } = mockBasics({
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
      NATIVE_Balance: 1,

      TOKEN_A: DEPAY,
      TOKEN_A_Decimals: 18,
      TOKEN_A_Name: 'DePay',
      TOKEN_A_Symbol: 'DEPAY',
      TOKEN_A_Amount: amount,
      TOKEN_A_Balance: 0,
      
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

    // DAI slippage
    mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 11, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 10, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 9, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN.sub(ethers.BigNumber.from('10000000000000000')), WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 8, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN.sub(ethers.BigNumber.from('20000000000000000')), WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})

    // ETH slippage
    mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 11, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 10, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
    mock({ block: 9, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [WRAPPED_AmountInBN.sub(ethers.BigNumber.from('100000000000000')), TOKEN_A_AmountBN] }})
    mock({ block: 8, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [WRAPPED_AmountInBN.sub(ethers.BigNumber.from('200000000000000')), TOKEN_A_AmountBN] }})
  })

  it('adds slippage automatically for preselected payment method if price is projected downwards and transaction would fail otherwise', () => {

    increaseBlock(9)
    
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [CONSTANTS[blockchain].NATIVE, DEPAY],
          amounts: [WRAPPED_AmountInBN.add(ethers.BigNumber.from('1000000000000000')), TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
      }
    })

    fetchMock.post({
      url: "https://public.depay.fi/payments",
      body: {
        after_block: 10,
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: 0,
        payload: {
          sender_amount: "0.011",
          sender_id: fromAddress.toLowerCase(),
          sender_token_id: ETH,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress.toLowerCase(),
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.wait(3000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '0.011')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'ETH')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €28.05').click()
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
              cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
            })
          })
        })
      })
    })
  })

  it('adds slippage automatically for all other payment means in the background', () => {

    increaseBlock(9)

    mock({ provider: provider(blockchain), blockchain, call: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: CONSTANTS[blockchain].MAXINT } })
    
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY],
          amounts: [TOKEN_B_AmountBN.add(ethers.BigNumber.from('10000000000000000')), TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
      }
    })

    fetchMock.post({
      url: "https://public.depay.fi/payments",
      body: {
        after_block: 1,
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: 0,
        payload: {
          sender_amount: "33.01",
          sender_id: fromAddress.toLowerCase(),
          sender_token_id: DAI,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress.toLowerCase(),
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.wait(3000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33.01')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €28.05').click()
            confirm(mockedTransaction)
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
                cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
              })
            })
          })
        })
      })
    })
  })

  it('detects slippage automatically also after selecting a new means of payment', () => {

    increaseBlock(9)

    mock({ provider: provider(blockchain), blockchain, call: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: CONSTANTS[blockchain].MAXINT } })
    
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY],
          amounts: [TOKEN_B_AmountBN.add(ethers.BigNumber.from('10000000000000000')), TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
      }
    })

    fetchMock.post({
      url: "https://public.depay.fi/payments",
      body: {
        after_block: 1,
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: 0,
        payload: {
          sender_amount: "33.01",
          sender_id: fromAddress.toLowerCase(),
          sender_token_id: DAI,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress.toLowerCase(),
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.wait(3000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
          mock({ block: 10, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          mock({ block: 9, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN.sub(ethers.BigNumber.from('10000000000000000')), WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          mock({ block: 8, provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [TOKEN_B_AmountBN.sub(ethers.BigNumber.from('20000000000000000')), WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Alert').should('contain', 'Price updated!')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reload').click()
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33.01')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €28.05').click()
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed')
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
                  cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
                })
              })
            })
          })
        })
      })
    })
  })
})
