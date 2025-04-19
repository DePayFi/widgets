import { routers } from '@depay/web3-payments'

export default (confirmedTransaction)=>{
  if(!confirmedTransaction || !confirmedTransaction?.meta?.logMessages || !confirmedTransaction?.transaction?.message?.compiledInstructions) { return }
  if(!confirmedTransaction.meta.logMessages.some((log)=>log.match(`Program ${routers.solana.address} invoke`))) { return }

  let foundInstruction
  confirmedTransaction.transaction.message.compiledInstructions.forEach((instruction)=>{
    Object.keys(routers.solana.api).forEach((key)=>{
      if(foundInstruction){ return }
      try {
        if(key.match(/^route/)) {
          let data = routers.solana.api[key].layout.decode(instruction.data)
          if(data.anchorDiscriminator.toString() === routers.solana.api[key].anchorDiscriminator.toString()){
            foundInstruction = data
          }
        }
      } catch {}
    })
  })

  return foundInstruction
}
