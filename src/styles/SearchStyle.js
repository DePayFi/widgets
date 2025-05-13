export default (style)=>{
  return(`

    .Search {
      border-radius: 13px;
      border: 1px solid transparent;
      background: none;
      outline: none !important;
      color: ${style.colors.text};
      font-size: 19px;
      padding: 8px 12px;
      width: 100%;
      position: relative !important; // fixes LastPass extension problem
    }

    .Search.small {
      padding: 4px 8px;
      font-size: 16px;
      border-radius: 6px;
    }

    .Search::placeholder {
      color: ${style.colors.mixPassive};
      color: color-mix(in srgb, ${style.colors.text} 55%, ${style.colors.mixPassive} 50%);
    } 

    .Search:focus::placeholder, .Search:focus-visible::placeholder {
      color: ${style.colors.mixPassive};
      color: color-mix(in srgb, ${style.colors.text} 65%, ${style.colors.mixPassive} 35%);
    } 

    .Search:focus, .Search:focus-visible {
      border: 1px solid ${style.colors.primary};
      background: none;
    }

  `)
}
