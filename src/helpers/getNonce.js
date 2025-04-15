/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SVM

import { Buffer, PublicKey, struct, u64 } from '@depay/solana-web3.js'
import { request } from '@depay/web3-client-solana'

//#else */

import { Buffer, PublicKey, struct, u64 } from '@depay/solana-web3.js'
import { request } from '@depay/web3-client'

//#endif

import { supported } from '../blockchains'

const getPaymentsAccountAddress = async({ account })=>{

  /*#if !_EVM

  let seeds = [Buffer.from("payments"), new PublicKey(account).toBuffer()]
  let [ pdaPublicKey ] = await PublicKey.findProgramAddress(
    seeds, new PublicKey('DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7')
  )
  return pdaPublicKey

  //#else */
  //#endif

}

const getPaymentsAccountData = async({ account })=>{

  /*#if !_EVM

  let address = (await getPaymentsAccountAddress({ account })).toString()
  return await request({
    blockchain: 'solana',
    address,
    api: struct([u64('anchorDiscriminator'), u64('nonce')]),
  })

  //#else */
  //#endif

}

const getNonce = async({ blockchain, transaction, account, wallet }) => {

  if(!blockchain) { blockchain = transaction.blockchain }

  if(supported.evm.includes(blockchain)) {

    if(transaction && transaction?.nonce) {
      return transaction?.nonce?.toString()
    } else if (blockchain) {
      return (await wallet.transactionCount({ blockchain, address: account })).toString()
    }

  } else if (supported.svm.includes(blockchain)) {

    if(transaction && transaction?.nonce) {
      return transaction?.nonce?.toString()
    }
    
    const paymentsAccountData = await getPaymentsAccountData({ account })

    if(paymentsAccountData) {
      return paymentsAccountData.nonce.toString()
    } else {
      return '0'
    }
  }
}

export default getNonce
