import { mock } from '@depay/web3-mock'

export default ({ amountInBN, path, amountsOut, provider, blockchain, exchange })=>{

  mock({
    provider,
    blockchain,
    request: {
      to: exchange.router.address,
      api: exchange.router.api,
      method: 'getAmountsOut',
      params: [
        amountInBN,
        path
      ],
      return: amountsOut
    }
  })
}
