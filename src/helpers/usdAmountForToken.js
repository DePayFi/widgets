import Blockchains from '@depay/web3-blockchains'
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

  let amountDecimal = ethers.utils.formatUnits(amount, decimals)
  let response = await fetch(`https://public.depay.com/conversions/USD/${blockchain}/${token}?amount=${amountDecimal}`)
  if(response.status == 200) {
    return parseFloat(await response.text())
  }

}
