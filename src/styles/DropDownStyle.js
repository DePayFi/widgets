export default (style)=>{
  return(`

    .DropDownWrapper {
      position: relative;
    }

    .DropDown {
      background: rgb(240,240,240);
      border-radius: 8px;
      border: 1px solid rgb(230,230,230);
      box-shadow: 0 0 12px rgba(0,0,0,0.1);
      display: block;
      padding: 8px 6px;
      position: absolute;
      right: 0;
    }

    .DropDownItem {
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 17px;
      font-weight: 500;
      min-width: 160px;
      padding: 6px 10px;
      text-align: left;
      white-space: nowrap;
    }

    .DropDownItem:focus {
      border: 1px solid ${style.colors.primary};
    }

    .DropDownItem:hover {
      background: rgba(0,0,0,0.1);
    }
    
    .DropDownItem:active {
      background: rgba(0,0,0,0.15);
    }
    
  `)
}
