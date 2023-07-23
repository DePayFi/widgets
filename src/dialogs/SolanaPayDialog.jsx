/*#if _EVM

import { Token } from '@depay/web3-tokens-evm'
import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SOLANA

import { Token } from '@depay/web3-tokens-solana'
import { TokenImage } from '@depay/react-token-image-solana'

//#else */

import { Token } from '@depay/web3-tokens'
import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import format from '../helpers/format'
import getFavicon from '../helpers/getFavicon'
import React, { useState, useEffect, useContext } from 'react'
import UUIDv4 from '../helpers/UUIDv4'
import { NavigateStackContext } from '@depay/react-dialog-stack'

const LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODYiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA4NiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTc3LjExMjggMjIuMDA2NUw3Mi4xNDc5IDExLjE1ODNINjguMDI3TDc1LjExOTcgMjUuNzk1Nkw3NC45OTIxIDI2LjIzNjRDNzQuODE0NCAyNi44MjIzIDc0LjQzOTUgMjcuMzI4MiA3My45MzExIDI3LjY2NzlDNzMuNDIyOCAyOC4wMDc2IDcyLjgxMjUgMjguMTU5OSA3Mi4yMDQ2IDI4LjA5ODlDNzEuNDkzIDI4LjA5MjMgNzAuNzk0OCAyNy45MDM5IDcwLjE3NjEgMjcuNTUxNUw2OS41MTY1IDMwLjY4NjVDNzAuNDY4NCAzMS4wNzk3IDcxLjQ4NzEgMzEuMjg0OSA3Mi41MTY3IDMxLjI5MDhDNzUuMzUzOCAzMS4yOTA4IDc3LjA3MDIgMzAuMjQ1OCA3OC40ODg4IDI3LjE2NzZMODYgMTEuMTU4M0g4Mi4wMjFMNzcuMTEyOCAyMi4wMDY1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTQyLjAyMzUgNS45OTAxMUgzMC4xMjE5VjI1LjkzMDZIMzQuMDIyOVYxOC42MDEzSDQyLjAyMzVDNDYuMzcxMyAxOC42MDEzIDQ5LjIyOTcgMTYuNDA0NyA0OS4yMjk3IDEyLjI5NTdDNDkuMjI5NyA4LjE4Njc3IDQ2LjM3MTMgNS45OTAxMSA0Mi4wMjM1IDUuOTkwMTFaTTQxLjgxMDcgMTUuMTEwOUgzNC4wMDg3VjkuNDIzNzJINDEuODEwN0M0NC4wNjYyIDkuNDIzNzIgNDUuMzU3IDEwLjQ1NDUgNDUuMzU3IDEyLjI2NzNDNDUuMzU3IDE0LjA4MDEgNDQuMDY2MiAxNS4xMTA5IDQxLjgxMDcgMTUuMTEwOVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik02NS41MzkgMjIuMTQ4N1YxNi4xNDE2QzY1LjUzOSAxMi41ODcyIDYyLjk5MjggMTAuNzQ2IDU4LjYyMzYgMTAuNzQ2QzU1LjA3NzMgMTAuNzQ2IDUxLjk3MDYgMTIuNDAyNCA1MS4wOTgyIDE0Ljk0NzNMNTQuMzA0MiAxNi4wODQ4QzU0Ljc3OTQgMTQuODEyMyA1Ni40MzIgMTMuODczOSA1OC40ODg5IDEzLjg3MzlDNjAuOTI4OCAxMy44NzM5IDYxLjk1NzIgMTQuODY5MSA2MS45NTcyIDE2LjA4NDhWMTYuNDc1OEw1Ni4xNTU0IDE3LjExNTZDNTIuODE0NyAxNy40NzEgNTAuNjE1OSAxOC45NzEgNTAuNjE1OSAyMS42NTExQzUwLjYxNTkgMjQuNTg3IDUzLjEzMzkgMjYuMTY1MiA1Ni40NzQ1IDI2LjE2NTJDNTguNjI3OCAyNi4yMzI1IDYwLjcyNDggMjUuNDY5MSA2Mi4zMzMxIDI0LjAzMjVDNjIuOTE0NyAyNS40NTQzIDYzLjUxMDUgMjYuNDA2OSA2Ny40NzU0IDI1LjkwMjJWMjIuOTMwN0M2NS44ODY2IDIzLjMxNDUgNjUuNTM5IDIyLjkzMDcgNjUuNTM5IDIyLjE0ODdaTTYxLjk5MjcgMjAuMjQzNUM2MS45OTI3IDIyLjE3NzEgNTkuMjkwMyAyMy4yMDA4IDU3LjAyNzggMjMuMjAwOEM1NS4zMDQyIDIzLjIwMDggNTQuMjY4NyAyMi42NDYzIDU0LjI2ODcgMjEuNTQ0NEM1NC4yNjg3IDIwLjQ0MjUgNTUuMTE5OCAyMC4wNDQ0IDU2Ljc2NTMgMTkuODUyNUw2Mi4wMDY5IDE5LjI0MTFMNjEuOTkyNyAyMC4yNDM1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTIyLjc0MzkgMjEuMjUzQzIyLjc3MTQgMjEuMzM2MSAyMi43NzE0IDIxLjQyNTkgMjIuNzQzOSAyMS41MDg5QzIyLjcyNzkgMjEuNTkxOCAyMi42ODg1IDIxLjY2ODMgMjIuNjMwNCAyMS43MjkzTDE4Ljg3ODMgMjUuNjc0OEMxOC43OTU2IDI1Ljc1OTkgMTguNjk2OCAyNS44Mjc2IDE4LjU4NzUgMjUuODczOEMxOC40NzggMjUuOTIxOSAxOC4zNTk1IDI1Ljk0NjIgMTguMjQgMjUuOTQ0OUgwLjQ0NDMwOEMwLjM2MTg5NCAyNS45NDU2IDAuMjgwODg4IDI1LjkyMzUgMC4yMTAyNDggMjUuODgwOUMwLjEzOTY1NSAyNS44MzI4IDAuMDgzMzAyOCAyNS43NjY1IDAuMDQ3MTE1NiAyNS42ODlDMC4wMjIxMjM2IDI1LjYxMDQgMC4wMjIxMjM2IDI1LjUyNTkgMC4wNDcxMTU2IDI1LjQ0NzNDMC4wNjE4MjM3IDI1LjM2NTUgMC4wOTg2MTkzIDI1LjI4OTIgMC4xNTM1MDYgMjUuMjI2OUwzLjkxMjY1IDIxLjI4MTVDMy45OTUzMyAyMS4xOTYzIDQuMDk0MjIgMjEuMTI4NiA0LjIwMzQ2IDIxLjA4MjRDNC4zMTI3NyAyMS4wMzM3IDQuNDMxMzcgMjEuMDA5NCA0LjU1MSAyMS4wMTEzSDIyLjMxODNDMjIuNDA0IDIxLjAwOTcgMjIuNDg4MiAyMS4wMzQ1IDIyLjU1OTQgMjEuMDgyNEMyMi42MzkzIDIxLjExNTQgMjIuNzA0NyAyMS4xNzU5IDIyLjc0MzkgMjEuMjUzWk0xOC44ODU0IDEzLjc2MDJDMTguODAwOSAxMy42NzczIDE4LjcwMjUgMTMuNjA5OSAxOC41OTQ2IDEzLjU2MTJDMTguNDg0IDEzLjUxNjQgMTguMzY2MyAxMy40OTI0IDE4LjI0NzEgMTMuNDkwMUgwLjQ0NDMwOEMwLjM2MDg2NCAxMy40OTEzIDAuMjc5NDMgMTMuNTE1OSAwLjIwOTIzMSAxMy41NjEyQzAuMTM5MDMyIDEzLjYwNjQgMC4wODI4NzI0IDEzLjY3MDQgMC4wNDcxMTU2IDEzLjc0NkMwLjAyMjU4MzEgMTMuODI0NyAwLjAyMjU4MzEgMTMuOTA5IDAuMDQ3MTE1NiAxMy45ODc3QzAuMDU5MDYwNyAxNC4wNzA0IDAuMDk2MjIwNiAxNC4xNDc0IDAuMTUzNTA2IDE0LjIwODFMMy45MTI2NSAxOC4xNjA2QzMuOTk3MTcgMTguMjQzNiA0LjA5NTYxIDE4LjMxMSA0LjIwMzQ2IDE4LjM1OTdDNC4zMTM4MyAxOC40MDUgNC40MzE3MyAxOC40MjkxIDQuNTUxIDE4LjQzMDhIMjIuMzE4M0MyMi40MDQgMTguNDMyNCAyMi40ODgyIDE4LjQwNzYgMjIuNTU5NCAxOC4zNTk3QzIyLjYzMTEgMTguMzE3OCAyMi42ODYxIDE4LjI1MjYgMjIuNzE1NSAxOC4xNzQ5QzIyLjc1MTggMTguMDk5MiAyMi43NjM5IDE4LjAxNDEgMjIuNzQ5OSAxNy45MzE0QzIyLjczNTkgMTcuODQ4NiAyMi42OTY2IDE3Ljc3MjIgMjIuNjM3NSAxNy43MTI4TDE4Ljg4NTQgMTMuNzYwMlpNMC4yMTAyNDggMTAuODQ1NUMwLjI4MDg4OCAxMC44ODgxIDAuMzYxODk0IDEwLjkxMDIgMC40NDQzMDggMTAuOTA5NUgxOC4yNDcxQzE4LjM2NjYgMTAuOTEwOCAxOC40ODUxIDEwLjg4NjUgMTguNTk0NiAxMC44Mzg0QzE4LjcwMzggMTAuNzkyMiAxOC44MDI3IDEwLjcyNDYgMTguODg1NCAxMC42Mzk0TDIyLjYzNzUgNi42OTM5NEMyMi42OTU2IDYuNjMyODggMjIuNzM0OSA2LjU1NjM5IDIyLjc1MDkgNi40NzM1NkMyMi43NzU1IDYuMzk0ODcgMjIuNzc1NSA2LjMxMDU1IDIyLjc1MDkgNi4yMzE4NkMyMi43MjE2IDYuMTU0MTQgMjIuNjY2NSA2LjA4ODg5IDIyLjU5NDkgNi4wNDcwMkMyMi41MjM3IDUuOTk5MTIgMjIuNDM5NSA1Ljk3NDMgMjIuMzUzOCA1Ljk3NTkzSDQuNTIyNjNDNC40MDMgNS45NzQwMiA0LjI4NDQgNS45OTgyOCA0LjE3NTA5IDYuMDQ3MDJDNC4wNjU4NSA2LjA5MzIyIDMuOTY2OTYgNi4xNjA5IDMuODg0MjggNi4yNDYwN0wwLjEzMjIyOSAxMC4yMDU3QzAuMDcyNzMzNyAxMC4yNjU4IDAuMDMzMTExOSAxMC4zNDI3IDAuMDE4NzQ0MSAxMC40MjYxQy0wLjAwNjI0ODAyIDEwLjUwNDcgLTAuMDA2MjQ4MDIgMTAuNTg5MiAwLjAxODc0NDEgMTAuNjY3OEMwLjA2NDc3ODkgMTAuNzQzOCAwLjEzMTExNiAxMC44MDU0IDAuMjEwMjQ4IDEwLjg0NTVWMTAuODQ1NVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo='

export default (props)=> {

  const { accept, track } = useContext(ConfigurationContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ paymentOptions, setPaymentOptions ] = useState()
  const [ selectedPaymentOption, setSelectedPaymantOption ] = useState()
  const [ secretId, setSecretId ] = useState()
  const [ QRCodeURI, setQRCodeURI ] = useState()
  const [ state, setState ] = useState('select')
  const [ deadline, setDeadline ] = useState()
  const [ synchronousTracking ] = useState( !!(track && (track.endpoint || typeof track.method == 'function') && track.async != true) )
  const [ asynchronousTracking ] = useState( !!(track && track.async == true) )

  const selectPaymentOption = (selectedPaymentOption)=>{
    const secretId = UUIDv4()
    setSecretId(secretId)
    setSelectedPaymantOption(selectedPaymentOption)
    setState('wait')
    openSocket(secretId, selectedPaymentOption)
  }

  const trace = (secretId, selectedPaymentOption)=>{
    if(!synchronousTracking && !asynchronousTracking) { return Promise.resolve() }
    return new Promise(async(resolve, reject)=>{
      let currentBlock = await request({ blockchain: 'solana', method: 'latestBlockNumber' })
      let payment = {
        blockchain: 'solana',
        sender: `solana:${secretId}`,
        nonce: 0,
        after_block: afterBlock.toString(),
        from_token: selectedPaymentOption.fromToken.address,
        from_amount: selectedPaymentOption.fromAmount.toString(),
        from_decimals: selectedPaymentOption.fromDecimals,
        to_token: selectedPaymentOption.toToken.address,
        to_amount: selectedPaymentOption.toAmount.toString(),
        to_decimals: selectedPaymentOption.toDecimals,
        fee_amount: selectedPaymentOption?.feeAmount?.toString(),
        deadline
      }
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
    })
  }

  const openSocket = (secretId, selectedPaymentOption)=>{
    let socket
    socket = new WebSocket('wss://integrate.depay.com/cable')

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
            payment_option: selectedPaymentOption
          })
        }))
        setQRCodeURI(`solana:https://public.depay.com/solana/${secretId}`)
        traceAndContinue(secretId, selectedPaymentOption)
      }
    }

    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        setTimeout(()=>openSocket(), 1000)
      }
    }

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      console.log('ONMESSAGE', item.message)
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error)
    }
  }

  const traceAndContinue = (secretId, selectedPaymentOption)=>{
    trace(secretId, selectedPaymentOption)
      .then(()=>{
        setState('scan')
      })
      .catch(()=>{
        navigate('TracingFailed')
      })
  }

  useEffect(()=>{
    Promise.all(
      accept.filter((configuration)=>configuration.blockchain === 'solana').map((configuration)=>{
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
    }).then((paymentOptions)=>{
      setPaymentOptions(paymentOptions)
      if(paymentOptions.length === 1) { selectPaymentOption(paymentOptions[0]) }
    })
  }, [])

  if(!paymentOptions) {
    return(
      <Dialog
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <h1 className="LineHeightL FontSizeL">
              <img src={ LOGO } alt="Solana Pay" title="Solana Pay"/>
            </h1>
          </div>
        </div>
        }
        body={
          <div className="MaxHeight PaddingTopM">
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
                <img src={ LOGO } alt="Solana Pay" title="Solana Pay"/>
              </h1>
            </div>
          </div>
        }
        body={
          <div className={`${['selectPaymentOption'].includes(state) ? 'MaxHeight' : ''} PaddingTopM`}>
            <div className="PaddingLeftM PaddingRightM">
              
              {
                state === 'selectPaymentOption' && paymentOptions && paymentOptions.map((paymentOption, index)=>{
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

              {
                state === 'preparing' &&
                <div className="TextCenter">
                  <div className="Skeleton" style={{ display: "inline-block", borderRadius: "18px", width: "305px", height: "305px" }}>
                    <div className="SkeletonBackground"/>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        footer={
          <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS">
            {
              state === 'select' &&
              <div className="Opacity05 PaddingBottomXS">
                <small>Select a payment option to continue</small>
              </div>
            }
            {
              state === 'wait' &&
              <div className="Opacity05 PaddingBottomXS">
                <small>Loading QR code...</small>
              </div>
            }{
              state === 'scan' &&
              <div className="Opacity05 PaddingBottomXS">
                <small>Scan QR code with your wallet</small>
              </div>
            }
          </div>
        }
      />
    )
  }
}
