export default (style)=>{
  return(`

    .Input {
      background: none;
      border: 1px solid transparent;
      margin: 0;
      outline: none !important;
      padding: 0 0 0 14px;
      width: 100%;
    }

    .Input::placeholder {
      color: rgb(210,210,210);
    }

    .InputField {
      border-radius: 13px;
      border: 1px solid rgba(0,0,0,0.2);
      background: ${style.colors.cardBackground};
      background: color-mix(in srgb, ${style.colors.cardBackground} 80%, ${style.colors.mixPassive} 20%);
      outline: none !important;
      color: ${style.colors.text};
      font-size: 19px;
      padding: 13px;
      width: 100%;
    }

    .InputField.small {
      border-radius: 8px;
      font-size: 15px;
    }

    .InputField::placeholder {
      color: rgb(180,180,180);
    } 

    .InputField:focus, .InputField:focus-visible {
      border: 1px solid ${style.colors.primary};
    }
    
  `)
}
