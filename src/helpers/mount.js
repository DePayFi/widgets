import styleRenderer from './style'
import { ReactShadowDOM } from '@depay/react-shadow-dom'

export default ({ style, container, document, closed }, content)=> {
  
  let insideStyle = styleRenderer(style)
  if(style && style.css) { insideStyle = [insideStyle, style.css].join(' ') }

  let unmountShadowDOM = ()=> {
    // setTimeout to allow dialog to animate out first
    setTimeout(()=>{
      unmount()
      if(typeof closed == 'function'){ closed() }
    }, 300)
  }

  let outsideStyle
  if(container) {
    outsideStyle = `
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 99999;
    `
  } else {
    outsideStyle = `
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 99999;
    `
  }

  let { unmount } = ReactShadowDOM({
    document,
    element: container || document.body,
    content: content(unmountShadowDOM),
    outsideStyle,
    insideStyle,
    insideClasses: container ? ['contained'] : []
  })

  return unmount
}
