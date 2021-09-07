import styleRenderer from './style'
import { ReactShadowDOM } from 'depay-react-shadow-dom'

export default ({ style, document }, content)=> {
  
  let insideStyle = styleRenderer(style)
  if(style && style.css) { insideStyle = [insideStyle, style.css].join(' ') }

  let unmountShadowDOM = ()=> {
    // setTimeout to allow dialog to animate out first
    setTimeout(unmount, 300)
  }

  let { unmount } = ReactShadowDOM({
    document,
    element: document.body,
    content: content(unmountShadowDOM),
    insideStyle,
    outsideStyle: `
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    `,
  })

  return 
}
