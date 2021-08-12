import Dialog from '../../components/Dialog'
import React from 'react'

export default (props)=>{

  let cards = [1].map((element, index)=>{
    return(
      <h2 key={index}>Payment</h2>
    )
  })

  return(
    <Dialog
      stacked={ true }
      header={
        <h1 className="HeaderTitle">Change Payment</h1>
      }
      body={
        <div>{ cards }</div>
      }
      footer={
        <div></div>
      }
    />
  )
}
