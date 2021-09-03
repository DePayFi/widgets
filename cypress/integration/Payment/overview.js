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

describe('overview Payment', () => {
  
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())

  afterEach(()=>{
    cy.wait(500).then(()=>{
      cy.get('body').then((body) => {
        if (body.find('.ReactShadowDOMOutsideContainer').length > 0) {
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
        }
      })
    })
  })

  let blockchain = 'ethereum'
  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
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
  
  describe('basics', () => {

    it('renders and opens a styled Payment dialog in a shadow dom', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('style').should('contain.text', '.Dialog')
        })
      })
    })

    describe("loading", ()=>{

      beforeEach(()=>{
        fetchMock.get({
          url: 'https://api.depay.pro/v1/assets?account=0xd8da6bf26964af9d7eed9e03e53415d37aa96045&blockchain=ethereum',
          headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
          overwriteRoutes: true,
          delay: 5000
        }, [])
      })

      it('shows an animated skeleton while loading data', ()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Skeleton')
          })
        })
      })

      it('allows me to close the container while its loading', () => {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
          })
        })
      })
    })
    
    it('loads the most cost-effective route and suggests that as a payment', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '20')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DEPAY')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardImage img').invoke('attr', 'src').should('eq', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png')
        })
      })
    })

    it('allows me to close the container after it loaded', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })
    
    it('contains a link to the DePay website in the footer', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.DialogFooter a').invoke('attr', 'href').should('eq', 'https://depay.fi?utm_source=localhost&utm_medium=widget&utm_campaign=WidgetV2')
        })
      })
    })
  })

  describe('updating', () => {

    it('updates payment routes every 15s as prices can change', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.wait(2000).then(()=>{
            let NEW_TOKEN_B_AmountBN = ethers.utils.parseUnits('35', 18)
            mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          })
          cy.wait(15000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '35')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          })
        })
      })
    })

    it('updates the payment amount aka toToken conversion price to local currency', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.wait(2000).then(()=>{
            let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 18)
            mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [TOKEN_A_AmountBN, [DEPAY, CONSTANTS[blockchain].WRAPPED, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, NEW_USD_AmountOutBN] }})
          })
          cy.wait(15000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€29.75')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €29.75')
          })
        })
      })
    })

    it.only('stops updating prices once payment is sending', () => {
      let mockedTransaction = mock({
        blockchain,
        transaction: {
          delay: 17000,
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'route',
          params: {
            path: [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY],
            amounts: [TOKEN_B_AmountBN, TOKEN_A_AmountBN, anything],
            addresses: [fromAddress, toAddress],
            plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
            data: []
          }
        }
      })

      mock({ provider: provider(blockchain), blockchain, call: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: CONSTANTS[blockchain].MAXINT } })

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.wait(2000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay €28.05').click()
            cy.wait(2000).then(()=>{
              let NEW_TOKEN_B_AmountBN = ethers.utils.parseUnits('35', 18)
              mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
              let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 18)
              mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [TOKEN_A_AmountBN, [DEPAY, CONSTANTS[blockchain].WRAPPED, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, NEW_USD_AmountOutBN] }})
            })
            cy.wait(15000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
              confirm(mockedTransaction)
            })
          })
        })
      })
    })

    it('unmounts the update intervals if dialog is closed', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          let NEW_TOKEN_B_AmountBN_mock_count
          let NEW_USD_AmountOutBN_mock_count
          DePayWidgets.Payment({ ...defaultArguments, document })
          let NEW_TOKEN_B_AmountBN = ethers.utils.parseUnits('35', 18)
          let NEW_TOKEN_B_AmountBN_mock = mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, CONSTANTS[blockchain].WRAPPED, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 18)
          let NEW_USD_AmountOutBN_mock = mock({ provider: provider(blockchain), blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: [TOKEN_A_AmountBN, [DEPAY, CONSTANTS[blockchain].WRAPPED, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, NEW_USD_AmountOutBN] }})
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
          cy.wait(2000).then(()=>{
            NEW_TOKEN_B_AmountBN_mock_count = NEW_TOKEN_B_AmountBN_mock.calls.count()
            NEW_USD_AmountOutBN_mock_count = NEW_USD_AmountOutBN_mock.calls.count()
          })
          cy.wait(16000).then(()=>{
            expect(NEW_TOKEN_B_AmountBN_mock.calls.count()).to.eq(NEW_TOKEN_B_AmountBN_mock_count)
            expect(NEW_USD_AmountOutBN_mock.calls.count()).to.eq(NEW_USD_AmountOutBN_mock_count)
          })
        })
      })
    })
  })
})
