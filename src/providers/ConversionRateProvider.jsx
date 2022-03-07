import ConfigurationContext from '../contexts/ConfigurationContext'
import ConversionRateContext from '../contexts/ConversionRateContext'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import { Currency } from '@depay/local-currency'

export default (props)=>{
  const { setError } = useContext(ErrorContext)
  const { currency } = useContext(ConfigurationContext)
  const [ conversionRate, setConversionRate ] = useState()

  useEffect(()=>{
    Currency.fromUSD({ amount: 1, code: currency })
      .then((conversion)=>setConversionRate(conversion.amount))
      .catch(setError)
  }, [])

  return(
    <ConversionRateContext.Provider value={{
      conversionRate
    }}>
      { props.children }
    </ConversionRateContext.Provider>
  )
}
