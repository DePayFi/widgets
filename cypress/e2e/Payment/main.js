import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'

describe('Payment Widget: main functionality', () => {

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
  const defaultArguments = { accept }
  
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
  
  it('executes', () => {
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
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
              cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
            })
          })
        })
      })
    })
  })

  it('stores link', () => {
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
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          link: '456',
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
        DePayWidgets.Payment({ ...defaultArguments, link: '456', document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
          expect(mockedTransaction.calls.count()).to.equal(1)
          cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
          confirm(mockedTransaction)
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment performed').then(()=>{
              cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
              cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
            })
          })
        })
      })
    })
  })

  it('resets the payment if anything goes wrong during submission (like user denying signature)', () => {
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
        value: 0,
        return: Error('MetaMask Tx Signature: User denied transaction signature.')
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

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]')
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('exist')
      })
    })
  })

  it('calls all callbacks (sent, succeeded)', () => {
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

    let sentCalledWith
    let succeededCalledWith

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress,
          sender_token_id: DEPAY,
          type: 'payment'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
      },
      matchPartialBody: true
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document,
          sent: (transaction)=>{ sentCalledWith = transaction },
          succeeded: (transaction)=>{ succeededCalledWith = transaction },
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€3.40')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
          cy.wait(3000).then(()=>{
            expect(sentCalledWith.from).to.equal(accounts[0])
            expect(sentCalledWith.id).to.equal(mockedTransaction.transaction._id)
            expect(sentCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
            expect(mockedTransaction.calls.count()).to.equal(1)
            confirm(mockedTransaction)
            cy.wait(5000).then(()=>{
              expect(succeededCalledWith.from).to.equal(accounts[0])
              expect(succeededCalledWith.id).to.equal(mockedTransaction.transaction._id)
              expect(succeededCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
            })
          })
        })
      })
    })
  })
})
