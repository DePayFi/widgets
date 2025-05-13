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

    .Step .ActionIndicatorSpinner {
      border: 2px solid ${style.colors.primary};
      border-bottom-color: ${style.colors.background};
      border-bottom-color: color-mix(in srgb, ${style.colors.background} 90%, ${style.colors.mixActive} 10%);
      height: 14px;
      width: 14px;
    }

    .Step.Card.small {
      padding: 6px 12px;
    }

    .Step.active {
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
      height: 50%;
      position: absolute;
      bottom: -25%;
      left: 19px;
      background: ${style.colors.text};
      z-index: 999;
    }

    .Step:last-child .StepConnector {
      display: none;
    }

    .Step.done:last-child {
      opacity: 100;
    }

    .StepText {
      text-align: left;
      display: flex;
      align-items: center;
      position: relative;
    }

  `)
}
