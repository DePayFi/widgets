import Blockchains from '@depay/web3-blockchains'
import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockAmountsIn from '../../../tests/mocks/evm/amountsIn'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Server } from 'mock-socket'

describe('Payment Widget: signature approval', () => {

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
    amount,
    blockchain,
    receiver: toAddress,
    token: DEPAY,
  }]
  const defaultArguments = { 
    accept,
    track: {
      endpoint: 'https://depay.test/track'
    }
  }
  
  let provider
  let TOKEN_A_AmountBN
  let WRAPPED_AmountInBN
  let exchange
  let rawSignature = "0x123456"
  let mockedTransaction
  let mockedPermit2ApprovalTransaction

  afterEach(closeWidget)

  const mockedWebsocketServer = new Server('wss://integrate.depay.com/cable')
  const websocketMessages = []
  let mockedWebsocket
  mockedWebsocketServer.on('connection', socket => {
    mockedWebsocket = socket
    mockedWebsocket.on('message', data => {
      websocketMessages.push(data)
    })
  })

  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    
    cy.then(() => getProvider(blockchain)).then((provider) => {

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

      mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].zero } })

      mock({
        provider,
        blockchain,
        request: {
          to: Blockchains[blockchain].permit2,
          api: [{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"AllowanceExpired","type":"error"},{"inputs":[],"name":"ExcessiveInvalidation","type":"error"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"uint256","name":"maxAmount","type":"uint256"}],"name":"InvalidAmount","type":"error"},{"inputs":[],"name":"InvalidContractSignature","type":"error"},{"inputs":[],"name":"InvalidNonce","type":"error"},{"inputs":[],"name":"InvalidSignature","type":"error"},{"inputs":[],"name":"InvalidSignatureLength","type":"error"},{"inputs":[],"name":"InvalidSigner","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[{"internalType":"uint256","name":"signatureDeadline","type":"uint256"}],"name":"SignatureExpired","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"spender","type":"address"}],"name":"Lockdown","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint48","name":"newNonce","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"oldNonce","type":"uint48"}],"name":"NonceInvalidation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"nonce","type":"uint48"}],"name":"Permit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"word","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mask","type":"uint256"}],"name":"UnorderedNonceInvalidation","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint48","name":"newNonce","type":"uint48"}],"name":"invalidateNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wordPos","type":"uint256"},{"internalType":"uint256","name":"mask","type":"uint256"}],"name":"invalidateUnorderedNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"internalType":"struct IAllowanceTransfer.TokenSpenderPair[]","name":"approvals","type":"tuple[]"}],"name":"lockdown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"nonceBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails[]","name":"details","type":"tuple[]"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitBatch","name":"permitBatch","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"internalType":"struct IAllowanceTransfer.AllowanceTransferDetails[]","name":"transferDetails","type":"tuple[]"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}],
          method: 'nonceBitmap',
          params: [fromAddress, "0"],
          return: "0"
        }
      })

      mock({
        blockchain,
        signature: {
          params:[
            "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            {
              "domain": {"name":"Permit2","chainId":"1","verifyingContract":"0x000000000022D473030F116dDEE9F6B43aC78BA3"},
              "types": {"TokenPermissions":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"PermitTransferFrom":[{"name":"permitted","type":"TokenPermissions"},{"name":"spender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]},
              "message":{
                "permitted": {
                  "token":"0x6B175474E89094C44Da98b954EedeAC495271d0F",
                  "amount":"33165000000000000000"
                },
                "spender":"0x365f7B56D2fB16C8Af89D7d33b420E4e013461e8",
                "nonce":"0",
                "deadline": anything
              },
            "primaryType":"PermitTransferFrom"
          }],
          delay: 2000,
          return: rawSignature
        }
      })

      mockedTransaction = mock({
        blockchain,
        transaction: {
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'pay',
          params: [
            [
              '33165000000000000000',
              "20000000000000000000",
              "0",
              "0",
              "0",
              anything,
              DAI,
              exchange.router.address,
              DEPAY,
              toAddress,
              Blockchains[blockchain].zero,
              Blockchains[blockchain].zero,
              1,
              0,
              true,
              anything,
              Blockchains[blockchain].zero,
            ],
            [
              [
                [
                  DAI,
                  '33165000000000000000',
                ],
                "0",
                anything,
              ],
              rawSignature,
            ]
          ],
          value: 0
        }
      })

      mockedPermit2ApprovalTransaction = mock({
        blockchain,
        transaction: {
          from: fromAddress,
          to: DAI,
          api: Token[blockchain].DEFAULT,
          method: 'approve',
          params: [Blockchains[blockchain].permit2, Blockchains[blockchain].maxInt]
        }
      })

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DEPAY}?amount=20.0` }, '4')
      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DAI}?amount=33.165` }, '33.165')
      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DAI}?amount=35.175` }, '35.175')

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
        },
      ])

      fetchMock.post({
        url: "https://depay.test/track",
        body: {},
        matchPartialBody: true
      }, 200)
    })
  })
  
  it('allows me to switch to signature approval and asks me to approve the token spending for the permit2 before I can execute the payment', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Approval').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Radio').contains('Signature').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Save and return').click().then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click().then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Enabling signature approval for DAI...').then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.disabled').should('contain.text', 'Approve spending DAI')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.disabled').should('contain.text', 'Perform payment')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.disabled').should('contain.text', 'Wait for payment confirmation')
                  })
                  confirm(mockedPermit2ApprovalTransaction)
                  cy.wait(5000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Approve spending DAI').then(()=>{
                      cy.wait(3000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Performing payment').then(()=>{
                          confirm(mockedTransaction)
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Confirming payment').then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Signature approval for DAI enabled')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Spending DAI approved')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Perform payment')
                            mockedWebsocket.send(JSON.stringify({
                              message: {
                                release: true,
                                status: 'success'
                              }
                            }))
                            cy.wait(1000).then(()=>{
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Payment confirmed')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
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
        })
      })
    })
  })
  
  it('resets back to overview if I decline the permit2 approval transaction (e.g. reject metamask)', () => {
    mockedPermit2ApprovalTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DAI,
        api: Token[blockchain].DEFAULT,
        method: 'approve',
        params: [Blockchains[blockchain].permit2, Blockchains[blockchain].maxInt],
        return: Error('MetaMask Tx Signature: User denied transaction signature.')
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Approval').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Radio').contains('Signature').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Save and return').click().then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click().then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('not.exist')
                  mockedPermit2ApprovalTransaction = mock({
                    blockchain,
                    transaction: {
                      from: fromAddress,
                      to: DAI,
                      api: Token[blockchain].DEFAULT,
                      method: 'approve',
                      params: [Blockchains[blockchain].permit2, Blockchains[blockchain].maxInt],
                    }
                  })
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click().then(()=>{
                    confirm(mockedPermit2ApprovalTransaction)
                    cy.wait(5000).then(()=>{
                      cy.wait(3000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Performing payment').then(()=>{
                          confirm(mockedTransaction)
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Confirming payment').then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Signature approval for DAI enabled')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Spending DAI approved')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Perform payment')
                            mockedWebsocket.send(JSON.stringify({
                              message: {
                                release: true,
                                status: 'success'
                              }
                            }))
                            cy.wait(1000).then(()=>{
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Payment confirmed')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
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
        })
      })
    })
  })

  it('resets back to overview if I decline the approval signature (e.g. reject metamask) and allows me to reperform the signature and continue with the payment', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
        mock({
          blockchain,
          signature: {
            params:[
              "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
              {
                "domain": {"name":"Permit2","chainId":"1","verifyingContract":"0x000000000022D473030F116dDEE9F6B43aC78BA3"},
                "types": {"TokenPermissions":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"PermitTransferFrom":[{"name":"permitted","type":"TokenPermissions"},{"name":"spender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]},
                "message":{
                  "permitted": {
                    "token":"0x6B175474E89094C44Da98b954EedeAC495271d0F",
                    "amount":"33165000000000000000"
                  },
                  "spender":"0x365f7B56D2fB16C8Af89D7d33b420E4e013461e8",
                  "nonce":"0",
                  "deadline": anything
                },
              "primaryType":"PermitTransferFrom"
            }],
            delay: 2000,
            return: Error('MetaMask Tx Signature: User denied transaction signature.')
          }
        })
        cy.wait(1000).then(()=>{
          mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].maxInt } })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Approval').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Radio').contains('Signature').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Save and return').click().then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click().then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('not.exist')
                  cy.wait(1000).then(()=>{
                    mock({
                      blockchain,
                      signature: {
                        params:[
                          "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                          {
                            "domain": {"name":"Permit2","chainId":"1","verifyingContract":"0x000000000022D473030F116dDEE9F6B43aC78BA3"},
                            "types": {"TokenPermissions":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"PermitTransferFrom":[{"name":"permitted","type":"TokenPermissions"},{"name":"spender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]},
                            "message":{
                              "permitted": {
                                "token":"0x6B175474E89094C44Da98b954EedeAC495271d0F",
                                "amount":"33165000000000000000"
                              },
                              "spender":"0x365f7B56D2fB16C8Af89D7d33b420E4e013461e8",
                              "nonce":"0",
                              "deadline": anything
                            },
                          "primaryType":"PermitTransferFrom"
                        }],
                        delay: 2000,
                        return: rawSignature
                      }
                    })
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Approve and pay').click().then(()=>{
                      confirm(mockedPermit2ApprovalTransaction)
                      cy.wait(5000).then(()=>{
                        cy.wait(3000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Performing payment').then(()=>{
                            confirm(mockedTransaction)
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.active').should('contain.text', 'Confirming payment').then(()=>{
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Signature approval for DAI enabled')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Spending DAI approved')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Perform payment')
                              mockedWebsocket.send(JSON.stringify({
                                message: {
                                  release: true,
                                  status: 'success'
                                }
                              }))
                              cy.wait(1000).then(()=>{
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.small.done').should('contain.text', 'Payment confirmed')
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
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
          })
        })
      })
    })
  })

  describe('permit2 approval already exists', ()=>{

    it('auto selects signature based approval, and allows me to perform a payment with a signature', () => {

      mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].maxInt } })
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select DAI as payment"]').click()
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Approval').click().then(()=>{
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Radio').contains('Signature').parents('.Radio').find('input[type="radio"]').invoke('prop', 'checked').should('eq', true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Save and return').click()
              })
            })
          })
        })
      })
    })
  })
})
