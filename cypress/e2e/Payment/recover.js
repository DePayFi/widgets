import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from '@depay/web3-constants'
import { mock, confirm, fail, increaseBlock, resetMocks, replace } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Server } from 'mock-socket'
import { Token } from '@depay/web3-tokens'

describe('Payment Widget: recover a previously made payment transaction', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = CONSTANTS[blockchain].USD
  const ETH = CONSTANTS[blockchain].NATIVE
  const WETH = CONSTANTS[blockchain].WRAPPED
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  
  let TOKEN_A_AmountBN
  let provider

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
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

  describe('confirmed via websockets', ()=>{
    let mockedWebsocketServer = new Server('wss://integrate.depay.com/cable')
    let websocketMessages = []
    let mockedWebsocket

    beforeEach(()=>{
      mockedWebsocketServer.on('connection', socket => {
        mockedWebsocket = socket
        mockedWebsocket.on('message', data => {
          websocketMessages.push(data)
        })
      })
    })

    it('recovers a previously made payment transaction and confirms it via websockets', () => {
      let transaction = {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
      
      let transactionId = '0x081ae81229b2c7df586835e9e4c16aa89f8a15dc118fac31b7521477c53ed2a9'
      let transactionNonce = 2865
      let transactionAfterBlock = 14088130

      fetchMock.get({
        url: `https://public.depay.com/transactions/${blockchain}/${fromAddress.toLowerCase()}/${transactionNonce}`,
        overwriteRoutes: true
      }, { status: 404 })

      let succeededCalledWith
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({
            recover: {
              blockchain: blockchain,
              transaction: transactionId,
              sender: transaction.from,
              nonce: transactionNonce,
              afterBlock: transactionAfterBlock,
              token: DEPAY,
              amount: amount
            },
            succeeded: (transaction)=> {
              succeededCalledWith = transaction
            },
            document
          })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/'+transactionId)
          cy.wait(2000).then(()=>{
            expect(!!websocketMessages.find((rawMessage)=>{
              let message = JSON.parse(rawMessage)
              return(
                message.command == 'subscribe' &&
                message.identifier == JSON.stringify({ blockchain, sender: fromAddress.toLowerCase(), nonce: transactionNonce, channel: 'TransactionChannel' })
              )
            })).to.equal(true)
            mockedWebsocket.send(JSON.stringify({
              message: {
                id: transactionId,
                status: 'success'
              }
            }))
          })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').invoke('attr', 'href').should('include', `https://etherscan.io/tx/${transactionId}`)
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
              cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
              expect(succeededCalledWith.id).to.equal(transactionId)
            })
          })
        })
      })
    })

    it('recovers a previously made payment transaction and fails it via websockets', () => {
      let transaction = {
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
      
      let transactionId = '0x081ae81229b2c7df586835e9e4c16aa89f8a15dc118fac31b7521477c53ed2a9'
      let transactionNonce = 2865
      let transactionAfterBlock = 14088130

      fetchMock.get({
        url: `https://public.depay.com/transactions/${blockchain}/${fromAddress.toLowerCase()}/${transactionNonce}`,
        overwriteRoutes: true
      }, { status: 404 })

      let failedCalledWith
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({
            recover: {
              blockchain: blockchain,
              transaction: transactionId,
              sender: transaction.from,
              nonce: transactionNonce,
              afterBlock: transactionAfterBlock,
              token: DEPAY,
              amount: amount
            },
            failed: (transaction)=> {
              failedCalledWith = transaction
            },
            document
          })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/'+transactionId)
          cy.wait(2000).then(()=>{
            expect(!!websocketMessages.find((rawMessage)=>{
              let message = JSON.parse(rawMessage)
              return(
                message.command == 'subscribe' &&
                message.identifier == JSON.stringify({ blockchain, sender: fromAddress.toLowerCase(), nonce: transactionNonce, channel: 'TransactionChannel' })
              )
            })).to.equal(true)
            mockedWebsocket.send(JSON.stringify({
              message: {
                id: transactionId,
                status: 'failed'
              }
            }))
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a', 'View on explorer').invoke('attr', 'href').should('include', `https://etherscan.io/tx/${transactionId}`)
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('h1').should('contain.text', 'Payment Failed')
              expect(failedCalledWith.id).to.equal(transactionId)
              cy.wait(1000).then(()=>{
                cy.get('.active button[title="Close dialog"]', { includeShadowDom: true }).click()
              })
              expect(failedCalledWith.id).to.equal(transactionId)
            })
          })
        })
      })
    })
  })
  
  it('recovers a previously made payment transaction and confirms it via polling', () => {
    let transaction = {
      from: fromAddress,
      to: DEPAY,
      api: Token[blockchain].DEFAULT,
      method: 'transfer',
      params: [toAddress, TOKEN_A_AmountBN]
    }
    
    let transactionId = '0x081ae81229b2c7df586835e9e4c16aa89f8a15dc118fac31b7521477c53ed2a9'
    let transactionNonce = 2865
    let transactionAfterBlock = 14088130

    fetchMock.get({
      url: `https://public.depay.com/transactions/${blockchain}/${fromAddress.toLowerCase()}/${transactionNonce}`,
      overwriteRoutes: true
    }, { status: 404 })

    let succeededCalledWith
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          recover: {
            blockchain: blockchain,
            transaction: transactionId,
            sender: transaction.from,
            nonce: transactionNonce,
            afterBlock: transactionAfterBlock,
            token: DEPAY,
            amount: amount
          },
          succeeded: (transaction)=> {
            succeededCalledWith = transaction
          },
          document
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/'+transactionId)
        cy.wait(1000).then(()=> {
          fetchMock.get({
            url: `https://public.depay.com/transactions/${blockchain}/${fromAddress.toLowerCase()}/${transactionNonce}`,
            overwriteRoutes: true
          }, { "external_id": transactionId, "status":"success" })
          cy.wait(5000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').invoke('attr', 'href').should('include', `https://etherscan.io/tx/${transactionId}`)
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
              cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
              expect(succeededCalledWith.id).to.equal(transactionId)
            })
          })
        })
      })
    })
  })

  it('recovers a previously made payment transaction and fails it via polling', () => {
    let transaction = {
      from: fromAddress,
      to: DEPAY,
      api: Token[blockchain].DEFAULT,
      method: 'transfer',
      params: [toAddress, TOKEN_A_AmountBN]
    }
    
    let transactionId = '0x081ae81229b2c7df586835e9e4c16aa89f8a15dc118fac31b7521477c53ed2a9'
    let transactionNonce = 2865
    let transactionAfterBlock = 14088130

    fetchMock.get({
      url: `https://public.depay.com/transactions/${blockchain}/${fromAddress.toLowerCase()}/${transactionNonce}`,
      overwriteRoutes: true
    }, { status: 404 })

    let failedCalledWith
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          recover: {
            blockchain: blockchain,
            transaction: transactionId,
            sender: transaction.from,
            nonce: transactionNonce,
            afterBlock: transactionAfterBlock,
            token: DEPAY,
            amount: amount
          },
          failed: (transaction)=> {
            failedCalledWith = transaction
          },
          document
        })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/'+transactionId)
        cy.wait(1000).then(()=> {
          fetchMock.get({
            url: `https://public.depay.com/transactions/${blockchain}/${fromAddress.toLowerCase()}/${transactionNonce}`,
            overwriteRoutes: true
          }, { "external_id": transactionId, "status":"failed" })
          cy.wait(5000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a', 'View on explorer').invoke('attr', 'href').should('include', `https://etherscan.io/tx/${transactionId}`)
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('h1').should('contain.text', 'Payment Failed')
            expect(failedCalledWith.id).to.equal(transactionId)
            cy.wait(1000).then(()=>{
              cy.get('.active button[title="Close dialog"]', { includeShadowDom: true }).click()
            })
            expect(failedCalledWith.id).to.equal(transactionId)
          })
        })
      })
    })
  })
})
