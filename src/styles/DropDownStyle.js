export default (style)=>{
  return(`

    .DropDownWrapper {
      position: relative;
    }

    .DropDown {
      background: ${style.colors.background};
      border-radius: 8px;
      box-shadow: 0 0 12px color-mix(in srgb, ${style.colors.background} 80%, black 20%);
      display: block;
      padding: 8px 6px;
      position: absolute;
      right: 0;
      z-index: 1000;
    }

    .DropDownItem {
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 17px;
      min-width: 160px;
      padding: 6px 10px;
      text-align: left;
      white-space: nowrap;
      width: 100%;
    }

    .DropDownItem:focus {
      border: 1px solid ${style.colors.primary};
    }

    .DropDownItem:hover {
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 90%, ${style.colors.mixActive} 10%);
    }
    
    .DropDownItem:active {
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 85%, ${style.colors.mixActive} 15%);
    }
    
  `)
}
