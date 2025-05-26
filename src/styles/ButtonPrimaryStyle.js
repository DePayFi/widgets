export default (style)=>{
  return(`

    .ButtonPrimary {
      align-items: center;
      align-self: center;
      background: ${style.colors.primary};
      border-radius: 13px;
      border: 1px solid transparent;
      box-shadow: 0 0 16px rgba(0,0,0,0.1);
      font-size: 22px;
      font-weight: 400;
      line-height: 40px;
      height: 58px;
      justify-content: center;
      width: 100%;
      overflow: hidden;
      padding: 7px 0;
      position: relative;
      text-align: center;
      text-decoration: none;
      text-overflow: ellipsis;
      transition: background 0.1s;
      vertical-align: middle;
      display: inline-block;
    }

    .ButtonPrimary, .ButtonPrimary * {
      color: ${style.colors.buttonText};
    }

    .ButtonPrimary.disabled {
      background-color: ${style.colors.background} !important;
      background-color: color-mix(in srgb, ${style.colors.background} 75%, ${style.colors.mixActive} 15%) !important;
      color: ${style.colors.buttonText} !important;
      color: color-mix(in srgb, ${style.colors.buttonText} 70%, ${style.colors.mixActive} 30%) !important;
      box-shadow: 0 !important;
    }
    
    .ButtonPrimary.disabled * {
      opacity: 0.7;
    }

    .ButtonPrimary:not(.disabled){
      cursor: pointer;
    }
    .ButtonPrimary:not(.disabled):hover {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);
    }
    .ButtonPrimary:not(.disabled):active {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);
    }
  `)
}
