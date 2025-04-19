export default (style)=>{
  return(`

    .Step {
      display: flex !important;
      align-items: center;
      width: 100%;
      opacity: 50%;
      padding-left: 0 !important;
      position: relative;
    }

    .Step.active, .Step.done {
      opacity: 100%;
    }

    .StepIcon {
      width: 40px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .StepCircle {
      border-radius: 999px;
      height: 12px;
      width: 12px;
      border: 2px solid ${style.colors.text};
      background: none;
      position: relative;
    }

    .Step.active .StepCircle {
      background: ${style.colors.text};
    }

    .StepConnector {
      width: 2px;
      height: 26px;
      position: absolute;
      bottom: -28px;
      left: 19px;
      background: ${style.colors.text}
    }

    .Step:last-child .StepConnector {
      display: none;
    }

    .StepText {
      width: 76%;
      text-align: left;
      display: flex;
      align-items: center;
      position: relative;
    }

  `)
}
