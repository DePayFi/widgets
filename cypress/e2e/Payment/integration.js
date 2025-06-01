import Blockchains from '@depay/web3-blockchains'
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
  let defaultArguments = {
    integration: integrationId,
    payload: {
      some: 'information'
    }
  }
  const accept = [{
    blockchain,
    amount,
    token: DEPAY,
    receiver: toAddress
  }]
  const remoteConfiguration = { 
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress,
      protocolFee: '1.5%'
    }]
  }
  const mockedWebsocketServer = new Server('wss://integrate.depay.com/cable')
  const websocketMessages = []
  let mockedWebsocket

  let TOKEN_A_AmountBN
  let provider

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
  
  it('loads the configuration from the managed integration backend and allows to track, execute and validate a payment through a managed integration', () => {
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
            paymentAmount: "19700000000000000000",
            feeAmount: 0,
            protocolAmount: "300000000000000000",
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
      url: `https://public.depay.com/configurations/${integrationId}?v=3`,
      body: {
        payload: {
          some: 'information'
        }
      }
    }, {
      body: { id: configurationId, configuration: remoteConfiguration },
      headers: { 'X-Signature': "r-JfAbj7OlPDgk1T9I4SXbVo3O90aCdzstmTZhicqYw0KnjuGFM0mKp_T5BKKGDHb1Jv0Jfb7f8bTUQBTYrVAcmlW-sMvuSUJuwHfKDqAxKHouE6CZkMep4iwJaj3m073kl-c-qXUbASe5K1beXxFVRRNY49oVBB-UXidi9Hn0eUA4dJNKmcj_C9Klxz3F7rCwtFvRSePX8v085yi0sZktWSCEOY4KNy_x1LEHBunK6BGlXFY9wQvQHoiW9oGL9CUrY3YJ0cUv3AsGXBDPtOayd_uiWgjJ-nPCXnG_Oxj9_L3p3T-uZuhGAoaTbk6velJdBEHoKGtciBivI-a0vPsw==" },
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
        protocol_fee_amount: "300000000000000000",
        sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        to_amount: "19700000000000000000",
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
          expect(mockedTransaction.calls.count()).to.equal(1)
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
            mockedWebsocket.send(JSON.stringify({
              message: {
                release: true,
                status: 'success'
              }
            }))
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').then(()=>{
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

  it('confirms managed integration payment through polling', () => {
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
            paymentAmount: "19700000000000000000",
            feeAmount: 0,
            protocolAmount: "300000000000000000",
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
      url: `https://public.depay.com/configurations/${integrationId}?v=3`,
      body: {
        payload: {
          some: 'information'
        }
      }
    }, {
      body: { id: configurationId, configuration: remoteConfiguration },
      headers: { 'X-Signature': "r-JfAbj7OlPDgk1T9I4SXbVo3O90aCdzstmTZhicqYw0KnjuGFM0mKp_T5BKKGDHb1Jv0Jfb7f8bTUQBTYrVAcmlW-sMvuSUJuwHfKDqAxKHouE6CZkMep4iwJaj3m073kl-c-qXUbASe5K1beXxFVRRNY49oVBB-UXidi9Hn0eUA4dJNKmcj_C9Klxz3F7rCwtFvRSePX8v085yi0sZktWSCEOY4KNy_x1LEHBunK6BGlXFY9wQvQHoiW9oGL9CUrY3YJ0cUv3AsGXBDPtOayd_uiWgjJ-nPCXnG_Oxj9_L3p3T-uZuhGAoaTbk6velJdBEHoKGtciBivI-a0vPsw==" },
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
        protocol_fee_amount: "300000000000000000",
        sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        to_amount: "19700000000000000000",
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
          expect(mockedTransaction.calls.count()).to.equal(1)
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
            cy.wait(5000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment confirmed').then(()=>{
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

  describe('calls configured callbacks', ()=> {

    let sentCallback
    let succeededCallback
    let failedCallback
    let validatedCallback
  
    beforeEach(()=>{
      defaultArguments = { 
        integration: integrationId,
        payload: {
          some: 'information'
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
              paymentAmount: "19700000000000000000",
              feeAmount: 0,
              protocolAmount: "300000000000000000",
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
        url: `https://public.depay.com/configurations/${integrationId}?v=3`,
        body: {
          payload: {
            some: 'information'
          }
        }
      }, {
        body: { id: configurationId, configuration: remoteConfiguration },
        headers: { 'X-Signature': "r-JfAbj7OlPDgk1T9I4SXbVo3O90aCdzstmTZhicqYw0KnjuGFM0mKp_T5BKKGDHb1Jv0Jfb7f8bTUQBTYrVAcmlW-sMvuSUJuwHfKDqAxKHouE6CZkMep4iwJaj3m073kl-c-qXUbASe5K1beXxFVRRNY49oVBB-UXidi9Hn0eUA4dJNKmcj_C9Klxz3F7rCwtFvRSePX8v085yi0sZktWSCEOY4KNy_x1LEHBunK6BGlXFY9wQvQHoiW9oGL9CUrY3YJ0cUv3AsGXBDPtOayd_uiWgjJ-nPCXnG_Oxj9_L3p3T-uZuhGAoaTbk6velJdBEHoKGtciBivI-a0vPsw==" },
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
          protocol_fee_amount: "300000000000000000",
          sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          to_amount: "19700000000000000000",
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
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
            expect(mockedTransaction.calls.count()).to.equal(1)
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
            confirm(mockedTransaction)
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
              mockedWebsocket.send(JSON.stringify({
                message: {
                  release: true,
                  status: 'success'
                }
              }))
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').then(()=>{
                cy.wait(2000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').should('exist')
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary:not(.disabled)', 'Done').click().then(()=>{
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
              paymentAmount: "19700000000000000000",
              feeAmount: 0,
              protocolAmount: "300000000000000000",
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
        url: `https://public.depay.com/configurations/${integrationId}?v=3`,
        body: {
          payload: {
            some: 'information'
          }
        }
      }, {
        body: { id: configurationId, configuration: remoteConfiguration },
        headers: { 'X-Signature': "r-JfAbj7OlPDgk1T9I4SXbVo3O90aCdzstmTZhicqYw0KnjuGFM0mKp_T5BKKGDHb1Jv0Jfb7f8bTUQBTYrVAcmlW-sMvuSUJuwHfKDqAxKHouE6CZkMep4iwJaj3m073kl-c-qXUbASe5K1beXxFVRRNY49oVBB-UXidi9Hn0eUA4dJNKmcj_C9Klxz3F7rCwtFvRSePX8v085yi0sZktWSCEOY4KNy_x1LEHBunK6BGlXFY9wQvQHoiW9oGL9CUrY3YJ0cUv3AsGXBDPtOayd_uiWgjJ-nPCXnG_Oxj9_L3p3T-uZuhGAoaTbk6velJdBEHoKGtciBivI-a0vPsw==" },
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
          protocol_fee_amount: "300000000000000000",
          sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          to_amount: "19700000000000000000",
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
        cy.document().then(async(document)=>{
          let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
            expect(mockedTransaction.calls.count()).to.equal(1)
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
            confirm(mockedTransaction)
            cy.wait(3000).then(()=>{
              mockedWebsocket.send(JSON.stringify({
                message: {
                  release: true,
                  status: 'failed',
                  failed_reason: 'MISMATCH'
                }
              }))
              cy.wait(3000).then(()=>{
                cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')

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
              paymentAmount: "19700000000000000000",
              feeAmount: 0,
              protocolAmount: "300000000000000000",
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
        url: `https://public.depay.com/configurations/${integrationId}?v=3`,
        body: {
          payload: {
            some: 'information'
          }
        }
      }, {
        body: { id: configurationId, configuration: remoteConfiguration },
        headers: { 'X-Signature': "r-JfAbj7OlPDgk1T9I4SXbVo3O90aCdzstmTZhicqYw0KnjuGFM0mKp_T5BKKGDHb1Jv0Jfb7f8bTUQBTYrVAcmlW-sMvuSUJuwHfKDqAxKHouE6CZkMep4iwJaj3m073kl-c-qXUbASe5K1beXxFVRRNY49oVBB-UXidi9Hn0eUA4dJNKmcj_C9Klxz3F7rCwtFvRSePX8v085yi0sZktWSCEOY4KNy_x1LEHBunK6BGlXFY9wQvQHoiW9oGL9CUrY3YJ0cUv3AsGXBDPtOayd_uiWgjJ-nPCXnG_Oxj9_L3p3T-uZuhGAoaTbk6velJdBEHoKGtciBivI-a0vPsw==" },
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
          protocol_fee_amount: "300000000000000000",
          sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          to_amount: "19700000000000000000",
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
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
            expect(mockedTransaction.calls.count()).to.equal(1)
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
            fail(mockedTransaction)
            cy.wait(1000).then(()=>{
              mockedWebsocket.send(JSON.stringify({
                message: {
                  release: true,
                  status: 'failed',
                  failed_reason: 'FAILED',
                }
              }))
              cy.wait(2000).then(()=>{
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
