/*#if _EVM

/*#elif _SVM

import { PublicKey } from '@depay/solana-web3.js'
import { request, getProvider } from '@depay/web3-client-svm'
import { routers } from '@depay/web3-payments-svm'
import { TokenImage } from '@depay/react-token-image-svm'

//#else */

import { PublicKey } from '@depay/solana-web3.js'
import { request, getProvider } from '@depay/web3-client'
import { routers } from '@depay/web3-payments'
import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import CallbackContext from '../contexts/CallbackContext'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ChevronRightIcon from '../icons/ChevronRightIcon'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import DigitalWalletIcon from '../icons/DigitalWalletIcon'
import DropDown from '../components/DropDown'
import format from '../helpers/format'
import getFavicon from '../helpers/getFavicon'
import getPaymentRouterInstruction from '../helpers/getPaymentRouterInstruction.svm'
import isDarkMode from '../helpers/isDarkMode'
import link from '../helpers/link'
import LoadingText from '../components/LoadingText'
import MenuIcon from '../icons/MenuIcon'
import openManagedSocket from '../helpers/openManagedSocket'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useEffect, useContext, useRef } from 'react'
import SolanaPayLogo from '../icons/SolanaPayLogo'
import Token from '@depay/web3-tokens'
import TracingFailedDialog from '../dialogs/TracingFailedDialog'
import UUIDv4 from '../helpers/UUIDv4'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { accept, allow, deny } = useContext(ConfigurationContext)
  const { callSentCallback, callSucceededCallback, callFailedCallback } = useContext(CallbackContext)
  const { navigate } = useContext(NavigateStackContext)
  const { close, setClosable } = useContext(ClosableContext)
  const { solanaPayWallet, setAccount } = useContext(WalletContext)
  const { synchronousTracking, track, trace, release, validationState, forwardTo } = useContext(PaymentTrackingContext)
  const { setSelectedRoute } = useContext(PaymentRoutingContext)
  const { paymentValue, displayedPaymentValue } = useContext(PaymentValueContext)
  const { setTransaction } = useContext(PaymentTrackingContext)

  const [ selectedPaymentOption, setSelectedPaymentOption ] = useState()
  const [ QRCodeURI, setQRCodeURI ] = useState()
  const [ QRCode, setQRCode ] = useState()
  const [ state, setState ] = useState('initializing')
  const [ showDropDown, setShowDropDown ] = useState(false)

  const QRCodeElement = useRef()
  const solanaPayTransactionPollingInterval = useRef()
  const solanaPayTransactionSocket = useRef()
  const transactionTrackingSocket = useRef()
  const afterBlock = useRef()
  const currentDeadline = useRef()
  const secretId = useRef()
  const transactionPollingInterval = useRef()
  const solanPayPayment = useRef()
  const transaction = useRef()
  
  const getNewQRCode = ()=>{
    return new QRCodeStyling({
      width: 340,
      height: 340,
      type: "svg",
      dotsOptions: {
        type: "extra-rounded",
        color: isDarkMode() ? "#FFFFFF" : "#000000",
      },
      cornersSquareOptions: { type: 'rounded' },
      backgroundOptions: {
        color: "transparent",
      },
    })
  }

  const startSolanaPayTransactionPolling = ()=>{
    if(solanaPayTransactionPollingInterval.current) { clearInterval(solanaPayTransactionPollingInterval.current) }
    solanaPayTransactionPollingInterval.current = setInterval(()=>{
      fetch(`https://public.depay.com/solanapay/${secretId.current}/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).then((response)=>{
          if(response.status == 200) {
            return response.json()
          } else {
            return undefined
          }
        }).then((data)=>{
          if(data && data.sender) {
            clearInterval(solanaPayTransactionPollingInterval.current)
            transactionLoaded(data)
          }
        })
    }, 2000)
  }

  const openSolanaPayTransactionSocket = ()=>{
    if(solanaPayTransactionSocket.current) { solanaPayTransactionSocket.current.close(1000) }
    const identifier = JSON.stringify({ secret_id: secretId.current, channel: 'SolanaPayChannel' })
    solanaPayTransactionSocket.current = openManagedSocket({
      identifier,
      onopen: ()=>{
        return({ command: 'subscribe', identifier })
      },
      onmessage: (eventData, socket)=>{
        if(eventData?.type == 'confirm_subscription') {
          socket.send(JSON.stringify({
            command: 'message', identifier,
            data: JSON.stringify({
              event: 'create',
              secret_id: secretId.current,
              label: document.title || 'DePay',
              icon: getFavicon() || 'https://depay.com/favicon.png',
              accept,
              allow,
              deny,  
            })
          }))
        } else if(eventData?.message?.event === 'created') {
          startSolanaPayTransactionPolling()
          setQRCodeURI(`solana:https://public.depay.com/solanapay/${secretId.current}`)
        } else if (eventData?.message?.event === 'scanned') {
          if(!solanPayPayment.current) {
            setClosable("Are you sure you want to abort this payment?")
            setState('pay')
          }
        } else if (eventData?.message?.event === 'loaded') {
          if(!solanPayPayment.current) {
            transactionLoaded(eventData.message)
            setClosable("Are you sure you want to abort this payment?")
            setState('pay')
          }
        }
      },
      keepAlive: {
        interval: 3000, 
        callback: ()=> {
          return {
            type: "ping",
            message: Math.floor(Date.now() / 1000)
          }
        }
      }
    })
  }

  const openTransactionTrackingSocket = ({ sender, receiver, deadline })=>{
    if(transactionTrackingSocket.current) { transactionTrackingSocket.current.close(1000) }
    let id = 1
    transactionTrackingSocket.current = openManagedSocket({
      identifier: JSON.stringify({ type: 'SolanaTransactionLogSubscription', sender, receiver, deadline }),
      endpoints: Blockchains.solana.sockets.reverse(),
      onopen: ()=>{
        return(
          {
            "jsonrpc": "2.0",
            "id": id,
            "method": "logsSubscribe",
            "params": [
              { "mentions": [ sender ] }
            ]
          }
        )
      },
      onmessage: async(eventData, socket)=>{
        if(eventData) {
          if(eventData && eventData?.params?.result?.value?.logs && (eventData?.params?.result?.value?.logs || [])?.find((log)=>{return log.match(`Program ${routers.solana.address}`)})) {
            const provider = await getProvider('solana')
            const transactionId = eventData.params.result.value.signature
            const fullTransactionData = await provider.getTransaction(transactionId, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 })
            const foundRouterInstruction = getPaymentRouterInstruction(fullTransactionData)
            if(foundRouterInstruction && foundRouterInstruction.deadline.toString() === deadline.toString()) {
              const result = eventData?.params?.result?.value
              setTransaction({ blockchain: 'solana', id: transactionId, url: Blockchains.solana.explorerUrlFor({ transaction: { id: transactionId } }) })
              if(fullTransactionData?.meta?.err !== null) {
                transactionFound(result.signature)
                socket.close(1000)
                setClosable(true)
                callFailedCallback(transaction.current, solanPayPayment.current)
                navigate('PaymentFailed')
              } else if(result) {
                transactionFound(result.signature)
                setState('succeeded')
                callSucceededCallback(transaction.current, solanPayPayment.current)
                socket.close(1000)
              }
            }
          }
        }
      },
      keepAlive: {
        interval: 3000, 
        callback: ()=> {
          return {
            jsonrpc: "2.0",
            id: id++,
            method: "getVersion",
            params: []
          }
        }
      }
    })
  }

  const startTransactionPolling = ({ sender, receiver, deadline })=>{
    if(transactionPollingInterval.current) { clearInterval(transactionPollingInterval.current) }
    transactionPollingInterval.current = setInterval(async()=>{
      const provider = await getProvider('solana')
      const signatures = await provider.getSignaturesForAddress(new PublicKey(sender))
      if(signatures && signatures.length && signatures[0].slot > afterBlock.current) {
        const relevantTransactions = signatures.filter((signature)=>signature.slot > afterBlock.current)
        relevantTransactions.forEach(async(relevantTransaction)=>{
          const transactionId = relevantTransaction.signature
          const fullTransactionData = await provider.getTransaction(transactionId, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 })
          const foundRouterInstruction = getPaymentRouterInstruction(fullTransactionData)
          if(foundRouterInstruction && foundRouterInstruction.deadline.toString() === deadline.toString()) {
            transactionFound(fullTransactionData.transaction.signatures[0])
            setTransaction({ blockchain: 'solana', id: transactionId, url: Blockchains.solana.explorerUrlFor({ transaction: { id: transactionId } }) })
            if(transactionPollingInterval.current) { clearInterval(transactionPollingInterval.current) }
            if(fullTransactionData?.meta?.err !== null) {
              callFailedCallback(transaction.current, solanPayPayment.current)
              navigate('PaymentFailed')
            } else {
              setState('succeeded')
              callSucceededCallback(transaction.current, solanPayPayment.current)
            }
          }
        })
      }
    }, 1000)
  }

  const transactionFound = (transactionId)=> {
    transaction.current = {
      from: solanPayPayment.current.fromAddress,
      blockchain: 'solana',
      status: 'succeeded',
      id: transactionId,
      url: Blockchains.solana.explorerUrlFor({ transaction: { id: transactionId } }),
    }
    callSentCallback(transaction.current, solanPayPayment.current)
    setClosable(release || !synchronousTracking)
    track(
      transaction.current,
      afterBlock.current,
      solanPayPayment.current,
      solanPayPayment.current.deadline
    )
  }

  const attemptTracing = ()=>{
    return trace(
      afterBlock.current,
      solanPayPayment.current,
      currentDeadline.current
    ).catch(()=>{
      setState('tracingFailed')
    })
  }

  const transactionLoaded = async({
    sender,
    from_token,
    from_amount,
    from_decimals,
    to_token,
    to_amount,
    to_decimals,
    fee_amount,
    fee_receiver,
    fee2_amount,
    fee2_receiver,
    protocol_fee_amount,
    receiver,
    deadline,
  }) => {

    setAccount(sender)

    if(solanPayPayment.current) { return }
    solanPayPayment.current = {
      blockchain: 'solana',
      fromAddress: sender,
      fromToken: { address: from_token },
      fromAmount: from_amount,
      fromDecimals: from_decimals,
      toToken: { address: to_token },
      toAmount: to_amount,
      toDecimals: to_decimals,
      toAddress: receiver,
      fee: { receiver: fee_receiver },
      feeAmount: fee_amount,
      fee2: { receiver: fee2_receiver },
      feeAmount2: fee2_amount,
      protocolFeeAmount: protocol_fee_amount,
      deadline
    }

    currentDeadline.current = deadline

    setSelectedRoute(solanPayPayment.current)

    attemptTracing()

    openTransactionTrackingSocket({ sender, receiver, deadline })
    startTransactionPolling({ sender, receiver, deadline })

    let token = new Token({ blockchain: 'solana', address: from_token })
    setSelectedPaymentOption({
      token: from_token,
      amount: await token.readable(from_amount) ,
      symbol: await token.symbol(),
    })
  }

  const reset = ()=>{
    if(solanaPayTransactionPollingInterval.current) { clearInterval(solanaPayTransactionPollingInterval.current) }
    if(transactionPollingInterval.current) { clearInterval(transactionPollingInterval.current) }
    if(solanaPayTransactionSocket.current) { solanaPayTransactionSocket.current.close(1000) }
    if(transactionTrackingSocket.current) { transactionTrackingSocket.current.close(1000) }
    if(afterBlock.current) { afterBlock.current = undefined }
    if(currentDeadline.current) { currentDeadline.current = undefined }
    if(secretId.current) { secretId.current = undefined }
    if(solanPayPayment.current) { solanPayPayment.current = undefined }
    setSelectedPaymentOption()
  }

  const initializeSolanaPay = ()=>{
    reset()
    request({ blockchain: 'solana', method: 'latestBlockNumber' }).then((latestBlock)=>{
      if(latestBlock) {
        afterBlock.current = latestBlock
        secretId.current = UUIDv4()
        openSolanaPayTransactionSocket()
      }
    })
  }

  const alternativeHeaderActionElement = (
    <span className="DropDownWrapper">
      <button type="button" onClick={ ()=>setShowDropDown(!showDropDown) } className="ButtonCircular">
        <MenuIcon/>
      </button>
      { showDropDown && <DropDown hide={()=>setShowDropDown(false)}
        items={[
          { label: "Contact support", action: ()=>{ window.open(`mailto:support@depay.com?subject=Need help with Solana Pay payment`, '_blank') } },
        ].filter(Boolean)}
      /> }
    </span>
  )

  useEffect(()=>{
    initializeSolanaPay()
    return reset
  }, [])

  useEffect(()=>{
    const newQRCode = getNewQRCode()
    newQRCode.update({ data: QRCodeURI })
    setQRCode(newQRCode)
  }, [QRCodeURI])

  useEffect(()=>{
    if(afterBlock.current && QRCode) {
      setTimeout(()=>setState('scan'), 400)
    }
  }, [afterBlock && QRCode])

  useEffect(()=>{
    if(state === 'scan' && QRCode && QRCodeElement && QRCodeElement.current) {
      QRCodeElement.current.innerHTML = ""
      QRCode.append(QRCodeElement.current)
    }
  }, [state, QRCode])

  useEffect(()=>{
    if(release && synchronousTracking) {
      setClosable(true)
    }
  }, [release, synchronousTracking])

  if(state === 'tracingFailed') {
    return(
      <TracingFailedDialog
        tryAgain={ ()=>{
          setState('pay')
          attemptTracing()
        } }
      />
    )
  }

  if(state === 'initializing') {
    return(
      <Dialog
        alternativeHeaderAction={ alternativeHeaderActionElement }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <h1 className="LineHeightL FontSizeL TextLeft">
              <SolanaPayLogo/>
            </h1>
          </div>
        </div>
        }
        body={
          <div className="MaxHeight">
            <div className="PaddingLeftL PaddingRightL PaddingTopS TextCenter">
              <div className="Card Skeleton" style={{ width: '100%', height: '300px' }}>
                <div className="SkeletonBackground"/>
              </div>
            </div>
          </div>
        }
      />
    ) 

  } else {

    return(
      <Dialog
        alternativeHeaderAction={ alternativeHeaderActionElement }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
            <div>
              <h1 className="LineHeightL FontSizeL TextLeft">
                <SolanaPayLogo/>
              </h1>
            </div>
          </div>
        }
        body={
          <div>
            <div className="PaddingLeftM PaddingRightM">
              
              {
                state === 'scan' &&
                <div ref={ QRCodeElement } className="QRCode"/>
              }

              { ['pay', 'succeeded'].includes(state) &&
                <div className="PaddingTopXS">

                  { !selectedPaymentOption &&
                    <div className="Card Skeleton">
                      <div className="SkeletonBackground"/>
                    </div>
                  }

                  { selectedPaymentOption &&
                    <div className="Card disabled">
                      <div className="CardImage">
                        <TokenImage
                          blockchain={ 'solana' }
                          address={ selectedPaymentOption?.token }
                        />
                        <img className={"BlockchainLogo small bottomRight " + Blockchains['solana'].name} style={{ backgroundColor: Blockchains['solana'].logoBackgroundColor }} src={Blockchains['solana'].logo} alt={Blockchains['solana'].label} title={Blockchains['solana'].label}/>
                      </div>
                      <div className="CardBody">
                        <div className="CardBodyWrapper">
                          <div className="CardText">
                            <div className="TokenAmountRow">
                              { selectedPaymentOption?.amount &&
                                <span className="TokenAmountCell">
                                  { format(selectedPaymentOption?.amount) }
                                </span>
                              }
                              <span>&nbsp;</span>
                              { selectedPaymentOption?.symbol &&
                                <span className="TokenSymbolCell">
                                  { selectedPaymentOption?.symbol }
                                </span>
                              }
                            </div>
                          </div>

                          {
                            paymentValue &&
                            displayedPaymentValue != `${selectedPaymentOption?.symbol} ${format(selectedPaymentOption?.amount)}` &&
                            <div className="TokenAmountRow small Opacity05">
                              <span className="TokenAmountCell">
                                { displayedPaymentValue }
                              </span>
                            </div>
                          }
                          {
                            !paymentValue &&
                            <div className="TokenAmountRow small">
                              <span className="TokenAmountCell">
                                <div className="Skeleton" style={{ position: 'relative', marginTop: '2px', borderRadius: '10px', width: '82px', height: '15px' }}>
                                  <div className="SkeletonBackground"/>
                                </div>
                              </span>
                            </div>
                          }

                        </div>
                      </div>
                    </div>
                  }
                </div>
              }

            </div>
          </div>
        }
        footer={
          <div className="PaddingRightM PaddingLeftM PaddingBottomM">
            
            {
              state === 'scan' &&
              <div className="Opacity05 PaddingBottomXS PaddingTopS">
                <small>Scan QR code with your wallet</small>
              </div>
            }

            {
              state === 'pay' &&  validationState !== true &&
              <div className="PaddingTopXS">
                
                <div className="PaddingBottomS PaddingTopXS">
                  <div className="PaddingTopXS">
                    <div className="ActionIndicator MarginBottomXS">
                      <img src={solanaPayWallet?.logo} />
                      <div className="ActionIndicatorSpinner"></div>
                    </div>
                    <div className="TextCenter PaddingTopXS">
                      <span className="FontSizeL">
                        Confirm in your wallet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }

            {
              (state === 'succeeded' || validationState === true) &&
              <div>
                <div className="PaddingTopXS">

                  <div className="PaddingBottomS StepsWrapper">

                    <a
                      href={ transaction?.current?.url } target="_blank" rel="noopener noreferrer" 
                      className={`Step Card small transparent done ${!synchronousTracking ? "active" : ""}`}
                    >
                      <div className="StepIcon">
                        <CheckmarkIcon className="small" />
                      </div>
                      <div className="StepText">
                        <div className="StepText">Perform payment</div>
                      </div>
                    </a>
                    <div className="StepConnector" />

                    { synchronousTracking && !release &&
                      <div className='Step Card small transparent active disabled'>
                        <div className="StepIcon">
                          <div className="ActionIndicatorSpinner"/>
                        </div>
                        <div className="StepText">
                          <div className="StepText">
                            <LoadingText>Confirming payment</LoadingText>
                          </div>
                        </div>
                      </div>
                    }
                    { synchronousTracking && release &&
                      <a 
                        href={
                          transaction
                            ? link({
                                url: `https://scan.depay.com/tx/solana/${transaction.current.id}?sender=${solanPayPayment.current.fromAddress}&receiver=${solanPayPayment.current.toAddress}&deadline=${solanPayPayment.current.deadline}`,
                                target: '_blank',
                                wallet: solanaPayWallet,
                              })
                            : undefined
                        }
                        target="_blank"
                        className='Step Card small transparent active'
                      >
                        <div className="StepIcon">
                          <CheckmarkIcon className="small" />
                        </div>
                        <div className="StepText">
                          <div className="StepText">
                            Payment confirmed
                          </div>
                        </div>
                      </a>
                    }

                  </div>

                  {
                    (release || !synchronousTracking) && forwardTo &&
                    <div className="PaddingBottomXS">
                      <a className="ButtonPrimary" href={ forwardTo } rel="noopener noreferrer">
                        Continue
                      </a>
                    </div>
                  }
                  {
                    (release || !synchronousTracking) && !forwardTo &&
                    <div className="PaddingBottomXS">
                      <button className="ButtonPrimary" onClick={ close }>
                        Close
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      />
    )
  }
}
