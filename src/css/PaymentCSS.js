export default function(style){
  return `
    .Payment {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .PaymentRow {
      display: table-row;
    }

    .PaymentRow:not(.loading) {
      cursor: pointer;
    }

    .Dialog.unactionable .PaymentRow {
      cursor: default;
    }

    .Dialog:not(.unactionable) .PaymentRow:not(.loading):hover {
      background: rgb(248,243,245);
    }

    .Dialog:not(.unactionable) .PaymentRow:not(.loading):active {
      background: rgb(241,232,235);
    }

    .PaymentColumn {
      border-bottom: 1px solid rgb(246,246,246);
      display: table-cell;
      position: relative;
      vertical-align: middle;
      padding-top: 1.4rem;
      padding-bottom: 1.6rem;
    }

    .PaymentColumn1 {
      width: 20%;
      padding: 1rem;
      text-align: center;
    }
    .PaymentColumnNFT{
      height: 100%;
      width:100%;
      object-fit: contain;
    }

    .PaymentColumn2 {
      width: 52%;
    }

    .PaymentColumn3 {
      text-align: right;
      padding-right: 0.9rem;
      width: 28%;
    }

    .PaymentAmountRow1 {
      font-size: 140%;
      line-height: 2rem;
      position: relative;
    }

    .PaymentAmountRow2, .PaymentDescription {
      color: rgb(110,110,110);
      font-size: 90%;
    }

    .PaymentAmountRow1, .PaymentAmountRow2, .PaymentAmountRow3, .PaymentDescription {
      text-align: left;
      display: block;
    }

    .PaymentAction {
      color: `+style.colors.primary+`;
      padding: 0.3rem 0.8rem;
      border: 1px solid transparent;
      border-radius: 99rem;
    }

    .PaymentAction:not(.disabled){
      cursor: pointer;
    }

    .PaymentAction:hover {
      background: rgba(0,0,0,0.03);
    }

    .PaymentAction:active {
      background: rgba(0,0,0,0.08);
    }

    .PaymentDialog.unactionable .PaymentAction {
      display: none;
    }

    .ChangeNetworkFeeRow .PaymentAmountRow1 {
      font-size: 130%;
      line-height: 1.8rem;
    }
  `;
}
