export default (style)=>{
  return(`

    .Icon {
      fill : ${style.colors.icons};
      stroke : ${style.colors.icons};
    }

    .ChevronLeft, .ChevronRight {
      position: relative;
      top: 1px;
    }

    .Checkmark {
      height: 24px;
      position: relative;
      top: -1px;
      vertical-align: middle;
      width: 24px;
    }

    .CheckMark.small {
      height: 16px;
      width: 16px;
    }

    .DigitalWalletIcon {
      height: 24px;
      position: relative;
      top: -1px;
      vertical-align: middle;
      width: 24px;
    }

    .ButtonPrimary .Icon {
      fill : ${style.colors.buttonText};
      stroke : ${style.colors.buttonText};
    }
  `)
}
