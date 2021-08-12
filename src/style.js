import ButtonCircularStyle from './styles/ButtonCircularStyle'
import ButtonPrimaryStyle from './styles/ButtonPrimaryStyle'
import CardStyle from './styles/CardStyle'
import DialogStyle from './styles/DialogStyle'
import FontStyle from './styles/FontStyle'
import FooterStyle from './styles/FooterStyle'
import HeaderTitleStyle from './styles/HeaderTitleStyle'
import ResetStyle from './styles/ResetStyle'
import SkeletonStyle from './styles/SkeletonStyle'
import TextStyle from './styles/TextStyle'
import TokenAmountStyle from './styles/TokenAmountStyle'
import IconStyle from './styles/IconStyle'

export default (style)=>{

  style = Object.assign({
    colors: {
      primary: '#ea357a'
    }
  }, style);
  
  return(
    [
      ResetStyle(style),
      FontStyle(style),
      DialogStyle(style),
      ButtonCircularStyle(style),
      ButtonPrimaryStyle(style),
      HeaderTitleStyle(style),
      CardStyle(style),
      FooterStyle(style),
      SkeletonStyle(style),
      TokenAmountStyle(style),
      TextStyle(style),
      IconStyle(style),
    ].join('')
  )
}
