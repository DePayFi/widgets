import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { CONSTANTS } from 'depay-web3-constants'
import { ethers } from 'ethers'
import { findByName } from 'depay-web3-exchanges'
import { mock, resetMocks } from 'depay-web3-mock'
import { routers } from 'depay-web3-payments'
import { Token } from 'depay-web3-tokens'

describe('Payment', () => {
  
  describe('basics', () => {

    beforeEach(resetMocks)

    let DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
    let DEPAYBalance = 30
    let DEPAYBalanceBN
    let DEPAYAmount = 20
    let DEPAYAmountBN = ethers.utils.parseUnits(DEPAYAmount.toString(), 18)
    let DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    let DAIAmountInBN = ethers.utils.parseUnits('33', 18)
    let blockchain = 'ethereum'
    let ETH = CONSTANTS[blockchain].NATIVE
    let WETH = CONSTANTS[blockchain].WRAPPED
    let WETHAmountInBN = ethers.utils.parseUnits('0.01', 18)
    let uniswapExchange = findByName('uniswap_v2')
    let fromAdress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    let toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'

    let defaultArguments = {
      blockchain,
      amount: DEPAYAmount,
      token: DEPAY,
      receiver: toAddress,
    }

    beforeEach(()=>{
      DEPAYBalanceBN = ethers.utils.parseUnits(DEPAYBalance.toString(), 18)

      mock(blockchain)
      
      fetchMock.get({
        url: `https://api.depay.pro/v1/assets?account=0xd8da6bf26964af9d7eed9e03e53415d37aa96045&blockchain=${blockchain}`,
        headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
        overwriteRoutes: true
      }, [
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
      ])

      mock({ blockchain, call: { to: DEPAY, api: Token[blockchain].ERC20, method: 'decimals', return: '18' } })
      mock({ blockchain, call: { to: DEPAY, api: Token[blockchain].ERC20, method: 'symbol', return: 'DEPAY' } })
      mock({ blockchain, call: { to: DEPAY, api: Token[blockchain].ERC20, method: 'name', return: 'DePay' } })
      
      mock({ blockchain, call: { to: DAI, api: Token[blockchain].ERC20, method: 'decimals', return: '18' } })
      
      mock({ blockchain, call: { to: uniswapExchange.contracts.factory.address, api: uniswapExchange.contracts.factory.api, method: 'getPair', params: [DAI, DEPAY], return: CONSTANTS[blockchain].ZERO }})
      mock({ blockchain, call: { to: uniswapExchange.contracts.factory.address, api: uniswapExchange.contracts.factory.api, method: 'getPair', params: [DAI, WETH], return: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11' }})
      mock({ blockchain, call: { to: uniswapExchange.contracts.factory.address, api: uniswapExchange.contracts.factory.api, method: 'getPair', params: [DEPAY, DAI], return: CONSTANTS[blockchain].ZERO }})
      mock({ blockchain, call: { to: uniswapExchange.contracts.factory.address, api: uniswapExchange.contracts.factory.api, method: 'getPair', params: [WETH, DEPAY], return: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d' }})
      mock({ blockchain, call: { to: uniswapExchange.contracts.factory.address, api: uniswapExchange.contracts.factory.api, method: 'getPair', params: [DEPAY, WETH], return: '0xEF8cD6Cb5c841A4f02986e8A8ab3cC545d1B8B6d' }})
      
      mock({ blockchain, call: { to: DEPAY, api: Token[blockchain].ERC20, method: 'balanceOf', params: fromAdress, return: DEPAYBalanceBN } })
      mock({ blockchain, call: { to: DEPAY, api: Token[blockchain].ERC20, method: 'allowance', params: [fromAdress, routers[blockchain].address], return: CONSTANTS[blockchain].MAXINT } })

      mock({ blockchain, call: { to: DAI, api: Token[blockchain].ERC20, method: 'balanceOf', params: fromAdress, return: DAIAmountInBN } })
      mock({ blockchain, call: { to: DAI, api: Token[blockchain].ERC20, method: 'allowance', params: [fromAdress, routers[blockchain].address], return: CONSTANTS[blockchain].MAXINT } })

      mock({ blockchain, call: { to: uniswapExchange.contracts.router.address, api: uniswapExchange.contracts.router.api, method: 'getAmountsIn', params: [DEPAYAmountBN, [WETH, DEPAY]], return: [WETHAmountInBN, DEPAYAmountBN] }})
      mock({ blockchain, call: { to: uniswapExchange.contracts.router.address, api: uniswapExchange.contracts.router.api, method: 'getAmountsIn', params: [DEPAYAmountBN, [DAI, WETH, DEPAY]], return: [DAIAmountInBN, WETHAmountInBN, DEPAYAmountBN] }})
      mock({ blockchain, call: { to: uniswapExchange.contracts.router.address, api: uniswapExchange.contracts.router.api, method: 'getAmountsOut', params: [DEPAYAmountBN, [DEPAY, WETH, DAI]], return: [DEPAYAmountBN, WETHAmountInBN, DAIAmountInBN] }})
      
      mock({ blockchain, balance: { for: fromAdress, return: '0' }})

      cy.stub(Intl, 'DateTimeFormat', () => {
        return { resolvedOptions: ()=>{
          return { timeZone: 'Europe/Berlin' }
        }}
      })

      fetchMock.get({
        url: 'https://api.depay.pro/v1/fiat?symbol=EUR',
        headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
        overwriteRoutes: true
      }, {
        "usd": "0.85"
      })
    })
    
    it('renders and opens a styled Payment dialog in a shadow dom', ()=> {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('style').should('contain.text', '.Dialog')
        })
      })
    })

    describe("loading", ()=>{

      beforeEach(()=>{
        fetchMock.get({
          url: 'https://api.depay.pro/v1/assets?account=0xd8da6bf26964af9d7eed9e03e53415d37aa96045&blockchain=ethereum',
          headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
          overwriteRoutes: true,
          delay: 5000
        }, [])
      })

      it('shows an animated skeleton while loading data', ()=> {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Skeleton')
          })
        })
      })

      it('allows me to close the container while its loading', () => {
        cy.visit('cypress/test.html').then((contentWindow) => {
          cy.document().then((document)=>{
            DePayWidgets.Payment({ ...defaultArguments, document })
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.DialogCloseButton').click()
            cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
          })
        })
      })
    })
    
    it('loads the most cost-effective route and suggests that as a payment', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenAmountCell').should('contain', '20')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card .TokenSymbolCell').should('contain', 'DEPAY')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardText small').should('contain', '€28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.CardImage img').invoke('attr', 'src').should('eq', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png')
        })
      })
    })

    it('allows me to close the container after it loaded', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').should('contain', 'Pay €28.05')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.DialogCloseButton').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })
    
    it('contains a link to the DePay website in the footer', () => {
      cy.visit('cypress/test.html').then((contentWindow) => {
        cy.document().then((document)=>{
          DePayWidgets.Payment({ ...defaultArguments, document })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.DialogFooter a').invoke('attr', 'href').should('eq', 'https://depay.fi?utm_source=localhost&utm_medium=widget&utm_campaign=WidgetV2')
        })
      })
    })
  })
})
