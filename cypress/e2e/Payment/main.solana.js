import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/solana/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, anything, confirm, increaseBlock, resetMocks } from '@depay/web3-mock'
import { mockPaymentsAccount, mockTokenAccount } from '../../../tests/mocks/solana/transaction'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('Payment Widget: main functionality for Solana', () => {

  const blockchain = 'solana'
  const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
  const DEPAY = 'DePay1miDBPWXs6PVQrdC5Vch2jemgEPaiyXLNLLa2NF'
  const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  const SOL = Blockchains[blockchain].currency.address
  const WSOL = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'
  const amount = 20
  const defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }
  
  let TOKEN_A_AmountBN
  let provider
  let exchange

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts } })
    provider = await getProvider(blockchain)

    ;({ exchange, TOKEN_A_AmountBN } = await mockBasics({
      provider,
      blockchain,

      fromAddress,
      fromAddressAssets: [
        {
          "name": "Solana",
          "symbol": "SOL",
          "address": SOL,
          "type": "NATIVE"
        }, {
          "name": "USD Coin",
          "symbol": "USDC",
          "address": USDC,
          "type": "SPL"
        }, {
          "name": "DePay",
          "symbol": "DEPAY",
          "address": DEPAY,
          "type": "SPL"
        }
      ],
      
      toAddress,

      exchange: 'orca',
      NATIVE_Balance: 0,

      TOKEN_A: DEPAY,
      TOKEN_A_Decimals: 9,
      TOKEN_A_Name: 'DePay',
      TOKEN_A_Symbol: 'DEPAY',
      TOKEN_A_Amount: amount,
      TOKEN_A_Balance: 30,
      
      TOKEN_B: USDC,
      TOKEN_B_Decimals: 9,
      TOKEN_B_Name: 'USD Coin',
      TOKEN_B_Symbol: 'USDC',
      TOKEN_B_Amount: 33,
      TOKEN_B_Balance: 50,

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
  
  it('executes', async()=> {

    let mockedTransaction = mock({
      blockchain,
      transaction: {
        from: fromAddress,
        instructions: [
          {
            to: 'DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7',
            api: routers.solana.api.routeToken.layout,
            params: {
              anchorDiscriminator: '13483873682232752277',
              nonce: '0',
              paymentAmount: '20000000000',
              feeAmount: anything,
              deadline: anything
            }
          }
        ]
      }
    })

    fetchMock.post({
      url: "https://public.depay.com/payments",
      body: {
        after_block: "1",
        amount: "20.0",
        blockchain: "solana",
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

    await mockPaymentsAccount({ provider, fromAddress, nonce: '0' })
    await mockTokenAccount({ provider, tokenAddress: DEPAY, ownerAddress: toAddress, exists: true, balance: 0 })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://solscan.io/tx/')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'target').should('eq', '_blank')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'rel').should('eq', 'noopener noreferrer')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
            expect(mockedTransaction.calls.count()).to.equal(1)
            cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('not.exist')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled')
            confirm(mockedTransaction)
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://solscan.io/tx/')
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
