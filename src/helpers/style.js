import ActionIndicatorStyle from '../styles/ActionIndicatorStyle'
import AlertStyle from '../styles/AlertStyle'
import InfoStyle from '../styles/InfoStyle'
import ButtonCircularStyle from '../styles/ButtonCircularStyle'
import ButtonPrimaryStyle from '../styles/ButtonPrimaryStyle'
import CardStyle from '../styles/CardStyle'
import DialogStyle from '../styles/DialogStyle'
import DropDownStyle from '../styles/DropDownStyle'
import FontStyle from '../styles/FontStyle'
import GraphicStyle from '../styles/GraphicStyle'
import GridStyle from '../styles/GridStyle'
import HeightStyle from '../styles/HeightStyle'
import HorizontalRuleStyle from '../styles/HorizontalRuleStyle'
import IconStyle from '../styles/IconStyle'
import InputStyle from '../styles/InputStyle'
import isDarkMode from '../helpers/isDarkMode'
import LinkStyle from '../styles/LinkStyle'
import LoadingTextStyle from '../styles/LoadingTextStyle'
import LogoStyle from '../styles/LogoStyle'
import MarginStyle from '../styles/MarginStyle'
import OpacityStyle from '../styles/OpacityStyle'
import PaddingStyle from '../styles/PaddingStyle'
import PoweredByStyle from '../styles/PoweredByStyle'
import StepStyle from '../styles/StepStyle'
import QRCodeStyle from '../styles/QRCodeStyle'
import RadioStyle from '../styles/RadioStyle'
import RangeSliderStyle from '../styles/RangeSliderStyle'
import ResetStyle from '../styles/ResetStyle'
import SearchStyle from '../styles/SearchStyle'
import SkeletonStyle from '../styles/SkeletonStyle'
import TabBarStyle from '../styles/TabBarStyle'
import TableStyle from '../styles/TableStyle'
import TabStyle from '../styles/TabStyle'
import TextButtonStyle from '../styles/TextButtonStyle'
import TextStyle from '../styles/TextStyle'
import TokenAmountStyle from '../styles/TokenAmountStyle'
import TokenImageStyle from '../styles/TokenImageStyle'
import TooltipStyle from '../styles/TooltipStyle'
import WalletStyle from '../styles/WalletStyle'

export default (style)=>{

  const defaultColors = !isDarkMode() ? {
    
    // LIGHT MODE

    primary: '#ea357a',
    buttonText: '#ffffff',
    text: '#212529',
    warning: '#bd2e21',
    success: '#32a03c',
    background: '#f2f2f2',
    cardBackground: '#ffffff',
    mixActive: '#000000',
    mixPassive: '#ffffff',
  
  } : {
  
    // DARK MODE
  
    primary: '#c21e5d',
    buttonText: '#ffffff',
    text: '#d5d9dd',
    warning: '#d55448',
    success: '#65c86e',
    background: '#171717',
    cardBackground: '#252525',
    mixActive: '#aaaaaa',
    mixPassive: '#000000',

  }

  const configuredColors = (isDarkMode() ? style?.colorsDarkMode : style?.colors) || style?.colors

  style = {
    colors: Object.assign(defaultColors, configuredColors || {}),
    fontFamily: style?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  }

  return(
    [
      ResetStyle(style),
      ActionIndicatorStyle(style),
      DialogStyle(style),
      ButtonCircularStyle(style),
      ButtonPrimaryStyle(style),
      CardStyle(style),
      PoweredByStyle(style),
      StepStyle(style),
      QRCodeStyle(style),
      GraphicStyle(style),
      GridStyle(style),
      SkeletonStyle(style),
      TokenAmountStyle(style),
      TextStyle(style),
      FontStyle(style),
      IconStyle(style),
      OpacityStyle(style),
      PaddingStyle(style),
      MarginStyle(style),
      HeightStyle(style),
      HorizontalRuleStyle(style),
      TabBarStyle(style),
      TabStyle(style),
      LoadingTextStyle(style),
      RadioStyle(style),
      RangeSliderStyle(style),
      InputStyle(style),
      TextButtonStyle(style),
      LogoStyle(style),
      SearchStyle(style),
      TokenImageStyle(style),
      AlertStyle(style),
      InfoStyle(style),
      TableStyle(style),
      LinkStyle(style),
      TooltipStyle(style),
      WalletStyle(style),
      DropDownStyle(style),
    ].join('')
  )
}
