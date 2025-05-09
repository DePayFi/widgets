export default (style)=>{
  return(`

    .Tab {
      padding: 3px 7px;
      margin-right: 3px;
      font-size: 17px;
      border-radius: 4px;
      cursor: pointer;
    }

    .Tab.active {
      background-color: color-mix(in srgb, ${style.colors.background} 90%, ${style.colors.mixActive} 10%);
      box-shadow: 0 0 4px rgba(0,0,0,0.03);
    }

    .Tab:hover:not(.active) {
      background-color: color-mix(in srgb, ${style.colors.background} 90%, ${style.colors.mixActive} 10%);
      box-shadow: 0 0 0 rgba(0,0,0,0); 
    }

    .Tab:active:not(.active) {
      background-color: color-mix(in srgb, ${style.colors.background} 95%, ${style.colors.mixActive} 5%);
      box-shadow: inset 0 0 4px rgba(0,0,0,0.02);
    }

    .Tab.search {
      display: flex;
    }
  `)
}
