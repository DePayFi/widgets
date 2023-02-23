import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import mockAmountsOut from '../../../tests/mocks/amountsOut'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from '@depay/web3-constants'
import { mock, confirm, increaseBlock, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

describe('Sale Widget: main functionality', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = CONSTANTS[blockchain].USD
  const ETH = CONSTANTS[blockchain].NATIVE
  const WETH = CONSTANTS[blockchain].WRAPPED
  const fromAddress = accounts[0]
  const toAddress = accounts[0]
  const amount = 20
  const defaultArguments = {
    sell: { [blockchain]: DEPAY }
  }

  let provider
  let exchange
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN
  let WRAPPED_AmountInBN

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' }) })
    provider = await getProvider(blockchain)

    ;({ 
      TOKEN_A_AmountBN,
      TOKEN_B_AmountBN,
      WRAPPED_AmountInBN,
      exchange
    } = mockBasics({
      
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
      TOKEN_A_Balance: 0,
      
      TOKEN_B: DAI,
      TOKEN_B_Decimals: 18,
      TOKEN_B_Name: 'Dai Stablecoin',
      TOKEN_B_Symbol: 'DAI',
      TOKEN_B_Amount: 1.16,
      TOKEN_B_Balance: 50,
      TOKEN_B_Allowance: CONSTANTS[blockchain].MAXINT,

      TOKEN_A_TOKEN_B_Pair: CONSTANTS[blockchain].ZERO,
      TOKEN_B_WRAPPED_Pair: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
      TOKEN_A_WRAPPED_Pair: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d',

      WRAPPED_AmountIn: 0.01,
      USD_AmountOut: 1.16,

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

    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '1176470588235294200',
      path: [DAI, WETH, DEPAY],
      amountsOut: [
        '1176470588235294200',
        WRAPPED_AmountInBN,
        TOKEN_A_AmountBN
      ]
    })
  })
  
  it('executes', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        delay: 1000,
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, WETH, DEPAY],
          amounts: ['1166000000000000000', TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
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
          sender_amount: "1.166",
          sender_id: fromAddress,
          sender_token_id: DAI,
          type: 'sale'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €1.00')
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
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
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
        delay: 1000,
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, WETH, DEPAY],
          amounts: ['1166000000000000000', TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
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
          sender_amount: "1.166",
          sender_id: fromAddress,
          sender_token_id: DAI,
          integration: '123',
          type: 'sale'
        },
        receiver: toAddress,
        sender: fromAddress,
        token: DEPAY,
        transaction: mockedTransaction.transaction._id,
        uuid: mockedTransaction.transaction._id,
      },
    }, 201)

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, integration: '123', document })
        cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €1.00')
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
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .Checkmark')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Transaction confirmed').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, WETH, DEPAY],
          amounts: ['1166000000000000000', TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
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
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, WETH, DEPAY],
          amounts: ['1166000000000000000', TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        },
        return: Error('MetaMask Tx Signature: User denied transaction signature.')
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €1.00')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('not.exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...')
        // sent fails:
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €1.00')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]')
        cy.get('.Card[title="Change payment"]', { includeShadowDom: true }).should('exist')
      })
    })
  })

  it('calls all callbacks (sent, succeeded)', () => {
    let mockedTransaction = mock({
      blockchain,
      transaction: {
        delay: 1000,
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'route',
        params: {
          path: [DAI, WETH, DEPAY],
          amounts: ['1166000000000000000', TOKEN_A_AmountBN, anything],
          addresses: [fromAddress, toAddress],
          plugins: [plugins[blockchain].uniswap_v2.address, plugins[blockchain].payment.address],
          data: []
        }
      }
    })

    fetchMock.post({ url: "https://public.depay.com/payments" }, 201)

    let sentCalledWith
    let succeededCalledWith

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({ ...defaultArguments, document,
          sent: (transaction)=>{ sentCalledWith = transaction },
          succeeded: (transaction)=>{ succeededCalledWith = transaction },
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €1.00')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
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
