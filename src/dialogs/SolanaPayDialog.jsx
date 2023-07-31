/*#if _EVM

/*#elif _SOLANA

import { PublicKey } from '@depay/solana-web3.js'
import { request, getProvider } from '@depay/web3-client-solana'
import { Token } from '@depay/web3-tokens-solana'
import { TokenImage } from '@depay/react-token-image-solana'

//#else */

import { PublicKey } from '@depay/solana-web3.js'
import { request, getProvider } from '@depay/web3-client'
import { Token } from '@depay/web3-tokens'
import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import Checkmark from '../components/Checkmark'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import DigitalWalletIcon from '../components/DigitalWalletIcon'
import ErrorGraphic from '../graphics/error'
import format from '../helpers/format'
import getFavicon from '../helpers/getFavicon'
import getPaymentRouterInstruction from '../helpers/getPaymentRouterInstruction.solana'
import LoadingText from '../components/LoadingText'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useEffect, useContext } from 'react'
import UUIDv4 from '../helpers/UUIDv4'
import { NavigateStackContext } from '@depay/react-dialog-stack'

const LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODYiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA4NiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTc3LjExMjggMjIuMDA2NUw3Mi4xNDc5IDExLjE1ODNINjguMDI3TDc1LjExOTcgMjUuNzk1Nkw3NC45OTIxIDI2LjIzNjRDNzQuODE0NCAyNi44MjIzIDc0LjQzOTUgMjcuMzI4MiA3My45MzExIDI3LjY2NzlDNzMuNDIyOCAyOC4wMDc2IDcyLjgxMjUgMjguMTU5OSA3Mi4yMDQ2IDI4LjA5ODlDNzEuNDkzIDI4LjA5MjMgNzAuNzk0OCAyNy45MDM5IDcwLjE3NjEgMjcuNTUxNUw2OS41MTY1IDMwLjY4NjVDNzAuNDY4NCAzMS4wNzk3IDcxLjQ4NzEgMzEuMjg0OSA3Mi41MTY3IDMxLjI5MDhDNzUuMzUzOCAzMS4yOTA4IDc3LjA3MDIgMzAuMjQ1OCA3OC40ODg4IDI3LjE2NzZMODYgMTEuMTU4M0g4Mi4wMjFMNzcuMTEyOCAyMi4wMDY1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTQyLjAyMzUgNS45OTAxMUgzMC4xMjE5VjI1LjkzMDZIMzQuMDIyOVYxOC42MDEzSDQyLjAyMzVDNDYuMzcxMyAxOC42MDEzIDQ5LjIyOTcgMTYuNDA0NyA0OS4yMjk3IDEyLjI5NTdDNDkuMjI5NyA4LjE4Njc3IDQ2LjM3MTMgNS45OTAxMSA0Mi4wMjM1IDUuOTkwMTFaTTQxLjgxMDcgMTUuMTEwOUgzNC4wMDg3VjkuNDIzNzJINDEuODEwN0M0NC4wNjYyIDkuNDIzNzIgNDUuMzU3IDEwLjQ1NDUgNDUuMzU3IDEyLjI2NzNDNDUuMzU3IDE0LjA4MDEgNDQuMDY2MiAxNS4xMTA5IDQxLjgxMDcgMTUuMTEwOVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik02NS41MzkgMjIuMTQ4N1YxNi4xNDE2QzY1LjUzOSAxMi41ODcyIDYyLjk5MjggMTAuNzQ2IDU4LjYyMzYgMTAuNzQ2QzU1LjA3NzMgMTAuNzQ2IDUxLjk3MDYgMTIuNDAyNCA1MS4wOTgyIDE0Ljk0NzNMNTQuMzA0MiAxNi4wODQ4QzU0Ljc3OTQgMTQuODEyMyA1Ni40MzIgMTMuODczOSA1OC40ODg5IDEzLjg3MzlDNjAuOTI4OCAxMy44NzM5IDYxLjk1NzIgMTQuODY5MSA2MS45NTcyIDE2LjA4NDhWMTYuNDc1OEw1Ni4xNTU0IDE3LjExNTZDNTIuODE0NyAxNy40NzEgNTAuNjE1OSAxOC45NzEgNTAuNjE1OSAyMS42NTExQzUwLjYxNTkgMjQuNTg3IDUzLjEzMzkgMjYuMTY1MiA1Ni40NzQ1IDI2LjE2NTJDNTguNjI3OCAyNi4yMzI1IDYwLjcyNDggMjUuNDY5MSA2Mi4zMzMxIDI0LjAzMjVDNjIuOTE0NyAyNS40NTQzIDYzLjUxMDUgMjYuNDA2OSA2Ny40NzU0IDI1LjkwMjJWMjIuOTMwN0M2NS44ODY2IDIzLjMxNDUgNjUuNTM5IDIyLjkzMDcgNjUuNTM5IDIyLjE0ODdaTTYxLjk5MjcgMjAuMjQzNUM2MS45OTI3IDIyLjE3NzEgNTkuMjkwMyAyMy4yMDA4IDU3LjAyNzggMjMuMjAwOEM1NS4zMDQyIDIzLjIwMDggNTQuMjY4NyAyMi42NDYzIDU0LjI2ODcgMjEuNTQ0NEM1NC4yNjg3IDIwLjQ0MjUgNTUuMTE5OCAyMC4wNDQ0IDU2Ljc2NTMgMTkuODUyNUw2Mi4wMDY5IDE5LjI0MTFMNjEuOTkyNyAyMC4yNDM1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTIyLjc0MzkgMjEuMjUzQzIyLjc3MTQgMjEuMzM2MSAyMi43NzE0IDIxLjQyNTkgMjIuNzQzOSAyMS41MDg5QzIyLjcyNzkgMjEuNTkxOCAyMi42ODg1IDIxLjY2ODMgMjIuNjMwNCAyMS43MjkzTDE4Ljg3ODMgMjUuNjc0OEMxOC43OTU2IDI1Ljc1OTkgMTguNjk2OCAyNS44Mjc2IDE4LjU4NzUgMjUuODczOEMxOC40NzggMjUuOTIxOSAxOC4zNTk1IDI1Ljk0NjIgMTguMjQgMjUuOTQ0OUgwLjQ0NDMwOEMwLjM2MTg5NCAyNS45NDU2IDAuMjgwODg4IDI1LjkyMzUgMC4yMTAyNDggMjUuODgwOUMwLjEzOTY1NSAyNS44MzI4IDAuMDgzMzAyOCAyNS43NjY1IDAuMDQ3MTE1NiAyNS42ODlDMC4wMjIxMjM2IDI1LjYxMDQgMC4wMjIxMjM2IDI1LjUyNTkgMC4wNDcxMTU2IDI1LjQ0NzNDMC4wNjE4MjM3IDI1LjM2NTUgMC4wOTg2MTkzIDI1LjI4OTIgMC4xNTM1MDYgMjUuMjI2OUwzLjkxMjY1IDIxLjI4MTVDMy45OTUzMyAyMS4xOTYzIDQuMDk0MjIgMjEuMTI4NiA0LjIwMzQ2IDIxLjA4MjRDNC4zMTI3NyAyMS4wMzM3IDQuNDMxMzcgMjEuMDA5NCA0LjU1MSAyMS4wMTEzSDIyLjMxODNDMjIuNDA0IDIxLjAwOTcgMjIuNDg4MiAyMS4wMzQ1IDIyLjU1OTQgMjEuMDgyNEMyMi42MzkzIDIxLjExNTQgMjIuNzA0NyAyMS4xNzU5IDIyLjc0MzkgMjEuMjUzWk0xOC44ODU0IDEzLjc2MDJDMTguODAwOSAxMy42NzczIDE4LjcwMjUgMTMuNjA5OSAxOC41OTQ2IDEzLjU2MTJDMTguNDg0IDEzLjUxNjQgMTguMzY2MyAxMy40OTI0IDE4LjI0NzEgMTMuNDkwMUgwLjQ0NDMwOEMwLjM2MDg2NCAxMy40OTEzIDAuMjc5NDMgMTMuNTE1OSAwLjIwOTIzMSAxMy41NjEyQzAuMTM5MDMyIDEzLjYwNjQgMC4wODI4NzI0IDEzLjY3MDQgMC4wNDcxMTU2IDEzLjc0NkMwLjAyMjU4MzEgMTMuODI0NyAwLjAyMjU4MzEgMTMuOTA5IDAuMDQ3MTE1NiAxMy45ODc3QzAuMDU5MDYwNyAxNC4wNzA0IDAuMDk2MjIwNiAxNC4xNDc0IDAuMTUzNTA2IDE0LjIwODFMMy45MTI2NSAxOC4xNjA2QzMuOTk3MTcgMTguMjQzNiA0LjA5NTYxIDE4LjMxMSA0LjIwMzQ2IDE4LjM1OTdDNC4zMTM4MyAxOC40MDUgNC40MzE3MyAxOC40MjkxIDQuNTUxIDE4LjQzMDhIMjIuMzE4M0MyMi40MDQgMTguNDMyNCAyMi40ODgyIDE4LjQwNzYgMjIuNTU5NCAxOC4zNTk3QzIyLjYzMTEgMTguMzE3OCAyMi42ODYxIDE4LjI1MjYgMjIuNzE1NSAxOC4xNzQ5QzIyLjc1MTggMTguMDk5MiAyMi43NjM5IDE4LjAxNDEgMjIuNzQ5OSAxNy45MzE0QzIyLjczNTkgMTcuODQ4NiAyMi42OTY2IDE3Ljc3MjIgMjIuNjM3NSAxNy43MTI4TDE4Ljg4NTQgMTMuNzYwMlpNMC4yMTAyNDggMTAuODQ1NUMwLjI4MDg4OCAxMC44ODgxIDAuMzYxODk0IDEwLjkxMDIgMC40NDQzMDggMTAuOTA5NUgxOC4yNDcxQzE4LjM2NjYgMTAuOTEwOCAxOC40ODUxIDEwLjg4NjUgMTguNTk0NiAxMC44Mzg0QzE4LjcwMzggMTAuNzkyMiAxOC44MDI3IDEwLjcyNDYgMTguODg1NCAxMC42Mzk0TDIyLjYzNzUgNi42OTM5NEMyMi42OTU2IDYuNjMyODggMjIuNzM0OSA2LjU1NjM5IDIyLjc1MDkgNi40NzM1NkMyMi43NzU1IDYuMzk0ODcgMjIuNzc1NSA2LjMxMDU1IDIyLjc1MDkgNi4yMzE4NkMyMi43MjE2IDYuMTU0MTQgMjIuNjY2NSA2LjA4ODg5IDIyLjU5NDkgNi4wNDcwMkMyMi41MjM3IDUuOTk5MTIgMjIuNDM5NSA1Ljk3NDMgMjIuMzUzOCA1Ljk3NTkzSDQuNTIyNjNDNC40MDMgNS45NzQwMiA0LjI4NDQgNS45OTgyOCA0LjE3NTA5IDYuMDQ3MDJDNC4wNjU4NSA2LjA5MzIyIDMuOTY2OTYgNi4xNjA5IDMuODg0MjggNi4yNDYwN0wwLjEzMjIyOSAxMC4yMDU3QzAuMDcyNzMzNyAxMC4yNjU4IDAuMDMzMTExOSAxMC4zNDI3IDAuMDE4NzQ0MSAxMC40MjYxQy0wLjAwNjI0ODAyIDEwLjUwNDcgLTAuMDA2MjQ4MDIgMTAuNTg5MiAwLjAxODc0NDEgMTAuNjY3OEMwLjA2NDc3ODkgMTAuNzQzOCAwLjEzMTExNiAxMC44MDU0IDAuMjEwMjQ4IDEwLjg0NTVWMTAuODQ1NVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo='

export default (props)=> {

  const { accept, track, validated, integration, link, type } = useContext(ConfigurationContext)
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
  const [ polling ] = useState( !!(track && track.poll && (track.poll.endpoint || typeof track.poll.method == 'function') && track.async != true) )
  const [ synchronousTracking ] = useState( !!(track && (track.endpoint || typeof track.method == 'function') && track.async != true) )
  const [ asynchronousTracking ] = useState( !!(track && track.async == true) )
  const isTracking = synchronousTracking || asynchronousTracking
  const QRCodeElement = React.useRef()

  const selectPaymentOption = async(selectedPaymentOption)=>{
    const secretId = UUIDv4()
    setSecretId(secretId)
    selectedPaymentOption.fromAmountBN = (await Token.BigNumber({ amount: selectedPaymentOption.amount, blockchain: 'solana', address: selectedPaymentOption.token }))
    selectedPaymentOption.feeAmountBN = selectedPaymentOption.fee ? (selectedPaymentOption.fee.amount.match("%") ? selectedPaymentOption.fromAmountBN.div(1000).mul(parseInt(selectedPaymentOption.fee.amount.replace("%", ''), 10)*10) : (typeof selectedPaymentOption.fee.amount === 'string') ? selectedPaymentOption.fee.amount : (await Token.BigNumber({ amount: selectedPaymentOption.fee.amount, blockchain: 'solana', address: selectedPaymentOption.token }))) : (await Token.BigNumber({ amount: 0, blockchain: 'solana', address: selectedPaymentOption.token }))
    selectedPaymentOption.toAmountBN = selectedPaymentOption.fee ? selectedPaymentOption.fromAmountBN.sub(selectedPaymentOption.feeAmountBN) : selectedPaymentOption.fromAmountBN
    setSelectedPaymantOption(selectedPaymentOption)
    setState('wait')
    openSolanaPayTransactionSocket(secretId, selectedPaymentOption)
  }

  const getNewQRCode = ()=>{
    return new QRCodeStyling({
      width: 340,
      height: 340,
      type: "svg",
      dotsOptions: { type: "extra-rounded" },
      cornersSquareOptions: { type: 'rounded' },
      backgroundOptions: {
        color: "transparent",
      },
    })
  }

  const sendTrackingAsConfigured = ({ payment, resolve, reject })=>{
    if(track.endpoint){
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
        nonce: 0,
        after_block: afterBlock.toString(),
        from_token: selectedPaymentOption.token,
        from_amount: selectedPaymentOption.fromAmountBN.toString(),
        from_decimals: selectedPaymentOption.decimals,
        to_token: selectedPaymentOption.token,
        to_amount: selectedPaymentOption.toAmountBN.toString(),
        to_decimals: selectedPaymentOption.decimals,
        fee_amount: selectedPaymentOption.feeAmountBN.toString()
      }
      sendTrackingAsConfigured({ payment, resolve, reject })
    })
  }

  const sendTrack = ({ transaction })=>{
    if(!isTracking) { return Promise.resolve() }
    return new Promise(async(resolve, reject)=>{
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
      sendTrackingAsConfigured({ payment, resolve, reject })
    })
  }

  const openSolanaPayTransactionSocket = (secretId, selectedPaymentOption)=>{
    if(solanaPayTransactionSocket) { solanaPayTransactionSocket.close() }
    const socket = new WebSocket('wss://integrate.depay.com/cable')
    setSolanaPayTransactionSocket(socket)

    socket.onopen = async (event)=> {
      await socket.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ secret_id: secretId, channel: 'SolanaPayChannel' })
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
            token: selectedPaymentOption.token,
            payment_receiver: selectedPaymentOption.receiver,
            payment_amount: selectedPaymentOption.fromAmountBN.toString(),
            fee_receiver: selectedPaymentOption.fee ? selectedPaymentOption.fee.receiver : undefined,
            fee_amount: selectedPaymentOption.fee ? selectedPaymentOption.feeAmountBN.toString() : undefined,
          })
        }))
      }
    }

    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        setTimeout(()=>openSolanaPayTransactionSocket(secretId, selectedPaymentOption), 1000)
      }
    }

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      if(item.message.created === true) {
        traceAndContinue(secretId, selectedPaymentOption, `solana:https://public.depay.com/solana/${secretId}`)
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
        if(data && data?.params?.result?.value) {
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
    if(paymentValidationSocket) { openPaymentValidationSocket.close() }
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
            setTimeout(()=>{ props.document.location.href = item.message.forward_to }, 200)
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
          setTimeout(()=>{ props.document.location.href = data.forward_to }, 200)
        } else {
          setClosable(true)
        }
        clearInterval(pollingInterval)
        if(validated) { validated(true, transaction) }
        setRelease(true)
      }
    }

    if(track.poll.endpoint) {
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
    } else if(track.poll.method) {
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
        const signatures = await provider.getSignaturesForAddress(new PublicKey(account), undefined, 'confirmed')
        if(signatures[0].slot > afterBlock) {
          const relevantTransactions = signatures.filter((signature)=>signature.slot > afterBlock)
          const foundPaymentTransactions = await Promise.all(relevantTransactions.map(async(relevantTransaction)=>{
            const fullTransactionData = await provider.getTransaction(relevantTransaction.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 })
            const foundRouterInstruction = getPaymentRouterInstruction(fullTransactionData)
            if(foundRouterInstruction.nonce.toString() === nonce.toString()) {
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

  const traceAndContinue = async(secretId, selectedPaymentOption, QRCodeURI)=>{
    sendTrace({ secretId, selectedPaymentOption })
      .then(async()=>{
        setQRCodeURI(QRCodeURI)
        const newQRCode = getNewQRCode()
        newQRCode.update({ data: QRCodeURI })
        setQRCode(newQRCode)
      })
      .catch((error)=>{
        console.log('Tracing error:', error)
        navigate('TracingFailed')
      })
    return { afterBlock }
  }

  const storePayment = async(transaction)=>{
    fetch('https://public.depay.com/payments', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        blockchain: 'solana',
        transaction: transaction.id,
        sender: transaction.from,
        nonce: transaction.nonce,
        receiver: selectedPaymentOption.receiver,
        token: selectedPaymentOption.token,
        amount: ethers.utils.formatUnits(selectedPaymentOption.toAmountBN, selectedPaymentOption.decimals),
        confirmations: 1,
        after_block: afterBlock.toString(),
        uuid: transaction.id,
        payload: {
          sender_id: transaction.from,
          sender_token_id: selectedPaymentOption.token,
          sender_amount: ethers.utils.formatUnits(selectedPaymentOption.fromAmountBN, selectedPaymentOption.decimals),
          integration,
          link,
          type
        },
        fee_amount: selectedPaymentOption.fee ? ethers.utils.formatUnits(selectedPaymentOption.feeAmountBN, selectedPaymentOption.decimals) : null,
        fee_receiver: selectedPaymentOption.fee ? selectedPaymentOption.fee.receiver : null,
        deadline: transaction.deadline
      })
    })
    .then((response)=>{
      if(response.status == 200 || response.status == 201) {
      } else {
        setTimeout(()=>{ storePayment(transaction) }, 3000)
      }
    })
    .catch((error)=>{
      setTimeout(()=>{ storePayment(transaction) }, 3000)
    })
  }

  useEffect(()=>{
    const setAfterBlockAsync = async ()=>{
      setAfterBlock(await request({ blockchain: 'solana', method: 'latestBlockNumber' }))
    }
    setAfterBlockAsync()
    Promise.all(
      accept.filter((configuration)=>configuration.blockchain === 'solana').map((configuration)=>{
        let token = new Token({ blockchain: configuration.blockchain, address: configuration.token })
        return Promise.all([ Promise.resolve(configuration), token.symbol(), token.name(), token.decimals() ])
      })
    ).then((options)=>{
      return options.map((option)=>{
        return {
          ...option[0],
          symbol: option[1],
          name: option[2],
          decimals: option[3],
        }
      })
    }).then((paymentOptions)=>{
      setPaymentOptions(paymentOptions)
      if(paymentOptions.length === 1) { selectPaymentOption(paymentOptions[0]) }
    })
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
    if(transaction && ['succeeded', 'failed'].includes(state)) {
      setClosable(!isTracking)
      setRelease(!isTracking)
      storePayment(transaction)
      if(transactionTrackingSocket) { transactionTrackingSocket.close() }
      if(transactionTrackingInterval) { clearInterval(transactionTrackingInterval) }
      if(synchronousTracking) { 
        openPaymentValidationSocket(transaction)
        startPollingPaymentStatus(transaction)
      }
      sendTrack({ transaction })
        .then(()=>{
          setClosable(!synchronousTracking)
          setRelease(!synchronousTracking)
        })
        .catch((e)=>{
          console.log('tracking failed')
        })
    }
  }, [transaction, state])

  if(status === 'failed') {
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
                    View on explorer
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
            <h1 className="LineHeightL FontSizeL">
              <img src={ LOGO } className="SolanaPayLogo" alt="Solana Pay" title="Solana Pay"/>
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
              <h1 className="LineHeightL FontSizeL">
                <img src={ LOGO } className="SolanaPayLogo" alt="Solana Pay" title="Solana Pay"/>
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
                    <img className={"BlockchainLogo small " + Blockchains[selectedPaymentOption.blockchain].name} src={Blockchains[selectedPaymentOption.blockchain].logo} alt={Blockchains[selectedPaymentOption.blockchain].label} title={Blockchains[selectedPaymentOption.blockchain].label}/>
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
                            <Checkmark className="small"/>
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
                            <Checkmark className="small"/>
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
