import { struct, u64, publicKey } from '@depay/solana-web3.js'

export default (logs)=>{
  if(!logs) { return }
  if(!(logs instanceof Array)) { return }

  let paymentEvent
  logs.forEach((log, index)=>{
    if(paymentEvent == undefined) {
      if(log.match('Program DePayRG7ZySPWzeK9Kvq7aPeif7sdbBZNh6DHcvNj7F7 consumed')) {
        const paymentEventLog = logs[index-1]
        if(paymentEventLog.match('Program data: ')) {
          try {
            const byteArray = Uint8Array.from(atob(paymentEventLog.replace('Program data: ', '')), c => c.charCodeAt(0))
            const eventLayout = struct([
               u64('delimter'),
               publicKey('sender'),
               u64('senderNonce'),
               u64('senderAmount'),
               publicKey('sendToken'),
               publicKey('paymentToken'),
               publicKey('paymentReceiver'),
               u64('paymentAmount'),
               publicKey('feeReceiver'),
               u64('feeAmount'),
            ])
            paymentEvent = eventLayout.decode(byteArray)
          } catch {}
        }
      }
    }
  })

  return paymentEvent
}
