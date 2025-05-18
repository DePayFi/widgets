import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

describe('Payment Widget: fee, fee2 & protocolFee', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const feeReceiver = '0x8a4aDA571ab235BF7d586d02E534D08552B3dedb'
  const fee2Receiver = '0xb87D81203FD2E881FBe0Bae6C01E1a5a3d98C456'
  const amount = 20
  const defaultArguments = {
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
  }
  
  let provider
  let TOKEN_A_AmountBN
  let exchange

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)

    ;({ TOKEN_A_AmountBN, exchange } = mockBasics({
      
      provider,
      blockchain,

      fromAddress,
      fromAddressAssets: [
        {
          "name": "Ether",
          "symbol": "ETH",
          "address": ETH,
          "type": "NATIVE"
        }
      ],
      
      toAddress,

      exchange: 'uniswap_v2',
      NATIVE_Balance: 1.1,

      TOKEN_A: DEPAY,
      TOKEN_A_Decimals: 18,
      TOKEN_A_Name: 'DePay',
      TOKEN_A_Symbol: 'DEPAY',
      TOKEN_A_Amount: amount,
      TOKEN_A_Balance: 0,
      
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
        accept: [{
          blockchain,
          amount,
          token: DEPAY,
          receiver: toAddress,
        }],
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
        accept: [{
          blockchain,
          amount,
          token: DEPAY,
          receiver: toAddress,
        }],
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
  
  it('pays a fee to feeReceiver, fee2 to fee2Receiver and a protocolFee remains with the protocol', () => {

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

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "19.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: '1.0',
        fee_receiver: feeReceiver,
        nonce: "0",
        payload: {
          sender_amount: "0.0101",
          sender_id: fromAddress,
          sender_token_id: ETH,
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
        cy.wait(2000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').should('contain.text', 'Performing payment...').then(()=>{
            expect(mockedTransaction.calls.count()).to.equal(1)
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
            confirm(mockedTransaction)
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
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
