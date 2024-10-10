const link = ({ url, target, wallet })=>{

  if(url && url.length && target == '_blank' && wallet?.name === 'World App' && url.match('depay.com')) {
    return `https://integrate.depay.fi/redirect?to=${encodeURIComponent(url)}`
  }

  return url
}

export default link
