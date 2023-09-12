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

describe('Payment Widget: insufficient amount of tokens', () => {

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
    mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'name', return: 'DePay' } })
    mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'symbol', return: 'DEPAY' } })
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
    mock({ provider, blockchain, request: { to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", api:exchange[blockchain].router.api, method: "getAmountsOut", return: ["20000000000000000000", "100000000000000"], params: ["20000000000000000000",["0xa0bed124a09ac2bd941b10349d8d224fe3c955eb","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0x6b175474e89094c44da98b954eedeac495271d0f"]]}})
    mock({ provider, blockchain, request: { to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", api:exchange[blockchain].router.api, method: "getAmountsIn", return: ["100000000000000", "20000000000000000000"], params: ["20000000000000000000",["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]]}})
    
    fetchMock.get({
      url: `https://public.depay.com/accounts/${blockchain}/${fromAddress}/assets`,
      overwriteRoutes: true
    }, [])

    fetchMock.get({
      url: `https://public.depay.com/currencies/USD`,
      overwriteRoutes: true
    }, "0.85")
  })

  it('tells me to top up the direct transfer route (if I have some balance for the direct transfer route)', () => {
    mock({ provider, blockchain, balance: { for: fromAddress, return: ethers.BigNumber.from('10000000000000') }})
    mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '5000000000000000000' } })
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Insufficient Amount')
        cy.get('.ReactShadowDOMOutsideContainer').shadow() .find('.Text').should('contain.text', '15 DEPAY are additionally required in order to perform this payment of 20 DEPAY.')
        cy.get('.ReactShadowDOMOutsideContainer').shadow() .find('.Text').should('contain.text', 'Please top up or swap another token to DEPAY to perform this payment.')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('button', 'Ok').click()
      })
    })
  })

  it('tells me to top up NATIVE if my wallet does not have enough NATIVE to even perform a transaction', () => {
    mock({ provider, blockchain, balance: { for: fromAddress, return: ethers.BigNumber.from('10000000000') }})
    mock({ provider, blockchain, request: { to: TOKEN, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '0' } })
    mock({ provider, blockchain, request: { to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '0' } })
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Insufficient Amount')
        cy.get('.ReactShadowDOMOutsideContainer').shadow() .find('.Text').should('contain.text', '0.000101 ETH is required in order to perform this payment.')
        cy.get('.ReactShadowDOMOutsideContainer').shadow() .find('.Text').should('contain.text', 'Please top up your ETH to perform this payment.')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('button', 'Ok').click()
      })
    })
  })
})
