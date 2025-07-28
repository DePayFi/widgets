import ConfigurationContext from '../contexts/ConfigurationContext'
import ConversionRateContext from '../contexts/ConversionRateContext'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import { Currency } from '@depay/local-currency'

export default (props)=>{
  const { setError } = useContext(ErrorContext)
  const { amount, currency } = useContext(ConfigurationContext)
  const [ conversionRate, setConversionRate ] = useState()
  const [ fixedCurrencyConversionRate, setFixedCurrencyConversionRate ] = useState()

  useEffect(()=>{
    if(typeof amount == 'object' && amount.currency) {
      Currency.fromUSD({ amount: 1, code: amount.currency })
        .then((conversion)=>setFixedCurrencyConversionRate(conversion.amount))
    }
    Currency.fromUSD({ amount: 1, code: currency })
      .then((conversion)=>setConversionRate(conversion.amount))
  }, [])

  return(
    <ConversionRateContext.Provider value={{
      conversionRate,
      fixedCurrencyConversionRate
    }}>
      { props.children }
    </ConversionRateContext.Provider>
  )
}
