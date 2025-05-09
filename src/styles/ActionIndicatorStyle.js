export default (style)=>{
  return(`

    .ActionIndicator {
      height: 64px;
      width: 64px;
      text-align: center;
      margin: 0 auto;
    }

    .ActionIndicator img {
      height: 41px;
      width: 41px;
      position: absolute;
      margin: 11px;
    }

    .ActionIndicatorSpinner {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .ActionIndicatorSpinner {
      height: 64px;
      width: 64px;
      border: 4px solid ${style.colors.primary};
      border-bottom-color: color-mix(in srgb, ${style.colors.background} 90%, ${style.colors.mixActive} 10%);
      border-radius: 50%;
      display: inline-block;
      position: relative;
      margin: 0 auto;
      box-sizing: border-box;
      animation: ActionIndicatorSpinnerRotation 1s linear infinite;
    }

    @keyframes ActionIndicatorSpinnerRotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    } 
  `)
}
