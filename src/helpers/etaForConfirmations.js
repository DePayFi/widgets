let blockTimes = { // in seconds
  ethereum: 13,
  bsc: 4,
  polygon: 3,
}

export default (blockchain, confirmationsRequired, confirmationsPassed)=> {
  
  return(
    (confirmationsRequired - confirmationsPassed) * blockTimes[blockchain]
  )
}
