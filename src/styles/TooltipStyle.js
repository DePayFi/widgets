export default (style)=>{
  return(`

    .TooltipWrapper {
      position: relative;
    }

    .Tooltip {
      background: ${style.colors.primary};
      border-radius: 10px;
      color: ${style.colors.buttonText};
      padding: 10px 13px;
      position: relative;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
    }

    .Tooltip.absolute {
      position: absolute;
    }

    .Tooltip.top {
      top: -40px;
    }

    .TooltipArrowUp {
      border-bottom: 10px solid ${style.colors.primary};
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      height: 0; 
      left: 12px;
      position: absolute;
      top: -8px;
      width: 0; 
    }

    .TooltipArrowDown {
      border-top: 10px solid ${style.colors.primary};
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      height: 0; 
      left: 12px;
      position: absolute;
      bottom: -8px;
      width: 0; 
    }
  `)
}
