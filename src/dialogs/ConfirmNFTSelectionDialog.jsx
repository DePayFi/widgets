import addressEllipsis from '../helpers/addressEllipsis'
import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import Dialog from '../components/Dialog'
import msToTime from '../helpers/msToTime'
import React, { useState, useContext, useEffect } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { selection, setSelection } = useContext(SelectionContext)
  const { setOpen } = useContext(ClosableContext)
  const { navigate } = useContext(NavigateStackContext)

  let age, holders

  if(selection.nft.createdAt) {
    age = msToTime(new Date() - new Date(selection.nft.createdAt))
    age = [
      ((age.year && age.year >= 1) ? (age.year >= 2 ? `${age.year} years` : `1 year`) : undefined ),
      ((age.month && age.month >= 1) ? (age.month >= 2 ? `${age.month} months` : `1 month`) : undefined ),
      ((age.day && age.day >= 1 && age.month <=1 && age.year <1) ? (age.day >= 2 ? `${age.day} days !!!` : `1 day !!!`) : undefined )
    ].filter(n => n).join(' ')
  }

  let blockchain = selection.nft?.blockchain || selection.blockchain?.name

  if(blockchain == undefined) {
    navigate('SelectBlockchain')
    return(null)
  }

  const onClickConfirm = ()=>{
    setOpen(false)
    props.resolve({...selection.nft, blockchain })
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
            { selection.nft.image && <img src={ selection.nft.image }/> }
          </div>
          <div className="PaddingTopS TextCenter">
            <div className="Alert FontSizeS">
              <strong>Review this information</strong>
            </div>
          </div>
          <div className="PaddingTopXS">
            <table className="Table TextLeft FontSizeS">
              <tbody>
                <tr>
                  <td>
                    <div className='TableSubTitle'>Blockchain</div>
                  </td>
                  <td>
                    <div>{ Blockchains.findByName(blockchain).label }</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className='TableSubTitle'>Name</div>
                  </td>
                  <td>
                    <a className="Link" href={ selection.nft.link } target="_blank" rel="noopener noreferrer">
                      { selection.nft.name }
                    </a>
                  </td>
                </tr>
                { selection.nft.address &&
                  <tr>
                    <td>
                      <div className='TableSubTitle'>Address</div>
                    </td>
                    <td>
                      <div>
                        <a className="Link" title={ selection.nft.address } href={ Blockchains.findByName(blockchain).explorerUrlFor({ token: selection.nft.address }) } target="_blank" rel="noopener noreferrer">
                          { addressEllipsis(selection.nft.address, 6) }
                        </a>
                      </div>
                    </td>
                  </tr>
                }
                { selection.nft.id &&
                  <tr>
                    <td>
                      <div className='TableSubTitle'>Token ID</div>
                    </td>
                    <td>
                      <div>{ selection.nft.id }</div>
                    </td>
                  </tr>
                }
                { selection.nft.addresses &&
                  <tr>
                    <td>
                      <div className='TableSubTitle'>Addresses</div>
                    </td>
                    <td>
                      <div>
                        { selection.nft.addresses.join(", ") }
                      </div>
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
