import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'

describe('Payment Widget: change categorized payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const fromAddress = accounts[0]
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
        }, {
          "name": "Uniswap",
          "symbol": "UNI",
          "address": '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
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

    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', api: Token[blockchain].DEFAULT, method: 'symbol', return: 'UNI' } })
    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', api: Token[blockchain].DEFAULT, method: 'name', return: 'Uniswap' } })
    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '123456788880000000000' } })
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: ['0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', DEPAY], return: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983' }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [DEPAY, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'], return: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983' }})
    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983', api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983', api: exchange.pair.api, method: 'token0', return: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' }})
    mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983', api: exchange.pair.api, method: 'token1', return: DEPAY }})
    mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: ["20000000000000000000", ['0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', DEPAY]], return: ["12200000000000", "20000000000000000000"] }})
  })
  
  describe('change payment via categories', () => {

    it('allows me to navigate all categories (Best, Major, Native, Stable & All) and it also allows me to search for a payment option', ()=> {
      let displayedList = []
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then(async(document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()

          // Best
          cy.get('button.Tab.active', { includeShadowDom: true }).contains('Best').should('exist')
          cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
            displayedList.push($el.text().trim())
          }).then(() => {
            expect(displayedList).to.deep.equal(['DEPAY'])
            displayedList = []
          })

          // Major
          cy.get('button.Tab', { includeShadowDom: true }).contains('Major').click().then(()=>{
            cy.get('button.Tab.active', { includeShadowDom: true }).contains('Major').should('exist')
            cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
              displayedList.push($el.text().trim())
            }).then(() => {
              expect(displayedList).to.deep.equal(['DEPAY', 'ETH', 'DAI'])
              displayedList = []
            })
          })

          // NATIVE
          cy.get('button.Tab', { includeShadowDom: true }).contains('Native').click().then(()=>{
            cy.get('button.Tab.active', { includeShadowDom: true }).contains('Native').should('exist')
            cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
              displayedList.push($el.text().trim())
            }).then(() => {
              expect(displayedList).to.deep.equal(['ETH'])
              displayedList = []
            })
          })

          // STABLE
          cy.get('button.Tab', { includeShadowDom: true }).contains('Stable').click().then(()=>{
            cy.get('button.Tab.active', { includeShadowDom: true }).contains('Stable').should('exist')
            cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
              displayedList.push($el.text().trim())
            }).then(() => {
              expect(displayedList).to.deep.equal(['DAI'])
              displayedList = []
            })
          })

          // ALL
          cy.get('button.Tab', { includeShadowDom: true }).contains('All').click().then(()=>{
            cy.get('button.Tab.active', { includeShadowDom: true }).contains('All').should('exist')
            cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
              displayedList.push($el.text().trim())
            }).then(() => {
              expect(displayedList).to.deep.equal(['DEPAY', 'ETH', 'UNI', 'DAI'])
              displayedList = []
            })
          })

          // SEARCH
          cy.get('button.Tab', { includeShadowDom: true }).contains('🔍').click().then(()=>{
            cy.get('.active input[placeholder="Search by name, symbol or blockchain"]', { includeShadowDom: true }).type('UNI', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
                displayedList.push($el.text().trim())
              }).then(() => {
                expect(displayedList).to.deep.equal(['UNI'])
                displayedList = []
                
                // RESET SEARCH
                cy.get('button[title="Go back to all payment options"]', { includeShadowDom: true }).click().then(()=>{
                  cy.get('button.Tab.active', { includeShadowDom: true }).contains('All').should('exist')
                  cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
                    displayedList.push($el.text().trim())
                  }).then(() => {
                    expect(displayedList).to.deep.equal(['DEPAY', 'ETH', 'UNI', 'DAI'])
                    displayedList = []
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
