import Blockchains from '@depay/web3-blockchains'
import DePayWidgets from '../../../src'
import Exchanges from '@depay/web3-exchanges'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { getProvider, resetCache } from '@depay/web3-client'
import { mock, resetMocks, anything, confirm } from '@depay/web3-mock'
import { routers, plugins } from '@depay/web3-payments'

describe('Payment Widget: no payment options found', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const TOKEN = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const exchange = Exchanges[blockchain].uniswap_v2
  const amount = 20
  const decimals = 18
  const amountBN = ethers.utils.parseUnits(amount.toString(), decimals)
  const accept = [{
    blockchain,
    amount,
    token: TOKEN,
    receiver: toAddress
  }]
  const defaultArguments = { accept }

  let USDValueMock
  let TOKENRouteMock
  let provider

  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    cy.stub(Intl, 'DateTimeFormat', () => {
      return { resolvedOptions: ()=>{
        return { timeZone: 'Europe/Berlin' }
      }}
    })
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    
    cy.then(() => getProvider(blockchain)).then((provider) => {

      mock(blockchain)
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT } })
      mock({ provider, blockchain, request: { to: Blockchains[blockchain].stables.usd[0], api: Token[blockchain].DEFAULT } })
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
      mock({ provider, blockchain, request: { to: Blockchains[blockchain].stables.usd[0], api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'symbol', return: 'DEPAY' } })
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'name', return: 'DePay' } })      
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: Blockchains[blockchain].maxInt } })
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
      mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].maxInt } })
      mock({ provider, blockchain, balance: { for: fromAddress, return: ethers.BigNumber.from('0') }})
      mock({ provider, blockchain, request: { to: exchange[blockchain].factory.address, api: exchange[blockchain].factory.api, method: 'getPair', params: [TOKEN, Blockchains[blockchain].stables.usd[0]], return: Blockchains[blockchain].zero }})
      mock({ provider, blockchain, request: { to: exchange[blockchain].factory.address, api: exchange[blockchain].factory.api, method: 'getPair', params: [TOKEN, Blockchains[blockchain].wrapped.address], return: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d'}})
      mock({ provider, blockchain, request: { to: exchange[blockchain].factory.address, api: exchange[blockchain].factory.api, method: 'getPair', params: [Blockchains[blockchain].wrapped.address, TOKEN], return: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d'}})
      mock({ provider, blockchain, request: { to: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d', api: exchange[blockchain].pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
      mock({ provider, blockchain, request: { to: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d', api: exchange[blockchain].pair.api, method: 'token0', return: TOKEN }})
      mock({ provider, blockchain, request: { to: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d', api: exchange[blockchain].pair.api, method: 'token1', return: Blockchains[blockchain].wrapped.address }})
      mock({ provider, blockchain, request: { to: exchange[blockchain].factory.address, api: exchange[blockchain].factory.api, method: 'getPair', params: [Blockchains[blockchain].stables.usd[0], Blockchains[blockchain].wrapped.address], return: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11'}})
      mock({ provider, blockchain, request: { to: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', api: exchange[blockchain].pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
      mock({ provider, blockchain, request: { to: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', api: exchange[blockchain].pair.api, method: 'token0', return: Blockchains[blockchain].stables.usd[0] }})
      mock({ provider, blockchain, request: { to: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', api: exchange[blockchain].pair.api, method: 'token1', return: Blockchains[blockchain].wrapped.address }})
      USDValueMock = mock({provider, blockchain, "call":{"to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","api":exchange[blockchain].router.api,"method":"getAmountsOut","return":"Your Value","params":["20000000000000000000",["0xa0bed124a09ac2bd941b10349d8d224fe3c955eb","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0x6b175474e89094c44da98b954eedeac495271d0f"]]}})
      TOKENRouteMock = mock({provider, blockchain, "call":{"to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","api":exchange[blockchain].router.api,"method":"getAmountsIn","return":"Your Value","params":["20000000000000000000",["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]]}})
      
      fetchMock.get({
        url: `https://public.depay.com/accounts/${blockchain}/${fromAddress}/assets`,
        overwriteRoutes: true
      }, [])

      fetchMock.get({
        url: `https://public.depay.com/currencies/EUR`,
        overwriteRoutes: true
      }, "0.85")

      fetchMock.post({
        url: "https://public.depay.com/routes/best",
        body: {
          accounts: { [blockchain]: accounts[0] },
          accept,
        },
      }, 404)

      fetchMock.post({
        url: "https://public.depay.com/routes/all",
        body: {
          accounts: { [blockchain]: accounts[0] },
          accept,
        },
      }, [])
    })
  })

  it('shows a dialog explaining that no payment option could be found and allows to see available payment options', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Not Enough Funds')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Text', 'Please check that you have sufficient funds on one of these blockchains:')
      })
    })
  })

  it('stops reloading routes and toToken price', () => {
    let USDValueMock_count
    let TOKENRouteMock_count
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Not Enough Funds')
        cy.wait(2000).then(()=>{
          USDValueMock_count = USDValueMock.calls.count()
          TOKENRouteMock_count = TOKENRouteMock.calls.count()
        })
        cy.wait(16000).then(()=>{
          expect(USDValueMock.calls.count()).to.eq(USDValueMock_count)
          expect(TOKENRouteMock.calls.count()).to.eq(TOKENRouteMock_count)
        })
      })
    })
  })

  describe("no options post payment initiation", ()=>{

    beforeEach(()=>{

      fetchMock.post({
        overwriteRoutes: true,
        url: "https://public.depay.com/routes/best",
        body: {
          accounts: { [blockchain]: accounts[0] },
          accept,
        },
      }, {
          blockchain,
          fromToken: TOKEN,
          fromDecimals: 18,
          fromName: "DePay",
          fromSymbol: "DEPAY",
          toToken: TOKEN,
          toAmount: amountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY"
      })

      fetchMock.post({
        overwriteRoutes: true,
        url: "https://public.depay.com/routes/all",
        body: {
          accounts: { [blockchain]: accounts[0] },
          accept,
        },
      }, [
        {
          blockchain,
          fromToken: TOKEN,
          fromDecimals: 18,
          fromName: "DePay",
          fromSymbol: "DEPAY",
          toToken: TOKEN,
          toAmount: amountBN.toString(),
          toDecimals: 18,
          toName: "DePay",
          toSymbol: "DEPAY"
        },
      ])

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${TOKEN}?amount=20.0` }, '4')
    })

    it('does not show the error dialog if payment is already in progress', ()=>{
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
              tokenInAddress: TOKEN,
              exchangeAddress: Blockchains[blockchain].zero,
              tokenOutAddress: TOKEN,
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
            fetchMock.post({
              overwriteRoutes: true,
              url: "https://public.depay.com/routes/best",
              body: {
                accounts: { [blockchain]: accounts[0] },
                accept,
              },
            }, 404)
            fetchMock.post({
              overwriteRoutes: true,
              url: "https://public.depay.com/routes/all",
              body: {
                accounts: { [blockchain]: accounts[0] },
                accept,
              },
            }, [])
            cy.wait(16000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Not Enough Funds').should('not.exist')
              confirm(mockedTransaction)
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').invoke('attr', 'href').should('include', 'https://etherscan.io/tx/')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Perform payment').then(()=>{
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
