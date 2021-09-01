import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { ethers } from 'ethers'
import { findByName } from 'depay-web3-exchanges'
import { mock, resetMocks } from 'depay-web3-mock'
import { Token } from 'depay-web3-tokens'

describe('execute Payment', () => {

  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  let blockchain = 'ethereum'
  let fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
  let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  let TOKEN = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  let exchange = findByName('uniswap_v2')
  let amount = 20
  let decimals = 18
  let amountBN = ethers.utils.parseUnits(amount.toString(), decimals)
  let defaultArguments = {
    accept: [{
      blockchain,
      amount,
      token: TOKEN,
      receiver: toAddress
    }]
  }

  let USDValueMock
  let TOKENRouteMock

  beforeEach(()=>{
    mock({ blockchain, call: { to: TOKEN, api: Token[blockchain].DEFAULT } })
    mock({ blockchain, call: { to: CONSTANTS[blockchain].USD, api: Token[blockchain].DEFAULT } })
    mock({ blockchain, call: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
    mock({ blockchain, call: { to: CONSTANTS[blockchain].USD, api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
    mock({ blockchain, balance: { for: fromAddress, return: ethers.BigNumber.from('0') }})
    mock({ blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [TOKEN, CONSTANTS[blockchain].USD], return: CONSTANTS[blockchain].ZERO }})
    mock({ blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [TOKEN, CONSTANTS[blockchain].WRAPPED], return: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d'}})
    mock({ blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [CONSTANTS[blockchain].WRAPPED, TOKEN], return: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d'}})
    mock({ blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [CONSTANTS[blockchain].USD, CONSTANTS[blockchain].WRAPPED], return: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11'}})
    USDValueMock = mock({"blockchain":"ethereum","call":{"to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","api":exchange.contracts.router.api,"method":"getAmountsOut","return":"Your Value","params":["20000000000000000000",["0xa0bed124a09ac2bd941b10349d8d224fe3c955eb","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0x6b175474e89094c44da98b954eedeac495271d0f"]]}})
    TOKENRouteMock = mock({"blockchain":"ethereum","call":{"to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","api":exchange.contracts.router.api,"method":"getAmountsIn","return":"Your Value","params":["20000000000000000000",["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]]}})
    
    fetchMock.get({
      url: `https://api.depay.pro/v1/assets?account=${fromAddress}&blockchain=${blockchain}`,
      headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
      overwriteRoutes: true
    }, [])

    fetchMock.get({
      url: `https://api.depay.pro/v1/fiat?symbol=CHF`,
      headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
      overwriteRoutes: true
    }, {
      "usd": 0.85
    })
  })

  it('shows a dialog explaining that no payment route could be found', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'We were not able to find the request payment token nor any other convertable asset in your wallet. Please top up your account in order to proceed with this payment.')
      })
    })
  })

  it('stops reloading routes and toToken price', () => {
    let USDValueMock_count
    let TOKENRouteMock_count
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'We were not able to find the request payment token nor any other convertable asset in your wallet. Please top up your account in order to proceed with this payment.')
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
})
