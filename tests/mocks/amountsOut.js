import { mock } from 'depay-web3-mock'

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
