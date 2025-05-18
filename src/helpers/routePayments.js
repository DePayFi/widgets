/*#if _EVM

import { route } from '@depay/web3-payments-evm'

/*#elif _SVM

import { route } from '@depay/web3-payments-svm'

//#else */

import { route } from '@depay/web3-payments'

//#endif

const prepareAcceptedPayments = (accept, receiver)=>{
  let toAddress = receiver ? receiver : undefined
  return({ 
    ...accept,
    toAddress,
  })
} 

const mergeFromAccounts = (accept, account)=>{
  let from = {}
  accept.forEach((accept)=>{
    from[accept.blockchain] = account
  })
  return from
}

export default ({ accept, account, receiver, allow, deny, whitelist, blacklist, best })=>{
  return route({
    accept: accept.map((accept)=>prepareAcceptedPayments(accept, receiver)),
    from: mergeFromAccounts(accept, account),
    allow: allow || whitelist,
    deny: deny || blacklist,
    best,
  })
}
