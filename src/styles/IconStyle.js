export default (style)=>{
  return(`

    .Icon {
      fill: ${style.colors.icons};
      stroke: ${style.colors.icons};
    }

    .QuestionMarkIcon {
      fill: transparent;
    }

    .ChevronLeft, .ChevronRight {
      position: relative;
      top: 1px;
    }

    .ChevronLeft.small, .ChevronRight.small {
      height: 12px;
      width: 12px;
    }

    .Checkmark {
      height: 24px;
      position: relative;
      top: -1px;
      vertical-align: middle;
      width: 24px;
    }

    .AlertIcon {
      height: 20px;
      position: relative;
      top: -1px;
      vertical-align: middle;
      width: 20px;
      fill: #e42626;
      stroke: transparent;
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

    .Loading {
      border: 3px solid ${style.colors.primary};
      border-top: 3px solid rgba(0,0,0,0.1);
      border-radius: 100%;
      position: relative;
      left: -1px;
      width: 18px;
      height: 18px;
      animation: spin 1.5s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `)
}
