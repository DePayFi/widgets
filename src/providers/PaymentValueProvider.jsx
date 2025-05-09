/*#if _EVM

import Token from '@depay/web3-tokens-evm'

/*#elif _SVM

import Token from '@depay/web3-tokens-svm'

//#else */

import Token from '@depay/web3-tokens'

//#endif

import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import PaymentContext from '../contexts/PaymentContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import usdAmountForToken from '../helpers/usdAmountForToken'
import { Currency } from '@depay/local-currency'

export default (props)=>{

  const { updatable } = useContext(UpdatableContext)
  const { amount: configuredAmount, currencyCode } = useContext(ConfigurationContext)
  const { amount } = useContext(ChangableAmountContext)
  const { payment } = useContext(PaymentContext)
  const [ paymentValue, setPaymentValue ] = useState()
  const [ displayedPaymentValue, setDisplayedPaymentValue ] = useState()
  const { currency } = useContext(ConfigurationContext)
  
  const updatePaymentValue = ({ updatable, payment })=>{
    if(updatable == false || payment?.route == undefined) { return }
    setPaymentValue(null)
    usdAmountForToken({
      blockchain: payment.route.blockchain,
      token: payment.route.fromToken.address,
      amount: payment.route.fromAmount,
      decimals: payment.route.fromDecimals,
    }).then((usdAmount)=>{
      if(usdAmount != undefined && usdAmount != null) {
        Currency.fromUSD({ amount: usdAmount, code: currency })
          .then(setPaymentValue)
      }
    })
  }

  useEffect(()=>{
    if(paymentValue && amount && configuredAmount && configuredAmount.fix) {
      setDisplayedPaymentValue(paymentValue.toString())
    } else if(amount && (configuredAmount == undefined || configuredAmount?.token != true)) {
      setDisplayedPaymentValue(new Currency({ amount: amount.toFixed(2), code: currencyCode }).toString())
    } else if(paymentValue && paymentValue.toString().length && configuredAmount?.token != true) {
      setDisplayedPaymentValue(paymentValue.toString())
    } else if(payment) {
      setDisplayedPaymentValue(`${payment.symbol} ${payment.amount}`)
    }
  }, [paymentValue, payment, amount, configuredAmount])
  
  useEffect(()=>{
    if(payment) { updatePaymentValue({ updatable, payment }) }
  }, [updatable, payment])

  return(
    <PaymentValueContext.Provider value={{
      paymentValue,
      displayedPaymentValue,
    }}>
      { props.children }
    </PaymentValueContext.Provider>
  )
}
