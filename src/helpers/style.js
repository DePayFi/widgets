import ActionCircleStyle from '../styles/ActionCircleStyle'
import AlertStyle from '../styles/AlertStyle'
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
import ImageStyle from '../styles/ImageStyle'
import InputStyle from '../styles/InputStyle'
import isDarkMode from '../helpers/isDarkMode'
import LinkStyle from '../styles/LinkStyle'
import LoadingTextStyle from '../styles/LoadingTextStyle'
import LogoStyle from '../styles/LogoStyle'
import MarginStyle from '../styles/MarginStyle'
import OpacityStyle from '../styles/OpacityStyle'
import PaddingStyle from '../styles/PaddingStyle'
import PoweredByStyle from '../styles/PoweredByStyle'
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
    icons: '#000000',
    text: '#212529',
    background: '#f8f8f8',
    cardBackground: '#ffffff',
    mixActive: '#000000',
    mixPassive: '#ffffff',
  
  } : {
  
    // DARK MODE
  
    primary: '#c21e5d',
    buttonText: '#ffffff',
    icons: '#ffffff',
    text: '#d5d9dd',
    background: '#1f1f24',
    cardBackground: '#000000',
    mixActive: '#ffffff',
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
      ActionCircleStyle(style),
      DialogStyle(style),
      ButtonCircularStyle(style),
      ButtonPrimaryStyle(style),
      CardStyle(style),
      PoweredByStyle(style),
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
      ImageStyle(style),
      LogoStyle(style),
      SearchStyle(style),
      TokenImageStyle(style),
      AlertStyle(style),
      TableStyle(style),
      LinkStyle(style),
      TooltipStyle(style),
      WalletStyle(style),
      DropDownStyle(style),
    ].join('')
  )
}
