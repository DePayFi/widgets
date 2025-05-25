import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything, trigger } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

describe('Payment Widget: change account', () => {
  
  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  const accept = [{
    blockchain,
    amount,
    token: DEPAY,
    receiver: toAddress
  }]
  const defaultArguments = {
    accept
  }

  let provider
  let exchange
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN

  afterEach(closeWidget)

  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    
    cy.then(() => getProvider(blockchain)).then((provider) => {
    
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

      fetchMock.post('https://public.depay.com/routes/best',
        (url, opts) => {
          const req = JSON.parse(opts.body)
          if(req.accounts[blockchain] == '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045') {
            return {
              blockchain,
              fromToken: DEPAY,
              fromDecimals: 18,
              fromName: "DePay",
              fromSymbol: "DePay",
              toToken: DEPAY,
              toAmount: TOKEN_A_AmountBN.toString(),
              toDecimals: 18,
              toName: "DePay",
              toSymbol: "DEPAY",
            }
          } else if(req.accounts[blockchain] == '0x8a4aDA571ab235BF7d586d02E534D08552B3dedb') {
            return {
              blockchain,
              fromToken: DAI,
              fromDecimals: 18,
              fromName: "Dai",
              fromSymbol: "DAI",
              toToken: DEPAY,
              toAmount: TOKEN_A_AmountBN.toString(),
              toDecimals: 18,
              toName: "DePay",
              toSymbol: "DEPAY",
              pairsData: [{ exchange: 'uniswap_v2' }]
            }
          }
        }
      )

      fetchMock.post('https://public.depay.com/routes/all',
        (url, opts) => {
          const req = JSON.parse(opts.body)
          if(req.accounts[blockchain] == '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045') {
            return [{
              blockchain,
              fromToken: DEPAY,
              fromDecimals: 18,
              fromName: "DePay",
              fromSymbol: "DePay",
              toToken: DEPAY,
              toAmount: TOKEN_A_AmountBN.toString(),
              toDecimals: 18,
              toName: "DePay",
              toSymbol: "DEPAY",
            }]
          } else if(req.accounts[blockchain] == '0x8a4aDA571ab235BF7d586d02E534D08552B3dedb') {
            return [{
              blockchain,
              fromToken: DAI,
              fromDecimals: 18,
              fromName: "Dai",
              fromSymbol: "DAI",
              toToken: DEPAY,
              toAmount: TOKEN_A_AmountBN.toString(),
              toDecimals: 18,
              toName: "DePay",
              toSymbol: "DEPAY",
              pairsData: [{ exchange: 'uniswap_v2' }]
            }]
          }
        }
      )

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DEPAY}?amount=20.0` }, '4')
      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DAI}?amount=33.165` }, '33.165')

    })
  })

  it('reloads the widget for the new account if account changed', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'DEPAY').should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay')
          cy.wait(1000).then(()=>{

            mockBasics({
              provider,
              blockchain,

              fromAddress: '0x8a4aDA571ab235BF7d586d02E534D08552B3dedb',
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
              USD_AmountOut: 33
            })

            const newAccount = '0x8a4aDA571ab235BF7d586d02E534D08552B3dedb'
            mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [newAccount, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
            mock({ blockchain, accounts: { return: [newAccount] }, wallet: 'metamask' })
            trigger('accountsChanged', [newAccount])
            cy.wait(2000).then(()=>{
              let mockedTransaction = mock({
                blockchain,
                transaction: {
                  from: newAccount,
                  to: routers[blockchain].address,
                  api: routers[blockchain].api,
                  method: 'pay',
                  params: {
                    payment: {
                      amountIn: ethers.utils.parseUnits('33.165', 18),
                      permit2: false,
                      paymentAmount: ethers.utils.parseUnits('20', 18),
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

              fetchMock.post({
                url: "https://public.depay.com/payments",
                body: {
                  after_block: "2",
                  amount: "20.0",
                  blockchain: "ethereum",
                  confirmations: 1,
                  fee_amount: null,
                  fee_receiver: null,
                  nonce: "0",
                  payload: {
                    sender_amount: "20.0",
                    sender_id: newAccount,
                    sender_token_id: DEPAY,
                    type: 'payment'
                  },
                  receiver: toAddress,
                  sender: newAccount,
                  token: DEPAY,
                  transaction: mockedTransaction.transaction._id,
                  uuid: mockedTransaction.transaction._id,
                },
                matchPartialBody: true
              }, 201)

              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'DAI').should('exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                expect(mockedTransaction.calls.count()).to.equal(1)
              })
            })
          })
        })
      })
    })
  })
})
