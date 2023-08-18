import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Server } from 'mock-socket'
import Token from '@depay/web3-tokens'

describe('Payment Widget: track', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const feeReceiver = '0xe7a2Ee8EdaD975D2EcCb04A53Cb020b64Edd0762'
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
    }],
    track: {
      endpoint: '/track/payments'
    }
  }
  const mockedWebsocketServer = new Server('wss://integrate.depay.com/cable')
  const websocketMessages = []

  let TOKEN_A_AmountBN
  let mockedWebsocket
  let provider

  afterEach(closeWidget)

  beforeEach(async ()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)

    ;({ TOKEN_A_AmountBN } = mockBasics({
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
  
  it('tracks payments and just closes the dialog if no forwardTo was defined', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "from_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
                    "from_amount": TOKEN_A_AmountBN.toString(),
                    "from_decimals": 18,
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
                    "to_amount": TOKEN_A_AmountBN.toString(),
                    "to_decimals": 18
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  return(
                    message.command == 'subscribe' &&
                    message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        release: true,
                        status: 'success'
                      }
                    }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').click().then(()=>{
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
    })
  })

  it('displays seconds left if tracking requires more than 1 confirmation', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        confirmations: { required: 13, passed: 2 }
                      }
                    }))
                    cy.wait(1000).then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment 143s').should('exist')
                      cy.get('span[title="2/13 required confirmations"]', { includeShadowDom: true }).should('exist')
                      cy.wait(2000).then(()=>{
                        mockedWebsocket.send(JSON.stringify({
                          message: {
                            release: true,
                            status: 'success'
                          }
                        }))  
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

  it('tracks payments and calls validated callback with payment status', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    let validatedStatus

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments,
          validated: (status)=>{
            validatedStatus = status
          }
        , document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "from_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
                    "from_amount": TOKEN_A_AmountBN.toString(),
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
                    "to_amount": TOKEN_A_AmountBN.toString(),
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  return(
                    message.command == 'subscribe' &&
                    message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        release: true,
                        status: 'success'
                      }
                    }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').click().then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
                          expect(validatedStatus).to.equal(true)
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

  it('tracks payments with fees', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        to: "0xae60ac8e69414c2dc362d0e6a03af643d1d85b92",
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: ["0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"],
          amounts: ["20000000000000000000", "19800000000000000000", anything, '0', '200000000000000000'],
          addresses: [fromAddress, feeReceiver, toAddress],
          plugins: [
            plugins[blockchain].payment.address,
            plugins[blockchain].paymentFee.address
          ],
          data:[]
        }
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "19.8",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: '0.2',
        fee_receiver: feeReceiver,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
        "to_amount": "19800000000000000000",
        "fee_amount": "200000000000000000",
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        defaultArguments
        DePayWidgets.Payment({
          accept: [{
            blockchain,
            amount,
            token: DEPAY,
            receiver: toAddress,
            fee: {
              amount: '1%',
              receiver: feeReceiver
            }
          }],
          track: {
            endpoint: '/track/payments'
          },
          document
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
                    "to_amount": "19800000000000000000",
                    "fee_amount": "200000000000000000",
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  return(
                    message.command == 'subscribe' &&
                    message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        release: true,
                        status: 'success'
                      }
                    }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').click().then(()=>{
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
    })
  })

  it('tracks payments asynchnously if configured that way', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, track: {
          endpoint: '/track/payments',
          async: true
        }, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').should('not.exist')
                })
              })
            })
          })
        })
      })
    })
  })

  it('does not release the user if tracking has not been initialized but transaction has been confirmed', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let attempt = 0
    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
      },
      matchPartialBody: true,
    }, (endpoint, request)=>{
      let data = JSON.parse(request.body)
      attempt += 1
      if(attempt == 1) {
        return 200 // pretrack
      } else if(data.transaction && attempt <= 3) {
        return 500
      } else { 
        return 200
      }
    })

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, track: {
          endpoint: '/track/payments',
          async: true
        }, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary.disabled').should('contain.text', 'Close')
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Initializing tracking')
                  cy.wait(1000).then(()=>{
                    cy.wait(3000).then(()=>{
                      cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Initializing tracking').should('not.exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Close').should('exist')
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

  it('tracks payments and forwards directly if forwardTo was specified by the backend end', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  return(
                    message.command == 'subscribe' &&
                    message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      identifier: JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' }),
                      message: {
                        release: true,
                        status: 'success',
                        forward_to: '/somethingelse'
                      }
                    }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').invoke('attr', 'href').should('include', '/somethingelse')
                      cy.location('href').should('include', '/somethingelse')
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

  it('confirms payment via tracking before rpc', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              cy.wait(1000).then(()=>{
                mockedWebsocket.send(JSON.stringify({
                  message: {
                    release: true,
                    status: 'success'
                  }
                }))
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  return(
                    message.command == 'subscribe' &&
                    message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Continue').should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').click().then(()=>{
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

  it.only('immediately shows failed payment and allows for a retry if payment confirmed "failed" through websocket', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, 200)

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "nonce": "0",
                    "after_block": "1",
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              cy.wait(1000).then(()=>{
                mockedWebsocket.send(JSON.stringify({
                  message: {
                    release: true,
                    status: 'failed'
                  }
                }))
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  return(
                    message.command == 'subscribe' &&
                    message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                  )
                })).to.equal(true)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('h1').should('contain.text', 'Payment Failed')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a', 'View details').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
                  cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
                })
              })
            })
          })
        })
      })
    })
  })

  it('tries tracking request multiple times', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let attempt = 0
    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, ()=>{
      attempt += 1
      if(attempt == 1) {
        return 200 // pretrack
      } else if(attempt <= 2) {
        return 502
      } else {
        return 200
      }
    })

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
                expect(
                  fetchMock.calls().filter((call)=>{ return call[0] == '/track/payments' && call.response.status == 502 }).length
                ).to.equal(1)
                expect(
                  fetchMock.calls().filter((call)=>{ return call[0] == '/track/payments' && call.response.status == 200 }).length
                ).to.equal(2)
                confirm(mockedTransaction)
                cy.wait(5000).then(()=>{
                  expect(!!websocketMessages.find((rawMessage)=>{
                    let message = JSON.parse(rawMessage)
                    return(
                      message.command == 'subscribe' &&
                      message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                    )
                  })).to.equal(true)
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                      mockedWebsocket.send(JSON.stringify({
                        message: {
                          release: true,
                          status: 'success'
                        }
                      }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').click().then(()=>{
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
      })
    })
  })

  it('shows error dialog if payment tracking fails allowing you to ensure internet connection and try again', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    let attempt = 0
    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      headers: {
        'x-custom-header': '1'
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, (request, second)=>{
      attempt += 1
      if(attempt == 1) {
        return 200 // pretrack
      } else if(attempt <= 3) {
        return 502
      } else {
        return 200
      }
    })

    mockedWebsocketServer.on('connection', socket => {
      mockedWebsocket = socket
      mockedWebsocket.on('message', data => {
        websocketMessages.push(data)
      })
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document, track: {
          method: async(payment)=>{
            let response = await fetch('/track/payments', {
              method: 'POST',
              body: JSON.stringify(payment),
              headers: { "Content-Type": "application/json", "x-custom-header": "1" }
            })
            if(response.status !== 200){ throw 'TRACKING FAILED' }
          },
          attempts: 2
        }})
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
                expect(
                  fetchMock.calls().filter((call)=>{ return call[0] == '/track/payments' && call.response.status == 502 }).length
                ).to.equal(2)

                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Tracking payment failed')
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'Please ensure you are connected to the internet, then click "Try again".')
                
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click().then(()=>{
                  cy.wait(3000).then(()=>{
                    expect(
                      fetchMock.calls().filter((call)=>{ return call[0] == '/track/payments' && call.response.status == 200 }).length
                    ).to.equal(2)
                    confirm(mockedTransaction)
                    cy.wait(1000).then(()=>{
                      expect(!!websocketMessages.find((rawMessage)=>{
                        let message = JSON.parse(rawMessage)
                        return(
                          message.command == 'subscribe' &&
                          message.identifier == JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' })
                        )
                      })).to.equal(true)
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Validating payment').find('.Loading')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                          mockedWebsocket.send(JSON.stringify({
                            message: {
                              release: true,
                              status: 'success'
                            }
                          }))
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').click().then(()=>{
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
          })
        })
      })
    })
  })

  it('allows to configure additional polling endpoint to retrieve payment status in case socket communication fails', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, 200)

    let attempt = 0
    fetchMock.post({
      url: "/payments/status",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, ()=>{
      attempt += 1
      if(attempt <= 2) {
        return 404
      } else {
        return {
          forward_to: '/somethingelse'
        }
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let errorCallbackError
        DePayWidgets.Payment({ ...defaultArguments, document,
          track: {
            endpoint: '/track/payments',
            poll: {
              endpoint: '/payments/status'
            }
          }
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
                confirm(mockedTransaction)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').invoke('attr', 'href').should('include', '/somethingelse')
                        cy.location('href').should('include', '/somethingelse')
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

  it('allows to configure additional polling method to retrieve payment status in case socket communication fails', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, 200)

    let attempt = 0
    fetchMock.post({
      url: "/payments/status",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      headers: {
        'x-custom-header': '1'
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, ()=>{
      attempt += 1
      if(attempt <= 2) {
        return 404
      } else {
        return {
          forward_to: '/somethingelse'
        }
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let errorCallbackError
        DePayWidgets.Payment({ ...defaultArguments, document,
          track: {
            endpoint: '/track/payments',
            poll: {
              method: async (payment)=>{
                let response = await fetch('/payments/status', {
                  method: 'POST',
                  body: JSON.stringify(payment),
                  headers: { "Content-Type": "application/json", "x-custom-header": "1" }
                })
                if(response.status == 200) {
                  let json = await response.json()
                  return json
                }
              }
            }
          }
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
                confirm(mockedTransaction)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment validated').find('.Checkmark')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').should('exist')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Continue').invoke('attr', 'href').should('include', '/somethingelse')
                        cy.location('href').should('include', '/somethingelse')
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

  it('allows to configure additional polling method to retrieve payment status in case socket communication fails without forward_to', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: "0",
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
      matchPartialBody: true
    }, 201)

    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "nonce": "0",
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, 200)

    let attempt = 0
    fetchMock.post({
      url: "/payments/status",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      headers: {
        'x-custom-header': '1'
      },
      matchPartialBody: true,
      overwriteRoutes: false
    }, ()=>{
      attempt += 1
      if(attempt <= 2) {
        return 404
      } else {
        return {}
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let errorCallbackError
        DePayWidgets.Payment({ ...defaultArguments, document,
          track: {
            endpoint: '/track/payments',
            poll: {
              method: async (payment)=>{
                let response = await fetch('/payments/status', {
                  method: 'POST',
                  body: JSON.stringify(payment),
                  headers: { "Content-Type": "application/json", "x-custom-header": "1" }
                })
                if(response.status == 200) {
                  let json = await response.json()
                  return json
                }
              }
            }
          }
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.grey').should('contain.text', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying').then(()=>{
                confirm(mockedTransaction)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
                      cy.wait(5000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
                        cy.wait(1000).then(()=>{
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
      })
    })
  })
})
