import { mock } from 'depay-web3-mock'

// mocks the getAmountsOut request called by PaymentValueProvider
// to determine the displayed payment value in USD
export default ({ amountInBN, path, amountsOut, provider, blockchain, exchange })=>{

  mock({
    provider,
    blockchain,
    call: {
      to: exchange.contracts.router.address,
      api: exchange.contracts.router.api,
      method: 'getAmountsOut',
      params: [
        amountInBN,
        path
      ],
      return: amountsOut
    }
  })
}
