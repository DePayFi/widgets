import fetchMock from 'fetch-mock'
import mockAmountsOut from './amountsOut'
import { CONSTANTS } from '@depay/web3-constants'
import { ethers } from 'ethers'
import { findByName } from '@depay/web3-exchanges'
import { mock } from '@depay/web3-mock'
import { routers } from '@depay/web3-payments'
import { Token } from '@depay/web3-tokens'

export default ({

  provider,
  blockchain,

  fromAddress,
  fromAddressAssets,

  toAddress,

  exchange,

  NATIVE_Balance,

  TOKEN_A,
  TOKEN_A_Decimals,
  TOKEN_A_Name,
  TOKEN_A_Symbol,
  TOKEN_A_Balance,
  TOKEN_A_Amount,

  TOKEN_B,
  TOKEN_B_Decimals,
  TOKEN_B_Name,
  TOKEN_B_Symbol,
  TOKEN_B_Balance,
  TOKEN_B_Amount,
  TOKEN_B_Allowance = CONSTANTS[blockchain].ZERO,

  TOKEN_B_WRAPPED_Pair,
  TOKEN_A_TOKEN_B_Pair,
  TOKEN_A_WRAPPED_Pair,

  WRAPPED_AmountIn,
  USD_AmountOut,

  timeZone,
  stubTimeZone,
  currency,
  currencyToUSD,

})=>{

  mock(blockchain)

  let TOKEN_A_AmountBN = ethers.utils.parseUnits(TOKEN_A_Amount.toString(), TOKEN_A_Decimals)
  let TOKEN_A_BalanceBN = ethers.utils.parseUnits(TOKEN_A_Balance.toString(), TOKEN_A_Decimals)

  let TOKEN_B_AmountBN = ethers.utils.parseUnits(TOKEN_B_Amount.toString(), TOKEN_B_Decimals)
  let TOKEN_B_BalanceBN = ethers.utils.parseUnits(TOKEN_B_Balance.toString(), TOKEN_B_Decimals)

  let NATIVE = CONSTANTS[blockchain].NATIVE
  let NATIVE_BalanceBN = ethers.utils.parseUnits(NATIVE_Balance.toString(), CONSTANTS[blockchain].DECIMALS)

  let WRAPPED = CONSTANTS[blockchain].WRAPPED
  let WRAPPED_AmountInBN = ethers.utils.parseUnits(WRAPPED_AmountIn.toString(), CONSTANTS[blockchain].DECIMALS)

  let USD_AmountOutBN = ethers.utils.parseUnits(USD_AmountOut.toString(), CONSTANTS[blockchain].DECIMALS)

  exchange = findByName(exchange)

  fetchMock.get({
    url: `https://api.depay.pro/v1/assets?account=${fromAddress}&blockchain=${blockchain}`,
    headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
    overwriteRoutes: true
  }, fromAddressAssets)

  stubTimeZone(timeZone)

  fetchMock.get({
    url: `https://api.depay.pro/v1/fiat?symbol=${currency}`,
    headers: { 'X-Api-Key': 'M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c' },
    overwriteRoutes: true
  }, {
    "usd": currencyToUSD
  })

  mock({ provider, blockchain, balance: { for: fromAddress, return: NATIVE_BalanceBN }})

  mock({ provider, blockchain, call: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'decimals', return: TOKEN_A_Decimals } })
  mock({ provider, blockchain, call: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'symbol', return: TOKEN_A_Symbol } })
  mock({ provider, blockchain, call: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'name', return: TOKEN_A_Name } })

  mock({ provider, blockchain, call: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'decimals', return: TOKEN_B_Decimals } })
  mock({ provider, blockchain, call: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'symbol', return: TOKEN_B_Symbol } })
  mock({ provider, blockchain, call: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'name', return: TOKEN_B_Name } })
  
  mock({ provider, blockchain, call: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: TOKEN_A_BalanceBN } })
  mock({ provider, blockchain, call: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: CONSTANTS[blockchain].MAXINT } })
  
  mock({ provider, blockchain, call: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: TOKEN_B_BalanceBN } })
  mock({ provider, blockchain, call: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: TOKEN_B_Allowance } })

  mock({ provider, blockchain, call: { to: CONSTANTS[blockchain].USD, api: Token[blockchain].DEFAULT, method: 'decimals', return: CONSTANTS[blockchain].DECIMALS } })
  
  mock({ provider, blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [TOKEN_B, TOKEN_A], return: TOKEN_A_TOKEN_B_Pair }})
  mock({ provider, blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [TOKEN_A, TOKEN_B], return: TOKEN_A_TOKEN_B_Pair }})
  mock({ provider, blockchain, call: { to: TOKEN_A_TOKEN_B_Pair, api: exchange.contracts.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, call: { to: TOKEN_A_TOKEN_B_Pair, api: exchange.contracts.pair.api, method: 'token0', return: TOKEN_A }})
  mock({ provider, blockchain, call: { to: TOKEN_A_TOKEN_B_Pair, api: exchange.contracts.pair.api, method: 'token1', return: TOKEN_B }})

  mock({ provider, blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [TOKEN_B, WRAPPED], return: TOKEN_B_WRAPPED_Pair }})
  mock({ provider, blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [WRAPPED, TOKEN_B], return: TOKEN_B_WRAPPED_Pair }})
  mock({ provider, blockchain, call: { to: TOKEN_B_WRAPPED_Pair, api: exchange.contracts.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, call: { to: TOKEN_B_WRAPPED_Pair, api: exchange.contracts.pair.api, method: 'token0', return: TOKEN_B }})
  mock({ provider, blockchain, call: { to: TOKEN_B_WRAPPED_Pair, api: exchange.contracts.pair.api, method: 'token1', return: WRAPPED }})

  mock({ provider, blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [WRAPPED, TOKEN_A], return: TOKEN_A_WRAPPED_Pair }})
  mock({ provider, blockchain, call: { to: exchange.contracts.factory.address, api: exchange.contracts.factory.api, method: 'getPair', params: [TOKEN_A, WRAPPED], return: TOKEN_A_WRAPPED_Pair }})
  mock({ provider, blockchain, call: { to: TOKEN_A_WRAPPED_Pair, api: exchange.contracts.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, call: { to: TOKEN_A_WRAPPED_Pair, api: exchange.contracts.pair.api, method: 'token0', return: TOKEN_A }})
  mock({ provider, blockchain, call: { to: TOKEN_A_WRAPPED_Pair, api: exchange.contracts.pair.api, method: 'token1', return: WRAPPED }})

  mock({ provider, blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [WRAPPED, TOKEN_A]], return: [WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
  mock({ provider, blockchain, call: { to: exchange.contracts.router.address, api: exchange.contracts.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [TOKEN_B, WRAPPED, TOKEN_A]], return: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
  
  mockAmountsOut({
    provider,
    blockchain,
    exchange,
    amountInBN: TOKEN_A_AmountBN,
    path: [TOKEN_A, WRAPPED, CONSTANTS[blockchain].USD],
    amountsOut: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, USD_AmountOutBN]
  })

  return {
    exchange,
    TOKEN_A_AmountBN,
    TOKEN_B_AmountBN,
    WRAPPED_AmountInBN,
  }
}
