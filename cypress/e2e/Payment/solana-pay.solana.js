import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, anything, confirm, increaseBlock, resetMocks } from '@depay/web3-mock'
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
  const transactionId = '5z3ZDe5Mz3hV1J63vUGLM6UgfHbxMm4SykGvrYybBFryQe65SHbU7GDpgn4HxPjGj4iyEyEALcNEZ4fmr7DnQ4xw'
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

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "19.7",
        blockchain: "solana",
        confirmations: 1,
        fee_amount: "0.3",
        fee_receiver: feeReceiver,
        nonce: 0,
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
    })
  })
})
