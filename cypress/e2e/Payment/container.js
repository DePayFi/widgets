import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import mockBasics from '../../../tests/mocks/evm/basics'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks, anything } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

describe('Payment Widget: render into container', () => {
  
  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  const DEPAY = '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const ETH = Blockchains[blockchain].currency.address
  const WETH = Blockchains[blockchain].wrapped.address
  const fromAddress = accounts[0]
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  const accept = [{
    blockchain,
    amount,
    token: DEPAY,
    receiver: toAddress
  }]
  const defaultArguments = { accept }
  
  let provider
  let exchange
  let WRAPPED_AmountInBN
  let TOKEN_A_AmountBN
  let TOKEN_B_AmountBN

  beforeEach(async()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    mock({ blockchain, accounts: { return: accounts }, wallet: 'metamask' })
    provider = await getProvider(blockchain)

    ;({ 
      exchange,
      TOKEN_A_AmountBN,
      TOKEN_B_AmountBN,
      WRAPPED_AmountInBN 
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
      TOKEN_A_Balance: 30,
      
      TOKEN_B: DAI,
      TOKEN_B_Decimals: 18,
      TOKEN_B_Name: 'Dai Stablecoin',
      TOKEN_B_Symbol: 'DAI',
      TOKEN_B_Amount: 33,
      TOKEN_B_Balance: 50,

      TOKEN_A_TOKEN_B_Pair: Blockchains[blockchain].zero,
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

    fetchMock.post({
      url: "https://public.depay.com/routes/best",
      body: {
        accounts: { [blockchain]: accounts[0] },
        accept,
      },
    }, {
        blockchain,
        fromToken: DEPAY,
        fromDecimals: 18,
        fromName: "DePay",
        fromSymbol: "DEPAY",
        toToken: DEPAY,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "DePay",
        toSymbol: "DEPAY"
    })

    fetchMock.post({
      url: "https://public.depay.com/routes/all",
      body: {
        accounts: { [blockchain]: accounts[0] },
        accept,
      },
    }, [
      {
        blockchain,
        fromToken: DEPAY,
        fromDecimals: 18,
        fromName: "DePay",
        fromSymbol: "DEPAY",
        toToken: DEPAY,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "DePay",
        toSymbol: "DEPAY"
      },
      {
        blockchain,
        fromToken: DAI,
        fromDecimals: 18,
        fromName: "Dai",
        fromSymbol: "DAI",
        toToken: DEPAY,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "DePay",
        toSymbol: "DEPAY",
        pairsData: [{ exchange: 'uniswap_v2' }]
      },
    ])

    fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${DEPAY}?amount=20.0` }, '4')
  })

  it('renders the widget into a container', () => {
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{

        let CustomComponentWithWidget = (props)=>{
          let container = useRef()

          useEffect(()=>{
            if(container.current) {
              DePayWidgets.Payment({ ...defaultArguments, document,
                container: container.current
              })
            }
          }, [container])

          return(
            <div ref={container} style={{ position: 'relative', border: '1px solid black', width: "600px", height: "600px" }}></div>
          )
        }

        ReactDOM.createRoot(
          document.getElementById('test')
        ).render(
          React.createElement(CustomComponentWithWidget)
        );
      })
    })
  })
})
