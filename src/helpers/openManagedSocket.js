const sockets = {}
const socketsPingIntervals = {}
const keepAliveIntervals = {}
const retryCounts = {}
const endpointIndices = {}

const openManagedSocket = ({
  identifier,
  onopen,
  onmessage,
  keepAlive,
  endpoint,
  endpoints,
})=>{

  const endpointsList = Array.isArray(endpoints) ? endpoints : [(endpoint || 'wss://integrate.depay.com/cable')]

  if(retryCounts[identifier] === undefined) { retryCounts[identifier] = 0 }
  if(endpointIndices[identifier] === undefined) { endpointIndices[identifier] = 0 }

  if(socketsPingIntervals[identifier]) { clearInterval(socketsPingIntervals[identifier]) }
  if(keepAliveIntervals[identifier]) { clearInterval(keepAliveIntervals[identifier]) }
  if(sockets[identifier]) { sockets[identifier].close() }

  if(endpoints){
    endpoint = endpoints[0]
  }

  const currentEndpoint = endpointsList[endpointIndices[identifier]]
  const socket = new WebSocket(currentEndpoint)
  sockets[identifier] = socket

  let keepAliveInterval
  if(keepAlive) {
    keepAliveInterval = setInterval(()=>{
      if([WebSocket.CLOSING, WebSocket.CLOSED].includes(socket.readyState)) {
        clearInterval(keepAliveInterval)
      } else {
        socket.send(JSON.stringify(keepAlive.callback()))
      }
    }, keepAlive.interval)
    keepAliveIntervals[identifier] = keepAliveInterval
  }

  let lastPing
  let pingInterval = setInterval(()=>{
    if(lastPing && (lastPing < Date.now() - 10*1000)) {
      clearInterval(pingInterval)
      if(keepAliveInterval) { clearInterval(keepAliveInterval) }
      if([WebSocket.CLOSING, WebSocket.CLOSED].includes(socket.readyState)) {
        clearInterval(pingInterval)
      } else {
        socket.close(3000) // force reopen
      }
    }
  }, 5000)
  socketsPingIntervals[identifier] = pingInterval


  socket.onopen = async ()=> {

    if(typeof onopen == 'function') {
      let message = await onopen()
      if(message) { await socket.send(JSON.stringify(message), socket) }
    }
  }

  socket.onclose = function(event) {
    if(!event || event.code != 1000) {
      retryCounts[identifier]++
      const delay = Math.min(10000, 1000 * 2 ** (retryCounts[identifier] - 1))
      endpointIndices[identifier] = (endpointIndices[identifier] + 1) % endpointsList.length
      if(pingInterval) { clearInterval(pingInterval) }
      if(keepAliveInterval) { clearInterval(keepAliveInterval) }
      console.log(`Reconnecting socket "${identifier}" in ${delay}ms (attempt #${retryCounts[identifier]})`)
      setTimeout(() => {
        openManagedSocket({ identifier, onopen, onmessage, keepAlive, endpoint, endpoints })
      }, delay)
    }
  }

  socket.onmessage = function(event) {
    lastPing = Date.now()
    const eventData = JSON.parse(event.data)
    if(eventData.error) {
      if(pingInterval) { clearInterval(pingInterval) }
      if(keepAliveInterval) { clearInterval(keepAliveInterval) }
      socket.close(3000) // force reopen
    } else if(typeof onmessage == 'function') {
      onmessage(eventData, socket)
    }
  }
    
  socket.onerror = function(error) {
    console.log('WebSocket Error: ', identifier, error)
  }

  return socket
}

export default openManagedSocket
