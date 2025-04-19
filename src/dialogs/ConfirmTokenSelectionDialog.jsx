/*#if _EVM

import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SVM

import { TokenImage } from '@depay/react-token-image-svm'

//#else */

import { TokenImage } from '@depay/react-token-image'

//#endif

import addressEllipsis from '../helpers/addressEllipsis'
import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import Dialog from '../components/Dialog'
import msToTime from '../helpers/msToTime'
import React, { useState, useContext } from 'react'
import SelectionContext from '../contexts/SelectionContext'

export default (props)=> {

  const { selection } = useContext(SelectionContext)
  const { setOpen } = useContext(ClosableContext)
  const token = selection.token
  const address = token.address || token.external_id
  const logo = token.logo || token.image
  const blockchain = Blockchains.findByName(token.blockchain)
  let age = token.first_transfer ? msToTime(new Date() - new Date(token.first_transfer)) : undefined
  if(age) {
    age = [
      ((age.year && age.year >= 1) ? (age.year >= 2 ? `${age.year} years` : `1 year`) : undefined ),
      ((age.month && age.month >= 1) ? (age.month >= 2 ? `${age.month} months` : `1 month`) : undefined ),
      ((age.day && age.day >= 1 && age.month <=1 && age.year <1) ? (age.day >= 2 ? `${age.day} days !!!` : `1 day !!!`) : undefined )
    ].filter(n => n).join(' ')
  }

  let holders = token.unique_senders ? token.unique_senders : undefined
  if(holders) {
    if(holders > 1000000) {
      holders = "Millions"
    } else if (holders > 100000) {
      holders = "Hundreds of Thousands"
    } else if (holders > 2000) {
      holders = "Thousands"
    } else if (holders > 100) {
      holders = "Hundreds"
    } else {
      holders = "Only a Few!!!"
    }
  }

  const onClickConfirm = ()=>{
    setOpen(false)
    props.resolve({
      blockchain: token.blockchain,
      address: token.external_id || token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logo: token.image || token.logo,
      routable: token.routable
    })
    setTimeout(props.unmount, 300)
  }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <h1 className="LineHeightL FontSizeL">Confirm Selection</h1>
          </div>
        </div>
      }
      stacked={ true }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div className="TokenImage medium TextCenter">
            { logo && <img src={ logo }/> }
            { !logo && <TokenImage blockchain={ token.blockchain } address={ address }/> }
          </div>
          <div className="PaddingTopS TextCenter">
            <div className="Alert FontSizeS">
              <strong>Please review this information</strong>
            </div>
          </div>
          <div className="PaddingTopXS">
            <table className="Table TextLeft FontSizeS">
              <tbody>
                <tr>
                  <td>
                    <div className='TableSubTitle'>Address</div>
                  </td>
                  <td>
                    <div>
                      <a className="Link" title={ address } href={ blockchain.explorerUrlFor({ token: address }) } target="_blank" rel="noopener noreferrer">
                        { addressEllipsis(address, 8) }
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='TableSubTitle'>Blockchain</div>
                  </td>
                  <td>
                    <div>{ blockchain.label }</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='TableSubTitle'>Symbol</div>
                  </td>
                  <td>
                    <div>{ token.symbol }</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='TableSubTitle'>Name</div>
                  </td>
                  <td>
                    <div>{ token.name }</div>
                  </td>
                </tr>
                { age &&
                  <tr>
                    <td>
                      <div className='TableSubTitle'>Age</div>
                    </td>
                    <td>
                      <div>{ age }</div>
                    </td>
                  </tr>
                }
                { holders &&
                  <tr>
                    <td>
                      <div className='TableSubTitle'>Holders</div>
                    </td>
                    <td>
                      <div>{ holders }</div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS">
          <button className='ButtonPrimary' onClick={ onClickConfirm }>
            Confirm
          </button>
        </div>
      }
    />
  )
}
