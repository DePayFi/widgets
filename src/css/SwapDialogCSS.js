export default function(){
  return `

    .SwapDialog .PaymentRow {
      background: transparent !important;
      cursor: auto !important;
    }

    .SwapDialog .PaymentColumn {
      border-bottom: 1px solid transparent !important;
    }

    .SwapDialog .FromRow .PaymentColumn2 {
      width: 40%;
    }

    .SwapDialog .FromRow .PaymentColumn3 {
      width: 40%;
    }

    .SwapDialog .ExchangeRow {
      position: absolute;
      width: 100%;
      z-index: 999;
    }

    .SwapDialog .SwapInputs {
      cursor: pointer;
      height: 1.8rem;
      padding-top: 0.6rem;
      position: relative;
      top: -0.9rem;
    }

    .SwapDialog .SwapInputs:hover svg * {
      fill: #c7537a;
      stroke: #c7537a;
    }

    .SwapDialog .SwapInputs:active svg * {
      fill: rgb(190,190,190);
      stroke: rgb(190,190,190);
    }
  `;
}
