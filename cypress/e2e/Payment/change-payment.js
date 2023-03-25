import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockAmountsOut from '../../../tests/mocks/amountsOut'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from '@depay/web3-constants'
import { mock, confirm, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('Payment Widget: change payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = CONSTANTS[blockchain].USD
  const ETH = CONSTANTS[blockchain].NATIVE
  const WETH = CONSTANTS[blockchain].WRAPPED
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
  
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let exchange
  let provider

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)
    
    ;({ WRAPPED_AmountInBN, TOKEN_A_AmountBN, exchange } = mockBasics({
      provider,
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
  
  describe('change payment', () => {

    describe('while loading', ()=> {

      it('shows an animated skeleton while loading the change payment dialog', ()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            mock({ blockchain, request: { delay: 3000, to: DAI, api: Token[blockchain].DEFAULT, method: 'name', return: 'Dai Stablecoin' } })
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Skeleton')
          })
        })
      })
    })

    it('allows me to change the payment', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DEPAY as payment"]').find('.CardImage img').invoke('attr', 'src').should('eq', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DEPAY as payment"]').contains('.TokenAmountCell', '20').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DEPAY as payment"]').contains('.TokenSymbolCell', 'DEPAY').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DEPAY as payment"]').contains('.CardText small', '30').should('exist')

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.BlockchainLogo[title="Ethereum"]')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select ETH as payment"]').contains('.TokenAmountCell', '0.01').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select ETH as payment"]').contains('.TokenSymbolCell', 'ETH').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select ETH as payment"]').contains('.CardText small', '1').should('exist')

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').find('.CardImage img').invoke('attr', 'src').should('eq', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').contains('.TokenAmountCell', '33').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').contains('.TokenSymbolCell', 'DAI').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').contains('.CardText small', '50').should('exist')
        })
      })
    })

    it('allows me to navigate back to the payment overview', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DEPAY as payment"]')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Go back"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]')
        })
      })
    })

    it('allows me to close the dialog', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]:visible').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })

    it('allows me to submit a changed payment', ()=> {

      let fromAddress = accounts[0]
      let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
      
      let mockedTransaction = mock({
        blockchain,
        transaction: {
          delay: 1000,
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'route',
          params: {
            path: [ETH, DEPAY],
            amounts: ['10100000000000000', TOKEN_A_AmountBN, anything],
            addresses: [fromAddress, toAddress],
            plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
            data: []
          },
          value: '10100000000000000'
        }
      })

      mockAmountsOut({
        provider,
        blockchain,
        exchange,
        amountInBN: '10100000000000000',
        path: [WETH, DAI],
        amountsOut: [
          '10000000000000000',
          '27000000000000000000'
        ]
      })

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select ETH as payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€22.95')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
            confirm(mockedTransaction)
            cy.wait(2000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
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
