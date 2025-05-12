import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import Exchanges from '@depay/web3-exchanges'
import { mock, resetMocks } from '@depay/web3-mock'
import { getProvider, resetCache } from '@depay/web3-client'
import Token from '@depay/web3-tokens'

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
  const defaultArguments = {
    currency: 'USD',
    accept: [{
      blockchain,
      amount,
      token: TOKEN,
      receiver: toAddress
    }]
  }

  let USDValueMock
  let TOKENRouteMock
  let provider

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)

    mock(blockchain)
    mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT } })
    mock({ provider, blockchain, request: { to: Blockchains[blockchain].stables.usd[0], api: Token[blockchain].DEFAULT } })
    mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
    mock({ provider, blockchain, request: { to: Blockchains[blockchain].stables.usd[0], api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
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
      url: `https://public.depay.com/currencies/USD`,
      overwriteRoutes: true
    }, "0.85")
  })

  it('shows a dialog explaining that no payment option could be found and allows to see available payment options', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('Detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'No enough funds!')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Text', 'Please make sure you have enough funds')
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
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'No enough funds!')
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
