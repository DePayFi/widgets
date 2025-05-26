import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'

export default async ({
  blockchain,
  token,
  amount,
})=>{

  if(Blockchains[blockchain].stables.usd.includes(token)) { // is stable
    return amount
  }

  let response = await fetch(`https://public.depay.com/conversions/${blockchain}/${token}/USD?amount=${amount}`)
  if(response.status == 200) {
    return parseFloat(await response.text())
  }
}
