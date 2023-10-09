const resetZoom = ()=>{
  const viewportMetaTag = document.createElement('meta')
  viewportMetaTag.name = "viewport"
  viewportMetaTag.content = "width=device-width, initial-scale=1.0"
  document.getElementsByTagName('head')[0].appendChild(viewportMetaTag)
}

const zoomOut = ()=>{
  const viewportMetaTag = document.createElement('meta')
  viewportMetaTag.name = "viewport"
  viewportMetaTag.content = "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
  document.getElementsByTagName('head')[0].appendChild(viewportMetaTag)
  setTimeout(resetZoom, 50)
}

export default ()=> {
  let viewportMetaTag = document.querySelector('meta[name="viewport"]')

  if (viewportMetaTag) {
    viewportMetaTag.remove()
    setTimeout(zoomOut, 50)
  } else {
    zoomOut()
  }  
}
