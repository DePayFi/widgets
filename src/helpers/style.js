import AlertStyle from '../styles/AlertStyle'
import BlockchainLogoStyle from '../styles/BlockchainLogoStyle'
import ButtonCircularStyle from '../styles/ButtonCircularStyle'
import ButtonPrimaryStyle from '../styles/ButtonPrimaryStyle'
import CardStyle from '../styles/CardStyle'
import DialogStyle from '../styles/DialogStyle'
import DropDownStyle from '../styles/DropDownStyle'
import FontStyle from '../styles/FontStyle'
import GraphicStyle from '../styles/GraphicStyle'
import GridStyle from '../styles/GridStyle'
import HeightStyle from '../styles/HeightStyle'
import IconStyle from '../styles/IconStyle'
import ImageStyle from '../styles/ImageStyle'
import InputStyle from '../styles/InputStyle'
import LinkStyle from '../styles/LinkStyle'
import LoadingTextStyle from '../styles/LoadingTextStyle'
import OpacityStyle from '../styles/OpacityStyle'
import PaddingStyle from '../styles/PaddingStyle'
import PoweredByStyle from '../styles/PoweredByStyle'
import QRCodeStyle from '../styles/QRCodeStyle'
import RangeSliderStyle from '../styles/RangeSliderStyle'
import ResetStyle from '../styles/ResetStyle'
import SearchStyle from '../styles/SearchStyle'
import SkeletonStyle from '../styles/SkeletonStyle'
import TableStyle from '../styles/TableStyle'
import TextButtonStyle from '../styles/TextButtonStyle'
import TextStyle from '../styles/TextStyle'
import TokenAmountStyle from '../styles/TokenAmountStyle'
import TokenImageStyle from '../styles/TokenImageStyle'
import TooltipStyle from '../styles/TooltipStyle'
import WalletStyle from '../styles/WalletStyle'

export default (style)=>{


  style = {
    colors: Object.assign({
      primary: '#ea357a',
      buttonText: '#ffffff',
      icons: '#000000',
      text: '#212529',
    }, style?.colors || {}),
    fontFamily: style?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  }

  return(
    [
      ResetStyle(style),
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
      HeightStyle(style),
      LoadingTextStyle(style),
      RangeSliderStyle(style),
      InputStyle(style),
      TextButtonStyle(style),
      ImageStyle(style),
      BlockchainLogoStyle(style),
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
