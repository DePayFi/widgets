/*#if _EVM

import { wallets } from "@depay/web3-wallets-evm"

/*#elif _SOLANA

import { wallets } from "@depay/web3-wallets-solana"

//#else */

import { wallets } from "@depay/web3-wallets"

//#endif

const generateUUIDv4 = ()=> {
    var d = new Date().getTime()
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16
      if(d > 0){
        r = (d + r)%16 | 0
        d = Math.floor(d/16)
      } else {
        r = (d2 + r)%16 | 0
        d2 = Math.floor(d2/16)
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

const getFavicon = function(){
  let favicon
  var nodeList = document.getElementsByTagName("link")
  for (var i = 0; i < nodeList.length; i++)
  {
    if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
    {
      favicon = nodeList[i].getAttribute("href");
    }
  }
  if(!favicon){ return }
  if(favicon.match(':')) {
    return favicon
  } else {
    return `${window.location.origin}/${favicon.replace(/^\//, '')}`
  }
}

export default class SolanaPay extends wallets.WindowSolana {

  constructor(options) {
    super()
    // emulates wallet (@depay/web3-wallets)
    this.isSolanaPay = true // needed to change widget flow
    this.blockchains = ['solana']
    this.on = ()=>{}
    this.off = ()=>{}
    this.name = options.name
    this.icon = options.icon
  }

  openSocket(secret_id, route){

    return new Promise((resolve)=>{
      this.socket = new WebSocket('wss://integrate.depay.com/cable')

      this.socket.onopen = async (event)=> {
        this._label = document.title || 'DePay'
        this._icon = getFavicon() || 'https://depay.com/favicon.png'
        const msg = {
          command: 'subscribe',
          identifier: JSON.stringify({
            secret_id,
            label: this._label,
            icon: this._icon,
            channel: 'SolanaPayChannel'
          }),
        }
        await this.socket.send(JSON.stringify(msg))
      }
      
      this.socket.onclose = (event)=> {
        if(!event || event.code != 1000) {
          setTimeout(()=>this.openSocket(secret_id), 1000)
        }
      }

      this.socket.onmessage = (event)=> {
        const item = JSON.parse(event.data)
        if(item.type === 'confirm_subscription') { resolve(this.socket) }
        if(item.type === "ping" || !item.message) { return }
        if(item.message && item.message.account){
          this._account = item.message.account
          route(item.message.account, this)
        }
      }
      
      this.socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error)
      }
    })  
  }

  async account(){ return this._account }

  async connect({ qr, route }){

    this.secret_id = generateUUIDv4().split('-')[0]

    const uri = `solana:https://public.depay.com/solana/${this.secret_id}`

    this.socket = await this.openSocket(this.secret_id, route)

    await qr(uri)

  }

  async _sendTransaction(transaction) {

    if(this.isTransactionSend) { return }
    this.isTransactionSend = true

    const serializedTransaction = transaction.serialize({ verifySignatures: false, requireAllSignatures: false })
    const txBase64 = serializedTransaction.toString('base64')

    this.socket.send(JSON.stringify({
      command: 'message',
      identifier: JSON.stringify({ secret_id: this.secret_id, label: this._label, icon: this._icon, channel: 'SolanaPayChannel' }),
      data: JSON.stringify({ secret_id: this.secret_id, transaction: txBase64 })
    }))
  }
}
