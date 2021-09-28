import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { findByName } from 'depay-web3-exchanges'
import { mock, trigger, confirm, connect, fail, increaseBlock, resetMocks } from 'depay-web3-mock'
import { resetCache, provider } from 'depay-web3-client'
import { routers, plugins } from 'depay-web3-payments'
import { supported } from 'depay-web3-wallets'
import { Token } from 'depay-web3-tokens'

describe('WalletConnect Payment', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)
  beforeEach(resetCache)
  beforeEach(()=>fetchMock.restore())

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
  let mockBasicsDelayed = ()=>{
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
          "type": "ERC20"
        }, {
          "name": "DePay",
          "symbol": "DEPAY",
          "address": DEPAY,
          "type": "ERC20"
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
  }

  it('allows to connect wallet via WalletConnect', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasicsDelayed()

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '20')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DEPAY')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
        })
      })
    })
  })

  it('shows error if WalletConnect fails connecting', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasicsDelayed()

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

          supported[0].connector.connect = async ()=>{
            throw('wallet connect connection failed')
          }

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()

          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Oops, Something Went Wrong')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong.FontItalic', 'wallet connect connection failed')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'If this keeps happening, please report it.')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
        })
      })
    })
  })

  it('allows to execute payment (and calls all the callbacks)', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let sentCalledWith
        let ensuredCalledWith
        let confirmedCalledWith
        DePayWidgets.Payment({ ...defaultArguments, document,
          sent: (transaction)=>{ sentCalledWith = transaction },
          confirmed: (transaction)=>{ confirmedCalledWith = transaction },
          ensured: (transaction)=>{ ensuredCalledWith = transaction }
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasicsDelayed()

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

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

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'target').should('eq', '_blank')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'rel').should('eq', 'noopener noreferrer')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
                expect(sentCalledWith.from).to.equal(accounts[0])
                expect(sentCalledWith.id).to.equal(mockedTransaction.transaction._id)
                expect(sentCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    confirm(mockedTransaction)
                    cy.wait(3000).then(()=>{
                      increaseBlock(12)
                      expect(confirmedCalledWith.from).to.equal(accounts[0])
                      expect(confirmedCalledWith.id).to.equal(mockedTransaction.transaction._id)
                      expect(confirmedCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
                      cy.get('button[title="Close dialog"]', { includeShadowDom: true }).should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary.round .Checkmark.Icon').click()
                      cy.get('.ReactShadowDOMOutsideContainer').should('not.exist').then(()=>{
                        cy.wait(4000).then(()=>{
                          expect(ensuredCalledWith.from).to.equal(accounts[0])
                          expect(ensuredCalledWith.id).to.equal(mockedTransaction.transaction._id)
                          expect(ensuredCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
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

  it('shows wallet selection dialog if wallet connect disconnects', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasicsDelayed()

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05').then(()=>{
            trigger('disconnect')
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').should('exist')
            })
          })
        })
      })
    })
  })

  it('fails and calls failed callback', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        let failedCalledWith
        DePayWidgets.Payment({ ...defaultArguments, document, 
          failed: (transaction)=> { failedCalledWith = transaction }
        })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasicsDelayed()

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

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

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'target').should('eq', '_blank')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').invoke('attr', 'rel').should('eq', 'noopener noreferrer')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Paying...').then(()=>{
                cy.wait(1000).then(()=>{
                  cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card.disabled').then(()=>{
                    fail(mockedTransaction)
                    cy.get('.ReactShadowDOMOutsideContainer').shadow().find('a').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
                    cy.wait(2000).then(()=>{
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('h1').should('contain.text', 'Payment Failed')
                      cy.get('button[title="Go back"]', { includeShadowDom: true }).should('exist')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain.text', 'Pay €28.05')
                      cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'Unfortunately executing your payment failed. You can go back and try again.').then(()=>{
                        expect(failedCalledWith.from).to.equal(accounts[0])
                        expect(failedCalledWith.id).to.equal(mockedTransaction.transaction._id)
                        expect(failedCalledWith.url).to.equal(`https://etherscan.io/tx/${mockedTransaction.transaction._id}`)
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

  it.only('asks user to switch wallet connect to different network when trying to submit payment', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        
        fetchMock.get({
          url: `https://api.depay.pro/v1/assets?account=${fromAddress}&blockchain=bsc`,
          headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
          overwriteRoutes: true
        }, [{
          "name": "Binance Coin",
          "symbol": "BNB",
          "address": CONSTANTS['bsc'].NATIVE,
          "type": "NATIVE"
        }])

        let exchange = findByName('pancakeswap')
        mock({ provider: provider('bsc'), blockchain: 'bsc', balance: { for: fromAddress, return: '1000000000000000000' }})
        mock({ provider: provider('bsc'), blockchain: 'bsc', call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair' }})
        mock({ provider: provider('bsc'), blockchain: 'bsc', call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn' }})
        mock({ provider: provider('bsc'), blockchain: 'bsc', call: { to: CONSTANTS['bsc'].USD, api: Token['bsc'].DEFAULT, method: 'decimals', return: CONSTANTS['bsc'].DECIMALS } })
        mock({ provider: provider('bsc'), blockchain: 'bsc', call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsOut', params: ['100000000000000000', [CONSTANTS['bsc'].WRAPPED, CONSTANTS['bsc'].USD]], return: ['100000000000000000', '100000000000000000'] }})
        mock({ provider: provider('bsc'), blockchain: 'bsc', call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [CONSTANTS['bsc'].WRAPPED, CONSTANTS['bsc'].USD], return: '0xc15fa3E22c912A276550F3E5FE3b0Deb87B55aCd' }})

        DePayWidgets.Payment({ accept: [{
          blockchain: 'bsc',
          amount: 0.1,
          token: CONSTANTS['bsc'].NATIVE,
          receiver: toAddress
        }], document })

        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.DialogHeader h1', 'Select a wallet').then(()=>{
          mockBasicsDelayed()

          mock({ 
            blockchain,
            accounts: { return: accounts },
            wallet: 'walletconnect',
            connector: supported[0].connector
          })

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

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Connect WalletConnect"]').click()
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Connect to Binance Smart Chain')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'Please make sure you connect your wallet to the correct network before you try again!')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click().then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary')
              })
            })
          })
        })
      })
    })
  })
})
