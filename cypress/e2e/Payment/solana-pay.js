import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, anything, confirm, fail, increaseBlock, resetMocks } from '@depay/web3-mock'
import { mockPaymentsAccount, mockTokenAccount } from '../../../tests/mocks/solana/transaction'
import { PublicKey, Buffer, BN } from '@depay/solana-web3.js'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers } from '@depay/web3-payments'
import { Server } from 'mock-socket'
import Token from '@depay/web3-tokens'

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
  const fee2Receiver = '3Hrw6AsNyJAp71Nkgo4tzJwvGM47DzqMdAtf8ojptkXk'
  const amount = 20
  const accept = [{
    blockchain,
    amount,
    token: DEPAY,
    receiver: toAddress,
    fee: { amount: '3%', receiver: feeReceiver },
    fee2: { amount: '2%', receiver: fee2Receiver },
    protocolFee: '1%'
  }]
  const remoteConfiguration = { 
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress,
      fee: { amount: '3%', receiver: feeReceiver },
      fee2: { amount: '2%', receiver: fee2Receiver },
      protocolFee: '1%'
    }]
  }
  let defaultArguments = {
    accept
  }

  let mockedDepayWebsocket
  let depayWebsocketMessages = []
  new Server('wss://integrate.depay.com/cable').on('connection', socket => {
    mockedDepayWebsocket = socket
    socket.on('message', data => {
      socket.send(JSON.stringify({ type: 'ping' }))
      depayWebsocketMessages.push(data)
    })
  })

  const mockedSolanaWebsockets = []
  let solanaWebsocketMessages = []
  const seen = new Set()
  Blockchains.solana.sockets.forEach((socketUrl)=>{
    const url = new URL(socketUrl)
    const key = `${url.protocol}//${url.host}${url.pathname}`
    if (seen.has(key)) { return }
    seen.add(key)
    new Server(socketUrl).on('connection', socket => {
      mockedSolanaWebsockets.push(socket)
      socket.on('message', data => {
        socket.send(JSON.stringify({ type: 'ping' }))
        solanaWebsocketMessages.push(data)
      })
    })
  })

  let provider
  let secret_id
  let mockedTransaction
  let transactionId
  let deadline
  
  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()

    depayWebsocketMessages = []
    solanaWebsocketMessages = []

    defaultArguments = { accept }

    cy.stub(Intl, 'DateTimeFormat', () => {
      return { resolvedOptions: ()=>{
        return { timeZone: 'Europe/Berlin' }
      }}
    })
    
    cy.then(() => getProvider(blockchain)).then((provider) => {

      mock({ blockchain, provider, accounts: { return: accounts } })

      cy.then(() => Token.solana.getMetaDataPDA({ metaDataPublicKey: new PublicKey(Token.solana.METADATA_ACCOUNT), mintPublicKey: new PublicKey(DEPAY) })).then((metaDataPDA) => {
      
        mock({
          blockchain,
          provider,
          request: {
            to: metaDataPDA.toString(),
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

        deadline = Date.now() + 5 * 60 * 1000

        const data = Buffer.alloc(routers.solana.api.routeToken.layout.span)
        routers.solana.api.routeToken.layout.encode({
          anchorDiscriminator: routers.solana.api.routeToken.anchorDiscriminator,
          paymentAmount: new BN('20000000000'.toString()),
          feeAmount: new BN(('600000000').toString()),
          feeAmount2: new BN(('400000000').toString()),
          protocolAmount: new BN(('200000000').toString()),
          deadline: new BN(deadline),
        }, data)

        mockedTransaction = mock({
          blockchain,
          transaction: {
            from: fromAddress,
            logMessages: [
              "Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke"
            ],
            compiledInstructions: [
              {
                accountKeyIndexes: [5,0,1,2,3],
                data: data,
                programIdIndex: 4
              }
            ]
          }
        })
        
        transactionId = mockedTransaction.transaction._id

        fetchMock.get({
          url: `https://public.depay.com/currencies/EUR`,
          overwriteRoutes: true
        }, "0.85")

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

        fetchMock.post({
          url: "https://public.depay.com/routes/best",
          body: {
            accounts: { [blockchain]: accounts[0] },
            accept: [{
              blockchain,
              amount,
              token: DEPAY,
              receiver: toAddress
            }],
          },
        }, {
            blockchain,
            fromToken: DEPAY,
            fromDecimals: 9,
            fromName: "DePay",
            fromSymbol: "DEPAY",
            toToken: DEPAY,
            toAmount: '20000000000',
            toDecimals: 18,
            toName: "DePay",
            toSymbol: "DEPAY",
        })

        fetchMock.post({
          url: "https://public.depay.com/routes/all",
          body: {
            accounts: { [blockchain]: accounts[0] },
            accept: [{
              blockchain,
              amount,
              token: DEPAY,
              receiver: toAddress
            }],
          },
        }, [
          {
            blockchain,
            fromToken: DEPAY,
            fromDecimals: 9,
            fromName: "DePay",
            fromSymbol: "DEPAY",
            toToken: DEPAY,
            toAmount: '20000000000',
            toDecimals: 9,
            toName: "DePay",
            toSymbol: "DEPAY",
          },
        ])

        fetchMock.get({
          url: `https://public.depay.com/conversions/USD/solana/${DEPAY}?amount=20.0`,
        }, "4.00")

      })
    })
  })
  
  describe('track transaction status', ()=> {

    it('processes successful transaction status via solana and websockets', ()=> {

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Perform payment')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').contains('Close')
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
    })

    it('reports failed transaction received from solana websocket', ()=> {

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          fail(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Your payment did not succeed.')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Please try again.')
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
    })

    it('processes successful transaction status via polling', ()=> {
      
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      fetchMock.get({overwriteRoutes: true, url: `https://public.depay.com/solanapay/${secret_id}/status`}, {
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      })
                      cy.wait(3000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mock({
                            blockchain,
                            provider,
                            request: {
                              method: 'getSignaturesForAddress',
                              params: [fromAddress],
                              return: [
                                {
                                  "blockTime": 2,
                                  "confirmationStatus": "finalized",
                                  "err": null,
                                  "memo": null,
                                  "signature": transactionId,
                                  "slot": 2
                                }
                              ]
                            }
                          })
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Perform payment')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').contains('Close')
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
    })

    it('reports failed transaction via polling solana RPCs for getSignaturesForAddress', ()=> {
      
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      fetchMock.get({overwriteRoutes: true, url: `https://public.depay.com/solanapay/${secret_id}/status`}, {
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      })
                      cy.wait(3000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          fail(mockedTransaction)
                          mock({
                            blockchain,
                            provider,
                            request: {
                              method: 'getSignaturesForAddress',
                              params: [fromAddress],
                              return: [
                                {
                                  "blockTime": 2,
                                  "confirmationStatus": "finalized",
                                  "err": null,
                                  "memo": null,
                                  "signature": transactionId,
                                  "slot": 2
                                }
                              ]
                            }
                          })
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Your payment did not succeed.')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Please try again.')
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
    })
  })

  describe('validate payments (trace and track via DePay)', ()=> {

    beforeEach(()=>{

      fetchMock.post({
        url: "https://depay.test/track",
        body: {
          sender: fromAddress,
          after_block: "1",
          blockchain: "solana",
          from_amount: '20000000000',
          from_decimals: 9,
          from_token: DEPAY,
          to_amount: '20000000000',
          to_decimals: 9,
          to_token: DEPAY,
          fee_amount: '600000000',
          fee_receiver: feeReceiver,
          fee2_amount: '400000000',
          fee2_receiver: fee2Receiver,
          protocol_fee_amount: '200000000',
        },
        matchPartialBody: true
      }, 200)

      fetchMock.get({url: /^https:\/\/public\.depay\.com\/solanapay\/[^\/]+\/status$/}, 404)
    })

    it('traces payment', ()=> {

      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            mockedDepayWebsocket.send(JSON.stringify({ message: {
                              release: true, status: 'success', transaction_id: transactionId
                            }}))
                            cy.wait(1000).then(()=>{
                              let foundTraceRequest = fetchMock.calls().find((mockedRequest)=>{
                                return mockedRequest[0] == "https://depay.test/track" &&
                                  mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction === undefined
                              })
                              expect(foundTraceRequest != undefined).to.equal(true)
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment confirmed')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').click()
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

    it('shows error dialog if tracing fails and allows to retry', ()=> {

      fetchMock.post({
        url: "https://depay.test/track",
        body: {},
        matchPartialBody: true,
        overwriteRoutes: true,
      }, 400)

      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Tracking payment failed')
                        fetchMock.post({
                          url: "https://depay.test/track",
                          body: {},
                          matchPartialBody: true,
                          overwriteRoutes: true,
                        }, 200)
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()

                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                          expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                          expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                          cy.wait(1000).then(()=>{
                            confirm(mockedTransaction)
                            mockedSolanaWebsockets.forEach((socket)=>{
                              socket.send(JSON.stringify({
                                params: {
                                  result: {
                                    value: {
                                      err: null,
                                      logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                      signature: transactionId
                                    },
                                  }
                                }
                              }))
                            })
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                            cy.wait(1000).then(()=>{
                              mockedDepayWebsocket.send(JSON.stringify({ message: {
                                release: true, status: 'success', transaction_id: transactionId
                              }}))
                              cy.wait(1000).then(()=>{
                                let foundTraceRequest = fetchMock.calls().find((mockedRequest)=>{
                                  return mockedRequest[0] == "https://depay.test/track" &&
                                    mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction === undefined
                                })
                                expect(foundTraceRequest != undefined).to.equal(true)
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment confirmed')
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').click()
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

    it('shows error dialog if tracking fails and allows to retry tracking', ()=> {

      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          fetchMock.post({
                            url: "https://depay.test/track",
                            body: {
                              transaction: transactionId
                            },
                            matchPartialBody: true,
                            overwriteRoutes: true,
                          }, 400)
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.wait(22000).then(()=>{

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

                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                            cy.wait(1000).then(()=>{
                              mockedDepayWebsocket.send(JSON.stringify({ message: {
                                release: true, status: 'success', transaction_id: transactionId
                              }}))
                              cy.wait(1000).then(()=>{
                                let foundTraceRequest = fetchMock.calls().find((mockedRequest)=>{
                                  return mockedRequest[0] == "https://depay.test/track" &&
                                    mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction === undefined
                                })
                                expect(foundTraceRequest != undefined).to.equal(true)
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment confirmed')
                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').click()
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

    it('validates succesfull payments via websocket and calls trace and tracking', ()=> {

      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          fetchMock.post({
                            url: "https://depay.test/track",
                            body: {
                              transaction: transactionId
                            },
                            matchPartialBody: true,
                            overwriteRoutes: true,
                          }, 400)
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            mockedDepayWebsocket.send(JSON.stringify({ message: {
                              release: true, status: 'success', transaction_id: transactionId
                            }}))
                            cy.wait(1000).then(()=>{
                              let foundTraceRequest = fetchMock.calls().find((mockedRequest)=>{
                                return mockedRequest[0] == "https://depay.test/track" &&
                                  mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction === undefined
                              })
                              expect(foundTraceRequest != undefined).to.equal(true)
                              let foundTrackingRequest = fetchMock.calls().find((mockedRequest)=>{
                                return mockedRequest[0] == "https://depay.test/track" &&
                                  mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction !== undefined
                              })
                              expect(foundTrackingRequest != undefined).to.equal(true)
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment confirmed')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Close').click()
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

    it('forwards_to (if set) after succesfull validation', ()=> {
      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          fetchMock.post({
                            url: "https://depay.test/track",
                            body: {
                              transaction: transactionId
                            },
                            matchPartialBody: true,
                            overwriteRoutes: true,
                          }, 400)
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            mockedDepayWebsocket.send(JSON.stringify({ message: {
                              forward_to: '/somethingelse', release: true, status: 'success', transaction_id: transactionId
                            }}))
                            cy.wait(1000).then(()=>{
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

    it('identifies failed payments via websocket', ()=> {
      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            mockedDepayWebsocket.send(JSON.stringify({ message: {
                              release: true, status: 'failed', failed_reason: 'FAILED', transaction_id: transactionId
                            }}))
                            cy.wait(1000).then(()=>{
                              let foundTraceRequest = fetchMock.calls().find((mockedRequest)=>{
                                return mockedRequest[0] == "https://depay.test/track" &&
                                  mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction === undefined
                              })
                              expect(foundTraceRequest != undefined).to.equal(true)
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Your payment did not succeed.')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Please try again.')
                              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
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

    it('displays validation errors to the user via websocket', ()=> {
      defaultArguments = { ...defaultArguments, track: { endpoint: 'https://depay.test/track' } }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then(async(document)=>{
          let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            mockedDepayWebsocket.send(JSON.stringify({ message: {
                              release: true, status: 'failed', failed_reason: 'MISMATCH', transaction_id: transactionId
                            }}))
                            cy.wait(1000).then(()=>{
                              let foundTraceRequest = fetchMock.calls().find((mockedRequest)=>{
                                return mockedRequest[0] == "https://depay.test/track" &&
                                  mockedRequest[1]?.body && JSON.parse(mockedRequest[1]?.body).transaction === undefined
                              })
                              expect(foundTraceRequest != undefined).to.equal(true)
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
            })
          })
        })
      })
    })

    it('validates successful payments via polling', ()=> {

      defaultArguments = { ...defaultArguments, 
        track: {
          endpoint: 'https://depay.test/track',
          poll: {
            endpoint: 'https://depay.test/poll'
          }
        }
      }

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        fetchMock.post({
                          url: "https://depay.test/track",
                          body: {
                            transaction: transactionId
                          },
                          matchPartialBody: true,
                          overwriteRoutes: true,
                        }, 400)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
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

  describe('managed integration', ()=>{

    const integrationId = '461cb57d-6063-40b8-8326-a124c4a40e6f'
    const configurationId = '392cb57d-9093-30b8-8326-a223c4a40e6f'
    const attemptId = '9kLcb50d-9022k2kb8-89k6-aLL9k4a40e6f'

    beforeEach(()=>{

      defaultArguments = { integration: integrationId }
      
      fetchMock.post({
        url: `https://public.depay.com/configurations/${integrationId}?v=3`,
      }, {
        body: { id: configurationId, configuration: remoteConfiguration },
        headers: { 'X-Signature': "ojLjOf7F01EQ3bdh30MPd1HZSXhSPWW21gtYJzLqBYv67q9El2x4PZuk1kyMMxvlRiqyPXETD2ZfTmxsLWbPrhv0K8feCsA5tbE3sGRyPkZQMKSH42uRRwj_5ws7_PXXBIhgcoNxn6-NR-DESp4OKQZzG_lLxb9Lcaazbea17u_ftA6wmwvL_ELWxqTjynXh7Jndhjj9nhvd0Tt9WtgMJcwCWmIMPVpBjK3jRwJxuvRJQqnQx7jYJhOYqX3pHkJ4CkFeS_-0HTITKr0_5mLSctJGLK4_oHu__TZOSOuP0skH798hG2BTdhK3PLkZl8KM_W2oyGXvoBdYmOg5xTDufQ==" },
        status: 200
      })

      fetchMock.get({url: /^https:\/\/public\.depay\.com\/solanapay\/[^\/]+\/status$/}, 404)
    })

    it('displays a validated payment via attempt polling', ()=> {
      defaultArguments = { integration: integrationId }

      fetchMock.post({
        url: `https://public.depay.com/configurations/${configurationId}/attempts`,
      }, {
        body: { id: attemptId },
        status: 200
      })

      fetchMock.get({
        url: `https://public.depay.com/attempts/${attemptId}`,
      }, {
        body: {
          status: 'success',
          forward_to: '/somethingelse'
        },
        status: 200
      })

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(3000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment confirmed')
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
          })
        })
      })
    })

    it('displays a failed payment via attempt polling', ()=> {
      defaultArguments = { integration: integrationId }

      fetchMock.post({
        url: `https://public.depay.com/configurations/${configurationId}/attempts`,
      }, {
        body: { id: attemptId },
        status: 200
      })

      fetchMock.get({
        url: `https://public.depay.com/attempts/${attemptId}`,
      }, {
        body: {
          status: 'failed',
          failed_reason: 'FAILED'
        },
        status: 200
      })

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
                          cy.wait(1000).then(()=>{
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Payment Failed')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Your payment did not succeed.')
                            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Please try again.')
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
    })

    it('displays validation errors via attempt polling', ()=> {
      defaultArguments = { integration: integrationId }

      fetchMock.post({
        url: `https://public.depay.com/configurations/${configurationId}/attempts`,
      }, {
        body: { id: attemptId },
        status: 200
      })

      fetchMock.get({
        url: `https://public.depay.com/attempts/${attemptId}`,
      }, {
        body: {
          status: 'failed',
          failed_reason: 'MISMATCH'
        },
        status: 200
      })

      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then(async(document)=>{
          let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
            cy.wait(1000).then(()=>{
              let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
              secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
              expect(secret_id !== undefined).to.equal(true)
              fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
              expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
              mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
              cy.wait(1000).then(()=>{
                let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                let createMessageData = JSON.parse(createMessage.data)
                expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                expect(createMessageData.event).to.equal('create')
                expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                expect(createMessageData.secret_id).to.equal(secret_id)
                expect(createMessageData.accept.length).to.equal(1)
                expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                  cy.wait(1000).then(()=>{
                    mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                      mockedDepayWebsocket.send(JSON.stringify({ message: {
                        event: 'loaded',
                        sender: accounts[0],
                        from_token: DEPAY,
                        from_amount: '20000000000',
                        from_decimals: 9,
                        to_token: DEPAY,
                        to_amount: '20000000000',
                        to_decimals: 9,
                        fee_amount: '600000000',
                        fee_receiver: feeReceiver,
                        fee2_amount: '400000000',
                        fee2_receiver: fee2Receiver,
                        protocol_fee_amount: '200000000',
                        receiver: toAddress,
                        deadline,
                      }}))
                      cy.wait(1000).then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                        expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                        expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                        cy.wait(1000).then(()=>{
                          confirm(mockedTransaction)
                          mockedSolanaWebsockets.forEach((socket)=>{
                            socket.send(JSON.stringify({
                              params: {
                                result: {
                                  value: {
                                    err: null,
                                    logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                    signature: transactionId
                                  },
                                }
                              }
                            }))
                          })
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirming payment')
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
          integration: integrationId,
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
        fetchMock.post({
          url: `https://public.depay.com/configurations/${configurationId}/attempts`,
        }, {
          body: { id: attemptId },
          status: 200
        })

        fetchMock.get({
          url: `https://public.depay.com/attempts/${attemptId}`,
        }, {
          status: 404
        })
      })

      it('calls sent, succeeded and validated (success == true) callback', ()=> {

        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.wait(1000).then(()=>{
                let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
                secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
                expect(secret_id !== undefined).to.equal(true)
                fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
                expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
                mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
                cy.wait(1000).then(()=>{
                  let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                  let createMessageData = JSON.parse(createMessage.data)
                  expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                  expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                  expect(createMessageData.event).to.equal('create')
                  expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                  expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                  expect(createMessageData.secret_id).to.equal(secret_id)
                  expect(createMessageData.accept.length).to.equal(1)
                  expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                  expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                  expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                  expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                  mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                        mockedDepayWebsocket.send(JSON.stringify({ message: {
                          event: 'loaded',
                          sender: accounts[0],
                          from_token: DEPAY,
                          from_amount: '20000000000',
                          from_decimals: 9,
                          to_token: DEPAY,
                          to_amount: '20000000000',
                          to_decimals: 9,
                          fee_amount: '600000000',
                          fee_receiver: feeReceiver,
                          fee2_amount: '400000000',
                          fee2_receiver: fee2Receiver,
                          protocol_fee_amount: '200000000',
                          receiver: toAddress,
                          deadline,
                        }}))
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                          expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                          expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                          cy.wait(1000).then(()=>{
                            confirm(mockedTransaction)
                            mockedSolanaWebsockets.forEach((socket)=>{
                              socket.send(JSON.stringify({
                                params: {
                                  result: {
                                    value: {
                                      err: null,
                                      logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                      signature: transactionId
                                    },
                                  }
                                }
                              }))
                            })
                            cy.wait(2000).then(()=>{
                              mockedDepayWebsocket.send(JSON.stringify({ message: {
                                forward_to: '/somethingelse', release: true, status: 'success', transaction_id: transactionId
                              }}))
                              cy.wait(2000).then(()=>{
                                cy.location('href').should('include', '/somethingelse')

                                expect(sentCallback.transaction.blockchain).to.equal('solana')
                                expect(sentCallback.transaction.id).to.equal(transactionId)
                                expect(sentCallback.transaction.from).to.equal(fromAddress)
                                expect(sentCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(sentCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(sentCallback.paymentRoute.deadline).to.equal(deadline)
                                expect(sentCallback.paymentRoute.fromAddress).to.equal(fromAddress)

                                expect(succeededCallback.transaction.blockchain).to.equal('solana')
                                expect(succeededCallback.transaction.id).to.equal(transactionId)
                                expect(succeededCallback.transaction.from).to.equal(fromAddress)
                                expect(succeededCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(succeededCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(succeededCallback.paymentRoute.deadline).to.equal(deadline)
                                expect(succeededCallback.paymentRoute.fromAddress).to.equal(fromAddress)
                                
                                expect(failedCallback?.transaction).to.equal(undefined)
                                expect(failedCallback?.paymentRoute).to.equal(undefined)

                                expect(validatedCallback.transaction.blockchain).to.equal('solana')
                                expect(validatedCallback.transaction.id).to.equal(transactionId)
                                expect(validatedCallback.transaction.from).to.equal(fromAddress)
                                expect(validatedCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(validatedCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(validatedCallback.paymentRoute.deadline).to.equal(deadline)
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
          })
        })
      })

      it('calls sent, succeeded and no validated callback (if validation failed)', ()=>{
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then(async(document)=>{
            let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.wait(1000).then(()=>{
                let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
                secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
                expect(secret_id !== undefined).to.equal(true)
                fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
                expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
                mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
                cy.wait(1000).then(()=>{
                  let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                  let createMessageData = JSON.parse(createMessage.data)
                  expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                  expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                  expect(createMessageData.event).to.equal('create')
                  expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                  expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                  expect(createMessageData.secret_id).to.equal(secret_id)
                  expect(createMessageData.accept.length).to.equal(1)
                  expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                  expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                  expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                  expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                  mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                        mockedDepayWebsocket.send(JSON.stringify({ message: {
                          event: 'loaded',
                          sender: accounts[0],
                          from_token: DEPAY,
                          from_amount: '20000000000',
                          from_decimals: 9,
                          to_token: DEPAY,
                          to_amount: '20000000000',
                          to_decimals: 9,
                          fee_amount: '600000000',
                          fee_receiver: feeReceiver,
                          fee2_amount: '400000000',
                          fee2_receiver: fee2Receiver,
                          protocol_fee_amount: '200000000',
                          receiver: toAddress,
                          deadline,
                        }}))
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                          expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                          expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                          cy.wait(1000).then(()=>{
                            confirm(mockedTransaction)
                            mockedSolanaWebsockets.forEach((socket)=>{
                              socket.send(JSON.stringify({
                                params: {
                                  result: {
                                    value: {
                                      err: null,
                                      logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                      signature: transactionId
                                    },
                                  }
                                }
                              }))
                            })
                            cy.wait(2000).then(()=>{
                              mockedDepayWebsocket.send(JSON.stringify({ message: {
                                status: 'failed', failed_reason: 'MISMATCH', transaction_id: transactionId
                              }}))
                              cy.wait(2000).then(()=>{

                                expect(sentCallback.transaction.blockchain).to.equal('solana')
                                expect(sentCallback.transaction.id).to.equal(transactionId)
                                expect(sentCallback.transaction.from).to.equal(fromAddress)
                                expect(sentCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(sentCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(sentCallback.paymentRoute.deadline).to.equal(deadline)
                                expect(sentCallback.paymentRoute.fromAddress).to.equal(fromAddress)

                                expect(succeededCallback.transaction.blockchain).to.equal('solana')
                                expect(succeededCallback.transaction.id).to.equal(transactionId)
                                expect(succeededCallback.transaction.from).to.equal(fromAddress)
                                expect(succeededCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(succeededCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(succeededCallback.paymentRoute.deadline).to.equal(deadline)
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
          })
        })
      })

      it('calls sent, and failed callback if transaction failed', ()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('Solana', { force: true })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Solana Pay').click()
              cy.wait(1000).then(()=>{
                let subscribeMessage = depayWebsocketMessages.find((msg)=>{ return(JSON.parse(msg)?.command == 'subscribe') })
                secret_id = JSON.parse(JSON.parse(subscribeMessage).identifier).secret_id
                expect(secret_id !== undefined).to.equal(true)
                fetchMock.get({url: `https://public.depay.com/solanapay/${secret_id}/status`}, 404)
                expect(JSON.parse(JSON.parse(subscribeMessage).identifier).channel).to.equal('SolanaPayChannel')
                mockedDepayWebsocket.send(JSON.stringify({ type: 'confirm_subscription' }))
                cy.wait(1000).then(()=>{
                  let createMessage = JSON.parse(depayWebsocketMessages.find((msg)=>{return(msg && JSON.parse(msg)?.data && JSON.parse(JSON.parse(msg).data).event == 'create')}))
                  let createMessageData = JSON.parse(createMessage.data)
                  expect(JSON.parse(createMessage.identifier).secret_id).to.equal(secret_id)
                  expect(JSON.parse(createMessage.identifier).channel).to.equal('SolanaPayChannel')
                  expect(createMessageData.event).to.equal('create')
                  expect(createMessageData.icon).to.equal('https://depay.com/favicon.png')
                  expect(createMessageData.label).to.equal('cypress/e2e/Payment/solana-pay.js')
                  expect(createMessageData.secret_id).to.equal(secret_id)
                  expect(createMessageData.accept.length).to.equal(1)
                  expect(createMessageData.accept[0].blockchain).to.equal(accept[0].blockchain)
                  expect(createMessageData.accept[0].amount).to.equal(accept[0].amount)
                  expect(createMessageData.accept[0].token).to.equal(accept[0].token)
                  expect(createMessageData.accept[0].receiver).to.equal(accept[0].receiver)
                  mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'created' } }))
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.QRCode').then(()=>{
                    cy.wait(1000).then(()=>{
                      mockedDepayWebsocket.send(JSON.stringify({ message: { event: 'scanned' } }))
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.Skeleton').then(()=>{
                        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Confirm in your wallet')
                        mockedDepayWebsocket.send(JSON.stringify({ message: {
                          event: 'loaded',
                          sender: accounts[0],
                          from_token: DEPAY,
                          from_amount: '20000000000',
                          from_decimals: 9,
                          to_token: DEPAY,
                          to_amount: '20000000000',
                          to_decimals: 9,
                          fee_amount: '600000000',
                          fee_receiver: feeReceiver,
                          fee2_amount: '400000000',
                          fee2_receiver: fee2Receiver,
                          protocol_fee_amount: '200000000',
                          receiver: toAddress,
                          deadline,
                        }}))
                        cy.wait(1000).then(()=>{
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('20 DEPAY')
                          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('€3.40')
                          expect(JSON.parse(solanaWebsocketMessages[0]).method).to.equal('logsSubscribe')
                          expect(JSON.parse(solanaWebsocketMessages[0]).params[0].mentions[0]).to.equal(fromAddress)
                          cy.wait(1000).then(()=>{
                            fail(mockedTransaction)
                            mockedSolanaWebsockets.forEach((socket)=>{
                              socket.send(JSON.stringify({
                                params: {
                                  result: {
                                    value: {
                                      err: null,
                                      logs: ['Program DePayR1gQfDmViCPKctnZXNtUgqRwnEqMax8LX9ho1Zg invoke [1]'],
                                      signature: transactionId
                                    },
                                  }
                                }
                              }))
                            })
                            cy.wait(2000).then(()=>{
                              mockedDepayWebsocket.send(JSON.stringify({ message: {
                                release: true, status: 'failed', failed_reason: 'FAILED', transaction_id: transactionId
                              }}))
                              cy.wait(2000).then(()=>{

                                expect(sentCallback.transaction.blockchain).to.equal('solana')
                                expect(sentCallback.transaction.id).to.equal(transactionId)
                                expect(sentCallback.transaction.from).to.equal(fromAddress)
                                expect(sentCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(sentCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(sentCallback.paymentRoute.deadline).to.equal(deadline)
                                expect(sentCallback.paymentRoute.fromAddress).to.equal(fromAddress)

                                expect(failedCallback.transaction.blockchain).to.equal('solana')
                                expect(failedCallback.transaction.id).to.equal(transactionId)
                                expect(failedCallback.transaction.from).to.equal(fromAddress)
                                expect(failedCallback.transaction.url).to.equal(`https://solscan.io/tx/${transactionId}`)
                                expect(failedCallback.paymentRoute.blockchain).to.equal('solana')
                                expect(failedCallback.paymentRoute.deadline).to.equal(deadline)
                                expect(failedCallback.paymentRoute.fromAddress).to.equal(fromAddress)
                                
                                expect(succeededCallback?.transaction).to.equal(undefined)
                                expect(succeededCallback?.paymentRoute).to.equal(undefined)

                                expect(validatedCallback?.transaction).to.equal(undefined)
                                expect(validatedCallback?.paymentRoute).to.equal(undefined)

                                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Please try again.')
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
