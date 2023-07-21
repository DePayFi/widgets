export default function(){
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
