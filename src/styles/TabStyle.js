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
      background: white;
      box-shadow: 0 0 4px rgba(0,0,0,0.03);
    }

    .Tab:hover:not(.active) {
      background: rgb(240,240,240);
      box-shadow: 0 0 0 rgba(0,0,0,0); 
    }

    .Tab:active:not(.active) {
      background: rgb(235,235,235);
      box-shadow: inset 0 0 4px rgba(0,0,0,0.02);
    }
  `)
}
