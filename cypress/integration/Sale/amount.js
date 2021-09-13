import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything } from 'depay-web3-mock'
import { resetCache, provider } from 'depay-web3-client'
import { routers, plugins } from 'depay-web3-payments'
import { Token } from 'depay-web3-tokens'

describe('change Sale amount', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

   afterEach(()=>{
    cy.wait(500).then(()=>{
      cy.get('body').then((body) => {
        if (body.find('.ReactShadowDOMOutsideContainer').length > 0) {
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
        }
        cy.wait(1000)
      })
    })
  })

  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN
  let toAddress = accounts[0]
  let amount = 20
  let exchange
  let defaultArguments = {
    amount: {
      start: 20,
      min: 1,
      step: 1
    },
    token: DEPAY,
    blockchains: [blockchain]
  }

  beforeEach(()=>{
    
    ({
      WRAPPED_AmountInBN,
      TOKEN_A_AmountBN,
      TOKEN_B_AmountBN,
      exchange
    } = mockBasics({
      provider: provider(blockchain),
      blockchain,

      fromAddress: accounts[0],
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
      NATIVE_Balance: 1,

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
      TOKEN_B_Allowance: CONSTANTS[blockchain].MAXINT,

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

    mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('1', 18), [WETH, DEPAY]], return: [WRAPPED_AmountInBN, ethers.utils.parseUnits('2000', 18)] }})
  })
  
  describe('change amount', () => {

    it('allows me to change the amount freely by entering it into an input field', ()=> {
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('10', 18), [WETH, DEPAY]], return: [ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('10', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('10', 18), [DAI, WETH, DEPAY]], return: [ethers.utils.parseUnits('16.5', 18), ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('10', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('0.005', 18), [WETH, DAI]], return: [ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('16.5', 18)] }})

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Sale({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('{selectall}')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('10', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').click()

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenAmountCell', '10').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenSymbolCell', 'DEPAY').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.CardText small', '€1.40 per token').should('exist')

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenAmountCell', '0.005').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'ETH').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.CardText small', '€14.03').should('exist')
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €14.03').should('exist')
        })
      })
    })

    it('allows me to change the amount freely by using a range slider', ()=> {
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('1', 18), [WETH, DEPAY]], return: [WRAPPED_AmountInBN, ethers.utils.parseUnits('2000', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('990', 18), [WETH, DEPAY]], return: [ethers.utils.parseUnits('0.495', 18), ethers.utils.parseUnits('990', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('990', 18), [DAI, WETH, DEPAY]], return: [ethers.utils.parseUnits('1633.5', 18), ethers.utils.parseUnits('0.495', 18), ethers.utils.parseUnits('990', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('0.5', 18), [WETH, DAI]], return: [ethers.utils.parseUnits('0.5', 18), ethers.utils.parseUnits('1633.5', 18)] }})

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Sale({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.rangeslider').click({ force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').click()

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenAmountCell', '990').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenSymbolCell', 'DEPAY').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.CardText small', '€1.40 per token').should('exist')

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenAmountCell', '0.5').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'ETH').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.CardText small', '€1,388.48').should('exist')
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €1,388.48').should('exist')
        })
      })
    })

    it('allows me to quickly select the max amount that I can buy', ()=> {
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('1', 18), [WETH, DEPAY]], return: [WRAPPED_AmountInBN, ethers.utils.parseUnits('2000', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('1980.19', 18), [WETH, DEPAY]], return: [ethers.utils.parseUnits('1', 18), ethers.utils.parseUnits('1980.19', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('1980.19', 18), [DAI, WETH, DEPAY]], return: [ethers.utils.parseUnits('3267', 18), ethers.utils.parseUnits('1', 18), ethers.utils.parseUnits('1980.19', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('1', 18), [WETH, DAI]], return: [ethers.utils.parseUnits('1', 18), ethers.utils.parseUnits('3267', 18)] }})

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Sale({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.TextButton', 'Max').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').click()

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenAmountCell', '1,980.19').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenSymbolCell', 'DEPAY').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.CardText small', '€1.40 per token').should('exist')

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenAmountCell', '1').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'ETH').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.CardText small', '€2,776.95').should('exist')
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €2,776.95').should('exist')
        })
      })
    })

    it('allows me to navigate back to the sale overview', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Sale({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.rangeslider')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Go back"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]')
        })
      })
    })

    it('allows me to close the dialog', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Sale({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]:visible').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })

    it('allows me to submit a changed amount for a token sale', ()=> {

      let fromAddress = accounts[0]
      let toAddress = fromAddress
      
      let mockedTransaction = mock({
        blockchain,
        transaction: {
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'route',
          params: {
            path: [CONSTANTS[blockchain].NATIVE, DEPAY],
            amounts: [ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('10', 18), anything],
            addresses: [fromAddress, toAddress],
            plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
            data: []
          }
        }
      })

      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('1', 18), [WETH, DEPAY]], return: [WRAPPED_AmountInBN, ethers.utils.parseUnits('2000', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('10', 18), [WETH, DEPAY]], return: [ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('10', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [ethers.utils.parseUnits('10', 18), [DAI, WETH, DEPAY]], return: [ethers.utils.parseUnits('16.5', 18), ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('10', 18)] }})
      mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [ethers.utils.parseUnits('0.005', 18), [WETH, DAI]], return: [ethers.utils.parseUnits('0.005', 18), ethers.utils.parseUnits('16.5', 18)] }})

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Sale({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('{selectall}')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('10', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').click()

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenAmountCell', '10').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.TokenSymbolCell', 'DEPAY').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').contains('.CardText small', '€1.40 per token').should('exist')

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenAmountCell', '0.005').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'ETH').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.CardText small', '€14.03').should('exist')
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €14.03').click().then(()=>{
            confirm(mockedTransaction)
            expect(mockedTransaction.calls.count()).to.eq(1)
          })
        })
      })
    })
  })
})
