import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, anything, confirm, fail, increaseBlock, resetMocks } from '@depay/web3-mock'
import { mockPaymentsAccount, mockTokenAccount } from '../../../tests/mocks/solana/transaction'
import { PublicKey } from '@depay/solana-web3.js'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers } from '@depay/web3-payments'
import { Server } from 'mock-socket'
import { Token } from '@depay/web3-tokens'

describe('Solana Pay: QR code based mobile handover', () => {

  const blockchain = 'solana'
  const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
  const DEPAY = 'DePay1miDBPWXs6PVQrdC5Vch2jemgEPaiyXLNLLa2NF'
  const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  const SOL = Blockchains[blockchain].currency.address
  const WSOL = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'
  const feeReceiver = '5s3M1WuqLyHYGPBnHuaEfFdd339aHtJVTKPdyRpbxHE2'
  const amount = 20
  const defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress,
      fee: { amount: '1.5%', receiver: feeReceiver },
    }]
  }

  let mockedDepayWebsocket
  const depayWebsocketMessages = []
  new Server('wss://integrate.depay.com/cable').on('connection', socket => {
    mockedDepayWebsocket = socket
    socket.on('message', data => {
      depayWebsocketMessages.push(data)
    })
  })

  const mockedSolanaWebsockets = []
  const solanaWebsocketMessages = []
  Blockchains.solana.sockets.forEach((solanaWebsocketEndpoint)=>{
    new Server(solanaWebsocketEndpoint).on('connection', socket => {
      mockedSolanaWebsockets.push(socket)
      socket.on('message', data => {
        solanaWebsocketMessages.push(data)
      })
    })
  })

  let provider
  let secret_id
  let mockedTransaction
  let transactionId
  
  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    provider = await getProvider(blockchain)
    mock({ blockchain, provider, accounts: { return: accounts } })
    
    mock({
      blockchain,
      provider,
      request: {
        to: (await Token.solana.getMetaDataPDA({ metaDataPublicKey: new PublicKey(Token.solana.METADATA_ACCOUNT), mintPublicKey: new PublicKey(DEPAY) })).toString(),
        api: Token[blockchain].METADATA_LAYOUT,
        return: {
          key: { metadataV1: {} },
          isMutable: true,
          editionNonce: 252,
          primarySaleHappened: false,
          updateAuthority: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
          mint: DEPAY,
          data: {
            creators: null,
            name: 'DePay',
            sellerFeeBasisPoints: 0,
            symbol: 'DEPAY',
            uri: ""
          }
        }
      }

    })

    mock({
      provider,
      blockchain,
      request: {
        to: DEPAY,
        api: Token[blockchain].MINT_LAYOUT,
        return: {
          mintAuthorityOption: 1,
          mintAuthority: "2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9",
          supply: "5034999492452932",
          decimals: 9,
          isInitialized: true,
          freezeAuthorityOption: 1,
          freezeAuthority: "3sNBr7kMccME5D55xNgsmYpZnzPgP2g12CixAajXypn6"
        }
      }
    })

    mock({
      blockchain,
      provider,
      request: {
        method: 'getSignaturesForAddress',
        params: [fromAddress],
        return: []
      }
    })

    mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        logMessages: [
          "Program DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7 invoke"
        ],
        compiledInstructions: [
          {
            accountKeyIndexes: [5,0,1,2,3],
            data: new Uint8Array([106,117,211,159,190,144,42,90,115,0,0,0,0,0,0,0,48,27,15,0,0,0,0,0,16,39,0,0,0,0,0,0,244,149,199,100,0,0,0,0]),
            programIdIndex: 4
          }
        ]
      }
    })
    
    transactionId = mockedTransaction.transaction._id

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "19.7",
        blockchain: "solana",
        confirmations: 1,
        fee_amount: "0.3",
        fee_receiver: feeReceiver,
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: transactionId,
        uuid: transactionId,
      },
      matchPartialBody: true
    }, 201)

  })
  
  describe('allows users to pay using Solana Pay', async()=> {
  
    describe('validate transactions', async()=> {
  
      it('validates successful transaction via solana websocket', async()=> {

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  expect(JSON.parse(depayWebsocketMessages[0]).command).to.equal('subscribe')
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  expect(secret_id !== undefined).to.equal(true)
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).channel).to.equal('SolanaPayChannel')
                  expect(JSON.parse(depayWebsocketMessages[1]).command).to.equal('message')
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).identifier).secret_id).to.equal(secret_id)
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).identifier).channel).to.equal('SolanaPayChannel')
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).type).to.equal('create')
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).secret_id).to.equal(secret_id)
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).label).to.equal('cypress/e2e/Payment/solana-pay.solana.js')
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).icon).to.equal('https://depay.com/favicon.png')
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).token).to.equal(DEPAY)
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).payment_receiver).to.equal(toAddress)
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).payment_amount).to.equal('20000000000')
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).fee_receiver).to.equal(feeReceiver)
                  expect(JSON.parse(JSON.parse(depayWebsocketMessages[1]).data).fee_amount).to.equal('300000000')
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Paying')
                    mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                    cy.wait(1000).then(()=>{
                      expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                      expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                      expect(JSON.parse(solanaWebsocketMessages[0]).params[1].commitment).to.equal('processed')
                      mockedSolanaWebsockets.forEach((socket)=>{
                        socket.send(JSON.stringify({
                          params: {
                            result: {
                              value: {
                                err: null,
                                signature: transactionId
                              }
                            }
                          }
                        }))
                      })
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Transaction confirmed')
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
      })

      it('fails transaction via solana websocket', async()=> {

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Phantom', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Phantom').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                    mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                    cy.wait(1000).then(()=>{
                      expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                      mockedSolanaWebsockets.forEach((socket)=>{
                        socket.send(JSON.stringify({
                          params: {
                            result: {
                              value: {
                                err: { message: 'failed' },
                                signature: transactionId
                              }
                            }
                          }
                        }))
                      })
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Unfortunately executing your payment failed, but you can try again.')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a', 'View details').invoke('attr', 'href').should('include', `https://solscan.io/tx/${transactionId}`)
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
      })

      it('validates successful transaction via pulling solana getSignaturesForAddress', async()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  expect(JSON.parse(depayWebsocketMessages[0]).command).to.equal('subscribe')
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                    mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 115 } }))
                    cy.wait(1000).then(()=>{
                      mock({
                        blockchain,
                        provider,
                        request: {
                          method: 'getSignaturesForAddress',
                          params: [fromAddress],
                          return: [{
                            "blockTime": 1684586373,
                            "confirmationStatus": "finalized",
                            "err": null,
                            "memo": null,
                            "signature": transactionId,
                            "slot": 194962028
                          }]
                        }
                      })
                      confirm(mockedTransaction)
                      cy.wait(5000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Transaction confirmed')
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
      })

      it('fails transaction via pulling solana getSignaturesForAddress', async()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  expect(JSON.parse(depayWebsocketMessages[0]).command).to.equal('subscribe')
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                    mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 115 } }))
                    cy.wait(1000).then(()=>{
                      mock({
                        blockchain,
                        provider,
                        request: {
                          method: 'getSignaturesForAddress',
                          params: [fromAddress],
                          return: [{
                            "blockTime": 1684586373,
                            "confirmationStatus": "finalized",
                            "err": null,
                            "memo": null,
                            "signature": transactionId,
                            "slot": 194962028
                          }]
                        }
                      })
                      fail(mockedTransaction)
                      cy.wait(5000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Unfortunately executing your payment failed, but you can try again.')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a', 'View details').invoke('attr', 'href').should('include', `https://solscan.io/tx/${transactionId}`)
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
      })
    })

    describe('validate payments', async()=> {

      beforeEach(()=>{

        // TRACE
        fetchMock.post({
          url: "https://depay.test/track",
          body: {
            after_block: "1",
            blockchain: "solana",
            fee_amount: "300000000",
            from_amount: "20000000000",
            from_decimals: 9,
            from_token: "DePay1miDBPWXs6PVQrdC5Vch2jemgEPaiyXLNLLa2NF",
            nonce: 0,
            to_amount: "19700000000",
            to_decimals: 9,
            to_token: "DePay1miDBPWXs6PVQrdC5Vch2jemgEPaiyXLNLLa2NF"
          },
          matchPartialBody: true
        }, 200)
      })

      it('traces payment', async()=> {

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track'
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    expect(fetchMock.lastCall()[0]).to.equal("https://depay.test/track")
                    expect(JSON.parse(fetchMock.lastCall()[1].body).sender).to.equal(`solana:${secret_id}`)
                  })
                })
              })
            })
          })
        })
      })

      it('shows error dialog if tracing fails', async()=> {

        fetchMock.post({
          url: "https://depay.test/track",
          body: {},
          matchPartialBody: true,
          overwriteRoutes: true,
        }, 400)

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track'
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Tracking payment failed')
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
                    cy.wait(1000).then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Tracking payment failed')
                      fetchMock.post({
                        url: "https://depay.test/track",
                        body: {},
                        matchPartialBody: true,
                        overwriteRoutes: true,
                      }, 200)
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                    })
                  })
                })
              })
            })
          })
        })
      })

      it('shows error dialog if tracking fails', async()=> {

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track'
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Paying')
                      fetchMock.post({
                        url: "https://depay.test/track",
                        body: {
                          transaction: transactionId
                        },
                        matchPartialBody: true,
                        overwriteRoutes: true,
                      }, 400)
                      mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                      cy.wait(1000).then(()=>{
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[1].commitment).to.equal('processed')
                        mockedSolanaWebsockets.forEach((socket)=>{
                          socket.send(JSON.stringify({
                            params: {
                              result: {
                                value: {
                                  err: null,
                                  signature: transactionId
                                }
                              }
                            }
                          }))
                        })
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Tracking payment failed')
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Tracking payment failed')
                            fetchMock.post({
                              url: "https://depay.test/track",
                              body: {
                                transaction: transactionId
                              },
                              matchPartialBody: true,
                              overwriteRoutes: true,
                            }, 200)
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
                            cy.wait(1000).then(()=>{
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Validating payment')
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

      it('validates succesfull payments via websocket', async()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track'
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Paying')
                      fetchMock.post({
                        url: "https://depay.test/track",
                        body: {
                          transaction: transactionId
                        },
                        matchPartialBody: true,
                        overwriteRoutes: true,
                      }, 200)
                      mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                      cy.wait(1000).then(()=>{
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[1].commitment).to.equal('processed')
                        mockedSolanaWebsockets.forEach((socket)=>{
                          socket.send(JSON.stringify({
                            params: {
                              result: {
                                value: {
                                  err: null,
                                  signature: transactionId
                                }
                              }
                            }
                          }))
                        })
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Validating payment')
                          mockedDepayWebsocket.send(JSON.stringify({ message: {
                            status: 'success',
                            release: true,
                          }}))
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment validated')
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
          })
        })
      })

      it('validates succesfull payments via websocket and forwards_to (if set)', async()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track'
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Paying')
                      fetchMock.post({
                        url: "https://depay.test/track",
                        body: {
                          transaction: transactionId
                        },
                        matchPartialBody: true,
                        overwriteRoutes: true,
                      }, 200)
                      mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                      cy.wait(1000).then(()=>{
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[1].commitment).to.equal('processed')
                        mockedSolanaWebsockets.forEach((socket)=>{
                          socket.send(JSON.stringify({
                            params: {
                              result: {
                                value: {
                                  err: null,
                                  signature: transactionId
                                }
                              }
                            }
                          }))
                        })
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Validating payment')
                          mockedDepayWebsocket.send(JSON.stringify({ message: {
                            status: 'success',
                            release: true,
                            forward_to: '/somethingelse'
                          }}))
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

      it('fails payments via websocket', async()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track'
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Paying')
                      fetchMock.post({
                        url: "https://depay.test/track",
                        body: {
                          transaction: transactionId
                        },
                        matchPartialBody: true,
                        overwriteRoutes: true,
                      }, 200)
                      mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                      cy.wait(1000).then(()=>{
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[1].commitment).to.equal('processed')
                        mockedSolanaWebsockets.forEach((socket)=>{
                          socket.send(JSON.stringify({
                            params: {
                              result: {
                                value: {
                                  err: null,
                                  signature: transactionId
                                }
                              }
                            }
                          }))
                        })
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Validating payment')
                          mockedDepayWebsocket.send(JSON.stringify({ message: {
                            status: 'failed',
                            release: true,
                          }}))
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Unfortunately executing your payment failed, but you can try again.')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a', 'View details').invoke('attr', 'href').should('include', `https://solscan.io/tx/${transactionId}`)
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
          })
        })
      })

      it('validates payments via polling', async()=> {

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document,
              track: {
                endpoint: 'https://depay.test/track',
                poll: {
                  endpoint: 'https://depay.test/poll'
                }
              }
            })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Loading QR code...').then(()=>{
                cy.wait(1000).then(()=>{
                  secret_id = JSON.parse(JSON.parse(depayWebsocketMessages[0]).identifier).secret_id
                  mockedDepayWebsocket.send(JSON.stringify({ message: { created: true } }))
                  cy.wait(1000).then(()=>{
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Scan QR code with your wallet')
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { scanned: true } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm payment in your wallet')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Paying')
                      fetchMock.post({
                        url: "https://depay.test/track",
                        body: {
                          transaction: transactionId
                        },
                        matchPartialBody: true,
                        overwriteRoutes: true,
                      }, 200)
                      mockedDepayWebsocket.send(JSON.stringify({ message: { account: fromAddress, nonce: 0 } }))
                      cy.wait(1000).then(()=>{
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[1].commitment).to.equal('processed')
                        mockedSolanaWebsockets.forEach((socket)=>{
                          socket.send(JSON.stringify({
                            params: {
                              result: {
                                value: {
                                  err: null,
                                  signature: transactionId
                                }
                              }
                            }
                          }))
                        })
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Validating payment')
                          fetchMock.post({
                            url: "https://depay.test/poll",
                            matchPartialBody: true,
                          }, {
                            status: 200,
                            body: {
                              forward_to: '/somethingelse'
                            }
                          })
                          cy.wait(5000).then(()=>{
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
    })
  })
})
