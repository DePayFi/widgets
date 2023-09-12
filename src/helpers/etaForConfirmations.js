let blockTimes = { // in seconds
  ethereum: 12,
  bsc: 3,
  polygon: 2,
  solana: 0.2,
  optimism: 0.5,
  base: 0.5,
  arbitrum: 0.28,
  fantom: 2.5,
  avalanche: 2,
  gnosis: 5,
}

export default (blockchain, confirmationsRequired, confirmationsPassed)=> {
  
  return(
    (confirmationsRequired - confirmationsPassed) * blockTimes[blockchain]
  )
}
