import { mock } from '@depay/web3-mock'

export default ({ amountOutBN, path, block, amountsIn, provider, blockchain, exchange })=>{

  mock({
    provider,
    blockchain,
    block,
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
