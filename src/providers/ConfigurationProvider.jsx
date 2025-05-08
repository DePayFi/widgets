/*#if _EVM

import { setProviderEndpoints } from '@depay/web3-client-evm'

/*#elif _SVM

import { setProviderEndpoints } from '@depay/web3-client-svm'

//#else */

import { setProviderEndpoints } from '@depay/web3-client'

//#endif

import ClosableProvider from '../providers/ClosableProvider'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import LoadingStack from '../stacks/LoadingStack'
import NavigateProvider from '../providers/NavigateProvider'
import PoweredBy from '../components/PoweredBy'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableProvider from '../providers/UpdatableProvider'
import { Currency } from '@depay/local-currency'
import { verify } from '@depay/js-verify-signature-web'

const PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtqsu0wy94cpz90W4pGsJ\nSf0bfvmsq3su+R1J4AoAYz0XoAu2MXJZM8vrQvG3op7OgB3zze8pj4joaoPU2piT\ndH7kcF4Mde6QG4qKEL3VE+J8CL3qK2dUY0Umu20x/O9O792tlv8+Q/qAVv8yPfdM\nn5Je9Wc7VI5XeIBKP2AzsCkrXuzQlR48Ac5LpViNSSLu0mz5NTBoHkW2sz1sNWc6\nUpYISJkiKTvYc8Bo4p5xD6+ZmlL4hj1Ad/+26SjYcisX2Ut4QD7YKRBP2SbItVkI\nqp9mp6c6MCKNmEUkosxAr0KVfOcrk6/fcc4tI8g+KYZ32G11Ri8Xo4fgHH06DLYP\n3QIDAQAB\n-----END PUBLIC KEY-----\n"

export default (props)=>{
  const currencyCode = typeof props.configuration.currency === 'string' ? new Currency({ code: props.configuration.currency }).code : new Currency({ amount: 0 }).code
  const { setError } = useContext(ErrorContext)
  const [configuration, setConfiguration] = useState(!props.configuration?.integration ? {... props.configuration, currencyCode } : undefined)

  const loadConfiguration = (id, attempt)=>{
    if(attempt > 3) {
      const msg = 'Unable to load payment configuration!'
      setError(msg)
      throw(msg)
      return
    }
    const retry = ()=>{ setTimeout(()=>loadConfiguration(id, attempt+1), 1000) }
    fetch(
      `https://public.depay.com/configurations/${id}?v=3`,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: props.configuration?.payload ? JSON.stringify({ payload: props.configuration.payload }) : undefined
      }
    ).catch(retry).then(async (response)=>{
      if(response.status == 200) {
        let { id: configurationId, configuration } = JSON.parse(await response.text())

        let verified = await verify({
          signature: response.headers.get('x-signature'),
          publicKey: PUBLIC_KEY,
          data: JSON.stringify(configuration)
        })

        if(verified){
          const localConfigurationWithValues = Object.entries(props.configuration).reduce((acc, [key, value]) => {
            if (value !== undefined) { acc[key] = value }
            return acc
          }, {})
          if(!configuration?.accept || !configuration?.accept?.length > 0) {
            const msg = 'Configuration is missing token acceptance!'
            setError(msg)
            throw(msg)
          }
          if(configuration.accept.some((configuration)=>!configuration.protocolFee)) {
            const msg = 'Configuration is missing protocol fee!'
            setError(msg)
            throw(msg)
          }
          setConfiguration({...configuration, ...localConfigurationWithValues, id: configurationId, currencyCode })
        } else {
          const msg = 'Configuration response not verified!'
          setError(msg)
          throw(msg)
        }
      } else { retry() }
    })
  }

  useEffect(()=>{
    if(configuration?.providers != undefined) {
      Object.entries(props.configuration.providers).forEach((entry)=>{
        setProviderEndpoints(entry[0], entry[1])
      })
    }
  }, [configuration])

  useEffect(()=>{
    if(props.configuration?.integration) {
      loadConfiguration(props.configuration?.integration, 1)
    }
  }, [props.configuration])

  if(props.configuration?.integration && !configuration) {

    return(
      <UpdatableProvider>
        <ClosableProvider unmount={ props.unmount } closable={ false }>
          <NavigateProvider>
            <PoweredBy/>
            <LoadingStack
              text={ false }
              document={ props.document }
              container={ props.container }
            />
          </NavigateProvider>
        </ClosableProvider>
      </UpdatableProvider>
    )

  } else {

    return(
      <ConfigurationContext.Provider value={ configuration }>
        { props.children }
      </ConfigurationContext.Provider>
    )
  }
}
