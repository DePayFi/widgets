import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { mock, confirm, increaseBlock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Server } from 'mock-socket'

describe('Payment Widget: integration', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  const integrationId = '461cb57d-6063-40b8-8326-a124c4a40e6f'
  const configurationId = '392cb57d-9093-30b8-8326-a223c4a40e6f'
  const attemptId = '9kLcb50d-9022k2kb8-89k6-aLL9k4a40e6f'
  const defaultArguments = {
    integration: integrationId,
    payload: {
      some: 'information'
    }
  }
  const remoteConfiguration = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }
  const mockedWebsocketServer = new Server('wss://integrate.depay.com/cable')
  const websocketMessages = []
  let mockedWebsocket

  let TOKEN_A_AmountBN
  let provider

  beforeEach(async()=>{
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
  
  it('loads the configuration from the managed integration backend and allows to track, execute and validate a payment through a managed integration', () => {
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
      url: `https://public.depay.com/configurations/${integrationId}`,
      body: {
        payload: {
          some: 'information'
        }
      }
    }, {
      body: { id: configurationId, configuration: remoteConfiguration },
      headers: { 'X-Signature': "gXtOM5DfbJyIRJvAmauWixiwckRFReaPiWukOHna2-tyASwaKhv1TR8uT9xyTrMywcLATE7TMYzR3C2k6IuCdhMXa5phUvKrqNwhuYU-fULXcYXT5hbbBLLpjLD4XwFf3n30u8UD1zOzRav7NPJgySV2kX1QP-clHACgKy6s9mijEY2Hrc1wkNjbc7KIrQ6Ho50KAlNqCj-zmI04QzhA-DgVX8r-d2-U6iYxLFUSPRXtZkMDn9cccqrLKf2VocwJQO7G6ttXiwP6g7svDRYinpe88PXJPyQojE3nkmoTCiMLEhVqOaSpKnlirvPDblUw5e8OAKYuoZwuVTXvEdrmmQ==" },
      status: 200
    })

    let traceSent = false
    fetchMock.post({
      url: `https://public.depay.com/configurations/${configurationId}/attempts`,
      body: {
        after_block: "1",
        blockchain: "ethereum",
        from_amount: "20000000000000000000",
        from_decimals: 18,
        from_token: "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
        nonce: "0",
        sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        to_amount: "20000000000000000000",
        to_decimals: 18,
        to_token: "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, (url, request)=>{
      if(traceSent === false) {
        traceSent = true
      } else { // track
        let jsonBody = JSON.parse(request.body)
        expect(jsonBody.transaction).to.equal(mockedTransaction.transaction._id)
      }
      return({
        body: { id: attemptId },
        status: 200
      })
    })

    fetchMock.get({
      url: `https://public.depay.com/attempts/${attemptId}`,
    }, 404)

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        nonce: "0",
        payload: {
          integration: integrationId,
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€28.05')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'target').should('eq', '_blank')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'rel').should('eq', 'noopener noreferrer')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
          expect(mockedTransaction.calls.count()).to.equal(1)
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
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

  it('confirms managed integration payment through polling', () => {
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
      url: `https://public.depay.com/configurations/${integrationId}`,
      body: {
        payload: {
          some: 'information'
        }
      }
    }, {
      body: { id: configurationId, configuration: remoteConfiguration },
      headers: { 'X-Signature': "gXtOM5DfbJyIRJvAmauWixiwckRFReaPiWukOHna2-tyASwaKhv1TR8uT9xyTrMywcLATE7TMYzR3C2k6IuCdhMXa5phUvKrqNwhuYU-fULXcYXT5hbbBLLpjLD4XwFf3n30u8UD1zOzRav7NPJgySV2kX1QP-clHACgKy6s9mijEY2Hrc1wkNjbc7KIrQ6Ho50KAlNqCj-zmI04QzhA-DgVX8r-d2-U6iYxLFUSPRXtZkMDn9cccqrLKf2VocwJQO7G6ttXiwP6g7svDRYinpe88PXJPyQojE3nkmoTCiMLEhVqOaSpKnlirvPDblUw5e8OAKYuoZwuVTXvEdrmmQ==" },
      status: 200
    })

    let traceSent = false
    fetchMock.post({
      url: `https://public.depay.com/configurations/${configurationId}/attempts`,
      body: {
        after_block: "1",
        blockchain: "ethereum",
        from_amount: "20000000000000000000",
        from_decimals: 18,
        from_token: "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
        nonce: "0",
        sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        to_amount: "20000000000000000000",
        to_decimals: 18,
        to_token: "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
      },
      matchPartialBody: true
    }, (url, request)=>{
      if(traceSent === false) {
        traceSent = true
      } else { // track
        let jsonBody = JSON.parse(request.body)
        expect(jsonBody.transaction).to.equal(mockedTransaction.transaction._id)
      }
      return({
        body: { id: attemptId },
        status: 200
      })
    })

    fetchMock.get({
      url: `https://public.depay.com/attempts/${attemptId}`,
    }, {
      body: {
        status: 'success',
      },
      status: 200
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        nonce: "0",
        payload: {
          integration: integrationId,
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

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€28.05')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'target').should('eq', '_blank')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'rel').should('eq', 'noopener noreferrer')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
          expect(mockedTransaction.calls.count()).to.equal(1)
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary.disabled', 'Continue').should('exist').then(()=>{
              cy.wait(5000).then(()=>{
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
