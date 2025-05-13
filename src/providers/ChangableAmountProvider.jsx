/*#if _EVM

import Token from '@depay/web3-tokens-evm'

/*#elif _SVM

import Token from '@depay/web3-tokens-svm'

//#else */

import Token from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConversionRateContext from '../contexts/ConversionRateContext'
import debounce from '../helpers/debounce'
import ErrorContext from '../contexts/ErrorContext'
import React, { useCallback, useState, useEffect, useContext } from 'react'
import round from '../helpers/round'
import tokenAmountForUSD from '../helpers/tokenAmountForUSD'
import WalletContext from '../contexts/WalletContext'
import { Decimal } from 'decimal.js'

export default (props)=>{
  const configurationsMissAmounts = (configurations)=>{
    return !configurations.every((configuration)=>{
      return(
        typeof configuration.amount != 'undefined' || typeof configuration.fromAmount != 'undefined'
      )
    })
  }
  const { amount: configuredAmount, toAmount, accept } = useContext(ConfigurationContext)
  const configuration = useContext(ConfigurationContext)
  const [ amountsMissing, setAmountsMissing ] = useState(configurationsMissAmounts(accept))
  let { account } = useContext(WalletContext)
  const { conversionRate, fixedCurrencyConversionRate } = useContext(ConversionRateContext)
  const { setError } = useContext(ErrorContext)
  const [ acceptWithAmount, setAcceptWithAmount ] = useState()
  const [ fixedAmount ] = useState((typeof configuredAmount == 'object' && configuredAmount.fix && configuredAmount.currency) ? configuredAmount.fix : null)
  const [ fixedCurrency ] = useState((typeof configuredAmount == 'object' && configuredAmount.fix && configuredAmount.currency) ? configuredAmount.currency : null)
  let startAmount
  if(amountsMissing) {
    if((typeof configuredAmount == "object" && configuredAmount.start && configuredAmount.start)) {
      startAmount = configuredAmount.start
    } else if (typeof configuredAmount == "object" && configuredAmount.fix) {
      startAmount = configuredAmount.fix
    } else {
      startAmount = 1
    }
  }
  const [ amount, setAmount ] = useState(startAmount)

  useEffect(()=>{
    setAmountsMissing(configurationsMissAmounts(accept))
  }, [accept])

  const getAmounts = ({ amount, conversionRate, fixedCurrencyConversionRate })=>{
    if(configuredAmount && configuredAmount.token) {
      return Promise.resolve(accept.map(()=>amount))
    } else {
      return Promise.all(accept.map((accept)=>{
        return tokenAmountForUSD({
          blockchain: accept.blockchain,
          token: accept.token,
          amount: amount*conversionRate,
        })
      }))
    }
  }

  const updateAmounts = useCallback(debounce(({ account, amount, conversionRate, fixedCurrencyConversionRate })=>{
    getAmounts({ amount, conversionRate, fixedCurrencyConversionRate }).then((amounts)=>{
      setAcceptWithAmount(accept.map((configuration, index)=>{
        if(amounts[index] == undefined) { return }
        return(
          {...configuration, amount: round(amounts[index]) }
        )
      }).filter((configuration)=>{
        return !!configuration
      }))
    }).catch(setError)
  }, 500), [])

  useEffect(()=>{
    if(amountsMissing && account && conversionRate && (fixedAmount ? fixedCurrencyConversionRate : true)) {
      setAcceptWithAmount()
      updateAmounts({ account, amount, conversionRate, fixedCurrencyConversionRate })
    }
  }, [amountsMissing, account, conversionRate, fixedAmount, fixedCurrencyConversionRate, amount])

  return(
    <ChangableAmountContext.Provider value={{
      amountsMissing,
      fixedAmount,
      fixedCurrency,
      acceptWithAmount,
      amount,
      setAmount,
    }}>
      { props.children }
    </ChangableAmountContext.Provider>
  )
}
