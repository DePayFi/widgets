/*#if _EVM

import Exchanges from '@depay/web3-exchanges-evm'
import Token from '@depay/web3-tokens-evm'

/*#elif _SOLANA

import Exchanges from '@depay/web3-exchanges-solana'
import Token from '@depay/web3-tokens-solana'

//#else */

import Exchanges from '@depay/web3-exchanges'
import Token from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import InsufficientGraphic from '../graphics/insufficient'
import React, { useContext, useState, useEffect } from 'react'
import round from '../helpers/round'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'

const NATIVE_AMOUNT_REQUIRED_FOR_TRANSACTION = {
  ethereum: ethers.BigNumber.from('3000000000000000'),
  bsc: ethers.BigNumber.from('700000000000000'),
  polygon: ethers.BigNumber.from('15000000000000000'),
  solana: ethers.BigNumber.from('15000'),
  optimism: ethers.BigNumber.from('3000000000000000'),
  base: ethers.BigNumber.from('3000000000000000'),
  arbitrum: ethers.BigNumber.from('3000000000000000'),
  fantom: ethers.BigNumber.from('3000000000000000'),
  avalanche: ethers.BigNumber.from('3000000000000000'),
  gnosis: ethers.BigNumber.from('3000000000000000'),
}

export default (props)=> {

  const [recommendedAssetSymbol, setRecommendedAssetSymbol] = useState()
  const [recommendedAssetAmountAvailable, setRecommendedAssetAmountAvailable] = useState()
  const [recommendedAssetAmountRequired, setRecommendedAssetAmountRequired] = useState()
  const [recommendedAssetTotalAmountDue, setRecommendedAssetTotalAmountDue] = useState()
  const [loading, setLoading] = useState(true)
  const { navigate, set } = useContext(NavigateStackContext)
  const { accept, sell } = useContext(ConfigurationContext)
  const { acceptWithAmount } = useContext(ChangableAmountContext)
  const { close } = useContext(ClosableContext)

  const setRecommendation = async ({ route, accept })=>{
    const nativeAvailableAsset = props.assets.find((asset)=>Blockchains[asset.blockchain].currency.address.toLowerCase() === asset.address.toLowerCase())
    if(route.blockchain === accept.blockchain && route.tokenIn.toLowerCase() === accept.token.toLowerCase()) {
      const token = new Token({ blockchain: route.blockchain, address: route.tokenIn })
      const asset = props.assets.find((asset)=>asset.blockchain === route.blockchain && asset.address.toLowerCase() === route.tokenIn.toLowerCase())
      setRecommendedAssetTotalAmountDue(
        round(
          await token.readable(ethers.BigNumber.from(accept.amount))
        )
      )
      setRecommendedAssetAmountRequired(
        round(
          await token.readable(ethers.BigNumber.from(route.amountIn).sub(ethers.BigNumber.from(asset.balance)))
        )
      )
      setRecommendedAssetSymbol(await token.symbol())
      setRecommendedAssetAmountAvailable(
        round(
          await token.readable(asset.balance),
          'down'
        )
      )
      setLoading(false)
    } else if(!nativeAvailableAsset || ethers.BigNumber.from(nativeAvailableAsset.balance).lt(NATIVE_AMOUNT_REQUIRED_FOR_TRANSACTION[nativeAvailableAsset.blockchain])) {
      // recommend NATIVE
      Exchanges.route({
        blockchain: route.blockchain,
        tokenIn: Blockchains[route.blockchain].currency.address,
        amountOut: await Token.BigNumber({ amount: accept.amount, blockchain: accept.blockchain, address: accept.token }),
        tokenOut: accept.token,
        fromAddress: props.account,
        toAddress: accept.receiver
      }).then(async(routes)=>{
        const route = routes[0]
        setRecommendedAssetAmountRequired(
          round(
            await Token.readable({ blockchain: route.blockchain, address: route.tokenIn, amount: route.amountIn })
          )
        )
        setRecommendedAssetSymbol(Blockchains[route.blockchain].currency.symbol)
        setRecommendedAssetAmountAvailable(0)
        setLoading(false)
      })
    } else if(route) {
      // recommend top up token
      Exchanges.route({
        blockchain: route.blockchain,
        tokenIn: route.tokenIn,
        amountOut: await Token.BigNumber({ amount: accept.amount, blockchain: accept.blockchain, address: accept.token }),
        tokenOut: accept.token,
        fromAddress: props.account,
        toAddress: accept.receiver
      }).then(async(routes)=>{
        const route = routes[0]
        const token = new Token({ blockchain: route.blockchain, address: route.tokenIn })
        const asset = props.assets.find((asset)=>asset.blockchain === route.blockchain && asset.address.toLowerCase() === route.tokenIn.toLowerCase())
        setRecommendedAssetTotalAmountDue(
          round(
            await token.readable(ethers.BigNumber.from(route.amountIn).mul(101).div(100))
          )
        )
        setRecommendedAssetAmountRequired(
          round(
            await token.readable(ethers.BigNumber.from(route.amountIn).sub(ethers.BigNumber.from(asset.balance)).mul(101).div(100))
          )
        )
        setRecommendedAssetSymbol(await token.symbol())
        setRecommendedAssetAmountAvailable(
          round(
            await token.readable(asset.balance),
            'down'
          )
        )
        setLoading(false)
      })
    } else {
      set(['NoPaymentOptionFound'])
    }
  }

  useEffect(()=>{
    const loadRecommendations = async()=>{
      let directTransfer = !sell & (acceptWithAmount||accept)?.find((accept)=>props.assets.find((asset)=>accept.blockchain === asset.blockchain && accept.token.toLowerCase() === asset.address.toLowerCase()))
      if(directTransfer){
        const token = new Token({ blockchain: directTransfer.blockchain, address: directTransfer.token })
        directTransfer = {
          blockchain: directTransfer.blockchain,
          tokenIn: directTransfer.token,
          amountIn: await token.BigNumber(directTransfer.amount),
          amount: await token.BigNumber(directTransfer.amount),
          token: directTransfer.token,
          receiver: directTransfer.receiver,
        }
      }
      if(directTransfer && props.assets.find((asset)=>Blockchains[asset.blockchain].currency.address.toLowerCase() === asset.address.toLowerCase()) && props.assets.find((asset)=>Blockchains[asset.blockchain].currency.address.toLowerCase() === asset.address.toLowerCase()).balance !== '0') {
        setRecommendation({ route: directTransfer, accept: directTransfer })
      } else { // requires routing
        Promise.all(props.assets.map((asset)=>{
          if(!Blockchains[asset.blockchain].tokens.find((token)=>token.address.toLowerCase() === asset.address.toLowerCase())) { return } // consdier only major tokens for this
          return (acceptWithAmount||accept).map(async(accept)=>{
            if(accept.blockchain === asset.blockchain) {
              return Exchanges.route({
                blockchain: asset.blockchain,
                tokenIn: asset.address,
                amountOut: await Token.BigNumber({ amount: accept.amount, blockchain: accept.blockchain, address: accept.token }),
                tokenOut: accept.token,
                fromAddress: props.account,
                toAddress: accept.receiver
              })
            }
          }).filter(Boolean).flat()
        }).flat().filter(Boolean)).then(async(routes)=>{
          const route = (routes.filter(Boolean)||[]).flat().find((route)=>(acceptWithAmount||accept).find((accept)=>accept.blockchain === route.blockchain && accept.token.toLowerCase() === route.tokenOut.toLowerCase())) || routes.flat()[0]
          if(!route){
            set(['NoPaymentOptionFound'])
          } else {
            const recommendedAccept = (acceptWithAmount||accept).find((accept)=>accept.blockchain === route.blockchain && accept.token.toLowerCase() === route.tokenOut.toLowerCase()) || accept.find((accept)=>accept.blockchain === route.blockchain)
            setRecommendation({ route, accept: recommendedAccept })
          }
        })
      }
    }
    loadRecommendations()
  }, [])

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
        </div>
      }
      body={
        <div className="TextCenter PaddingBottomS">
          <div className="GraphicWrapper">
            <img className="Graphic" src={ InsufficientGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Insufficient Amount</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
            { loading && 
              <div className="Skeleton" style={{ borderRadius: "18px", width: "100%", height: "170px" }}>
                <div className="SkeletonBackground"/>
              </div>
            }
            {
              !loading &&
              <div>
                <div>
                  { recommendedAssetAmountAvailable > 0 &&
                    <div>
                      <div>
                        <strong className="FontSizeM">
                          <span style={{ fontWeight: 'bold'}}>{recommendedAssetAmountRequired} {recommendedAssetSymbol}</span>
                          <br/> are additionally required in order to perform this payment of {recommendedAssetTotalAmountDue} {recommendedAssetSymbol}.
                        </strong>
                      </div>
                      <div className="PaddingTopS PaddingBottomM">
                        <strong className="FontSizeM">
                          Please top up or swap another token to {recommendedAssetSymbol} to perform this payment.
                        </strong>
                      </div>
                    </div>
                  }
                  { recommendedAssetAmountAvailable === 0 &&
                    <div>
                      <div>
                        <strong className="FontSizeM">
                          <span style={{ fontWeight: 'bold'}}>{recommendedAssetAmountRequired} {recommendedAssetSymbol}</span>
                          <br/> is required in order to perform this payment.
                        </strong>
                      </div>
                      <div className="PaddingTopS">
                        <strong className="FontSizeM">
                          Please top up your {recommendedAssetSymbol} to perform this payment.
                        </strong>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={ close }>
            Ok
          </button>
        </div>
      }
    />
  )
}
