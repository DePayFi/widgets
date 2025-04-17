export default (style)=>{
  return(`

    .ActionCircle {
      height: 64px;
      width: 64px;
      text-align: center;
      margin: 0 auto;
    }

    .ActionCircle img {
      height: 41px;
      width: 41px;
      position: absolute;
      margin: 11px;
    }

    .ActionCircleSpinner {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .ActionCircleSpinner {
      height: 64px;
      width: 64px;
      border: 4px solid ${style.colors.primary};
      border-bottom-color: color-mix(in srgb, ${style.colors.background} 90%, ${style.colors.mixActive} 10%);
      border-radius: 50%;
      display: inline-block;
      position: relative;
      margin: 0 auto;
      box-sizing: border-box;
      animation: ActionCircleSpinnerRotation 1s linear infinite;
    }

    @keyframes ActionCircleSpinnerRotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    } 
  `)
}
