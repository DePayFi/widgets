/*#if _EVM

import { route } from '@depay/web3-payments-evm'

/*#elif _SOLANA

import { route } from '@depay/web3-payments-solana'

//#else */

import { route } from '@depay/web3-payments'

//#endif

const prepareAcceptedPayments = (accept)=>{
  let toAddress = typeof accept.receiver == 'object' ? accept.receiver.address : accept.receiver
  let toContract = typeof accept.receiver == 'object' ? accept.receiver : undefined
  return({ 
    ...accept,
    toAddress,
    toContract,
  })
} 

const mergeFromAccounts = (accept, account)=>{
  let from = {}
  accept.forEach((accept)=>{
    from[accept.blockchain] = account
  })
  return from
}

export default ({ accept, account, whitelist, blacklist, fee })=>{
  return route({
    accept: accept.map(prepareAcceptedPayments),
    from: mergeFromAccounts(accept, account),
    whitelist,
    blacklist,
    event: 'ifRoutedAndNative',
    fee,
  })
}
