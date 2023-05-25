let blockTimes = { // in seconds
  ethereum: 13,
  bsc: 4,
  polygon: 3,
  solana: 0.5,
}

export default (blockchain, confirmationsRequired, confirmationsPassed)=> {
  
  return(
    (confirmationsRequired - confirmationsPassed) * blockTimes[blockchain]
  )
}
