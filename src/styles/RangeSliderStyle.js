export default (style)=>{
  return(`

    .rangeslider {
      margin: 20px 0;
      position: relative;
      background: #e6e6e6;
      -ms-touch-action: none;
      touch-action: none;
    }

    .rangeslider,
    .rangeslider__fill {
      display: block;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .rangeslider__handle {
      outline: none;
      cursor: pointer;
      display: inline-block;
      position: absolute;
      border-radius: 50%;
      background-color: `+style.colors.primary+`;
      border: 1px solid white;
      box-shadow: 0 0 8px rgba(0,0,0,0.1);
    }

    .rangeslider__handle:hover {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);
    }

    .rangeslider__handle:active {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.3);
    }

    .rangeslider__active {
      opacity: 1;
    }

    .rangeslider__handle-tooltip {
      display: none;
    }

    .rangeslider-horizontal {
      height: 12px;
      border-radius: 10px;
    }

    .rangeslider-horizontal .rangeslider__fill {
      height: 100%;
      background-color: `+style.colors.primary+`;
      border-radius: 10px;
      top: 0;
    }
    .rangeslider-horizontal .rangeslider__handle {
      width: 18px;
      height: 18px;
      border-radius: 30px;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }


    .rangeslider-horizontal .rangeslider__handle-tooltip {
      top: -55px;
    }

  `)
}
