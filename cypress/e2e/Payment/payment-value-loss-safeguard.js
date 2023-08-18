import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import React from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

describe('Payment Widget: value loss safeguard', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 1.8
  const defaultArguments = {
    accept:[{
      blockchain,
      token: DEPAY,
      receiver: toAddress
    }]
  }

  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN
  let exchange
  let provider

  afterEach(closeWidget)

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)

    ;({
      WRAPPED_AmountInBN,
      TOKEN_A_AmountBN,
      TOKEN_B_AmountBN,
      exchange
    } = mockBasics({
      provider,
      blockchain,
      fromAddress: accounts[0],
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
          "name": "USDT",
          "symbol": "USDT",
          "address": USDT,
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
      TOKEN_B_Allowance: Blockchains[blockchain].maxInt,

      TOKEN_A_TOKEN_B_Pair: Blockchains[blockchain].zero,
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
      amountInBN: '1176471',
      path: [Blockchains[blockchain].stables.usd[0], DEPAY],
      amountsOut: [
        '1176471',
        TOKEN_A_AmountBN
      ]
    })
  })
  
  it('removes warning if switching payments', ()=> {
    let fromAddress = accounts[0]
    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '11764706',
      path: [Blockchains[blockchain].stables.usd[0], DEPAY],
      amountsOut: [
        '11764706',
        TOKEN_A_AmountBN
      ]
    })
    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '11764710',
      path: [DAI, WETH, DEPAY],
      amountsOut: [
        '11764710',
        WRAPPED_AmountInBN.mul(10),
        TOKEN_A_AmountBN.mul(10)
      ]
    })
    // value loss
    mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsOut', params: [TOKEN_A_AmountBN, [DEPAY, WETH, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, ethers.utils.parseUnits('0.5', 18)] }})

    //USDT
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '880000000000000000000' } })
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USDT, Blockchains[blockchain].stables.usd[0]], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [DEPAY, USDT], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USDT, DEPAY], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USDT, Blockchains[blockchain].wrapped.address], return: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [Blockchains[blockchain].wrapped.address, USDT], return: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' }})
    mock({ provider, blockchain, request: { to: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('100000', 18), ethers.utils.parseUnits('100000', 18), '1629804922'] }})
    mock({ provider, blockchain, request: { to: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", api: exchange.pair.api, method: 'token0', return: USDT }})
    mock({ provider, blockchain, request: { to: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", api: exchange.pair.api, method: 'token1', return: Blockchains[blockchain].wrapped.address }})
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].zero } })
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'symbol', return: 'USDT' } })
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'name', return: 'USDT' } })
    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '11764710',
      path: [USDT, WETH, DEPAY],
      amountsOut: [
        '11764710',
        WRAPPED_AmountInBN.mul(10),
        TOKEN_A_AmountBN.mul(10)
      ]
    })
    mock({
      provider,
      blockchain,
      request: {
        to: exchange.router.address,
        api: exchange.router.api,
        method: 'getAmountsIn',
        params: [ethers.utils.parseUnits('1.8', 18), [USDT, WETH, DEPAY]],
        return: [ethers.utils.parseUnits('11.6', 18), ethers.utils.parseUnits('0.05', 18), ethers.utils.parseUnits('1.8', 18)]
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input[name="amount"]').type('{selectall}', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('10', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').click()
        cy.wait(3000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', "Payment would lose 58% of its value!").should('exist')
          cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).should('exist')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').click()
          cy.wait(2000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Select USDT as payment"]').click()
            cy.wait(2000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', "Payment would lose 58% of its value!").should('not.exist')
            })
          })
        })
      })
    })
  })

  it('also hides approval in case of payment value loss', ()=> {
    let fromAddress = accounts[0]
    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '11764706',
      path: [Blockchains[blockchain].stables.usd[0], DEPAY],
      amountsOut: [
        '11764706',
        TOKEN_A_AmountBN
      ]
    })
    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '11764710',
      path: [DAI, WETH, DEPAY],
      amountsOut: [
        '11764710',
        WRAPPED_AmountInBN.mul(10),
        TOKEN_A_AmountBN.mul(10)
      ]
    })
    // value loss
    mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsOut', params: [TOKEN_A_AmountBN, [DEPAY, WETH, DAI]], return: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, ethers.utils.parseUnits('0.5', 18)] }})

    //USDT
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: '880000000000000000000' } })
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USDT, Blockchains[blockchain].stables.usd[0]], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [DEPAY, USDT], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USDT, DEPAY], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USDT, Blockchains[blockchain].wrapped.address], return: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [Blockchains[blockchain].wrapped.address, USDT], return: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' }})
    mock({ provider, blockchain, request: { to: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('100000', 18), ethers.utils.parseUnits('100000', 18), '1629804922'] }})
    mock({ provider, blockchain, request: { to: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", api: exchange.pair.api, method: 'token0', return: USDT }})
    mock({ provider, blockchain, request: { to: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", api: exchange.pair.api, method: 'token1', return: Blockchains[blockchain].wrapped.address }})
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].zero } })
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'symbol', return: 'USDT' } })
    mock({ provider, blockchain, request: { to: USDT, api: Token[blockchain].DEFAULT, method: 'name', return: 'USDT' } })
    mockAmountsOut({
      provider,
      blockchain,
      exchange,
      amountInBN: '11764710',
      path: [USDT, WETH, DEPAY],
      amountsOut: [
        '11764710',
        WRAPPED_AmountInBN.mul(10),
        TOKEN_A_AmountBN.mul(10)
      ]
    })
    mock({
      provider,
      blockchain,
      request: {
        to: exchange.router.address,
        api: exchange.router.api,
        method: 'getAmountsIn',
        params: [ethers.utils.parseUnits('1.8', 18), [USDT, WETH, DEPAY]],
        return: [ethers.utils.parseUnits('11.6', 18), ethers.utils.parseUnits('0.05', 18), ethers.utils.parseUnits('1.8', 18)]
      }
    })

    mock({ provider, blockchain, request: { to: DEPAY, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].zero } })
    mock({ provider, blockchain, request: { to: DAI, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].zero } })

    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card').contains('detected').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change amount"]').click()
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input[name="amount"]').type('{selectall}', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input').type('10', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Done').click()
        cy.wait(3000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', "Payment would lose 58% of its value!").should('exist')
          cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).contains('Pay').should('exist')
          cy.get('.ButtonPrimary.disabled', { includeShadowDom: true }).contains('Approve use of DAI').should('exist')
        })
      })
    })
  })
})

