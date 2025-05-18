import { mock } from '@depay/web3-mock'
import { struct, u8, u32, u64, nu64, seq, offset, publicKey, Buffer, PublicKey } from '@depay/solana-web3.js'
import Token from '@depay/web3-tokens'

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

const mockEscrowAccount = async({ provider, tokenAddress, ownerAddress })=>{

  mock({
    blockchain: 'solana',
    provider,
    request: {
      method: 'getAccountInfo',
      to: ownerAddress,
      api: Token.solana.TOKEN_LAYOUT,
      return: {
        mint: tokenAddress,
        owner: ownerAddress,
        amount: '0',
        delegateOption: 70962703,
        delegate: 'BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR',
        state: 0,
        isNativeOption: 0,
        isNative: '0',
        delegatedAmount: '0',
        closeAuthorityOption: 0,
        closeAuthority: '11111111111111111111111111111111'
      }
    }
  })
}

const mockALT = async({ provider, address })=>{

  mock({
    blockchain: 'solana',
    provider,
    request: {
      method: 'getAccountInfo',
      to: address,
      responseSize: 56,
      api: struct([
        u32('typeIndex'),
        u64('deactivationSlot'),
        nu64('lastExtendedSlot'),
        u8('lastExtendedStartIndex'),
        u8(),
        seq(
          publicKey(),
          offset(u8(), -1),
          'authority'
        ),
        seq(
          publicKey(),
          offset(u8(), -1),
          'addresses'
        ),
      ]),
      return: {
        typeIndex: 1,
        deactivationSlot: '18446744073709551615',
        lastExtendedSlot: '329254481',
        lastExtendedStartIndex: 11,
        authority: ['3KoHqsUo4QA9iUhPeYHZAXfL2ooYHhpgRaCHR3QSVhEX'],
        addresses: []
      }
    }
  })
}

export {
  mockTokenAccount,
  mockEscrowAccount,
  mockALT,
}
