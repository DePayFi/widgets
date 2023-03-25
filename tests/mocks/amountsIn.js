import { mock } from '@depay/web3-mock'

export default ({ amountOutBN, path, amountsIn, provider, blockchain, exchange })=>{

  mock({
    provider,
    blockchain,
    request: {
      to: exchange.router.address,
      api: exchange.router.api,
      method: 'getAmountsIn',
      params: [
        amountOutBN,
        path
      ],
      return: amountsIn
    }
  })
}
