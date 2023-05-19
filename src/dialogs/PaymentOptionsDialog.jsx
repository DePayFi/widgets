import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import format from '../helpers/format'
import React, { useContext, useEffect, useState } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { Token } from '@depay/web3-tokens'
import { TokenImage } from '@depay/react-token-image'

export default ()=> {

  const { accept } = useContext(ConfigurationContext)
  const { close } = useContext(ClosableContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ paymentOptions, setPaymentOptions ] = useState()

  useEffect(()=>{
    Promise.all(
      accept.map((configuration)=>{
        let token = new Token({ blockchain: configuration.blockchain, address: configuration.token })
        return Promise.all([ Promise.resolve(configuration), token.symbol(), token.name() ])
      })
    ).then((options)=>{
      return options.map((option)=>{
        return {
          ...option[0],
          symbol: option[1],
          name: option[2]
        }
      })
    }).then(setPaymentOptions)
  }, [])

  if(!paymentOptions) {
    return(
      <Dialog
        stacked={ true }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
            <div>
              <h1 className="LineHeightL FontSizeL">Payment options</h1>
            </div>
          </div>
        }
        body={
          <div className="MaxHeight PaddingTopM">
            <div className="PaddingLeftM PaddingRightM">
              <div className="Card Skeleton">
                <div className="SkeletonBackground"/>
              </div>
              <div className="Card Skeleton">
                <div className="SkeletonBackground"/>
              </div>
              <div className="Card Skeleton">
                <div className="SkeletonBackground"/>
              </div>
            </div>
          </div>
        }
      />
    ) 

  } else {

    console.log(paymentOptions)

    return(
      <Dialog
        stacked={ true }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
            <div>
              <h1 className="LineHeightL FontSizeL">Payment options</h1>
            </div>
          </div>
        }
        body={
          <div className="MaxHeight PaddingTopM">
            <div className="PaddingLeftM PaddingRightM">
              {
                paymentOptions && paymentOptions.map((paymentOption, index)=>{
                  return(
                    <div className="Card" key={index}>
                      <div className="CardImage">
                        <TokenImage
                          blockchain={ paymentOption.blockchain }
                          address={ paymentOption.token }
                        />
                        <img className={"BlockchainLogo small " + Blockchains[paymentOption.blockchain].name} src={Blockchains[paymentOption.blockchain].logo} alt={Blockchains[paymentOption.blockchain].label} title={Blockchains[paymentOption.blockchain].label}/>
                      </div>
                      <div className="CardBody">
                        <div className="CardBodyWrapper">
                          <h2 className="CardText">
                            <div className="TokenAmountRow">
                              <span className="TokenAmountCell">
                                { format(paymentOption.amount) }
                              </span>
                              <span>&nbsp;</span>
                              <span className="TokenSymbolCell">
                                { paymentOption.symbol }
                              </span>
                            </div>
                            <div className="TokenAmountRow small grey">
                              <span className="TokenAmountCell">
                                on { Blockchains[paymentOption.blockchain].label }
                              </span>
                            </div>
                          </h2>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        }
        footer={
          <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
            <button type="button" className="ButtonPrimary" onClick={()=>navigate('back')}>
              <span class="FontSizeM">❮</span> Go back
            </button>
          </div>
        }
      />
    )

  }
}
