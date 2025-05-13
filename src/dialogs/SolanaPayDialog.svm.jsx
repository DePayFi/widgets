import Blockchains from '@depay/web3-blockchains'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import DigitalWalletIcon from '../icons/DigitalWalletIcon'
import format from '../helpers/format'
import getFavicon from '../helpers/getFavicon'
import getPaymentRouterInstruction from '../helpers/getPaymentRouterInstruction.svm'
import isDarkMode from '../helpers/isDarkMode'
import LoadingText from '../components/LoadingText'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useEffect, useContext, useRef } from 'react'
import Token from '@depay/web3-tokens'
import UUIDv4 from '../helpers/UUIDv4'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { PublicKey } from '@depay/solana-web3.js'
import { request, getProvider } from '@depay/web3-client'
import { routers } from '@depay/web3-payments'
import { TokenImage } from '@depay/react-token-image'

export default (props)=> {

  const { accept, track, validated, integration, link, type, id: configurationId } = useContext(ConfigurationContext)
  const [ attemptId, setAttemptId ] = useState()
  const attemptIdRef = useRef(attemptId)
  attemptIdRef.current = attemptId
  const { set, navigate } = useContext(NavigateStackContext)
  const { close, setClosable } = useContext(ClosableContext)
  const [ paymentOptions, setPaymentOptions ] = useState()
  const [ forwardTo, setForwardTo ] = useState()
  const [ pollingPaymentStatusInterval, setPollingPaymentStatusInterval ] = useState()
  const [ transactionTrackingInterval, setTransactionTrackingInterval ] = useState()
  const [ selectedPaymentOption, setSelectedPaymantOption ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ secretId, setSecretId ] = useState()
  const [ solanaPayTransactionSocket, setSolanaPayTransactionSocket ] = useState()
  const [ transactionTrackingSocket, setTransactionTrackingSocket ] = useState()
  const [ paymentValidationSocket, setPaymentValidationSocket ] = useState()
  const [ QRCodeURI, setQRCodeURI ] = useState()
  const [ release, setRelease ] = useState()
  const [ afterBlock, setAfterBlock ] = useState()
  const [ QRCode, setQRCode ] = useState()
  const [ state, setState ] = useState('select')
  const [ synchronousTracking ] = useState(
    !!configurationId ||
    !!(track && (track.endpoint || typeof track.method == 'function') && track.async != true)
  )
  const [ asynchronousTracking ] = useState(
    !configurationId &&
    !!(track && track.async == true)
  )
  const [ polling ] = useState(
    !!configurationId ||
    !!(track && track.poll && (track.poll.endpoint || typeof track.poll.method == 'function') && track.async != true)
  )
  const isTracking = synchronousTracking || asynchronousTracking
  const QRCodeElement = React.useRef()

  const selectPaymentOption = async(selectedPaymentOption)=>{
    selectedPaymentOption.fromAmountBN = (await Token.BigNumber({ amount: selectedPaymentOption.amount, blockchain: 'solana', address: selectedPaymentOption.token }))
    if(selectedPaymentOption.fee) {
      if(selectedPaymentOption.fee.amount.match("%")) {
        selectedPaymentOption.feeAmountBN = selectedPaymentOption.fromAmountBN.mul(parseFloat(selectedPaymentOption.fee.amount.replace("%", ''))*10).div(1000)
      } else if (typeof selectedPaymentOption.fee.amount === 'string') {
        selectedPaymentOption.feeAmountBN = selectedPaymentOption.fee.amount
      } else {
        selectedPaymentOption.feeAmountBN = await Token.BigNumber({ amount: selectedPaymentOption.fee.amount, blockchain: 'solana', address: selectedPaymentOption.token })
      }
    }
    if(selectedPaymentOption.fee) {
      selectedPaymentOption.toAmountBN = selectedPaymentOption.fromAmountBN.sub(selectedPaymentOption.feeAmountBN)
    } else {
      selectedPaymentOption.toAmountBN = selectedPaymentOption.fromAmountBN
    }
    setSelectedPaymantOption(selectedPaymentOption)
    setState('wait')
    openSolanaPayTransactionSocket(secretId)
  }

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

  const sendTrackingAsConfigured = ({ payment, resolve, reject })=>{
    if(configurationId){
        return fetch(`https://public.depay.com/configurations/${configurationId}/attempts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payment)
        }).then((response)=>{
          if(response.status == 200 || response.status == 201) {
            response.json().then((attempt)=>setAttemptId(attempt.id))
            return resolve()
          } else {
            return reject('TRACING REQUEST FAILED')
          }
        })
    } else if(track.endpoint){
      return fetch(track.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          return resolve()
        } else {
          return reject('TRACING REQUEST FAILED')
        }
      })
    } else if (track.method) {
      track.method(payment).then(resolve).catch(reject)
    } else {
      reject('No tracking defined!')
    }
  }

  const sendTrace = ({ secretId, selectedPaymentOption })=>{
    if(!isTracking) { return Promise.resolve() }
    return new Promise(async(resolve, reject)=>{
      let payment = {
        blockchain: 'solana',
        sender: `solana:${secretId}`,
        after_block: afterBlock.toString(),
        from_token: selectedPaymentOption.token,
        from_amount: selectedPaymentOption.fromAmountBN.toString(),
        from_decimals: selectedPaymentOption.decimals,
        to_token: selectedPaymentOption.token,
        to_amount: selectedPaymentOption.toAmountBN.toString(),
        to_decimals: selectedPaymentOption.decimals,
        fee_amount: selectedPaymentOption.feeAmountBN.toString(),
        deadline: Math.ceil(Date.now()/1000) + (10 * 60 * 6000) // 1h
      }
      sendTrackingAsConfigured({ payment, resolve, reject })
    })
  }

  const sendTrack = ({ transaction })=>{
    if(!isTracking) { return }
    let payment = {
      blockchain: 'solana',
      sender: transaction.from,
      transaction: transaction.id,
      nonce: transaction.nonce,
      after_block: afterBlock.toString(),
      from_token: selectedPaymentOption.token,
      from_amount: selectedPaymentOption.fromAmountBN.toString(),
      from_decimals: selectedPaymentOption.decimals,
      to_token: selectedPaymentOption.token,
      to_amount: selectedPaymentOption.toAmountBN.toString(),
      to_decimals: selectedPaymentOption.decimals,
      fee_amount: selectedPaymentOption.feeAmountBN.toString(),
      deadline: transaction.deadline
    }
    sendTrackingAsConfigured({
      payment,
      resolve: ()=>{
        setClosable(!synchronousTracking)
        setRelease(!synchronousTracking)
      },
      reject: ()=>{
        setState('trackingFailed')  
      }
    })
  }

  const openSolanaPayTransactionSocket = (secretId)=>{
    if(solanaPayTransactionSocket) { solanaPayTransactionSocket.close() }
    const socket = new WebSocket('wss://integrate.depay.com/cable')
    setSolanaPayTransactionSocket(socket)

    socket.onopen = async (event)=> {

      await socket.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ secret_id: secretId, version: 3, channel: 'SolanaPayChannel' })
      }))

      if(QRCodeURI === undefined) {
        await socket.send(JSON.stringify({
          command: 'message',
          identifier: JSON.stringify({ secret_id: secretId, channel: 'SolanaPayChannel' }),
          data: JSON.stringify({
            type: 'create',
            secret_id: secretId,
            label: document.title || 'DePay',
            icon: getFavicon() || 'https://depay.com/favicon.png',
            accept,
          })
        }))
      }
    }

    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        setTimeout(()=>openSolanaPayTransactionSocket(secretId), 1000)
      }
    }

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      if(item.message.created === true) {
        traceAndContinue(secretId, `solana:https://public.depay.com/solana/${secretId}`)
      } else if (item.message.scanned) {
        setClosable("Are you sure you want to abort this payment?")
        setState('pay')
      } else if (item.message.account) {
        trackTransaction(item.message)
        setClosable("Are you sure you want to abort this payment?")
        setState('pay')
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ', error)
    }
  }

  const openTransactionTrackingSocket = ({ account, nonce })=>{
    if(transactionTrackingSocket) { transactionTrackingSocket.close() }
    const socket = new WebSocket(
      Blockchains.solana.sockets[Math.floor(Math.random()*Blockchains.solana.sockets.length)]
    )
    setTransactionTrackingSocket(socket)

    socket.onopen = async (event)=> {
      await socket.send(JSON.stringify({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "logsSubscribe",
        "params": [
          {
            "mentions": [ account ]
          },
          {
            "commitment": "processed"
          }
        ]
      }))
    }

    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        setTimeout(()=>openTransactionTrackingSocket({ account, nonce }), 1000)
      }
    }

    socket.onmessage = function(event) {
      if(event && event.data) {
        const data = JSON.parse(event.data)
        if(data && data?.params?.result?.value?.logs && (data?.params?.result?.value?.logs || [])?.find((log)=>{return log.match(`Program ${routers.solana.address}`)})) {
          const result = data?.params?.result?.value
          if(result && result.err === null) {
            setState('succeeded')
            setTransaction({
              status: 'succeeded',
              id: result.signature,
              url: Blockchains.solana.explorerUrlFor({ transaction: { id: result.signature } }),
              from: account,
              nonce,
              deadline: Math.ceil(Date.now()/1000) + (10 * 60 * 1000) // 10 minutes
            })
          } else if(result) {
            setState('failed')
            setTransaction({
              status: 'failed',
              id: result.signature,
              url: Blockchains.solana.explorerUrlFor({ transaction: { id: result.signature } }),
              from: account,
              nonce,
              deadline: Math.ceil(Date.now()/1000) + (10 * 60 * 1000) // 10 minutes
            })
          }
        }
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ', error)
    }
  }

  const openPaymentValidationSocket = (transaction)=>{
    if(paymentValidationSocket) { paymentValidationSocket.close() }
    const socket = new WebSocket('wss://integrate.depay.com/cable')
    setPaymentValidationSocket(socket)
    
    socket.onopen = async function(event) {
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          blockchain: 'solana',
          sender: transaction.from,
          nonce: transaction.nonce,
          channel: 'PaymentChannel'
        }),
      }
      socket.send(JSON.stringify(msg))
    }

    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        setTimeout(()=>openPaymentValidationSocket(transaction), 1000)
      }
    }

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      const success = (item.message.status === 'success')
      if(validated) { setTimeout(()=>validated(success, transaction), 200) }
      if(item.message.release) {
        socket.close()
        if(success) {
          setRelease(true)
          setClosable(true)
          setForwardTo(item.message.forward_to)
          if(!!item.message.forward_to) {
            setTimeout(()=>{ (props.document || window.document).location.href = item.message.forward_to }, 200)
          }
        } else if(success == false) {
          setClosable(true)
          setState('failed')
        }
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ', error)
    }
  }

  const pollStatus = (transaction)=>{
    const payment = {
      blockchain: 'solana',
      transaction: transaction.id,
      sender: transaction.from,
      nonce: transaction.nonce,
      after_block: afterBlock.toString(),
      to_token: selectedPaymentOption.token
    }

    const handlePollingResponse = (data)=>{
      if(data) {
        if(data && data.forward_to) {
          setClosable(true)
          setForwardTo(data.forward_to)
          setTimeout(()=>{ (props.document || window.document).location.href = data.forward_to }, 200)
        } else {
          setClosable(true)
        }
        clearInterval(pollingInterval)
        if(validated) { validated(true, transaction) }
        setRelease(true)
      }
    }

    if(configurationId) {
      if(attemptId) {
        fetch(`https://public.depay.com/attempts/${attemptId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).then((response)=>{
          if(response.status == 200 || response.status == 201) {
            return response.json()
          } else {
            return undefined
          }
        }).then(handlePollingResponse)
      }
    } else if(track?.poll?.endpoint) {
      fetch(track.poll.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          return response.json().catch(()=>{ setClosable(true) })
        } else {
          return undefined
        }
      }).then(handlePollingResponse)
    } else if(track?.poll?.method) {
      track.poll.method(payment).then(handlePollingResponse)
    }
  }

  const startPollingPaymentStatus = (transaction) =>{
    if(polling) {
      setPollingPaymentStatusInterval(
        setInterval(()=>{
          pollStatus(transaction)
        }, 5000)
      )
    }
  }

  const trackTransaction = ({ account, nonce }) => {

    openTransactionTrackingSocket({ account, nonce })
    setTransactionTrackingInterval(
      setInterval(async()=>{
        const provider = await getProvider('solana')
        const signatures = await provider.getSignaturesForAddress(new PublicKey(account))
        if(signatures && signatures.length && signatures[0].slot > afterBlock) {
          const relevantTransactions = signatures.filter((signature)=>signature.slot > afterBlock)
          const foundPaymentTransactions = await Promise.all(relevantTransactions.map(async(relevantTransaction)=>{
            const fullTransactionData = await provider.getTransaction(relevantTransaction.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 })
            const foundRouterInstruction = getPaymentRouterInstruction(fullTransactionData)
            if(foundRouterInstruction && foundRouterInstruction.nonce.toString() === nonce.toString()) {
              if(fullTransactionData.meta.err === null) {
                setState('succeeded')
                setTransaction({
                  status: 'succeeded',
                  id: fullTransactionData.transaction.signatures[0],
                  url: Blockchains.solana.explorerUrlFor({ transaction: { id: fullTransactionData.transaction.signatures[0] } }),
                  from: account,
                  nonce,
                  deadline: Math.ceil(Date.now()/1000) + (10 * 60 * 1000) // 10 minutes
                })
              } else {
                setState('failed')
                setTransaction({
                  status: 'failed',
                  id: fullTransactionData.transaction.signatures[0],
                  url: Blockchains.solana.explorerUrlFor({ transaction: { id: fullTransactionData.transaction.signatures[0] } }),
                  from: account,
                  nonce,
                  deadline: Math.ceil(Date.now()/1000) + (10 * 60 * 1000) // 10 minutes
                })
              }
            }
          }))
        }
      }, 1000)
    )
  }

  const traceAndContinue = async(secretId, QRCodeURI)=>{
    sendTrace({ secretId, accept })
      .then(async()=>{
        setQRCodeURI(QRCodeURI)
        const newQRCode = getNewQRCode()
        newQRCode.update({ data: QRCodeURI })
        setQRCode(newQRCode)
      })
      .catch((error)=>{
        console.log('Tracing error:', error)
        setState('tracingFailed')
      })
    return { afterBlock }
  }

  useEffect(()=>{
    let secretId = UUIDv4()
    setSecretId(secretId)
    openSolanaPayTransactionSocket(secretId)
    request({ blockchain: 'solana', method: 'latestBlockNumber' }).then(setAfterBlock)
  }, [])

  useEffect(()=>{
    return ()=>{
      if(solanaPayTransactionSocket) { solanaPayTransactionSocket.close() }
    }
  }, [solanaPayTransactionSocket])

  useEffect(()=>{
    return ()=>{
      if(transactionTrackingSocket) { transactionTrackingSocket.close() }
    }
  }, [transactionTrackingSocket])

  useEffect(()=>{
    return ()=>{
      if(paymentValidationSocket) { paymentValidationSocket.close() }
    }
  }, [paymentValidationSocket])

  useEffect(()=>{
    return ()=>{
      if(transactionTrackingInterval) { clearInterval(transactionTrackingInterval) }
    }
  }, [transactionTrackingInterval])

  useEffect(()=>{
    return ()=>{
      if(pollingPaymentStatusInterval) { clearInterval(pollingPaymentStatusInterval) }
    }
  }, [pollingPaymentStatusInterval])

  useEffect(()=>{
    if(afterBlock && QRCode) {
      setState('scan')
    }
  }, [afterBlock && QRCode])

  useEffect(()=>{
    if(state === 'scan' && QRCode && QRCodeElement && QRCodeElement.current) {
      QRCodeElement.current.innerHTML = ""
      QRCode.append(QRCodeElement.current)
    }
  }, [state, QRCode])

  useEffect(()=>{
    if(transaction && ['succeeded', 'failed'].includes(state) && paymentValidationSocket === undefined) {
      setClosable(!isTracking)
      setRelease(!isTracking)
      if(transactionTrackingSocket) { transactionTrackingSocket.close() }
      if(transactionTrackingInterval) { clearInterval(transactionTrackingInterval) }
      if(synchronousTracking) { 
        openPaymentValidationSocket(transaction)
        startPollingPaymentStatus(transaction)
      }
      sendTrack({ transaction })
    }
  }, [transaction, state, paymentValidationSocket])

  if(state === 'trackingFailed') {
    return(
      <Dialog
        stacked={ false }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
          </div>
        }
        body={
          <div className="TextCenter">
            <div className="GraphicWrapper">
              <ErrorGraphic/>
            </div>
            <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Tracking payment failed</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <strong className="FontSizeM">
                Please ensure you are connected to the internet, then click "Try again".
              </strong>
              <div className="PaddingTopS">
                <span>If this keeps happening, please report it.</span>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
            <button className='ButtonPrimary' onClick={()=>{
              setState(transaction.status)
              sendTrack({ transaction })
            }}>
              Try again
            </button>
          </div>
        }
      />
    )
  }

  if(state === 'tracingFailed') {
    return(
      <Dialog
        stacked={ false }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
          </div>
        }
        body={
          <div className="TextCenter">
            <div className="GraphicWrapper">
              <img className="Graphic" src={ ErrorGraphic }/>
            </div>
            <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Tracking payment failed</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <strong className="FontSizeM">
                Please ensure you are connected to the internet, then click "Try again".
              </strong>
              <div className="PaddingTopS">
                <span>If this keeps happening, please report it.</span>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
            <button className='ButtonPrimary' onClick={()=>{
              setState('wait')
              traceAndContinue(secretId, `solana:https://public.depay.com/solanapay/${secretId}`)
            }}>
              Try again
            </button>
          </div>
        }
      />
    )
  }

  if(state === 'failed') {
    return(
      <Dialog
        stacked={ false }
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
          </div>
        }
        body={
          <div className="TextCenter">
            <div className="GraphicWrapper">
              <img className="Graphic" src={ ErrorGraphic }/>
            </div>
            <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Payment Failed</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <strong className="FontSizeM">
                Unfortunately executing your payment failed, but you can try again.
              </strong>
              { transaction &&
                <div className="PaddingTopS">
                  <a className="Link" title="Check your transaction on a block explorer" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
                    View details
                  </a>
                </div>
              }
            </div>
          </div>
        }
        footer={
          <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
            <button className='ButtonPrimary' onClick={()=>close()}>
              Try again
            </button>
          </div>
        }
      />
    )
  }

  if(!paymentOptions) {
    return(
      <Dialog
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <h1 className="LineHeightL FontSizeL TextLeft">
              <svg className="SolanaPayLogo" width="86" height="32" viewBox="0 0 86 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M77.1128 22.0065L72.1479 11.1583H68.027L75.1197 25.7956L74.9921 26.2364C74.8144 26.8223 74.4395 27.3282 73.9311 27.6679C73.4228 28.0076 72.8125 28.1599 72.2046 28.0989C71.493 28.0923 70.7948 27.9039 70.1761 27.5515L69.5165 30.6865C70.4684 31.0797 71.4871 31.2849 72.5167 31.2908C75.3538 31.2908 77.0702 30.2458 78.4888 27.1676L86 11.1583H82.021L77.1128 22.0065Z"/>
                <path d="M42.0235 5.99011H30.1219V25.9306H34.0229V18.6013H42.0235C46.3713 18.6013 49.2297 16.4047 49.2297 12.2957C49.2297 8.18677 46.3713 5.99011 42.0235 5.99011ZM41.8107 15.1109H34.0087V9.42372H41.8107C44.0662 9.42372 45.357 10.4545 45.357 12.2673C45.357 14.0801 44.0662 15.1109 41.8107 15.1109Z"/>
                <path d="M65.539 22.1487V16.1416C65.539 12.5872 62.9928 10.746 58.6236 10.746C55.0773 10.746 51.9706 12.4024 51.0982 14.9473L54.3042 16.0848C54.7794 14.8123 56.432 13.8739 58.4889 13.8739C60.9288 13.8739 61.9572 14.8691 61.9572 16.0848V16.4758L56.1554 17.1156C52.8147 17.471 50.6159 18.971 50.6159 21.6511C50.6159 24.587 53.1339 26.1652 56.4745 26.1652C58.6278 26.2325 60.7248 25.4691 62.3331 24.0325C62.9147 25.4543 63.5105 26.4069 67.4754 25.9022V22.9307C65.8866 23.3145 65.539 22.9307 65.539 22.1487ZM61.9927 20.2435C61.9927 22.1771 59.2903 23.2008 57.0278 23.2008C55.3042 23.2008 54.2687 22.6463 54.2687 21.5444C54.2687 20.4425 55.1198 20.0444 56.7653 19.8525L62.0069 19.2411L61.9927 20.2435Z"/>
                <path d="M22.7439 21.253C22.7714 21.3361 22.7714 21.4259 22.7439 21.5089C22.7279 21.5918 22.6885 21.6683 22.6304 21.7293L18.8783 25.6748C18.7956 25.7599 18.6968 25.8276 18.5875 25.8738C18.478 25.9219 18.3595 25.9462 18.24 25.9449H0.444308C0.361894 25.9456 0.280888 25.9235 0.210248 25.8809C0.139655 25.8328 0.0833028 25.7665 0.0471156 25.689C0.0221236 25.6104 0.0221236 25.5259 0.0471156 25.4473C0.0618237 25.3655 0.0986193 25.2892 0.153506 25.2269L3.91265 21.2815C3.99533 21.1963 4.09422 21.1286 4.20346 21.0824C4.31277 21.0337 4.43137 21.0094 4.551 21.0113H22.3183C22.404 21.0097 22.4882 21.0345 22.5594 21.0824C22.6393 21.1154 22.7047 21.1759 22.7439 21.253ZM18.8854 13.7602C18.8009 13.6773 18.7025 13.6099 18.5946 13.5612C18.484 13.5164 18.3663 13.4924 18.2471 13.4901H0.444308C0.360864 13.4913 0.27943 13.5159 0.209231 13.5612C0.139032 13.6064 0.0828724 13.6704 0.0471156 13.746C0.0225831 13.8247 0.0225831 13.909 0.0471156 13.9877C0.0590607 14.0704 0.0962206 14.1474 0.153506 14.2081L3.91265 18.1606C3.99717 18.2436 4.09561 18.311 4.20346 18.3597C4.31383 18.405 4.43173 18.4291 4.551 18.4308H22.3183C22.404 18.4324 22.4882 18.4076 22.5594 18.3597C22.6311 18.3178 22.6861 18.2526 22.7155 18.1749C22.7518 18.0992 22.7639 18.0141 22.7499 17.9314C22.7359 17.8486 22.6966 17.7722 22.6375 17.7128L18.8854 13.7602ZM0.210248 10.8455C0.280888 10.8881 0.361894 10.9102 0.444308 10.9095H18.2471C18.3666 10.9108 18.4851 10.8865 18.5946 10.8384C18.7038 10.7922 18.8027 10.7246 18.8854 10.6394L22.6375 6.69394C22.6956 6.63288 22.7349 6.55639 22.7509 6.47356C22.7755 6.39487 22.7755 6.31055 22.7509 6.23186C22.7216 6.15414 22.6665 6.08889 22.5949 6.04702C22.5237 5.99912 22.4395 5.9743 22.3538 5.97593H4.52263C4.403 5.97402 4.2844 5.99828 4.17509 6.04702C4.06585 6.09322 3.96696 6.1609 3.88428 6.24607L0.132229 10.2057C0.0727337 10.2658 0.0331119 10.3427 0.0187441 10.4261C-0.00624802 10.5047 -0.00624802 10.5892 0.0187441 10.6678C0.0647789 10.7438 0.131116 10.8054 0.210248 10.8455V10.8455Z"/>
              </svg>
            </h1>
          </div>
        </div>
        }
        body={
          <div className="MaxHeight">
            <div className="PaddingLeftM PaddingRightM">
              {
                accept.filter((configuration)=>configuration.blockchain === 'solana').map((configuration, index)=>{
                  return(
                    <div className="Card Skeleton" key={ index }>
                      <div className="SkeletonBackground"/>
                    </div>
                  )
                })
              }
            </div>
          </div>
        }
      />
    ) 

  } else {

    return(
      <Dialog
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
            <div>
              <h1 className="LineHeightL FontSizeL TextLeft">
                <svg className="SolanaPayLogo" width="86" height="32" viewBox="0 0 86 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M77.1128 22.0065L72.1479 11.1583H68.027L75.1197 25.7956L74.9921 26.2364C74.8144 26.8223 74.4395 27.3282 73.9311 27.6679C73.4228 28.0076 72.8125 28.1599 72.2046 28.0989C71.493 28.0923 70.7948 27.9039 70.1761 27.5515L69.5165 30.6865C70.4684 31.0797 71.4871 31.2849 72.5167 31.2908C75.3538 31.2908 77.0702 30.2458 78.4888 27.1676L86 11.1583H82.021L77.1128 22.0065Z"/>
                  <path d="M42.0235 5.99011H30.1219V25.9306H34.0229V18.6013H42.0235C46.3713 18.6013 49.2297 16.4047 49.2297 12.2957C49.2297 8.18677 46.3713 5.99011 42.0235 5.99011ZM41.8107 15.1109H34.0087V9.42372H41.8107C44.0662 9.42372 45.357 10.4545 45.357 12.2673C45.357 14.0801 44.0662 15.1109 41.8107 15.1109Z"/>
                  <path d="M65.539 22.1487V16.1416C65.539 12.5872 62.9928 10.746 58.6236 10.746C55.0773 10.746 51.9706 12.4024 51.0982 14.9473L54.3042 16.0848C54.7794 14.8123 56.432 13.8739 58.4889 13.8739C60.9288 13.8739 61.9572 14.8691 61.9572 16.0848V16.4758L56.1554 17.1156C52.8147 17.471 50.6159 18.971 50.6159 21.6511C50.6159 24.587 53.1339 26.1652 56.4745 26.1652C58.6278 26.2325 60.7248 25.4691 62.3331 24.0325C62.9147 25.4543 63.5105 26.4069 67.4754 25.9022V22.9307C65.8866 23.3145 65.539 22.9307 65.539 22.1487ZM61.9927 20.2435C61.9927 22.1771 59.2903 23.2008 57.0278 23.2008C55.3042 23.2008 54.2687 22.6463 54.2687 21.5444C54.2687 20.4425 55.1198 20.0444 56.7653 19.8525L62.0069 19.2411L61.9927 20.2435Z"/>
                  <path d="M22.7439 21.253C22.7714 21.3361 22.7714 21.4259 22.7439 21.5089C22.7279 21.5918 22.6885 21.6683 22.6304 21.7293L18.8783 25.6748C18.7956 25.7599 18.6968 25.8276 18.5875 25.8738C18.478 25.9219 18.3595 25.9462 18.24 25.9449H0.444308C0.361894 25.9456 0.280888 25.9235 0.210248 25.8809C0.139655 25.8328 0.0833028 25.7665 0.0471156 25.689C0.0221236 25.6104 0.0221236 25.5259 0.0471156 25.4473C0.0618237 25.3655 0.0986193 25.2892 0.153506 25.2269L3.91265 21.2815C3.99533 21.1963 4.09422 21.1286 4.20346 21.0824C4.31277 21.0337 4.43137 21.0094 4.551 21.0113H22.3183C22.404 21.0097 22.4882 21.0345 22.5594 21.0824C22.6393 21.1154 22.7047 21.1759 22.7439 21.253ZM18.8854 13.7602C18.8009 13.6773 18.7025 13.6099 18.5946 13.5612C18.484 13.5164 18.3663 13.4924 18.2471 13.4901H0.444308C0.360864 13.4913 0.27943 13.5159 0.209231 13.5612C0.139032 13.6064 0.0828724 13.6704 0.0471156 13.746C0.0225831 13.8247 0.0225831 13.909 0.0471156 13.9877C0.0590607 14.0704 0.0962206 14.1474 0.153506 14.2081L3.91265 18.1606C3.99717 18.2436 4.09561 18.311 4.20346 18.3597C4.31383 18.405 4.43173 18.4291 4.551 18.4308H22.3183C22.404 18.4324 22.4882 18.4076 22.5594 18.3597C22.6311 18.3178 22.6861 18.2526 22.7155 18.1749C22.7518 18.0992 22.7639 18.0141 22.7499 17.9314C22.7359 17.8486 22.6966 17.7722 22.6375 17.7128L18.8854 13.7602ZM0.210248 10.8455C0.280888 10.8881 0.361894 10.9102 0.444308 10.9095H18.2471C18.3666 10.9108 18.4851 10.8865 18.5946 10.8384C18.7038 10.7922 18.8027 10.7246 18.8854 10.6394L22.6375 6.69394C22.6956 6.63288 22.7349 6.55639 22.7509 6.47356C22.7755 6.39487 22.7755 6.31055 22.7509 6.23186C22.7216 6.15414 22.6665 6.08889 22.5949 6.04702C22.5237 5.99912 22.4395 5.9743 22.3538 5.97593H4.52263C4.403 5.97402 4.2844 5.99828 4.17509 6.04702C4.06585 6.09322 3.96696 6.1609 3.88428 6.24607L0.132229 10.2057C0.0727337 10.2658 0.0331119 10.3427 0.0187441 10.4261C-0.00624802 10.5047 -0.00624802 10.5892 0.0187441 10.6678C0.0647789 10.7438 0.131116 10.8054 0.210248 10.8455V10.8455Z"/>
                </svg>
              </h1>
            </div>
          </div>
        }
        body={
          <div className={`${['select'].includes(state) ? 'MaxHeight' : ''}`}>
            <div className="PaddingLeftM PaddingRightM">
              
              {
                state === 'select' && paymentOptions && 
                <div className="PaddingTopXS">
                  {
                    paymentOptions.map((paymentOption, index)=>{
                      return(
                        <div className="Card" key={index} onClick={()=>selectPaymentOption(paymentOption)}>
                          <div className="CardImage">
                            <TokenImage
                              blockchain={ paymentOption.blockchain }
                              address={ paymentOption.token }
                            />
                            <img className={"BlockchainLogo small bottomRight " + Blockchains[paymentOption.blockchain].name} style={{ backgroundColor: Blockchains[paymentOption.blockchain].logoBackgroundColor }} src={Blockchains[paymentOption.blockchain].logo} alt={Blockchains[paymentOption.blockchain].label} title={Blockchains[paymentOption.blockchain].label}/>
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
                              </h2>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              }

              {
                state === 'wait' &&
                <div className="TextCenter PaddingTopS">
                  <div className="Skeleton" style={{ display: "inline-block", borderRadius: "18px", width: "305px", height: "305px" }}>
                    <div className="SkeletonBackground"/>
                  </div>
                </div>
              }

              {
                state === 'scan' &&
                <div ref={ QRCodeElement } className="QRCode"/>
              }

              { ['pay', 'succeeded', 'failed'].includes(state) &&
                <div className="Card disabled">
                  <div className="CardImage">
                    <TokenImage
                      blockchain={ selectedPaymentOption.blockchain }
                      address={ selectedPaymentOption.token }
                    />
                    <img className={"BlockchainLogo small bottomRight " + Blockchains[selectedPaymentOption.blockchain].name} style={{ backgroundColor: Blockchains[selectedPaymentOption.blockchain].logoBackgroundColor }} src={Blockchains[selectedPaymentOption.blockchain].logo} alt={Blockchains[selectedPaymentOption.blockchain].label} title={Blockchains[selectedPaymentOption.blockchain].label}/>
                  </div>
                  <div className="CardBody">
                    <div className="CardBodyWrapper">
                      <h2 className="CardText">
                        <div className="TokenAmountRow">
                          <span className="TokenAmountCell">
                            { format(selectedPaymentOption.amount) }
                          </span>
                          <span>&nbsp;</span>
                          <span className="TokenSymbolCell">
                            { selectedPaymentOption.symbol }
                          </span>
                        </div>
                      </h2>
                    </div>
                  </div>
                </div>
              }

            </div>
          </div>
        }
        footer={
          <div className="PaddingRightM PaddingLeftM PaddingBottomM">
            {
              state === 'select' &&
              <div className="Opacity05 PaddingBottomXS PaddingTopS">
                <small>Select a payment option to continue</small>
              </div>
            }
            {
              state === 'wait' &&
              <div className="Opacity05 PaddingBottomXS PaddingTopS">
                <small>Loading QR code...</small>
              </div>
            }
            {
              state === 'scan' &&
              <div className="Opacity05 PaddingBottomXS PaddingTopS">
                <small>Scan QR code with your wallet</small>
              </div>
            }
            {
              state === 'pay' &&
              <div className="PaddingTopXS">
                <div className="PaddingBottomS">
                  <div className="Card transparent disabled small">
                    <div className="CardImage">
                      <div className="TextCenter Opacity05">
                        <DigitalWalletIcon className="small"/>
                      </div>
                    </div>
                    <div className="CardBody">
                      <div className="CardBodyWrapper">
                        <div className="Opacity05">
                          Confirm payment in your wallet
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <a className={`ButtonPrimary ${transaction?.url ? '' : 'disabled'}`} href={ transaction?.url } target="_blank" rel="noopener noreferrer">
                  <LoadingText>Paying</LoadingText>
                </a>
              </div>
            }
            {
              state === 'succeeded' &&
              <div>
                <div className="PaddingTopXS">
                  <div className="PaddingBottomS">
                    <div>
                      <a className="Card transparent small" title="Transaction has been confirmed by the network" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
                        <div className="CardImage">
                          <div className="TextCenter Opacity05">
                            <CheckmarkIcon className="small"/>
                          </div>
                        </div>
                        <div className="CardBody">
                          <div className="CardBodyWrapper">
                            <div className="Opacity05">
                              Transaction confirmed
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    { synchronousTracking && !release &&
                      <div className="Card transparent small disabled">
                        <div className="CardImage">
                          <div className="TextCenter">
                            <div className="Loading Icon"></div>
                          </div>
                        </div>
                        <div className="CardBody">
                          <div className="CardBodyWrapper">
                            <div className="Opacity05">
                              Validating payment
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    { synchronousTracking && release &&
                      <div className="Card transparent small disabled">
                        <div className="CardImage">
                          <div className="TextCenter Opacity05">
                            <CheckmarkIcon className="small"/>
                          </div>
                        </div>
                        <div className="CardBody">
                          <div className="CardBodyWrapper">
                            <div className="Opacity05">
                              Payment validated
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  { !release &&
                    <button className="ButtonPrimary disabled">
                      Continue
                    </button>
                  }
                  {
                    release && forwardTo &&
                    <a className="ButtonPrimary" href={ forwardTo } rel="noopener noreferrer">
                      Continue
                    </a>
                  }
                  {
                    release && !forwardTo &&
                    <button className="ButtonPrimary" onClick={ close }>
                      Close
                    </button>
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
