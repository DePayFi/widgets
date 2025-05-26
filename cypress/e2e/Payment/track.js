import Blockchains from '@depay/web3-blockchains'
import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { mock, confirm, fail, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Server } from 'mock-socket'

describe('Payment Widget: track', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const feeReceiver = '0xe7a2Ee8EdaD975D2EcCb04A53Cb020b64Edd0762'
  const fee2Receiver = '0xb87D81203FD2E881FBe0Bae6C01E1a5a3d98C456'
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
  let defaultArguments = {
    accept,
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

  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    
    cy.then(() => getProvider(blockchain)).then((provider) => {

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

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DEPAY}?amount=20.0` }, '4')
    })
  })
  
  it('tracks payments and just closes the dialog if no forwardTo was defined', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
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
                  let identifier = JSON.parse(message.identifier)
                  return(
                    message.command == 'subscribe' &&
                    identifier.channel == 'PaymentChannel' &&
                    identifier.blockchain == blockchain &&
                    identifier.sender == fromAddress &&
                    identifier.receiver == toAddress &&
                    identifier.deadline != undefined
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        release: true,
                        status: 'success'
                      }
                    }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').click().then(()=>{
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        confirmations: { required: 13, passed: 2 }
                      }
                    }))
                    cy.wait(1000).then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', '132s').should('exist')
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

  it('tracks payments with fees', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: "20000000000000000000",
            permit2: false,
            paymentAmount: "18100000000000000000",
            feeAmount: "1000000000000000000",
            feeAmount2: "600000000000000000",
            protocolAmount: "300000000000000000",
            tokenInAddress: "0xa0bed124a09ac2bd941b10349d8d224fe3c955eb",
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: "0xa0bed124a09ac2bd941b10349d8d224fe3c955eb",
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: feeReceiver,
            feeReceiverAddress2: fee2Receiver,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
        "after_block": "1",
        "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
        "to_amount": "18100000000000000000",
        "fee_amount": "1000000000000000000",
        "fee2_amount": "600000000000000000",
        "protocol_fee_amount": "300000000000000000",
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
              amount: '5%',
              receiver: feeReceiver
            },
            fee2: {
              amount: '3%',
              receiver: fee2Receiver
            },
            protocolFee: '1.5%'
          }],
          track: {
            endpoint: '/track/payments'
          },
          document
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
                    "after_block": "1",
                    "to_token": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
                    "to_amount": "18100000000000000000",
                    "fee_amount": "1000000000000000000",
                    "fee2_amount": "600000000000000000",
                    "protocol_fee_amount": "300000000000000000",
                  },
                  matchPartialBody: true
                })
              ).to.equal(true)
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  let identifier = JSON.parse(message.identifier)
                  return(
                    message.command == 'subscribe' &&
                    identifier.channel == 'PaymentChannel' &&
                    identifier.blockchain == blockchain &&
                    identifier.sender == fromAddress &&
                    identifier.receiver == toAddress &&
                    identifier.deadline != undefined
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      message: {
                        release: true,
                        status: 'success'
                      }
                    }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').find('.Checkmark')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').click().then(()=>{
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
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
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('not.exist')
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

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
      } else if(data.transaction && attempt <= 5) {
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Initializing tracking').should('not.exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              confirm(mockedTransaction)
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Initializing tracking')
                  cy.wait(4000).then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Initializing tracking').should('not.exist')
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

  it('tracks payments and forwards directly if forwardTo was specified by the backend end', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
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
                  let identifier = JSON.parse(message.identifier)
                  return(
                    message.command == 'subscribe' &&
                    identifier.channel == 'PaymentChannel' &&
                    identifier.blockchain == blockchain &&
                    identifier.sender == fromAddress &&
                    identifier.receiver == toAddress &&
                    identifier.deadline != undefined
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                    mockedWebsocket.send(JSON.stringify({
                      identifier: JSON.stringify({ blockchain, sender: fromAddress, nonce: "0", channel: 'PaymentChannel' }),
                      message: {
                        release: true,
                        status: 'success',
                        forward_to: '/somethingelse'
                      }
                    }))
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

  it('confirms payment via tracking before rpc', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
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
                  let identifier = JSON.parse(message.identifier)
                  return(
                    message.command == 'subscribe' &&
                    identifier.channel == 'PaymentChannel' &&
                    identifier.blockchain == blockchain &&
                    identifier.sender == fromAddress &&
                    identifier.receiver == toAddress &&
                    identifier.deadline != undefined
                  )
                })).to.equal(true)
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').find('.Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').click().then(()=>{
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

  it('immediately shows failed payment and allows for a retry if payment confirmed "failed" through websocket', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
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
                    status: 'failed',
                    failed_reason: 'FAILED',
                  }
                }))
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  let identifier = JSON.parse(message.identifier)
                  return(
                    message.command == 'subscribe' &&
                    identifier.channel == 'PaymentChannel' &&
                    identifier.blockchain == blockchain &&
                    identifier.sender == fromAddress &&
                    identifier.receiver == toAddress &&
                    identifier.deadline != undefined
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
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
                        let identifier = JSON.parse(message.identifier)
                        return(
                          message.command == 'subscribe' &&
                          identifier.channel == 'PaymentChannel' &&
                          identifier.blockchain == blockchain &&
                          identifier.sender == fromAddress &&
                          identifier.receiver == toAddress &&
                          identifier.deadline != undefined
                        )
                      })).to.equal(true)
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                      mockedWebsocket.send(JSON.stringify({
                        message: {
                          release: true,
                          status: 'success'
                        }
                      }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').find('.Checkmark')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').click().then(()=>{
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let attempt = 0
    fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
      console.log('attempt', attempt)
      if(attempt == 1) {
        return 200 // pretrack
      } else if(attempt <= 11) {
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
        }})
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              confirm(mockedTransaction)
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').find('.Checkmark')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('not.exist')
              cy.wait(4000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Confirming payment').then(()=>{
                  cy.wait(4000).then(()=>{
                    expect(
                      fetchMock.calls().filter((call)=>{ return call[0] == '/track/payments' && call.response.status == 502 }).length > 5
                    ).to.equal(true)

                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Tracking payment failed')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'Please ensure you are connected to the internet, then click "Try again".')
                    
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click().then(()=>{
                      cy.wait(3000).then(()=>{
                        expect(
                          fetchMock.calls().filter((call)=>{ return call[0] == '/track/payments' && call.response.status == 200 }).length > 1
                        ).to.equal(true)
                        confirm(mockedTransaction)
                        cy.wait(1000).then(()=>{
                          expect(!!websocketMessages.find((rawMessage)=>{
                            let message = JSON.parse(rawMessage)
                            let identifier = JSON.parse(message.identifier)
                            return(
                              message.command == 'subscribe' &&
                              identifier.channel == 'PaymentChannel' &&
                              identifier.blockchain == blockchain &&
                              identifier.sender == fromAddress &&
                              identifier.receiver == toAddress &&
                              identifier.deadline != undefined
                            )
                          })).to.equal(true)
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                              mockedWebsocket.send(JSON.stringify({
                                message: {
                                  release: true,
                                  status: 'success'
                                }
                              }))
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').then(()=>{
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').find('.Checkmark')
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').click().then(()=>{
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
    })
  })

  it('displays validation failed error asking to contact support', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
            receiverType: 0,
            exchangeCallData: anything,
            receiverCallData: Blockchains[blockchain].zero,
            deadline: anything,
          }
        },
        value: 0
      }
    })

    let trackingRequestMock = fetchMock.post({
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
      cy.document().then(async(document)=>{
        let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
              expect(
                fetchMock.called('/track/payments', {
                  body: {
                    "blockchain": blockchain,
                    "sender": fromAddress,
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
                    status: 'failed',
                    failed_reason: 'MISMATCH',
                  }
                }))
                expect(!!websocketMessages.find((rawMessage)=>{
                  let message = JSON.parse(rawMessage)
                  let identifier = JSON.parse(message.identifier)
                  return(
                    message.command == 'subscribe' &&
                    identifier.channel == 'PaymentChannel' &&
                    identifier.blockchain == blockchain &&
                    identifier.sender == fromAddress &&
                    identifier.receiver == toAddress &&
                    identifier.deadline != undefined
                  )
                })).to.equal(true)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Validation failed')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming the payment failed')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Please contact support')
                  cy.wait(1000).then(()=>{
                    try{
                      unmount()
                    } catch(e) { console.log('ERROR', e) }
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
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
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
                confirm(mockedTransaction)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
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

  it('allows to configure additional polling method to retrieve payment status in case socket communication fails', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
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
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.wait(9000).then(()=>{
              confirm(mockedTransaction)
              cy.wait(1000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                  cy.wait(3000).then(()=>{
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

  it('allows to configure additional polling method to retrieve payment status in case socket communication fails without forward_to', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
        params: {
          payment: {
            amountIn: ethers.utils.parseUnits('20', 18),
            permit2: false,
            paymentAmount: "20000000000000000000",
            feeAmount: 0,
            tokenInAddress: DEPAY,
            exchangeAddress: Blockchains[blockchain].zero,
            tokenOutAddress: DEPAY,
            paymentReceiverAddress: toAddress,
            feeReceiverAddress: Blockchains[blockchain].zero,
            exchangeType: 0,
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
      url: "/track/payments",
      body: {
        "blockchain": blockchain,
        "sender": fromAddress,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
            cy.wait(1000).then(()=>{
                cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                confirm(mockedTransaction)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').should('exist').then(()=>{
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

  describe('calls configured callbacks', ()=> {

    let sentCallback
    let succeededCallback
    let failedCallback
    let validatedCallback
  
    beforeEach(()=>{
      defaultArguments = { 
        accept,
        track: {
          endpoint: '/track/payments'
        },
        sent: (transaction, paymentRoute)=>{
          sentCallback = { transaction, paymentRoute }
        },
        succeeded: (transaction, paymentRoute)=>{
          succeededCallback = { transaction, paymentRoute }
        },
        failed: (transaction, paymentRoute)=>{
          failedCallback = { transaction, paymentRoute }
        },
        validated: (transaction, paymentRoute)=>{
          validatedCallback = { transaction, paymentRoute }
        }
      }
      sentCallback = undefined
      succeededCallback = undefined
      failedCallback = undefined
      validatedCallback = undefined
    })

    it('calls sent, succeeded and validated (success == true) callback', ()=> {
      let mockedTransaction = mock({
        blockchain,
        transaction: {
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'pay',
          params: {
            payment: {
              amountIn: ethers.utils.parseUnits('20', 18),
              permit2: false,
              paymentAmount: "20000000000000000000",
              feeAmount: 0,
              tokenInAddress: DEPAY,
              exchangeAddress: Blockchains[blockchain].zero,
              tokenOutAddress: DEPAY,
              paymentReceiverAddress: toAddress,
              feeReceiverAddress: Blockchains[blockchain].zero,
              exchangeType: 0,
              receiverType: 0,
              exchangeCallData: anything,
              receiverCallData: Blockchains[blockchain].zero,
              deadline: anything,
            }
          },
          value: 0
        }
      })

      let trackingRequestMock = fetchMock.post({
        url: "/track/payments",
        body: {
          "blockchain": blockchain,
          "sender": fromAddress,
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
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
                expect(
                  fetchMock.called('/track/payments', {
                    body: {
                      "blockchain": blockchain,
                      "sender": fromAddress,
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
                    let identifier = JSON.parse(message.identifier)
                    return(
                      message.command == 'subscribe' &&
                      identifier.channel == 'PaymentChannel' &&
                      identifier.blockchain == blockchain &&
                      identifier.sender == fromAddress &&
                      identifier.receiver == toAddress &&
                      identifier.deadline != undefined
                    )
                  })).to.equal(true)
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                      mockedWebsocket.send(JSON.stringify({
                        message: {
                          release: true,
                          status: 'success'
                        }
                      }))
                      cy.wait(2000).then(()=>{
                        expect(sentCallback.transaction.blockchain).to.equal('ethereum')
                        expect(sentCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                        expect(sentCallback.transaction.from).to.equal(fromAddress)
                        expect(sentCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                        expect(sentCallback.paymentRoute.blockchain).to.equal('ethereum')
                        expect(sentCallback.paymentRoute.fromAddress).to.equal(fromAddress)

                        expect(succeededCallback.transaction.blockchain).to.equal('ethereum')
                        expect(succeededCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                        expect(succeededCallback.transaction.from).to.equal(fromAddress)
                        expect(succeededCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                        expect(succeededCallback.paymentRoute.blockchain).to.equal('ethereum')
                        expect(succeededCallback.paymentRoute.fromAddress).to.equal(fromAddress)
                        
                        expect(failedCallback?.transaction).to.equal(undefined)
                        expect(failedCallback?.paymentRoute).to.equal(undefined)

                        expect(validatedCallback.transaction.blockchain).to.equal('ethereum')
                        expect(validatedCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                        expect(validatedCallback.transaction.from).to.equal(fromAddress)
                        expect(validatedCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                        expect(validatedCallback.paymentRoute.blockchain).to.equal('ethereum')
                        expect(validatedCallback.paymentRoute.fromAddress).to.equal(fromAddress)
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

    it('calls sent, succeeded and no validated callback (if validation failed)', ()=>{
      let mockedTransaction = mock({
        blockchain,
        transaction: {
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'pay',
          params: {
            payment: {
              amountIn: ethers.utils.parseUnits('20', 18),
              permit2: false,
              paymentAmount: "20000000000000000000",
              feeAmount: 0,
              tokenInAddress: DEPAY,
              exchangeAddress: Blockchains[blockchain].zero,
              tokenOutAddress: DEPAY,
              paymentReceiverAddress: toAddress,
              feeReceiverAddress: Blockchains[blockchain].zero,
              exchangeType: 0,
              receiverType: 0,
              exchangeCallData: anything,
              receiverCallData: Blockchains[blockchain].zero,
              deadline: anything,
            }
          },
          value: 0
        }
      })

      let trackingRequestMock = fetchMock.post({
        url: "/track/payments",
        body: {
          "blockchain": blockchain,
          "sender": fromAddress,
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
        cy.document().then(async(document)=>{
          let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment').then(()=>{
                expect(
                  fetchMock.called('/track/payments', {
                    body: {
                      "blockchain": blockchain,
                      "sender": fromAddress,
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
                    let identifier = JSON.parse(message.identifier)
                    return(
                      message.command == 'subscribe' &&
                      identifier.channel == 'PaymentChannel' &&
                      identifier.blockchain == blockchain &&
                      identifier.sender == fromAddress &&
                      identifier.receiver == toAddress &&
                      identifier.deadline != undefined
                    )
                  })).to.equal(true)
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').should('not.exist')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirming payment').should('exist').then(()=>{
                      mockedWebsocket.send(JSON.stringify({
                        message: {
                          release: true,
                          status: 'failed',
                          failed_reason: 'MISMATCH'
                        }
                      }))
                      cy.wait(2000).then(()=>{
                        expect(sentCallback.transaction.blockchain).to.equal('ethereum')
                        expect(sentCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                        expect(sentCallback.transaction.from).to.equal(fromAddress)
                        expect(sentCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                        expect(sentCallback.paymentRoute.blockchain).to.equal('ethereum')
                        expect(sentCallback.paymentRoute.fromAddress).to.equal(fromAddress)

                        expect(succeededCallback.transaction.blockchain).to.equal('ethereum')
                        expect(succeededCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                        expect(succeededCallback.transaction.from).to.equal(fromAddress)
                        expect(succeededCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                        expect(succeededCallback.paymentRoute.blockchain).to.equal('ethereum')
                        expect(succeededCallback.paymentRoute.fromAddress).to.equal(fromAddress)
                        
                        expect(failedCallback?.transaction).to.equal(undefined)
                        expect(failedCallback?.paymentRoute).to.equal(undefined)

                        expect(validatedCallback?.transaction).to.equal(undefined)
                        expect(validatedCallback?.paymentRoute).to.equal(undefined)

                        unmount()
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

    it('calls sent, and failed callback if transaction failed', ()=> {
      let mockedTransaction = mock({
        blockchain,
        transaction: {
          from: fromAddress,
          to: routers[blockchain].address,
          api: routers[blockchain].api,
          method: 'pay',
          params: {
            payment: {
              amountIn: ethers.utils.parseUnits('20', 18),
              permit2: false,
              paymentAmount: "20000000000000000000",
              feeAmount: 0,
              tokenInAddress: DEPAY,
              exchangeAddress: Blockchains[blockchain].zero,
              tokenOutAddress: DEPAY,
              paymentReceiverAddress: toAddress,
              feeReceiverAddress: Blockchains[blockchain].zero,
              exchangeType: 0,
              receiverType: 0,
              exchangeCallData: anything,
              receiverCallData: Blockchains[blockchain].zero,
              deadline: anything,
            }
          },
          value: 0
        }
      })

      let trackingRequestMock = fetchMock.post({
        url: "/track/payments",
        body: {
          "blockchain": blockchain,
          "sender": fromAddress,
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
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
              cy.wait(1000).then(()=>{
                fail(mockedTransaction)
                cy.wait(1000).then(()=>{
                  mockedWebsocket.send(JSON.stringify({
                    message: {
                      release: true,
                      status: 'failed',
                      failed_reason: 'FAILED',
                    }
                  }))
                  cy.wait(3000).then(()=>{
                    expect(sentCallback.transaction.blockchain).to.equal('ethereum')
                    expect(sentCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                    expect(sentCallback.transaction.from).to.equal(fromAddress)
                    expect(sentCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                    expect(sentCallback.paymentRoute.blockchain).to.equal('ethereum')
                    expect(sentCallback.paymentRoute.fromAddress).to.equal(fromAddress)

                    expect(failedCallback.transaction.blockchain).to.equal('ethereum')
                    expect(failedCallback.transaction.id).to.equal(mockedTransaction.transaction._id)
                    expect(failedCallback.transaction.from).to.equal(fromAddress)
                    expect(failedCallback.transaction.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                    expect(failedCallback.paymentRoute.blockchain).to.equal('ethereum')
                    expect(failedCallback.paymentRoute.fromAddress).to.equal(fromAddress)
                    
                    expect(succeededCallback?.transaction).to.equal(undefined)
                    expect(succeededCallback?.paymentRoute).to.equal(undefined)

                    expect(validatedCallback?.transaction).to.equal(undefined)
                    expect(validatedCallback?.paymentRoute).to.equal(undefined)
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
