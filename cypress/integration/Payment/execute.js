import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from '@depay/web3-constants'
import { mock, confirm, increaseBlock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('execute Payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())
  beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

  let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let DAI = CONSTANTS[blockchain].USD
  let ETH = CONSTANTS[blockchain].NATIVE
  let WETH = CONSTANTS[blockchain].WRAPPED
  let fromAddress = accounts[0]
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let amount = 20
  let TOKEN_A_AmountBN
  let defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: DEPAY,
      receiver: toAddress
    }]
  }

  beforeEach(()=>{

    ({ TOKEN_A_AmountBN } = mockBasics({
      provider: provider(blockchain),
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
  
  it('executes', () => {
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
      url: "https://api.depay.fi/v2/payments",
      body: {
        after_block: 1,
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: 0,
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress.toLowerCase(),
          sender_token_id: DEPAY,
        },
        receiver: toAddress,
        sender: fromAddress.toLowerCase(),
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
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
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment has been confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
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

  it('stores integration', () => {
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
      url: "https://api.depay.fi/v2/payments",
      body: {
        after_block: 1,
        amount: "20.0",
        blockchain: "ethereum",
        confirmations: 1,
        fee_amount: null,
        fee_receiver: null,
        nonce: 0,
        payload: {
          sender_amount: "20.0",
          sender_id: fromAddress.toLowerCase(),
          sender_token_id: DEPAY,
          integration: '123'
        },
        receiver: toAddress,
        sender: fromAddress.toLowerCase(),
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, integration: '123', document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
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
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Payment has been confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
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

  it('asks to confirm transaction in your wallet after handing over to the wallet', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        delay: 2000,
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN]
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.wait(2000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Confirm transaction in your wallet')
            confirm(mockedTransaction)
          })
        })
      })
    })
  })

  it('resets the payment if anything goes wrong during submission (like user denying signature)', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        delay: 1000,
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN],
        return: Error('MetaMask Tx Signature: User denied transaction signature.')
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('not.exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
        // sent fails:
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]')
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('exist')
      })
    })
  })

  it('calls all callbacks (sent, confirmed)', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        delay: 1000,
        from: fromAddress,
        to: DEPAY,
        api: Token[blockchain].DEFAULT,
        method: 'transfer',
        params: [toAddress, TOKEN_A_AmountBN],
      }
    })

    let sentCalledWith
    let confirmedCalledWith

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document,
          sent: (transaction)=>{ sentCalledWith = transaction },
          confirmed: (transaction)=>{ confirmedCalledWith = transaction },
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
          cy.wait(1000).then(()=>{
            expect(sentCalledWith.from).to.equal(accounts[0])
            expect(sentCalledWith.id).to.equal(mockedTransaction.transaction._id)
            expect(sentCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
            expect(mockedTransaction.calls.count()).to.equal(1)
            confirm(mockedTransaction)
            cy.wait(5000).then(()=>{
              expect(confirmedCalledWith.from).to.equal(accounts[0])
              expect(confirmedCalledWith.id).to.equal(mockedTransaction.transaction._id)
              expect(confirmedCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
            })
          })
        })
      })
    })
  })
})
