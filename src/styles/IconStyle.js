export default (style)=>{
  return(`

    .Icon {
      fill: ${style.colors.text};
      stroke: ${style.colors.text};
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

    .Checkmark.small {
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
      animation: spin 1.5s linear infinite;
      border-radius: 100%;
      border: 3px solid ${style.colors.primary};
      border-top: 3px solid rgba(0,0,0,0.1);
      display: inline-block;
      height: 18px;
      left: -1px;
      position: relative;
      width: 18px;
    }

    .Loading.medium {
      border: 4px solid ${style.colors.primary};
      border-top: 4px solid rgba(0,0,0,0.1);
      display: inline-block;
      height: 22px;
      position: relative;
      top: 0;
      width: 22px; 
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `)
}
