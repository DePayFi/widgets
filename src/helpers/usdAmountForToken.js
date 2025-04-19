import Blockchains from '@depay/web3-blockchains'
import Exchanges from '@depay/web3-exchanges'
import { ethers } from 'ethers'

export default async ({
  blockchain,
  token,
  amount,
  decimals,
})=>{

  if(Blockchains[blockchain].stables.usd.includes(token)) { // is stable
      
    const decimals = Blockchains[blockchain].tokens.find((tokenData)=>tokenData.address===token).decimals

    return ethers.utils.formatUnits(
      amount.toString(),
      decimals
    )

  }

  if(blockchain == 'solana') {

    let amountDecimal = ethers.utils.formatUnits(amount, decimals)
    let response = await fetch(`https://api.depay.com/v2/conversions/USD/solana/${token}?amount=${amountDecimal}`)
    if(response.status == 200) {
      return parseFloat(await response.text())
    }

  } else {

    let routes = (await Promise.all(Blockchains[blockchain].stables.usd.map((stable)=>{
      return Exchanges.route({
        blockchain,
        tokenIn: token,
        tokenOut: stable,
        amountIn: amount,
      })
    }))).filter(Boolean).flat()
    
    if(routes.length > 0) {

      let amounts = routes.map((route)=>{
        
        const decimals = Blockchains[blockchain].tokens.find(
          (token)=>token.address===route.tokenOut
        ).decimals

        return parseFloat(ethers.utils.formatUnits(route.amountOut, decimals))
      })

      // remove outliers

      const average = amounts.reduce((a, b)=>a+b)/amounts.length
      const diff = 0.1 // 10%
      const filteredAmounts = amounts.filter((amount)=>{
        return (amount < (average + average*diff) && amount > (average - average*diff))
      })

      if(filteredAmounts.length) {
        return filteredAmounts.reduce((a, b)=>a+b)/filteredAmounts.length
      } else {
        return amounts.reduce((a, b)=>a+b)/amounts.length
      }
    }
  }
}
