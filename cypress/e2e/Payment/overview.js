import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

describe('Payment Widget: overview', () => {
  
  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
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
  let exchange
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN

  afterEach(closeWidget)

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)
    
    ;({ 
      exchange,
      TOKEN_A_AmountBN,
      TOKEN_B_AmountBN,
      WRAPPED_AmountInBN 
    } = mockBasics({
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
  })

  it('calls the closed callback if user closes the dialog', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let closedCalled
        DePayWidgets.Payment({ ...defaultArguments, document,
          closed: ()=>{ closedCalled = true } 
        })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click({ force: true })
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist').then(()=>{
            expect(closedCalled).to.equal(true)
          })
        })
      })
    })
  })

  it('does not allow to close the widget if set to unclosable', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then(async(document)=>{
        let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document,
          closable: false
        })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('exist').then(()=>{
            unmount()
          })
        })
      })
    })
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
          url: 'https://public.depay.com/accounts/ethereum/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/assets',
          overwriteRoutes: true,
          delay: 10000
        }, [])
      })

      it('shows an animated skeleton while loading data and a sentence after 4s that balances are still loading', ()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Skeleton')
            cy.wait(4000).then(()=> {
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('strong').should('contain.text', 'Loading payment options...')
            })
          })
        })
      })

      it('allows me to close the container while its loading', () => {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.wait(500).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
              cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
            })
          })
        })
      })
    })

    it('loads the most cost-effective route and suggests that as a payment', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '20')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DEPAY')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell', '€28.05').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardImage img[src="https://depay.com/favicon.png"]')
        })
      })
    })

    it('allows me to close the container after it loaded', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell', '€28.05').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })
    
    it('contains a link to the DePay website', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('a').invoke('attr', 'href').should('eq', 'https://depay.com')
        })
      })
    })
  })

  describe('updating', () => {

    it('updates payment routes every 15s as prices can change', () => {
      mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell', '€28.05').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
          cy.wait(2000).then(()=>{
            let NEW_TOKEN_B_AmountBN = ethers.utils.parseUnits('35', 18)
            let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 18)
            mockAmountsOut({
              provider,
              blockchain,
              exchange,
              amountInBN: TOKEN_A_AmountBN,
              path: [DEPAY, WETH, DAI],
              amountsOut: [
                TOKEN_A_AmountBN,
                WRAPPED_AmountInBN,
                NEW_USD_AmountOutBN
              ]
            })
            mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, Blockchains[blockchain].wrapped.address, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          })
          cy.wait(16000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Alert').should('contain', 'Exchange rate updated!')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Reload').click()
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '35.175')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
            })
          })
        })
      })
    })

    it('stops updating prices once payment is sending', () => {
      fetchMock.post({
        url: "https://public.depay.com/payments",
        body: {
          blockchain: "ethereum",
        },
        matchPartialBody: true
      }, 201)

      let mockedTransaction = mock({
        blockchain,
        transaction: {
          delay: 16000,
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'pay',
          params: {
            payment: {
              amountIn: '33165000000000000000',
              permit2: false,
              paymentAmount: TOKEN_A_AmountBN,
              feeAmount: 0,
              tokenInAddress: DAI,
              exchangeAddress: exchange.router.address,
              tokenOutAddress: DEPAY,
              paymentReceiverAddress: toAddress,
              feeReceiverAddress: Blockchains[blockchain].zero,
              exchangeType: 1,
              receiverType: 0,
              exchangeCallData: anything,
              receiverCallData: Blockchains[blockchain].zero,
              deadline: anything,
            }
          },
          value: 0
        }
      })

      mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.wait(2000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Pay').click()
              cy.wait(2000).then(()=>{
                let NEW_TOKEN_B_AmountBN = ethers.utils.parseUnits('35', 18)
                mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, Blockchains[blockchain].wrapped.address, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
                let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 18)
                mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsOut', params: [TOKEN_A_AmountBN, [DEPAY, Blockchains[blockchain].wrapped.address, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, NEW_USD_AmountOutBN] }})
              })
              cy.wait(15000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '33.165')
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DAI')
                confirm(mockedTransaction)
              })
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
          let NEW_TOKEN_B_AmountBN_mock = mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [DAI, Blockchains[blockchain].wrapped.address, DEPAY]], return: [NEW_TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
          let NEW_USD_AmountOutBN = ethers.utils.parseUnits('35', 18)
          let NEW_USD_AmountOutBN_mock = mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsOut', params: ['33165000000000000000', [DEPAY, Blockchains[blockchain].wrapped.address, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, NEW_USD_AmountOutBN] }})
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.wait(3000).then(()=>{
            NEW_TOKEN_B_AmountBN_mock_count = NEW_TOKEN_B_AmountBN_mock.calls.count()
            NEW_USD_AmountOutBN_mock_count = NEW_USD_AmountOutBN_mock.calls.count()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click({ force: true })
            cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
          })
          cy.wait(16000).then(()=>{
            expect(NEW_TOKEN_B_AmountBN_mock.calls.count()).to.eq(NEW_TOKEN_B_AmountBN_mock_count)
            expect(NEW_USD_AmountOutBN_mock.calls.count()).to.eq(NEW_USD_AmountOutBN_mock_count)
          })
        })
      })
    })
  })

  describe('couldnt load toToken USD route for localValue', ()=> {

    beforeEach(()=> {
      mock({
        provider,
        blockchain, 
        request: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'getAmountsOut',
          params: [TOKEN_A_AmountBN, [DEPAY, WETH, Blockchains[blockchain].stables.usd[0]]],
          return: []
        }
      })
    })

    it('falls back to display the token amount and symbol', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('h3.CardText', { includeShadowDom: true }).should('not.exist')
        })
      })
    })
  })

  describe('toToken is USD and hence cant route localValue to USD itself', ()=>{

    it('takes the amount for toToken USD instead of trying to route to USD token itself (which is not routable)', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          let USD = Blockchains[blockchain].stables.usd[0]
          mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [WETH, USD], return: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11' }})
          mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: ["20000000", [DEPAY, USD]], return: [TOKEN_A_AmountBN, "20000000"] }})
          let USD_TOKEN = Blockchains[blockchain].tokens.find((token)=>token.address===USD)
          mock({ provider, blockchain, request: { to: USD, api: Token[blockchain].DEFAULT, method: 'decimals', return: USD_TOKEN.decimals } })
          mock({ provider, blockchain, request: { to: USD, api: Token[blockchain].DEFAULT, method: 'symbol', return: USD_TOKEN.symbol } })
          mock({ provider, blockchain, request: { to: USD, api: Token[blockchain].DEFAULT, method: 'name', return: USD_TOKEN.name } })
          DePayWidgets.Payment({ 
            accept: [{
              blockchain,
              amount,
              token: USD,
              receiver: toAddress
            }]
          , document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '20.1')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DEPAY')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
        })
      })
    })
  })
})
