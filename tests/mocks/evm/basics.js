import Blockchains from '@depay/web3-blockchains'
import fetchMock from 'fetch-mock'
import mockAmountsOut from './amountsOut'
import mockAmountsIn from './amountsIn'
import { ethers } from 'ethers'
import Exchanges from '@depay/web3-exchanges'
import { mock } from '@depay/web3-mock'
import { routers } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

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
  TOKEN_B_Allowance = Blockchains[blockchain].zero,

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

  let NATIVE = Blockchains[blockchain].currency.address
  let NATIVE_BalanceBN = ethers.utils.parseUnits(NATIVE_Balance.toString(), Blockchains[blockchain].currency.decimals)

  let WRAPPED = Blockchains[blockchain].wrapped.address
  let WRAPPED_AmountInBN = ethers.utils.parseUnits(WRAPPED_AmountIn.toString(), Blockchains[blockchain].currency.decimals)

  exchange = Exchanges[exchange][blockchain]

  fetchMock.get({
    url: `https://public.depay.com/accounts/${blockchain}/${fromAddress}/assets`,
    overwriteRoutes: true
  }, fromAddressAssets)

  if(stubTimeZone) { stubTimeZone(timeZone) }

  if(currencyToUSD) {
    fetchMock.get({
      url: `https://public.depay.com/currencies/${currency}`,
      overwriteRoutes: true
    }, currencyToUSD.toString())
  }

  fetchMock.post({
    url: `https://public.depay.com/transactions`,
    overwriteRoutes: true
  }, { status: 201 })

  fetchMock.get({
    url: `https://public.depay.com/transactions/${blockchain}/${fromAddress}/0`,
    overwriteRoutes: true
  }, { status: 404 })

  Blockchains[blockchain].tokens.forEach((token)=>{
    if(token.type == '20') {
      mock({ request: { return: '0', to: token.address, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress }, provider, blockchain })
    }
  })

  mock({ provider, blockchain, balance: { for: fromAddress, return: NATIVE_BalanceBN }})

  mock({ provider, blockchain, request: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'decimals', return: TOKEN_A_Decimals } })
  mock({ provider, blockchain, request: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'symbol', return: TOKEN_A_Symbol } })
  mock({ provider, blockchain, request: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'name', return: TOKEN_A_Name } })

  mock({ provider, blockchain, request: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'decimals', return: TOKEN_B_Decimals } })
  mock({ provider, blockchain, request: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'symbol', return: TOKEN_B_Symbol } })
  mock({ provider, blockchain, request: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'name', return: TOKEN_B_Name } })
  
  mock({ provider, blockchain, request: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: TOKEN_A_BalanceBN } })
  mock({ provider, blockchain, request: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: Blockchains[blockchain].maxInt } })
  mock({ provider, blockchain, request: { to: TOKEN_A, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].zero } })
  
  mock({ provider, blockchain, request: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'balanceOf', params: fromAddress, return: TOKEN_B_BalanceBN } })
  mock({ provider, blockchain, request: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, routers[blockchain].address], return: TOKEN_B_Allowance } })
  mock({ provider, blockchain, request: { to: TOKEN_B, api: Token[blockchain].DEFAULT, method: 'allowance', params: [fromAddress, Blockchains[blockchain].permit2], return: Blockchains[blockchain].zero } })

  Blockchains[blockchain].stables.usd.forEach((stable)=>{
    const decimals = Blockchains[blockchain].tokens.find((token)=>token.address===stable).decimals
    mock({ provider, blockchain, request: { to: stable, api: Token[blockchain].DEFAULT, method: 'decimals', return: decimals } })
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [stable, TOKEN_A], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_A, stable], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_B, stable], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [stable, TOKEN_B], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [stable, Blockchains[blockchain].wrapped.address], return: Blockchains[blockchain].zero }})
    mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [Blockchains[blockchain].wrapped.address, stable], return: Blockchains[blockchain].zero }})
    let USD_AmountOutBN = ethers.utils.parseUnits(USD_AmountOut.toString(), decimals)
    mockAmountsOut({ provider, blockchain, exchange, amountInBN: TOKEN_A_AmountBN, path: [TOKEN_A, WRAPPED, stable], amountsOut: [TOKEN_A_AmountBN, WRAPPED_AmountInBN, USD_AmountOutBN] })
    mockAmountsIn({ provider, blockchain, exchange, amountOutBN: TOKEN_A_AmountBN, path: [stable, WRAPPED, TOKEN_A], amountsOut: [USD_AmountOutBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] })
    mockAmountsIn({ provider, blockchain, exchange, amountOutBN: TOKEN_A_AmountBN, path: [stable, WRAPPED, TOKEN_A], amountsOut: [USD_AmountOutBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] })
    mockAmountsIn({ provider, blockchain, block: 0, exchange, amountOutBN: TOKEN_A_AmountBN, path: [stable, WRAPPED, TOKEN_A], amountsOut: [USD_AmountOutBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] })
    mockAmountsIn({ provider, blockchain, block: 1, exchange, amountOutBN: TOKEN_A_AmountBN, path: [stable, WRAPPED, TOKEN_A], amountsOut: [USD_AmountOutBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] })
  })

  // mocks for changable amounts
  let USD = Blockchains[blockchain].stables.usd[0]
  let USD_DECIMALS = Blockchains[blockchain].tokens.find((token)=>token.address===USD).decimals
  let USD_PAIR = '0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5'
  mockAmountsOut({ provider, blockchain, exchange, amountInBN: TOKEN_A_AmountBN, path: [TOKEN_A, USD], amountsOut: [TOKEN_A_AmountBN, ethers.utils.parseUnits(USD_AmountOut.toString(), USD_DECIMALS)] })
  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_A, USD], return: USD_PAIR }})
  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [USD, TOKEN_A], return: USD_PAIR }})
  mock({ provider, blockchain, request: { to: USD_PAIR, api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, request: { to: USD_PAIR, api: exchange.pair.api, method: 'token0', return: USD }})
  mock({ provider, blockchain, request: { to: USD_PAIR, api: exchange.pair.api, method: 'token1', return: TOKEN_A }})

  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_B, TOKEN_A], return: TOKEN_A_TOKEN_B_Pair }})
  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_A, TOKEN_B], return: TOKEN_A_TOKEN_B_Pair }})
  mock({ provider, blockchain, request: { to: TOKEN_A_TOKEN_B_Pair, api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, request: { to: TOKEN_A_TOKEN_B_Pair, api: exchange.pair.api, method: 'token0', return: TOKEN_A }})
  mock({ provider, blockchain, request: { to: TOKEN_A_TOKEN_B_Pair, api: exchange.pair.api, method: 'token1', return: TOKEN_B }})

  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_B, WRAPPED], return: TOKEN_B_WRAPPED_Pair }})
  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [WRAPPED, TOKEN_B], return: TOKEN_B_WRAPPED_Pair }})
  mock({ provider, blockchain, request: { to: TOKEN_B_WRAPPED_Pair, api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, request: { to: TOKEN_B_WRAPPED_Pair, api: exchange.pair.api, method: 'token0', return: TOKEN_B }})
  mock({ provider, blockchain, request: { to: TOKEN_B_WRAPPED_Pair, api: exchange.pair.api, method: 'token1', return: WRAPPED }})

  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [WRAPPED, TOKEN_A], return: TOKEN_A_WRAPPED_Pair }})
  mock({ provider, blockchain, request: { to: exchange.factory.address, api: exchange.factory.api, method: 'getPair', params: [TOKEN_A, WRAPPED], return: TOKEN_A_WRAPPED_Pair }})
  mock({ provider, blockchain, request: { to: TOKEN_A_WRAPPED_Pair, api: exchange.pair.api, method: 'getReserves', return: [ethers.utils.parseUnits('1000', 18), ethers.utils.parseUnits('1000', 18), '1629804922'] }})
  mock({ provider, blockchain, request: { to: TOKEN_A_WRAPPED_Pair, api: exchange.pair.api, method: 'token0', return: TOKEN_A }})
  mock({ provider, blockchain, request: { to: TOKEN_A_WRAPPED_Pair, api: exchange.pair.api, method: 'token1', return: WRAPPED }})

  mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [WRAPPED, TOKEN_A]], return: [WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
  mock({ provider, blockchain, request: { to: exchange.router.address, api: exchange.router.api, method: 'getAmountsIn', params: [TOKEN_A_AmountBN, [TOKEN_B, WRAPPED, TOKEN_A]], return: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] }})
  mockAmountsOut({ provider, blockchain, exchange, amountInBN: TOKEN_B_AmountBN, path: [TOKEN_B, WRAPPED, TOKEN_A], amountsOut: [TOKEN_B_AmountBN, WRAPPED_AmountInBN, TOKEN_A_AmountBN] })
  
  return {
    exchange,
    TOKEN_A_AmountBN,
    TOKEN_B_AmountBN,
    WRAPPED_AmountInBN,
  }
}
