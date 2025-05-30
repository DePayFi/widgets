import allWallets from '../../helpers/allWallets'
import React, { useContext } from 'react'
import WalletContext from '../../contexts/WalletContext'

export default (props)=>{
  
  const walletctx = useContext(WalletContext)
  const wallet = walletctx?.wallet || walletctx?.solanaPayWallet
  let walletMeta = wallet ? allWallets.find((walletMeta)=>walletMeta.name == wallet.name) : undefined
  if(!walletMeta?.colors){ walletMeta = undefined }

  return(
    <svg className={"Graphic "+props.className} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1171.6 933.3">
      <g>
        <path opacity="0.5" className="GraphicActiveColor" d="M1128.6,796.2c-1.2-3.3-2-6.7-2.9-10.1-.2-.8-.5-1.7-.7-2.5-.2-.4-.3-.9-.5-1.4-.2-.5-.4-.9-.6-1.4-.2-.5-.4-.9-.5-1.4-1-2.5-2-5.6-3.2-8.1-.3-.4-.6-.9-.9-1.2-1.6-1.9-3.6-3-6.1-2.5-5.7,1.5-9.8,7.7-16,10.7-.5.3-1,.6-1.6,1-.5.3-1,.6-1.6.9,0-.2,0-.4.1-.6.6-2.8,1.3-5.5,1.9-8.2,1.1-4.7,2.1-9.8,1-14.6-.1-.7-.3-1.4-.6-2-1.3-3.2-5.4-3.2-7.7-1-.7.4-1.4.9-2.1,1.3-1.4.9-2.7,1.8-4.1,2.6-.6.3-1.1.7-1.7,1-4,2.5-8.2,3.5-12.8,5.1-.5-3.6-2.5-7.2-2.7-10.7,0-.6-.2-1.1-.3-1.7-.2-1.7-.3-3.4-.1-5.4.2-2-1.9-3.9-3.8-3.9-2.2,0-3.7,1.7-3.9,3.8-.3,3,0,6.1.7,9.2.1.8.3,1.5.5,2.3.9,4.2.4,9.4,3.5,12,5.6,6.2,14.9-.5,21.8-3.5.5-.3,1-.6,1.5-.9,1.5-.9,3-1.8,4.5-2.8,0,.3,0,.6,0,.9,0,.3,0,.6,0,.9,0,0,0,.1,0,.2,0,0,0,0,0,.1,0,.6-.2,1.3-.3,1.9-.3,1.4-.6,2.7-.9,4.1-1.3,5.3-2.9,10.8-2.7,16.3.1,3.1,3.1,4.5,5.8,3.3,2.3-1,4.5-2.2,6.6-3.4.7-.4,1.4-.8,2.1-1.3,1.8-1.5,4-2.3,6.2-3.1.4-.1.7-.3,1.1-.4,2.5-.9,5.6-4,8.2-.9,2.1,2.6,2.6,5.7,3.1,8.9.1.4.2.8.3,1.2.6,2.4,1.3,4.7,2.1,7.1.7,2,2.6,3.3,4.7,2.7,1.9-.5,3.4-2.8,2.7-4.7Z"/>
        <path className="GraphicActiveColor" d="M1096.6,707.6c11.5-.9,23-1.8,34.4-2.7-1.8-2.4-3.6-4.8-5.5-7.1-2.2,7.6-4.3,15.3-6.5,22.9-1.1,3.8,1.2,7.5,5.5,7.1,11.4-.9,22.9-1.8,34.3-2.7,6.6-.5,5.2-10.8-1.4-10.2-11.4.9-22.9,1.8-34.3,2.7,1.8,2.4,3.6,4.8,5.5,7.1,2.2-7.6,4.3-15.3,6.5-22.9,1.1-3.8-1.2-7.5-5.5-7.1-11.5.9-23,1.8-34.4,2.7-6.6.5-5.2,10.8,1.4,10.2h0Z"/>
        <path className="GraphicActiveColor" d="M1026.9,794c7.2,11.1,14.5,22.2,21.7,33.2,1-2.8,2.1-5.6,3.1-8.4-8.9,2.1-17.8,4.1-26.7,6.2-4,.9-5.3,5.1-3.1,8.4,7.2,11,14.5,22,21.7,33.1,1.5,2.3,5.3,2.4,7.3.7,2.4-1.9,2.3-4.9.7-7.3-7.2-11-14.5-22-21.7-33.1-1,2.8-2.1,5.6-3.1,8.4,8.9-2.1,17.8-4.1,26.7-6.2,4-.9,5.3-5.1,3.1-8.4-7.2-11.1-14.5-22.2-21.7-33.2-1.5-2.3-5.3-2.4-7.3-.7-2.4,1.9-2.3,4.9-.7,7.3h0Z"/>
      </g>
      <g>
        <path opacity="0.5" className="GraphicActiveColor" d="M130.4,101.7c.7-3.7,1.8-7.3,2.8-11,.3-.9.5-1.8.7-2.7,0-.5.2-1,.3-1.5,0-.5.1-1.1.2-1.6,0-.5.2-1.1.2-1.6.4-2.9,1.2-6.3,1.4-9.3,0-.6,0-1.1-.2-1.7-.4-2.6-1.7-4.8-4.4-5.7-6.1-1.7-13.4,1.8-20.8,1.2-.7,0-1.3,0-2,0-.7,0-1.3,0-2,0,.1-.2.3-.3.4-.5,2-2.3,4.2-4.4,6.3-6.6,3.6-3.8,7.3-8,8.9-13,.2-.7.4-1.5.6-2.2.5-3.7-3.3-6-6.6-5.1-.9,0-1.8,0-2.6.1-1.8,0-3.5.1-5.3.2-.7,0-1.4,0-2.1,0-5.1.2-9.5-1.2-14.7-2.3,1.5-3.6,1.6-8.1,3.3-11.5.2-.6.5-1.2.7-1.7.7-1.7,1.6-3.4,2.8-5.1,1.3-1.8.4-4.7-1.5-5.7-2.1-1.1-4.4-.5-5.7,1.5-1.9,2.7-3.3,5.8-4.4,8.9-.3.8-.6,1.6-.8,2.4-1.4,4.4-4.8,8.9-3.3,13,1.9,8.9,14.2,7.8,22.3,8.7.6,0,1.3,0,1.9,0,1.9,0,3.8,0,5.7-.1-.2.3-.4.5-.5.8-.2.3-.4.5-.6.8,0,0,0,.1-.1.2,0,0,0,0,0,0-.4.5-.9,1.1-1.4,1.6-1,1.1-2,2.2-3.1,3.3-4.1,4.3-8.6,8.5-11.4,13.7-1.6,3,.4,5.9,3.6,6.3,2.7.3,5.3.4,8,.5.9,0,1.8,0,2.7,0,2.5-.4,5,0,7.5.5.4,0,.8.2,1.2.2,2.8.5,7.4-.6,8.1,3.7.5,3.5-.7,6.7-2,10-.1.4-.2.9-.4,1.3-.7,2.6-1.4,5.1-1.9,7.7-.4,2.2.6,4.5,2.9,5.1,2,.6,4.7-.7,5.1-2.9Z"/>
        <path className="GraphicActiveColor" d="M86.4,190.2c-11.2,5.5-22.4,11-33.5,16.5,2.8,1.7,5.6,3.3,8.3,5-.9-8.5-1.8-17.1-2.7-25.6-.5-4.3-4.2-7-8.3-5-11.1,5.5-22.2,11-33.4,16.5-6.4,3.2-.9,12.9,5.5,9.7,11.1-5.5,22.2-11,33.4-16.5-2.8-1.7-5.6-3.3-8.3-5,.9,8.5,1.8,17.1,2.7,25.6.5,4.3,4.2,7,8.3,5,11.2-5.5,22.4-11,33.5-16.5,6.5-3.2.9-12.9-5.5-9.7h0Z"/>
        <path className="GraphicActiveColor" d="M97.1,136.1c-13.3-5.4-26.5-10.8-39.8-16.2.8,3.1,1.6,6.2,2.4,9.4,6.7-7.3,13.3-14.6,20-21.9,3-3.3,1.6-7.8-2.4-9.4-13.2-5.4-26.4-10.7-39.6-16.1-2.8-1.1-6.1,1.1-6.9,3.8-.9,3.2,1,5.8,3.8,6.9,13.2,5.4,26.4,10.7,39.6,16.1-.8-3.1-1.6-6.2-2.4-9.4-6.7,7.3-13.3,14.6-20,21.9-3,3.3-1.6,7.7,2.4,9.4,13.3,5.4,26.5,10.8,39.8,16.2,2.8,1.1,6.1-1.1,6.9-3.8.9-3.2-1-5.8-3.8-6.9h0Z"/>
      </g>
      <path fill={walletMeta?.colors?.primary || "#d88568"} d="M898.1,786.2c-186.5,31.3-391.2,20.5-578.4-1.5-7.4-.9-14.6-2-21.5-3.4-43-9.3-88.2-31.4-111.4-71-3.3-5.7-6.3-11.8-8.9-18.3-2.6-6.5-4.9-13.4-6.8-20.8-3.2-12.1-5.5-24.4-7.2-36.5-13.9-151.9-14.4-306.7,14.1-456.6,4.5-13.9,10.8-27.2,19.5-39.1,8.7-11.9,19.8-22.4,34.1-31,35-20.8,74.5-18.4,112.6-22.9,13.2-.9,26.5-1.6,39.8-2.2,118.2-5.4,236.6-6.2,354.9-2.6,83.1,2.5,176.9-9.6,252.1,32.9,80.2,45.4,90.7,134.8,94.4,216.4,3.5,78.4,1.7,157.1-6,235.2-6.2,63.5-12.9,130.3-66.3,174.8-30.4,25.4-70.9,39.1-114.9,46.5Z"/>
      <path fill="#000000" d="M875.5,780.1c-16.3,5.1-32.9,7-49.9,11.3-8.1,1.5-16.1,2.9-24.2,4.1-8,1.2-16,2.2-24,3-10.6,1-21.3,1.9-32,2.7-141.6,10.2-288.9,1.7-427.5-13.5-8.1-.9-16.3-1.8-24.3-2.9-49.6-8.7-105.9-26.8-133-72.9-3.3-5.6-6.3-11.6-8.9-18-2.6-6.4-4.9-13.2-6.8-20.4-3.2-11.9-5.5-24-7.2-35.9-13.9-149.3-14.4-301.4,14.1-448.8,4.5-13.7,10.8-26.7,19.5-38.4s19.8-22.1,34.1-30.5c35-20.4,74.5-18.1,112.6-22.5,13.2-.9,26.5-1.5,39.8-2.1,118.2-5.3,236.6-6.1,354.9-2.6,83.1,2.5,176.9-9.4,252.1,32.3,80.2,44.6,90.7,132.5,94.4,212.7,2.2,48.2,2.3,96.4.2,144.6-.4,9.6-.9,19.3-1.5,28.9-3.1,52.8-4,105.3-19.7,157-18.4,59.8-79.3,95.2-138.8,105.4-7.8,2.2-15.8,4.4-23.8,6.4Z"/>
      <g>
        <path className="GraphicActiveColor" d="M679.8,715.7c-.4,5.1-.7,10.2-1.3,15.3v-.3c0,.6,0,1.6-.1,2.4-.6,6-1.2,12-2,17.9-1.4,12.1-3.1,24.1-5,36.1-3.7,23.8-8,47.4-12.4,70.9-2.5,13.3-5.1,26.6-7.5,40-.8,4.4,1,9.6,4.2,10.7,3.2,1,6.6-1.4,7.4-6.1,8.9-47.6,18.6-95,24.6-143.6.9-7.1,1.7-14.2,2.4-21.4.7-7.2,1.3-14.4,1.8-21.6.3-4.6-3-9.1-6.1-8.9-3.6.2-5.7,3.8-6.1,8.8h0Z"/>
        <path className="GraphicActiveColor" d="M657,903.9c1.4.8,2.8,1.5,4.3,2.2,1.5.7,3,1.2,4.6,1.8,5.6,1.2,13.1,2.9,19.8,2.7,1.7,0,3.3-.2,4.9-.6,1.1-.2,2.4-.6,3.7-1,1.3-.4,2.5-1,3.6-1.6,3.6-1.9,3.6-6,2.1-9.3-2.1-3.6-4.4-6.5-8-8.2-.9-.5-1.9-.9-2.9-1.2-8.9-3-19.2,0-26.1,7.2-.6.6-1.2,1.2-1.8,1.9-.7,1.7-2.5,2.6-3.2,4.2-.4.7-.7,1.3-1.1,2Z"/>
        <path className="GraphicActiveColor" d="M654.4,908.4c3.8,2.2,8,4,12.3,4.9,4.3.9,8.7,1.7,13.1,2.2,4.6.4,9.2.2,13.7-.9,4.2-1.1,9.1-3,11.2-7,4.2-7.9-2.2-17.4-9-21.5-6.9-4.2-16-4.7-23.5-2-4.4,1.6-8.5,4-11.9,7.2-.7.7-1.4,1.4-2,2.1-.5.6-1.1,1.2-1.5,1.8-.1.3-.2.5-.4.7.4-.5.4-.5,0-.1-1.7,1.6-2.9,3.5-3.9,5.7-1.2,2.4-.8,5.7,1.9,7.1,2.3,1.2,5.8.8,7.1-1.9.3-.7.7-1.4,1.1-2,.1-.2.9-1.2,0-.3.2-.2.4-.4.6-.6.7-.7,1.3-1.4,1.9-2.3,0,0,.6-1.1.3-.5-.3.3-.2.2.2-.2.2-.2.5-.5.7-.7.5-.6,1.1-1.1,1.7-1.7.2-.2.5-.4.7-.6,0,0,1.1-.9.5-.5-.6.5.6-.4.6-.4.3-.2.6-.4.9-.6.7-.4,1.4-.9,2.2-1.2.4-.2.8-.4,1.2-.6-.2,0-.9.4,0,0,.7-.3,1.4-.5,2.1-.7.7-.2,1.4-.4,2.1-.5.3,0,.6-.1.9-.2.6,0,.6,0,0,0,.3,0,.6,0,.9,0,1.3-.1,2.6-.1,3.9,0,.2,0,1.6.3.3,0,.3,0,.6,0,.9.2.9.2,1.7.4,2.5.7-.1,0,1.5.5.8.3-.6-.3.9.5.8.4.7.3,1.3.7,1.9,1.1.8.5.1.1,0,0,.3.3.7.6,1,.9.2.2.4.4.6.6.1.1,1.1,1.3.7.8-.5-.6.4.6.4.6.2.3.3.5.5.8.3.4.5.8.7,1.2.6.9.1.1,0-.1.1.3.7,1.5.5,1.8,0-.2,0-.4,0-.6,0,.2,0,.5,0,.7,0,.1,0,.2,0,.4,0,.6,0,.5,0-.3,0,0-.1.7-.2.7,0-.2.2-.4.2-.6-.1.2-.2.4-.4.6.5-.9.3-.5,0-.2.1-.1.3-.2.4-.3-.2.2-.5.3-.7.4-.3.2-.6.3-.8.5,0,0-1.5.7-.6.3-.8.3-1.7.6-2.5.8-.9.2-1.7.4-2.6.6,0,0-1.7.2-.8.1-.4,0-.7,0-1.1,0-2,.1-3.9,0-5.9,0-1,0-2-.2-2.9-.3-1-.1,1.2.2-.5,0-.5,0-1-.2-1.6-.3-2-.3-4-.7-6-1.2-1.8-.4-3.5-.8-5.3-1.5-1.6-.6.4.2-.5-.2-.6-.2-1.1-.5-1.7-.8-1-.5-1.9-1-2.8-1.5-2.4-1.3-5.8-.6-7.1,1.9-1.3,2.5-.7,5.6,1.9,7.1Z"/>
      </g>
      <g>
        <path className="GraphicActiveColor" d="M506.6,715.9c.2,3,.5,6,.7,9,.1,1.4.2,2.8.4,4.3,0,.6.1,1.3.2,1.9-.1-1.2.2,1.6.2,1.9.6,6,1.2,12,2,17.9,1.4,12.1,3.1,24.1,5,36.1,3.7,23.8,8,47.4,12.4,70.9,2.5,13.3,5.1,26.6,7.5,40,.8,4.4-1,9.6-4.2,10.7-3.2,1-6.6-1.4-7.4-6.1-8.9-47.6-18.6-95-24.6-143.6-.9-7.1-1.7-14.2-2.4-21.4-.7-7.2-1.3-14.3-1.8-21.5-.3-4.5,3-8.9,6-8.7,3.6.2,5.7,3.8,6.1,8.7h0Z"/>
        <path className="GraphicActiveColor" d="M529.5,903.9c-1.4.8-2.8,1.5-4.3,2.2-1.5.7-3,1.2-4.6,1.8-5.6,1.2-13.1,2.9-19.8,2.7-1.7,0-3.3-.2-4.9-.6-1.1-.2-2.4-.6-3.7-1-1.3-.4-2.5-1-3.6-1.6-3.6-1.9-3.6-6-2.1-9.3,2.1-3.6,4.4-6.5,8-8.2.9-.5,1.9-.9,2.9-1.2,8.9-3,19.2,0,26.1,7.2.6.6,1.2,1.2,1.8,1.9.7,1.7,2.5,2.6,3.2,4.2.4.7.7,1.3,1.1,2Z"/>
        <path className="GraphicActiveColor" d="M532.1,908.4c-3.8,2.2-8,4-12.3,4.9-4.3.9-8.7,1.7-13.1,2.2-4.6.4-9.2.2-13.7-.9-4.2-1.1-9.1-3-11.2-7-4.2-7.9,2.2-17.4,9-21.5,6.9-4.2,16-4.7,23.5-2,4.4,1.6,8.5,4,11.9,7.2.7.7,1.4,1.4,2,2.1.5.6,1.1,1.2,1.5,1.8.1.3.2.5.4.7-.4-.5-.4-.5,0-.1,1.7,1.6,2.9,3.5,3.9,5.7,1.2,2.4.8,5.7-1.9,7.1-2.3,1.2-5.8.8-7.1-1.9-.3-.7-.7-1.4-1.1-2-.1-.2-.9-1.2,0-.3-.2-.2-.4-.4-.6-.6-.7-.7-1.3-1.4-1.9-2.3,0,0-.6-1.1-.3-.5.3.3.2.2-.2-.2-.2-.2-.5-.5-.7-.7-.5-.6-1.1-1.1-1.7-1.7-.2-.2-.5-.4-.7-.6,0,0-1.1-.9-.5-.5.6.5-.6-.4-.6-.4-.3-.2-.6-.4-.9-.6-.7-.4-1.4-.9-2.2-1.2-.4-.2-.8-.4-1.2-.6.2,0,.9.4,0,0-.7-.3-1.4-.5-2.1-.7-.7-.2-1.4-.4-2.1-.5-.3,0-.6-.1-.9-.2-.6,0-.6,0,0,0-.3,0-.6,0-.9,0-1.3-.1-2.6-.1-3.9,0-.2,0-1.6.3-.3,0-.3,0-.6,0-.9.2-.9.2-1.7.4-2.5.7.1,0-1.5.5-.8.3.6-.3-.9.5-.8.4-.7.3-1.3.7-1.9,1.1-.8.5-.1.1,0,0-.3.3-.7.6-1,.9-.2.2-.4.4-.6.6-.1.1-1.1,1.3-.7.8.5-.6-.4.6-.4.6-.2.3-.3.5-.5.8-.3.4-.5.8-.7,1.2-.6.9-.1.1,0-.1-.1.3-.7,1.5-.5,1.8,0-.2,0-.4,0-.6,0,.2,0,.5,0,.7,0,.1,0,.2,0,.4,0,.6,0,.5,0-.3,0,0,.1.7.2.7,0-.2-.2-.4-.2-.6.1.2.2.4.4.6-.5-.9-.3-.5,0-.2-.1-.1-.3-.2-.4-.3.2.2.5.3.7.4.3.2.6.3.8.5,0,0,1.5.7.6.3.8.3,1.7.6,2.5.8.9.2,1.7.4,2.6.6,0,0,1.7.2.8.1.4,0,.7,0,1.1,0,2,.1,3.9,0,5.9,0,1,0,2-.2,2.9-.3,1-.1-1.2.2.5,0,.5,0,1-.2,1.6-.3,2-.3,4-.7,6-1.2,1.8-.4,3.5-.8,5.3-1.5,1.6-.6-.4.2.5-.2.6-.2,1.1-.5,1.7-.8,1-.5,1.9-1,2.8-1.5,2.4-1.3,5.8-.6,7.1,1.9,1.3,2.5.7,5.6-1.9,7.1Z"/>
      </g>
      <path fill={walletMeta?.colors?.primary || "#d88568"} style={{fill: walletMeta?.colors?.primary || "#d88568"}}  d="M851.8,803.5c-109.3,19-220.4,21.7-331,19.1-51.9-1.2-104.9-6.6-156.7-10.9-12.6-1-26.1-2-39.9-3.2-6.9-.6-13.9-1.3-20.9-2.1-59.2-8.6-125.6-28-156.6-82.7-3.3-6-6.2-12.2-8.7-18.6-2.5-6.4-4.6-12.9-6.3-19.4-3.2-12.4-5.5-25-7.1-37.4-12.6-142.2-13.4-285.5,7-427.1,6.5-45,19.4-87.2,60-112.5,33.6-20.7,76.5-21,114.8-23.2,48.5-2.8,97.1-4.7,145.7-6,89.6-2.3,179.2-1.9,268.7.8,75.3,2.2,155.2-5.9,223.1,33.8,79.5,46.5,89.9,138.1,93.5,221.7,3.5,80.3,1.6,160.9-6,241-6.2,65-12.8,133.5-65.7,179-30.1,26-70.2,40.1-113.8,47.7Z"/>
      <g opacity="0.5">
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M248.3,147.4c3.9-.3,8-1,11.8-2,1.7-.5,3.6-1.1,5.3-2,1.7-1,3.1-2.1,3.8-4,1.1-2.9.5-6.7-2.3-8.5-1.3-.8-2.8-1.1-4.3-1-1.7,0-3.4.3-5.1.5-2.9.4-5.9.9-8.7,1.6-2.5.7-5,1.2-7,3-2.2,2-2.3,5.2-1.6,7.9.9,3.1,3.3,4.6,6.3,4.6.6,0,1.3,0,1.9,0Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M295.4,138.5c4,.3,8.2,0,12-.8,3.5-.7,7.9-1.5,9.6-5.1,1.3-2.8,1.1-6.7-1.5-8.6-1.2-.9-2.7-1.3-4.2-1.4-1.7-.1-3.4-.1-5.1,0-2.9,0-5.9.4-8.8.8-2.5.3-5.1.6-7.2,2.1-2.4,1.7-2.9,5-2.5,7.7.5,3.1,2.7,4.9,5.7,5.2.6,0,1.3.1,1.9.1Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M343.3,133.7c4,.5,8.2.4,12.1,0,3.6-.4,8-1.1,9.9-4.6,1.5-2.7,1.4-6.6-1.1-8.7-1.1-1-2.6-1.4-4.1-1.6-1.7-.2-3.4-.3-5.1-.3-2.9-.1-5.9,0-8.8.3-2.5.2-5.1.3-7.3,1.6-2.5,1.5-3.2,4.7-3,7.5.3,3.2,2.4,5,5.4,5.6.6.1,1.3.2,1.9.3Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M391.7,131.1c4,.6,8.2.6,12.2.2,3.6-.3,8.1-1,10-4.4,1.5-2.7,1.5-6.6-1-8.7-1.1-1-2.6-1.4-4-1.6-1.7-.2-3.4-.3-5-.4-2.9-.2-5.8,0-8.7,0-2.5.1-5,.1-7.3,1.4-2.5,1.4-3.4,4.6-3.2,7.4.2,3.2,2.2,5.1,5.2,5.8.6.1,1.3.2,1.9.3Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M440.3,129c4,.6,8.2.5,12.1,0,3.6-.5,8-.9,10-4.3,1.5-2.6,1.5-6.5-1-8.7-1.1-1-2.6-1.5-4.1-1.7-1.7-.3-3.4-.3-5.1-.4-2.9-.1-5.8,0-8.8.2-2.5.2-5,.2-7.3,1.5-2.5,1.5-3.3,4.6-3.2,7.4.2,3.2,2.2,5.1,5.3,5.7.6.1,1.3.2,1.9.3Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M488.7,127.6c3.9.7,8.2.8,12.1.5,3.6-.3,8.1-.8,10.1-4.2,1.6-2.6,1.7-6.5-.7-8.7-1.1-1-2.5-1.5-4-1.7-1.7-.3-3.4-.4-5-.5-2.9-.2-5.9-.2-8.8-.1-2.5,0-5.1,0-7.4,1.2-2.6,1.4-3.4,4.5-3.3,7.3.1,3.2,2.1,5.2,5.1,5.9.6.1,1.3.3,1.9.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M537.2,127.1c3.9.8,8.2.9,12.1.7,3.6-.2,8.1-.6,10.2-4,1.6-2.6,1.8-6.5-.6-8.7-1.1-1-2.5-1.5-4-1.8-1.7-.3-3.4-.4-5-.6-2.9-.3-5.8-.3-8.7-.3-2.5,0-5,0-7.4,1.1-2.6,1.3-3.5,4.5-3.5,7.2,0,3.2,2,5.2,5,6,.6.2,1.3.3,1.9.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M585.8,127.4c3.9.8,8.2,1,12.1.9,3.6-.2,8.1-.5,10.2-3.9,1.7-2.6,1.8-6.5-.5-8.8-1.1-1-2.5-1.6-4-1.8-1.6-.3-3.3-.5-5-.7-2.9-.3-5.8-.4-8.7-.4-2.5,0-5-.1-7.4,1-2.6,1.3-3.6,4.4-3.6,7.2,0,3.2,1.9,5.2,4.9,6,.6.2,1.3.3,1.9.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M634.3,128.2c3.9.9,8.2,1.1,12.1,1,3.6-.1,8.1-.5,10.3-3.8,1.7-2.6,1.9-6.5-.4-8.8-1-1-2.5-1.6-3.9-1.9-1.6-.3-3.3-.5-5-.7-2.9-.4-5.8-.5-8.7-.5-2.5,0-5-.2-7.4,1-2.6,1.3-3.6,4.4-3.7,7.1,0,3.2,1.9,5.3,4.8,6.1.6.2,1.2.3,1.9.5Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M683,129.4c4,.8,8.3,1,12.2.8,3.6-.2,8.2-.7,10.2-4,1.6-2.6,1.7-6.5-.7-8.7-1.1-1-2.5-1.5-4-1.8-1.6-.3-3.3-.4-5-.6-2.9-.3-5.8-.3-8.7-.3-2.5,0-5-.1-7.3,1-2.6,1.3-3.6,4.4-3.7,7.1,0,3.2,1.9,5.3,4.9,6.1.6.2,1.3.3,1.9.5Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M731.8,129.3c3.9.8,8.2.9,12.1.7,3.6-.2,8.1-.6,10.2-4,1.6-2.6,1.8-6.5-.5-8.8-1.1-1-2.5-1.6-4-1.8-1.7-.3-3.4-.5-5-.6-2.9-.3-5.8-.3-8.8-.3-2.5,0-5.1,0-7.4,1.2-2.6,1.4-3.5,4.5-3.5,7.2,0,3.2,2,5.2,5,6,.6.2,1.3.3,1.9.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M780,130c3.9,1,8,1.3,11.9,1.4,3.5,0,8,0,10.4-3.2,1.8-2.4,2.4-6.3.2-8.8-1-1.1-2.4-1.7-3.9-2.1-1.6-.4-3.4-.7-5-1-2.9-.5-5.9-.7-8.8-.8-2.5-.1-5.1-.3-7.5.8-2.7,1.2-3.7,4.3-3.8,7.1,0,3.2,1.8,5.3,4.7,6.2.6.2,1.2.4,1.9.5Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M827.5,134.9c1.8.7,3.8,1.3,5.7,1.8,1.9.5,3.9.8,5.8,1.2,1.7.3,3.7.5,5.6.4,1.9-.1,3.7-.6,5.1-2,2.2-2.1,3.4-5.9,1.6-8.6-.8-1.3-2.1-2.1-3.5-2.7-1.6-.7-3.3-1.2-4.9-1.7-2.8-1-5.8-1.5-8.7-2.1-2.5-.5-5.1-1-7.6-.2-2.8.9-4.2,3.9-4.6,6.6-.4,3.2,1.2,5.4,3.9,6.7.6.3,1.2.5,1.8.7Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M873,147.2c1.6,1.1,3.4,2,5.1,2.9,1.8.9,3.6,1.7,5.3,2.3,3.2,1.3,7.3,2.8,10.6.9,2.6-1.6,4.7-4.9,3.6-8-.5-1.4-1.6-2.6-2.8-3.5-1.4-1-2.9-1.9-4.4-2.8-2.6-1.5-5.4-2.8-8.2-3.9-2.4-.9-4.8-2-7.5-1.7-3,.4-4.9,3-5.8,5.6-1,3,0,5.6,2.5,7.3.5.4,1,.7,1.6,1.1Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M913.6,169.8c2.4,3,5.5,5.6,8.3,8,.7.5,1.4,1.1,2.1,1.6.7.6,1.5,1.1,2.3,1.5,1.6.9,3.4,1.3,5.4.9,2.9-.6,6-3.1,6-6.4,0-1.5-.7-2.9-1.6-4.2-.5-.7-1-1.4-1.6-2.1-.6-.7-1.2-1.3-1.8-2-1-1.1-2.1-2.2-3.2-3.3-1.1-1-2.3-2-3.5-3-1-.8-2-1.7-3.1-2.4-1.1-.7-2.3-1.2-3.6-1.5-3-.5-5.5,1.4-7.1,3.7-1.8,2.6-1.5,5.4.4,7.7.4.5.8,1,1.2,1.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M944.6,203.9c1.4,3.6,3.3,7.1,5.2,10.4.4.7,1,1.5,1.5,2.3.5.8,1.1,1.5,1.7,2.2,1.3,1.3,2.9,2.3,4.8,2.6,3,.3,6.6-1.1,7.7-4.3.4-1.4.2-3-.2-4.5-.5-1.7-1.1-3.3-1.8-4.9-.6-1.4-1.3-2.8-1.9-4.1-.7-1.3-1.5-2.6-2.3-4-1.3-2.3-2.7-4.5-5.1-5.9-2.6-1.5-5.7-.5-8,1.1-1.3.9-2.1,2.1-2.4,3.3-.4,1.3-.3,2.7.2,4.1.2.6.4,1.2.6,1.7Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M963.8,246.3c.2,1.9.5,3.9,1,5.9.5,1.9.9,3.9,1.5,5.7.6,1.7,1.2,3.5,2.1,5.2.9,1.6,2.3,3,4.1,3.6,2.9,1,6.7.4,8.4-2.5.8-1.3.9-2.8.8-4.4-.1-1.7-.3-3.5-.6-5.2-.5-3-1.2-5.9-2.1-8.8-.4-1.2-.7-2.5-1.2-3.7-.5-1.2-1.2-2.3-2.1-3.2-2.1-2.1-5.4-2-8-1.1-3,1.1-4.3,3.5-4.2,6.5,0,.6,0,1.3.2,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M973.7,292.7c-.3,4,.1,8.1.7,11.9.6,3.5,1.4,7.9,5,9.6,2.7,1.4,6.6,1.2,8.7-1.4.9-1.2,1.3-2.7,1.4-4.2.1-1.7.1-3.4,0-5.1,0-3-.3-5.9-.7-8.9-.3-2.5-.6-5.1-2.1-7.3-1.7-2.4-4.9-2.9-7.6-2.5-3.1.5-4.9,2.7-5.2,5.7,0,.6-.1,1.3-.2,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M977.9,340.6c-.6,4-.5,8.2-.1,12.1.3,3.6,1,8,4.4,10,2.7,1.5,6.6,1.5,8.7-.9,1-1.1,1.4-2.6,1.6-4.1.2-1.7.3-3.4.4-5.1.2-2.9,0-5.9,0-8.8-.1-2.5-.2-5.1-1.5-7.3-1.5-2.5-4.7-3.3-7.4-3.1-3.2.2-5.1,2.3-5.7,5.3-.1.6-.2,1.3-.3,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M979.6,389c-.7,3.9-.8,8.2-.5,12.1.2,3.6.7,8.1,4.1,10.1,2.6,1.6,6.5,1.7,8.7-.7,1-1.1,1.5-2.5,1.8-4,.3-1.7.4-3.4.6-5,.2-2.9.2-5.9.2-8.8,0-2.5,0-5.1-1.3-7.4-1.4-2.6-4.5-3.5-7.3-3.4-3.2,0-5.2,2.1-5.9,5.1-.1.6-.3,1.3-.4,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M979.7,437.4c-.8,3.9-1.1,8.2-.9,12.1.1,3.6.5,8.1,3.8,10.3,2.6,1.7,6.5,1.9,8.8-.4,1-1,1.6-2.5,1.9-3.9.3-1.6.5-3.4.7-5,.3-2.9.4-5.8.5-8.8,0-2.5.1-5.1-1-7.4-1.3-2.6-4.4-3.6-7.2-3.6-3.2,0-5.2,1.9-6,4.9-.2.6-.3,1.2-.4,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M978.3,485.8c-1,3.9-1.3,8.1-1.3,12,0,3.6.2,8.1,3.4,10.4,2.5,1.8,6.4,2.1,8.8,0,1.1-1,1.7-2.4,2-3.9.4-1.6.6-3.3.9-5,.5-2.9.6-5.8.7-8.7,0-2.5.3-5.1-.8-7.4-1.2-2.6-4.3-3.7-7.1-3.8-3.2-.1-5.3,1.8-6.2,4.7-.2.6-.4,1.2-.5,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M975.3,534.1c-1.1,3.9-1.6,8.1-1.7,12,0,3.6,0,8.1,3.1,10.5,2.5,1.8,6.3,2.3,8.8.2,1.1-1,1.8-2.4,2.1-3.8.5-1.6.8-3.3,1-5,.5-2.9.8-5.8,1-8.7.2-2.5.5-5-.5-7.4-1.1-2.7-4.2-3.9-6.9-4.1-3.2-.2-5.4,1.6-6.3,4.5-.2.6-.4,1.2-.6,1.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M970.8,582.3c-1.2,3.8-1.8,8-2.1,11.9-.2,3.5-.4,8,2.6,10.5,2.4,2,6.2,2.7,8.7.6,1.2-.9,1.9-2.3,2.3-3.7.5-1.6.9-3.3,1.3-5,.6-2.9,1-5.8,1.3-8.7.3-2.5.6-5-.3-7.5-1.1-2.7-4.1-4-6.8-4.3-3.2-.3-5.4,1.4-6.5,4.3-.2.6-.4,1.2-.6,1.8Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M963.5,629.6c-1.6,3.6-2.7,7.5-3.5,11.3-.4,1.7-.8,3.6-.7,5.5,0,1.9.4,3.7,1.7,5.2,2,2.3,5.6,3.7,8.5,2.1,1.3-.7,2.2-2,2.9-3.4.8-1.5,1.4-3.2,2-4.8,1-2.8,1.9-5.7,2.5-8.6.6-2.5,1.2-5,.6-7.6-.8-2.9-3.7-4.4-6.4-4.9-3.1-.6-5.5.9-6.9,3.6-.3.6-.6,1.1-.8,1.7Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M948.3,673.9c-1.1,1.5-2.3,3.1-3.3,4.8-1,1.7-2,3.3-2.9,5-.8,1.5-1.7,3.2-2.2,5-.5,1.7-.6,3.6.2,5.4.6,1.4,1.7,2.7,3,3.6,1.3.9,2.9,1.3,4.5,1,1.5-.3,2.7-1.3,3.8-2.4,1.2-1.3,2.3-2.7,3.3-4.1,1.8-2.5,3.4-5.1,4.8-7.8,1.3-2.3,2.5-4.7,2.5-7.4,0-3-2.5-5.2-5.1-6.3-1.5-.6-2.8-.7-4.1-.4-1.2.4-2.4,1.1-3.4,2.2-.4.5-.8.9-1.2,1.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M921,710.8c-1.6,1-3.2,2.1-4.8,3.3-1.5,1.2-3,2.4-4.4,3.7-.6.6-1.3,1.2-1.9,1.9-.7.6-1.3,1.3-1.8,2.1-1.1,1.5-1.8,3.2-1.7,5.2.2,3,2.2,6.4,5.5,6.9,1.5.2,3-.3,4.4-1,.8-.4,1.6-.8,2.3-1.3.8-.5,1.5-1,2.2-1.4,1.3-.8,2.5-1.7,3.8-2.7,1.2-1,2.3-2,3.5-3,1-.9,2-1.8,2.8-2.8.9-1,1.6-2.1,2-3.3.9-2.9-.6-5.8-2.6-7.6-1.2-1.1-2.4-1.6-3.7-1.7-1.3-.1-2.6.3-3.9,1-.5.3-1.1.6-1.6.9Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M882.6,736.6c-3.8.9-7.6,2.4-11,4-.8.4-1.6.8-2.4,1.2-.8.4-1.6.9-2.4,1.5-1.5,1.1-2.7,2.6-3.1,4.5-.6,3,.5,6.7,3.5,8,1.4.6,2.9.5,4.4.3,1.7-.3,3.4-.8,5.1-1.3,1.4-.4,2.9-.9,4.3-1.5,1.4-.5,2.8-1.2,4.2-1.8,1.2-.5,2.4-1,3.5-1.7,1.1-.7,2.1-1.5,2.9-2.6,1.8-2.4,1.2-5.6,0-8-1.5-2.8-4.1-3.8-7.1-3.2-.6.1-1.2.3-1.8.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M838.1,752c-2,.1-4,.3-5.9.6-2,.3-3.9.8-5.8,1.3-1.7.4-3.6,1-5.3,1.9-1.7.9-3.1,2.1-3.8,3.9-1.1,2.9-.6,6.7,2.1,8.5,1.2.8,2.8,1,4.3,1,1.7,0,3.4-.2,5.1-.4,3-.3,5.9-.9,8.8-1.6,2.5-.6,5-1.1,7-2.9,2.2-1.9,2.4-5.2,1.6-7.9-.8-3.1-3.2-4.5-6.3-4.6-.6,0-1.3,0-1.9,0Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M790.9,760.5c-4-.2-8.2.2-12,1-3.5.7-7.9,1.7-9.5,5.3-1.3,2.8-.9,6.7,1.7,8.6,1.2.9,2.7,1.2,4.2,1.3,1.7,0,3.4,0,5.1,0,2.9-.1,5.8-.5,8.7-.9,2.5-.4,5-.6,7.1-2.2,2.4-1.7,2.9-4.9,2.4-7.7-.5-3.1-2.7-4.9-5.8-5.2-.6,0-1.3-.1-1.9-.1Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M742.9,766.6c-4-.4-8.2-.1-12.1.5-3.5.5-8,1.4-9.7,4.9-1.4,2.8-1.2,6.6,1.4,8.7,1.2.9,2.7,1.3,4.1,1.4,1.7.1,3.4.1,5.1.1,2.9,0,5.9-.3,8.8-.6,2.5-.3,5.1-.4,7.2-1.9,2.4-1.6,3-4.8,2.7-7.6-.4-3.2-2.5-5-5.6-5.4-.6,0-1.3-.2-1.9-.2Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M694.7,770.8c-4-.5-8.2-.4-12.1,0-3.6.4-8,1.1-9.9,4.6-1.5,2.7-1.4,6.6,1.1,8.7,1.1,1,2.6,1.4,4.1,1.6,1.7.2,3.4.3,5.1.3,2.9,0,5.9,0,8.8-.3,2.5-.2,5.1-.3,7.3-1.6,2.5-1.5,3.2-4.7,3-7.4-.3-3.2-2.4-5.1-5.4-5.6-.6-.1-1.3-.2-1.9-.3Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M646.3,773.3c-4-.6-8.2-.7-12.1-.3-3.6.3-8.1.9-10.1,4.3-1.5,2.7-1.6,6.6.8,8.7,1.1,1,2.6,1.5,4,1.7,1.7.3,3.4.4,5.1.5,2.9.2,5.9.1,8.8,0,2.5,0,5.1-.1,7.3-1.4,2.5-1.4,3.4-4.6,3.2-7.3-.2-3.2-2.2-5.1-5.2-5.8-.6-.1-1.3-.3-1.9-.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M597.9,774.4c-3.9-.7-8.2-.9-12.1-.6-3.6.2-8.1.7-10.2,4-1.6,2.6-1.8,6.5.6,8.7,1.1,1,2.5,1.5,4,1.8,1.7.3,3.4.4,5,.6,2.9.3,5.8.3,8.8.3,2.5,0,5.1,0,7.4-1.2,2.6-1.4,3.5-4.5,3.5-7.3,0-3.2-2-5.2-5-5.9-.6-.2-1.3-.3-1.9-.4Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M549.6,774.1c-3.9-1-8.1-1.3-12-1.3-3.6,0-8.1.3-10.4,3.5-1.7,2.5-2,6.4.2,8.8,1,1.1,2.5,1.6,3.9,2,1.6.4,3.3.6,5,.8,2.9.4,5.8.6,8.8.7,2.5,0,5.1.3,7.4-.8,2.7-1.3,3.7-4.4,3.7-7.1,0-1.6-.5-2.9-1.3-3.9-.8-1-2-1.7-3.5-2.2-.6-.2-1.2-.4-1.9-.5Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M501.1,771.8c-3.9-1-8.1-1.3-12.1-1.3-3.6,0-8.1.2-10.4,3.5-1.8,2.5-2.1,6.4.1,8.8,1,1.1,2.4,1.7,3.9,2,1.6.4,3.3.6,5,.9,2.9.4,5.8.6,8.7.8,2.5.1,5,.3,7.4-.7,2.6-1.2,3.8-4.3,3.9-7,.1-3.2-1.7-5.3-4.7-6.2-.6-.2-1.2-.4-1.9-.5Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M452.7,769c-3.9-1-8.1-1.5-12-1.6-3.6,0-8.1,0-10.4,3.2-1.8,2.5-2.2,6.3,0,8.8,1,1.1,2.4,1.7,3.8,2.1,1.6.4,3.3.7,5,1,2.9.5,5.8.7,8.7.9,2.5.1,5,.4,7.4-.6,2.7-1.2,3.8-4.2,4-7,.2-3.2-1.6-5.3-4.6-6.3-.6-.2-1.2-.4-1.9-.6Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M404.4,765.1c-3.8-1.1-8-1.8-11.9-1.9-3.6-.1-8.1-.2-10.5,2.9-1.9,2.4-2.5,6.3-.4,8.8,1,1.1,2.4,1.8,3.8,2.2,1.6.5,3.3.8,5,1.1,2.9.6,5.8.9,8.7,1.2,2.5.2,5,.6,7.5-.4,2.7-1.1,4-4.1,4.2-6.9.3-3.2-1.5-5.4-4.4-6.4-.6-.2-1.2-.4-1.8-.6Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M356.3,759.5c-3.8-1.3-7.9-2.1-11.8-2.4-3.6-.3-8.1-.6-10.6,2.4-2,2.3-2.8,6.2-.8,8.7.9,1.2,2.3,1.9,3.7,2.4,1.6.6,3.3,1,4.9,1.4,2.9.7,5.8,1.1,8.7,1.5,2.5.3,5,.8,7.5,0,2.7-1,4.1-4,4.5-6.7.4-3.2-1.3-5.4-4.1-6.6-.6-.2-1.2-.5-1.8-.7Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M308.8,751.7c-3.7-1.5-7.7-2.5-11.6-3-1.8-.2-3.7-.5-5.7-.3-1.9.2-3.7.6-5.1,2-2.2,2.1-3.3,5.9-1.5,8.6.8,1.2,2.1,2.2,3.5,2.7,1.6.6,3.2,1.1,4.9,1.6,2.8.9,5.7,1.5,8.6,2,2.5.5,5,1.1,7.5.4,2.8-.8,4.3-3.7,4.8-6.4.5-3.1-1-5.5-3.7-6.8-.6-.3-1.2-.5-1.8-.8Z"/>
        <path fill={walletMeta?.colors?.secondary || "#000000"} d="M261.9,740.7c-3.6-1.8-7.6-3-11.4-3.8-3.5-.8-7.9-1.6-10.8,1.1-2.3,2.1-3.5,5.7-1.9,8.6.7,1.3,2,2.2,3.4,2.8,1.5.7,3.1,1.4,4.7,2,2.7,1.1,5.6,1.9,8.4,2.6,2.4.6,4.9,1.4,7.4.8,2.8-.6,4.6-3.4,5.2-6.1.8-3.1-.6-5.6-3.3-7-.6-.3-1.1-.6-1.7-.9Z"/>
      </g>
      <g opacity="0.3">
        <path fill={walletMeta?.colors?.secondary || "#ffffff"} d="M206.3,218.7c-21,19.1-30.7,59.5-20.1,88.1,2.1,5.7,5,11,8.9,15.5,4.4,4.3,9.5,8.8,15.8,8.2,41.6-1.4,50.6-60.8,45.7-92.5-2.5-16.3-15-34.2-33.5-27.9-6.1,1.3-11.9,4.3-16.7,8.6Z"/>
        <path fill={walletMeta?.colors?.secondary || "#ffffff"} d="M192.7,367.3c-8.3,9.1-11.8,21.8-9.7,34.1,3.1,15.7,15.8,36.8,33.2,30.4,19.9-7.6,24.5-34.2,19.3-53.9-2.4-9-8.5-16.8-17.6-20-9.4-3-18.6,1.9-25.2,9.4Z"/>
      </g>

      <g>
        <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M949.3,571.5c-1.3,9.7-3.1,19.1-5.7,28.4v-.4c-3.8,12.7-8.5,25.4-15.8,36.4l.5-.3c-12.1,19.2-29.3,34.8-49.8,44.9-2.6,1.3-5.2,2.6-7.8,3.8-1.4.6-2.8,1.3-4.2,1.9-.7.3-1.3.6-2,.8-.7.3.2,0,.3-.1-.5.2-1,.4-1.5.6-3.1,1.2-5.7,4.2-4.6,7.8.9,3,4.4,5.9,7.8,4.6,10.5-4.1,20.6-9.1,30.1-15,38.7-22.6,59-66.8,63.7-110,.1-3.6-1.3-7.8-5.7-8.1-2.8,0-5.1,2.1-5.3,4.7h0Z"/>
        <g>
          <g>
            <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M858,692.8c.5,1.6.9,3.3,1,4.9.1,1.6,0,3.2-.2,4.8-1.8,8.8-7,17.5-16.4,20.7-1.4.5-2.9.8-4.4,1-9.3,2-19-3.9-21-12.7-3-13.9,12.3-23.4,25.5-22.7,2.2,0,4.4.2,6.5.7,2,.4,3.9,1.1,5.8,2,.9.4,2,.9,3.1,1.4Z"/>
            <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M852.4,694.2c.4,1.2.7,2.4.9,3.7-.1-1.1,0,.9,0,.9,0,.6,0,1.2,0,1.8,0,.2-.3,2,0,.7,0,.5-.2.9-.3,1.3-.2.9-.5,1.8-.8,2.7-.2.4-.3.9-.5,1.3,0,.2-.7,1.6-.1.3-.4.8-.8,1.7-1.3,2.5-.4.7-.8,1.3-1.2,2-.3.4-.5.8-.8,1.1.9-1.1-.4.4-.6.6-.6.7-1.3,1.3-2,1.9-.2.2-.5.4-.7.6,1.1-.8-.2,0-.4.2-.8.5-1.7,1-2.5,1.4-.2,0-1.7.6-.4.2-.7.2-1.4.5-2.1.6-.9.2-1.8.4-2.7.6-.5,0-.9.2-1.4.2,1.5-.2,0,0-.3,0-.9,0-1.8,0-2.8-.1,1.5.2,0,0-.3,0-.4-.1-.9-.2-1.3-.4-.4-.1-.9-.3-1.3-.5-1.4-.5,1,.6-.3-.1-.8-.5-1.5-.9-2.3-1.4-1.2-.8.8.8-.2-.2-.3-.3-.5-.5-.8-.8-.3-.3-.5-.5-.8-.8-.2-.2-.4-.4-.6-.7.4.6.5.6,0,.1-.5-.8-.9-1.5-1.3-2.3-.6-1.3.3,1.1,0-.3,0-.4-.2-.7-.3-1.1,0-.4-.1-.7-.2-1.1-.3-1.4,0,1.2,0-.2,0-.6-.3-2.4.1-2.9,0,.2,0,.5-.1.7,0-.3.1-.5.2-.8,0-.4.2-.8.3-1.1,0-.2.2-.5.3-.7.4-1.3-.6,1.1,0,0,.4-.7.8-1.4,1.2-2,.2-.3.7-1.4,0-.1.2-.4.7-.9,1.1-1.2.5-.5,1-1,1.5-1.4.3-.3.6-.5,1-.8-1.2.9,0,0,.2,0,1.4-.9,3-1.7,4.5-2.4-1.4.6,0,0,.2,0,.5-.2,1.1-.4,1.7-.5,1-.3,2-.5,3-.7.3,0,.6-.1.9-.1.3,0,.6,0,.9-.1-.8,0-.9.1-.2,0,1,0,2,0,3,0,1.3,0,2.7,0,4,.2.2,0,1.1.2.2,0,.8.1,1.6.3,2.3.5,3.1.8,4.6,1.7,7.7,3.1,2.8,1.2,6.5-1.1,7.2-3.9.8-3.3-.9-5.9-3.9-7.2-.3-.1-.6-.2-.9-.4-.9-.4.6.3-.2,0-.7-.3-1.3-.6-2-.9-1.5-.7-3.1-1.3-4.7-1.7-3-.8-6.1-1.2-9.2-1.2-4.3,0-8.7.5-12.8,1.9-8.3,3-16.5,9.1-18.4,18.2-2.1,9.9,2.8,20.1,11.9,24.5,9.8,4.8,21.7,2.6,30-4.2,9-7.3,13.8-21,10.2-32.1-.9-2.9-3.9-5.1-7-4.2-2.8.9-5.1,3.9-4.2,7Z"/>
          </g>
          <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M840.9,682.9c-.9-.2-1.9-.3-2.8-.5-.3,0-.5-.1-.8-.2.2,0,.3.1.5.2.2.3,1.3,1.6,1.1,1.8,0-.2-.1-.4-.1-.5,0-.3,0-.2,0,.2,0,.5,0,.5,0,.2,0-.2,0-.4,0-.6,0-1,0,.4,0,.4,0-.1,0-.2,0-.4.2-.5.2-.5,0,0-.2.4-.2.5,0,.2,0-.2.2-.3.3-.5.1.2-1,1-1.1,1.1.9-.5-.9.5-.3.1.3-.2-.6,0,0,0,.4,0,.9,0,1.3,0,.5,0,.6,0,0,0,.9.1,1.7.4,2.5.7.4.1.6.2,0,0,.4.2.8.4,1.2.6.7.4,1.4.8,2,1.3.3.2.6.4.9.6-.8-.6.2.1.3.3.6.5,1.2,1.1,1.7,1.6,2.6,2.5,5.1,5.2,7.3,8.1,2.8-2.7,5.5-5.3,8.3-8-2.9-3.8-7.7-6.3-12.5-6.9-2.2-.3-4.4-.5-6.6-.6-.9,0-1.8,0-2.7,0-1.8,0-3.3.6-4.9,1.3-2.7,1.2-3.8,5.3-2.2,7.8,1.7,2.8,4.9,3.6,7.8,2.2,1.3-.6-.9.2-.9.1,0,0,1,0,1.1,0,.8,0,1.7,0,2.5,0,1.7,0,3.5.3,5.2.5-.6,0-.1,0,.2,0,.4.1.7.2,1.1.3.4.1.7.2.1,0,.3.1.6.3.9.5.3.2.6.4.9.5,1.2.8-.2-.4.3.2.5.6,1.1,1.1,1.6,1.8,1.8,2.4,6.2,2.2,8.1.2,2.4-2.5,2.1-5.6.2-8.1-2.8-3.8-6.2-7.4-9.8-10.4-4.2-3.5-9.2-6.2-14.8-6.2-2.9,0-5.7.5-7.9,2.5-2,1.9-2.9,4.4-3.3,7.1-.3,2.6.3,5.8,2.1,7.8,2.2,2.4,5,3.1,8.1,3.7,3,.5,6.4-.6,7.2-3.9.7-2.8-.7-6.6-3.9-7.2Z"/>
        </g>
      </g>

      <g>
        <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M173.8,571.5c1.3,9.7,3.1,19.1,5.7,28.4v-.4c3.8,12.7,8.5,25.4,15.8,36.4l-.5-.3c12.1,19.2,29.3,34.8,49.8,44.9,2.6,1.3,5.2,2.6,7.8,3.8,1.4.6,2.8,1.3,4.2,1.9.7.3,1.3.6,2,.8.7.3-.2,0-.3-.1.5.2,1,.4,1.5.6,3.1,1.2,5.7,4.2,4.6,7.8-.9,3-4.4,5.9-7.8,4.6-10.5-4.1-20.6-9.1-30.1-15-38.7-22.6-59-66.8-63.7-110-.1-3.6,1.3-7.8,5.7-8.1,2.8,0,5.1,2.1,5.3,4.7h0Z"/>
        <g>
          <g>
            <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M265.2,692.8c-.5,1.6-.9,3.3-1,4.9-.1,1.6,0,3.2.2,4.8,1.8,8.8,7,17.5,16.4,20.7,1.4.5,2.9.8,4.4,1,9.3,2,19-3.9,21-12.7,3-13.9-12.3-23.4-25.5-22.7-2.2,0-4.4.2-6.5.7-2,.4-3.9,1.1-5.8,2-.9.4-2,.9-3.1,1.4Z"/>
            <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M270.8,694.2c-.4,1.2-.7,2.4-.9,3.7.1-1.1,0,.9,0,.9,0,.6,0,1.2,0,1.8,0,.2.3,2,0,.7,0,.5.2.9.3,1.3.2.9.5,1.8.8,2.7.2.4.3.9.5,1.3,0,.2.7,1.6.1.3.4.8.8,1.7,1.3,2.5.4.7.8,1.3,1.2,2,.3.4.5.8.8,1.1-.9-1.1.4.4.6.6.6.7,1.3,1.3,2,1.9.2.2.5.4.7.6-1.1-.8.2,0,.4.2.8.5,1.7,1,2.5,1.4.2,0,1.7.6.4.2.7.2,1.4.5,2.1.6.9.2,1.8.4,2.7.6.5,0,.9.2,1.4.2-1.5-.2,0,0,.3,0,.9,0,1.8,0,2.8-.1-1.5.2,0,0,.3,0,.4-.1.9-.2,1.3-.4.4-.1.9-.3,1.3-.5,1.4-.5-1,.6.3-.1.8-.5,1.5-.9,2.3-1.4,1.2-.8-.8.8.2-.2.3-.3.5-.5.8-.8.3-.3.5-.5.8-.8.2-.2.4-.4.6-.7-.4.6-.5.6,0,.1.5-.8.9-1.5,1.3-2.3.6-1.3-.3,1.1,0-.3,0-.4.2-.7.3-1.1,0-.4.1-.7.2-1.1.3-1.4,0,1.2,0-.2,0-.6.3-2.4-.1-2.9,0,.2,0,.5.1.7,0-.3-.1-.5-.2-.8,0-.4-.2-.8-.3-1.1,0-.2-.2-.5-.3-.7-.4-1.3.6,1.1,0,0-.4-.7-.8-1.4-1.2-2-.2-.3-.7-1.4,0-.1-.2-.4-.7-.9-1.1-1.2-.5-.5-1-1-1.5-1.4-.3-.3-.6-.5-1-.8,1.2.9,0,0-.2,0-1.4-.9-3-1.7-4.5-2.4,1.4.6,0,0-.2,0-.5-.2-1.1-.4-1.7-.5-1-.3-2-.5-3-.7-.3,0-.6-.1-.9-.1-.3,0-.6,0-.9-.1.8,0,.9.1.2,0-1,0-2,0-3,0-1.3,0-2.7,0-4,.2-.2,0-1.1.2-.2,0-.8.1-1.6.3-2.3.5-3.1.8-4.6,1.7-7.7,3.1-2.8,1.2-6.5-1.1-7.2-3.9-.8-3.3.9-5.9,3.9-7.2.3-.1.6-.2.9-.4.9-.4-.6.3.2,0,.7-.3,1.3-.6,2-.9,1.5-.7,3.1-1.3,4.7-1.7,3-.8,6.1-1.2,9.2-1.2,4.3,0,8.7.5,12.8,1.9,8.3,3,16.5,9.1,18.4,18.2,2.1,9.9-2.8,20.1-11.9,24.5-9.8,4.8-21.7,2.6-30-4.2-9-7.3-13.8-21-10.2-32.1.9-2.9,3.9-5.1,7-4.2,2.8.9,5.1,3.9,4.2,7Z"/>
          </g>
          <path fill={walletMeta?.colors?.secondary || "#000000"} style={{fill: walletMeta?.colors?.secondary || "#000000"}} d="M282.2,682.9c.9-.2,1.9-.3,2.8-.5.3,0,.5-.1.8-.2-.2,0-.3.1-.5.2-.2.3-1.3,1.6-1.1,1.8,0-.2.1-.4.1-.5,0-.3,0-.2,0,.2,0,.5,0,.5,0,.2,0-.2,0-.4,0-.6,0-1,0,.4,0,.4,0-.1,0-.2,0-.4-.2-.5-.2-.5,0,0,.2.4.2.5,0,.2,0-.2-.2-.3-.3-.5-.1.2,1,1,1.1,1.1-.9-.5.9.5.3.1-.3-.2.6,0,0,0-.4,0-.9,0-1.3,0-.5,0-.6,0,0,0-.9.1-1.7.4-2.5.7-.4.1-.6.2,0,0-.4.2-.8.4-1.2.6-.7.4-1.4.8-2,1.3-.3.2-.6.4-.9.6.8-.6-.2.1-.3.3-.6.5-1.2,1.1-1.7,1.6-2.6,2.5-5.1,5.2-7.3,8.1-2.8-2.7-5.5-5.3-8.3-8,2.9-3.8,7.7-6.3,12.5-6.9,2.2-.3,4.4-.5,6.6-.6.9,0,1.8,0,2.7,0,1.8,0,3.3.6,4.9,1.3,2.7,1.2,3.8,5.3,2.2,7.8-1.7,2.8-4.9,3.6-7.8,2.2-1.3-.6.9.2.9.1,0,0-1,0-1.1,0-.8,0-1.7,0-2.5,0-1.7,0-3.5.3-5.2.5.6,0,.1,0-.2,0-.4.1-.7.2-1.1.3-.4.1-.7.2-.1,0-.3.1-.6.3-.9.5-.3.2-.6.4-.9.5-1.2.8.2-.4-.3.2-.5.6-1.1,1.1-1.6,1.8-1.8,2.4-6.2,2.2-8.1.2-2.4-2.5-2.1-5.6-.2-8.1,2.8-3.8,6.2-7.4,9.8-10.4,4.2-3.5,9.2-6.2,14.8-6.2,2.9,0,5.7.5,7.9,2.5,2,1.9,2.9,4.4,3.3,7.1.3,2.6-.3,5.8-2.1,7.8-2.2,2.4-5,3.1-8.1,3.7-3,.5-6.4-.6-7.2-3.9-.7-2.8.7-6.6,3.9-7.2Z"/>
        </g>
      </g>

      { walletMeta?.logo &&
        <>
          { walletMeta?.colors?.background &&
            <>
              <defs>
                <clipPath id="clipLogo">
                  <rect width="340" height="340" rx="80" ry="80" />
                </clipPath>
              </defs>
              <rect
                x="420"
                y="290"
                width="340"
                height="340"
                rx="80"
                fill={walletMeta?.colors?.background}
              />
            </>
          }
          <image
            x="420"
            y="290"
            width="340"
            height="340"
            href={walletMeta.logo}
            clipPath="inset(0 round 60px)"
            preserveAspectRatio="xMidYMid meet"
          />
        </>
      }
      { !walletMeta?.logo &&
        <>
          <g opacity="0.3">
            <path fill="#ffffff" d="M453.7,592.4c0,0-.1,0-.2,0,0,0-.1,0-.2,0-11,1.7-25.6,8.1-28.8,20.6-3.3,12.8,9.2,21.9,19.5,24.7,10.7,2.9,22.5,1.3,32.4-3.8,9.1-4.6,17.6-14.3,12.4-25.4-6.2-13.3-22.1-17.9-35.1-16.2Z"/>
            <path fill="#ffffff" d="M721,592.5c0,0-.1,0-.2,0,0,0-.1,0-.2,0-12.2-1.5-25.2,2-33,12.6-3.1,4.3-4.8,9.7-3.1,15,1.6,5.1,5.5,9,9.7,11.8,9.2,6.1,21,8.4,31.7,6.8,10.2-1.5,24-8.5,24.4-21,.4-15.1-17.5-23.4-29.3-25.2Z"/>
          </g>
          <g>
            <path fill="#000000" d="M626.4,611.1c-4.5-14.6-16.7-26.3-33.5-27.3-18.7-1.2-31.9,11.3-37.9,26.9-3.4,8.8,11.4,13.1,14.8,4.3,3.6-9.4,11.1-17.7,22.7-16.7,9.7.9,16.3,7.7,18.9,16.2,2.8,9,17.8,5.6,15-3.4h0Z"/>
            <path fill="#000000" d="M705.6,545.8s0,0,.1-.1c8.3-8.4,19.1-14.9,30.8-20.1,4.5-2,2.4-8.5-2.5-7.8-22,2.9-42.1,16.6-57.3,30.8-3,2.6-5.8,5.3-8.5,8.1-2.5,2.6-5,5.3-7.3,8.1-2.5,3.1.4,7.4,4.5,6.6.2,0,.4,0,.5-.1,4.2-.8,8.4-1.4,12.7-1.7,20.3-1.8,40.5,2,59.6,7.6,4.5,1.3,7.7-4,4.3-7-9.8-8.4-22-14.6-34.8-17.6-3.3-.8-4.4-4.7-1.9-6.9Z"/>
            <path fill="#000000" d="M465,545.8s0,0-.1-.1c-8.3-8.4-19.1-14.9-30.8-20.1-4.5-2-2.4-8.5,2.5-7.8,22,2.9,42.1,16.6,57.3,30.8,3,2.6,5.8,5.3,8.5,8.1,2.5,2.6,5,5.3,7.3,8.1,2.5,3.1-.4,7.4-4.5,6.6-.2,0-.4,0-.5-.1-4.2-.8-8.4-1.4-12.7-1.7-20.3-1.8-40.5,2-59.6,7.6-4.5,1.3-7.7-4-4.3-7,9.8-8.4,22-14.6,34.8-17.6,3.3-.8,4.4-4.7,1.9-6.9Z"/>
          </g>
        </>
      }

    </svg>
  )
}
