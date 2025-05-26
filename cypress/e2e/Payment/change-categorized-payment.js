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

describe('Payment Widget: change categorized payment option', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const fromAddress = accounts[0]
  const amount = 20
  const accept = [{
    blockchain,
    amount,
    token: DEPAY,
    receiver: toAddress
  }]
  const defaultArguments = { accept }
  
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let exchange
  let provider

  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    
    cy.then(() => getProvider(blockchain)).then((provider) => {
    
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
            "name": "USD Coin",
            "symbol": "USDC",
            "address": USDC,
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
        
        TOKEN_B: USDC,
        TOKEN_B_Decimals: 6,
        TOKEN_B_Name: 'USD Coin',
        TOKEN_B_Symbol: 'USDC',
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

      mock({ provider, blockchain, request: { to: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
      mock({ provider, blockchain, request: { to: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', api: Token[blockchain].DEFAULT, method: 'symbol', return: 'SHIB' } })
      mock({ provider, blockchain, request: { to: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', api: Token[blockchain].DEFAULT, method: 'name', return: 'Shiba Inu' } })
      mock({ provider, blockchain, request: { to: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '223456788880000000000' } })
      mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: ['0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', DEPAY], return: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983' }})
      mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [DEPAY, '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'], return: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983' }})
      mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983', api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
      mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983', api: exchange.pair.api, method: 'token0', return: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' }})
      mock({ provider, blockchain, request: { to: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f983', api: exchange.pair.api, method: 'token1', return: DEPAY }})
      mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: ["20000000000000000000", ['0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', DEPAY]], return: ["12200000000000", "20000000000000000000"] }})

      fetchMock.post({
        url: "https://public.depay.com/routes/best",
        body: {
          accounts: { [blockchain]: accounts[0] },
          accept,
        },
      }, {
          blockchain,
          fromToken: DEPAY,
          fromDecimals: 18,
          fromName: "DePay",
          fromSymbol: "DEPAY",
          toToken: DEPAY,
          toAmount: TOKEN_A_AmountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY"
      })

      fetchMock.post({
        url: "https://public.depay.com/routes/all",
        body: {
          accounts: { [blockchain]: accounts[0] },
          accept,
        },
      }, [
        {
          blockchain,
          fromToken: DEPAY,
          fromDecimals: 18,
          fromName: "DePay",
          fromSymbol: "DEPAY",
          toToken: DEPAY,
          toAmount: TOKEN_A_AmountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY"
        },
        {
          blockchain,
          fromToken: USDC,
          fromDecimals: 6,
          fromName: "Usdc",
          fromSymbol: "USDC",
          toToken: DEPAY,
          toAmount: TOKEN_A_AmountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY",
          pairsData: [{ exchange: 'uniswap_v2' }]
        },
        {
          blockchain,
          fromToken: ETH,
          fromDecimals: 18,
          fromName: "Ether",
          fromSymbol: "ETH",
          toToken: DEPAY,
          toAmount: TOKEN_A_AmountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY",
          pairsData: [{ exchange: 'uniswap_v2' }]
        },
        {
          blockchain,
          fromToken: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
          fromDecimals: 18,
          fromName: "Uniswap",
          fromSymbol: "UNI",
          toToken: DEPAY,
          toAmount: TOKEN_A_AmountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY",
          pairsData: [{ exchange: 'uniswap_v2' }]
        },
        {
          blockchain,
          fromToken: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
          fromDecimals: 18,
          fromName: "Shiba Inu",
          fromSymbol: "SHIB",
          toToken: DEPAY,
          toAmount: TOKEN_A_AmountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY",
          pairsData: [{ exchange: 'uniswap_v2' }]
        },
      ])

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DEPAY}?amount=20.0` }, '4')
    })
  })
  
  describe('change payment via categories', () => {

    it('allows me to navigate all categories (Best, Major, Native, Stable & All) and it also allows me to search for a payment option', ()=> {
      let displayedList = []
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then(async(document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()

          // ALL by default (with search focus on desktop)
          cy.get('.Search', { includeShadowDom: true }).focused()
          cy.get('button.Tab.active', { includeShadowDom: true }).contains('All').should('exist')
          cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
            displayedList.push($el.text().trim())
          }).then(() => {
            expect(displayedList).to.deep.equal(['DEPAY', 'ETH', 'USDC', 'UNI', 'SHIB'])
            displayedList = []
          })

          // Best
          cy.get('button.Tab', { includeShadowDom: true }).contains('Best').click().then(()=>{
            cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
              displayedList.push($el.text().trim())
            }).then(() => {
              expect(displayedList).to.deep.equal(['DEPAY'])
              displayedList = []
            })
          })

          // Major
          cy.get('button.Tab', { includeShadowDom: true }).contains('Major').click().then(()=>{
            cy.get('button.Tab.active', { includeShadowDom: true }).contains('Major').should('exist')
            cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
              displayedList.push($el.text().trim())
            }).then(() => {
              expect(displayedList).to.deep.equal(['DEPAY', 'ETH', 'USDC'])
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
              expect(displayedList).to.deep.equal(['USDC'])
              displayedList = []
            })
          })

          // SEARCH
          cy.get('.Search', { includeShadowDom: true }).click().then(()=>{
            cy.get('input[placeholder="Search"]', { includeShadowDom: true }).type('UNI', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
                displayedList.push($el.text().trim())
              }).then(() => {
                expect(displayedList).to.deep.equal(['UNI'])
                displayedList = []
                
                // RESET SEARCH
                cy.get('button.Tab', { includeShadowDom: true }).contains('All').click().then(()=>{
                  cy.get('button.Tab.active', { includeShadowDom: true }).contains('All').should('exist')
                  cy.get('.active .Card .TokenSymbolCell', { includeShadowDom: true }).each(($el) => {
                    displayedList.push($el.text().trim())
                  }).then(() => {
                    expect(displayedList).to.deep.equal(['DEPAY', 'ETH', 'USDC', 'UNI', 'SHIB'])
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
