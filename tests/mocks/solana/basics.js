import Blockchains from '@depay/web3-blockchains'
import fetchMock from 'fetch-mock'
import { ethers } from 'ethers'
import Exchanges from '@depay/web3-exchanges'
import { mock } from '@depay/web3-mock'
import { PublicKey, struct, u8, u16, u32, u64, nu64, seq, offset, publicKey } from '@depay/solana-web3.js'
import { routers } from '@depay/web3-payments'
import Token from '@depay/web3-tokens'

export default async({

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

  exchange = Exchanges[blockchain][exchange]

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

  await Promise.all(Blockchains[blockchain].tokens.map(async(token)=>{
    if(token.type == 'SPL') {
      
      mock({
        blockchain,
        provider,
        request: {
          to: (await Token.solana.getMetaDataPDA({ metaDataPublicKey: new PublicKey(Token.solana.METADATA_ACCOUNT), mintPublicKey: new PublicKey(token.address) })).toString(),
          api: Token[blockchain].METADATA_LAYOUT,
          return: {
            key: { metadataV1: {} },
            isMutable: true,
            editionNonce: 252,
            primarySaleHappened: false,
            updateAuthority: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            mint: token.address,
            data: {
              creators: null,
              name: token.name,
              sellerFeeBasisPoints: 0,
              symbol: token.symbol,
              uri: ""
            }
          }
        }
      })

      mock({
        provider,
        blockchain,
        request: {
          method: 'getTokenAccountBalance',
          to: (await Token.solana.findProgramAddress({ token: token.address, owner: new PublicKey(fromAddress) })).toString(),
          return: {
            amount: "0",
            decimals: token.decimals,
            uiAmount: 0,
            uiAmountString: "0"
          }
        }
      })
    }
  }))

  mock({
    blockchain,
    provider,
    request: {
      to: (await Token.solana.getMetaDataPDA({ metaDataPublicKey: new PublicKey(Token.solana.METADATA_ACCOUNT), mintPublicKey: new PublicKey(TOKEN_A) })).toString(),
      api: Token[blockchain].METADATA_LAYOUT,
      return: {
        key: { metadataV1: {} },
        isMutable: true,
        editionNonce: 252,
        primarySaleHappened: false,
        updateAuthority: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
        mint: TOKEN_A,
        data: {
          creators: null,
          name: TOKEN_A_Name,
          sellerFeeBasisPoints: 0,
          symbol: TOKEN_A_Symbol,
          uri: ""
        }
      }
    }
  })

  mock({
    provider,
    blockchain,
    request: {
      method: 'getTokenAccountBalance',
      to: (await Token.solana.findProgramAddress({ token: TOKEN_A, owner: new PublicKey(fromAddress) })).toString(),
      return: {
        amount: TOKEN_A_BalanceBN.toString(),
        decimals: TOKEN_A_Decimals,
        uiAmount: TOKEN_A_Balance,
        uiAmountString: TOKEN_A_Balance.toString()
      }
    }
  })

  mock({ provider, blockchain, balance: { for: fromAddress, return: parseInt(NATIVE_BalanceBN.toString(), 10) }})

  mock({
    provider,
    blockchain,
    request: {
      to: TOKEN_A,
      api: Token[blockchain].MINT_LAYOUT,
      return: {
        mintAuthorityOption: 1,
        mintAuthority: "2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9",
        supply: "5034999492452932",
        decimals: TOKEN_A_Decimals,
        isInitialized: true,
        freezeAuthorityOption: 1,
        freezeAuthority: "3sNBr7kMccME5D55xNgsmYpZnzPgP2g12CixAajXypn6"
      }
    }
  })

  // Address Lookup Table
  mock({
    provider,
    blockchain,
    request: {
      method: 'getAccountInfo',
      to: 'EYGgx5fYCZtLN2pvnR4Bhn5KpMffKwyHCms4VhjSvF2K',
      return: {
        raw: [
          'AQAAAP//////////lLGICwAAAAAAAZUI+NweiVYgbeIRBEMNzoLMusq6HgZtEwERcVYj1p/XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpjJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkGm4hX/quBhPtof2NGGMA12sQ53BrrO1WYoPAAAAAAAQ4DaF+OkJBT5FgSHGb1p2rtx3BqoRyC+KqVKo8reHmpDpoKvwBmYYKpkmwX9Ra2xxeUYGLrb2ybLB8DYx6TbqtYvtHSRjfDO652liD+rV4xFH1onTGdwBEBKgOpjZ0hheYdmw0g/Sz5t99kRCL9onQzwZnnJHNJKmDY+gEjqA7C'
          , 'base64'
        ]
      }
    }
  })

  console.log("RETURN BASICS", {
    exchange,
    TOKEN_A_AmountBN,
    TOKEN_B_AmountBN,
    WRAPPED_AmountInBN,
  })

  return {
    exchange,
    TOKEN_A_AmountBN,
    TOKEN_B_AmountBN,
    WRAPPED_AmountInBN,
  }
}
