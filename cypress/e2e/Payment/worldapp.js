import Blockchains from '@depay/web3-blockchains'
import closeWidget from '../../../tests/helpers/closeWidget'
import DePayWidgets from '../../../src'
import Exchanges from '@depay/web3-exchanges'
import fetchMock from 'fetch-mock'
import mockAmountsIn from '../../../tests/mocks/evm/amountsIn'
import mockAmountsOut from '../../../tests/mocks/evm/amountsOut'
import mockBasics from '../../../tests/mocks/evm/basics'
import React from 'react'
import ReactDOM from 'react-dom'
import Token from '@depay/web3-tokens'
import { ethers } from 'ethers'
import { mock, confirm, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { routers, plugins } from '@depay/web3-payments'

describe('Payment Widget: WorldApp', () => {

  const blockchain = 'worldchain'
  const WLD = '0x2cFc85d8E48F8EAB294be644d9E25C3030863003'
  const USDC = '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1'
  const fromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  const toAddress = '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  const amount = 20
  const accept = [{
    amount,
    blockchain,
    receiver: toAddress,
    token: WLD,
  }]
  const defaultArguments = { accept }
  
  let provider
  let exchange = Exchanges.worldchain.uniswap_v3
  let TOKEN_A_AmountBN = '20000000000000000000'

  afterEach(closeWidget)

  beforeEach(()=>{

    resetMocks()
    resetCache()
    fetchMock.restore()

    cy.stub(Intl, 'DateTimeFormat', () => {
      return { resolvedOptions: ()=>{
        return { timeZone: 'Europe/Berlin' }
      }}
    })

    fetchMock.get({
      url: `https://public.depay.com/currencies/EUR`,
      overwriteRoutes: true
    }, "0.85")

    fetchMock.post({
      url: "https://public.depay.com/routes/best",
      body: {
        accounts: { [blockchain]: fromAddress },
        accept,
      },
    }, {
        blockchain,
        fromToken: WLD,
        fromDecimals: 18,
        fromName: "Worldcoin",
        fromSymbol: "WLD",
        toToken: WLD,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "Worldcoin",
        toSymbol: "WLD"
    })

    fetchMock.post({
      url: "https://public.depay.com/routes/all",
      body: {
        accounts: { [blockchain]: fromAddress },
        accept,
      },
    }, [
      {
        blockchain,
        fromToken: WLD,
        fromDecimals: 18,
        fromName: "Worldcoin",
        fromSymbol: "WLD",
        toToken: WLD,
        toAmount: TOKEN_A_AmountBN.toString(),
        toDecimals: 18,
        toName: "Worldcoin",
        toSymbol: "WLD"
      }
    ])

    cy.then(() => getProvider(blockchain)).then((provider) => {

      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'decimals', return: 18 } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'symbol', return: 'WLD' } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'name', return: 'Worldcoin' } })      
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: Blockchains[blockchain].maxInt } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
      mock({ wallet: false, provider, blockchain, balance: { for: fromAddress, return: '10000000' }})
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].zero } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].zero } })
      mock({ wallet: false, provider, blockchain, request: { to: WLD, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].zero } })
      mock({
        wallet: false,
        provider,
        blockchain,
        request: {
          to: Blockchains[blockchain].permit2,
          api: [{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"AllowanceExpired","type":"error"},{"inputs":[],"name":"ExcessiveInvalidation","type":"error"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"uint256","name":"maxAmount","type":"uint256"}],"name":"InvalidAmount","type":"error"},{"inputs":[],"name":"InvalidContractSignature","type":"error"},{"inputs":[],"name":"InvalidNonce","type":"error"},{"inputs":[],"name":"InvalidSignature","type":"error"},{"inputs":[],"name":"InvalidSignatureLength","type":"error"},{"inputs":[],"name":"InvalidSigner","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[{"internalType":"uint256","name":"signatureDeadline","type":"uint256"}],"name":"SignatureExpired","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"spender","type":"address"}],"name":"Lockdown","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint48","name":"newNonce","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"oldNonce","type":"uint48"}],"name":"NonceInvalidation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"nonce","type":"uint48"}],"name":"Permit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"word","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mask","type":"uint256"}],"name":"UnorderedNonceInvalidation","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint48","name":"newNonce","type":"uint48"}],"name":"invalidateNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wordPos","type":"uint256"},{"internalType":"uint256","name":"mask","type":"uint256"}],"name":"invalidateUnorderedNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"internalType":"struct IAllowanceTransfer.TokenSpenderPair[]","name":"approvals","type":"tuple[]"}],"name":"lockdown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"nonceBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails[]","name":"details","type":"tuple[]"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitBatch","name":"permitBatch","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"internalType":"struct IAllowanceTransfer.AllowanceTransferDetails[]","name":"transferDetails","type":"tuple[]"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}],
          method: 'nonceBitmap',
          params: [fromAddress, "0"],
          return: "0"
        }
      })
      mock({
        wallet: false,
        provider,
        blockchain,
        logs:{
          "address":"0x0000000071727De22E5E9d8BAf0edAc6f37da032",
          "topics":["0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f","0x6789"],
          "fromBlock":"0x1",
          "toBlock":"latest",
          "return":[]
        }
      })

      fetchMock.get({ url: `https://public.depay.com/conversions/USD/${blockchain}/${WLD}?amount=20.0` }, '26.2')

    })
  })
  
  it('auto connects worldapp', () => {

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'WLD').should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€22.27')
      })
    })
  })

  it('does not ask to perform an approval neither shows any approval information when performing transactions in world app (bundled transactions)', () => {

    let transactionId = '0x12345'
    let miniAppId = '12345'
    let userOpHash = '0x6789'

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      cy.document().then(async(document)=>{
        let { unmount } = await DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'WLD').should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€22.27').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            window.MiniKit.trigger('miniapp-send-transaction', {
              status: 'success',
              transaction_id: transactionId,
              mini_app_id: miniAppId,
              userOpHash: userOpHash
            })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card', 'Approve WLD for spending').should('not.exist')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.active', 'Performing payment').should('exist')
              cy.wait(2000).then(unmount) 
            })
          })
        })
      })
    })
  })  

  it('confirms payment via transaction polling via worldcoin api', () => {

    let bundledTransactionId = '0x12345'
    let miniAppId = '12345'
    let userOpHash = '0x6789'
    let mockedTransaction = mock({
      wallet: false,
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'WLD').should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€22.27').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            fetchMock.get({ url: `https://public.depay.com/transactions/worldchain/${bundledTransactionId}?app_id=${miniAppId}` }, {
              "external_id": mockedTransaction.transaction._id,
              "status": "success"
            })
            window.MiniKit.trigger('miniapp-send-transaction', {
              status: 'success',
              transaction_id: bundledTransactionId,
              mini_app_id: miniAppId,
              userOpHash: userOpHash
            })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.active', 'Performing payment').should('exist')
              confirm(mockedTransaction)
              cy.wait(2000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.done', 'Perform payment').should('exist')
              })
            })
          })
        })
      })
    })
  })

  it('confirms payment via event polling via gnosis bundled userOp event', () => {

    let bundledTransactionId = '0x12345'
    let miniAppId = '12345'
    let userOpHash = '0x6789'
    let mockedTransaction = mock({
      wallet: false,
      blockchain,
      transaction: {
        from: fromAddress,
        to: routers[blockchain].address,
        api: routers[blockchain].api,
        method: 'pay',
      }
    })

    cy.visit('cypress/test.html').then((contentWindow) => {
      contentWindow.localStorage.setItem('_DePayWorldAppAddressV1', fromAddress)
      window.WorldApp = true
      cy.document().then((document)=>{
        DePayWidgets.Payment({ ...defaultArguments, document })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.Card[title="Change payment"]').contains('.TokenSymbolCell', 'WLD').should('exist')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.TokenAmountRow.small.Opacity05').should('contain.text', '€22.27').then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary').click().then(()=>{
            fetchMock.get({ url: `https://public.depay.com/transactions/worldchain/${bundledTransactionId}?app_id=${miniAppId}` }, 404)
            window.MiniKit.trigger('miniapp-send-transaction', {
              status: 'success',
              transaction_id: bundledTransactionId,
              mini_app_id: miniAppId,
              userOpHash: userOpHash
            })
            cy.wait(1000).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.active', 'Performing payment').should('exist')
              mock({
                wallet: false,
                provider,
                blockchain,
                logs:{
                  "address":"0x0000000071727De22E5E9d8BAf0edAc6f37da032",
                  "topics":["0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f","0x6789"],
                  "fromBlock":"0x1",
                  "toBlock":"latest",
                  "return":[{ removed: false, transactionHash: mockedTransaction.transaction._id }]
                }
              })
              confirm(mockedTransaction)
              cy.wait(2000).then(()=>{
                cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.done', 'Perform payment').should('exist')
              })
            })
          })
        })
      })
    })

  })
})
