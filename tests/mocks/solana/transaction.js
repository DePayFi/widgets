import { mock } from '@depay/web3-mock'
import { struct, u64, publicKey, Buffer, PublicKey } from '@depay/solana-web3.js'
import { Token } from '@depay/web3-tokens'

const getPaymentsAccountPublicKey = async({ fromAddress })=> {
  let seeds = [Buffer.from("payments"), new PublicKey(fromAddress).toBuffer()]

  let [ pdaPublicKey ] = await PublicKey.findProgramAddress(
    seeds, new PublicKey('DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7')
  )

  return pdaPublicKey
}

const mockPaymentsAccount = async({ provider, fromAddress, nonce }) => {

  let requestMock = mock({
    provider,
    blockchain: 'solana',
    request: {
      method: 'getAccountInfo',
      to: (await getPaymentsAccountPublicKey({ fromAddress })).toString(),
      api: struct([
        u64('anchorDiscriminator'),
        u64('nonce'),
      ]),
      return: nonce ? { nonce } : null
    }
  })
}

const getTokenAccountAddress = async({ tokenAddress, ownerAddress })=>{

  return await Token.solana.findProgramAddress({
    token: tokenAddress,
    owner: ownerAddress
  })
}

const mockTokenAccount = async({ provider, tokenAddress, ownerAddress, exists, balance })=>{

  mock({
    blockchain: 'solana',
    provider,
    request: {
      method: 'getAccountInfo',
      to: await getTokenAccountAddress({ tokenAddress, ownerAddress }),
      api: Token.solana.TOKEN_LAYOUT,
      return: exists ? {
        mint: tokenAddress,
        owner: ownerAddress,
        amount: balance ? balance : '0',
        delegateOption: 70962703,
        delegate: 'BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR',
        state: 0,
        isNativeOption: 0,
        isNative: '0',
        delegatedAmount: '0',
        closeAuthorityOption: 0,
        closeAuthority: '11111111111111111111111111111111'
      } : null
    }
  })
}

export {
  mockPaymentsAccount,
  mockTokenAccount
}
