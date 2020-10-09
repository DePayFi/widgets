const PaymentCSS = `

  .Payment {
    display: table;
    width: 100%;
  }

  .PaymentRow {
    display: table-row;
  }

  .PaymentRow:last-child .PaymentCell { 
    border-bottom: 1px solid transparent;
  }

  .PaymentCell {
    border-bottom: 1px solid rgb(246,246,246);
    display: table-cell;
    position: relative;
    vertical-align: middle;
    width: 100%
  }

  .PaymentCell:not(.loading) {
    cursor: pointer;
  }

  .PaymentCell:not(.loading):hover {
    background: rgb(248,243,245);
  }

  .PaymentCell:not(.loading):active {
    background: rgb(241,232,235);
  }

  .PaymentAmountInLocalCurrency {
    font-size: 140%;
    line-height: 2rem;
    position: relative;
    width: 66%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .PaymentOriginalAmount {
    color: rgb(140,140,140);
    font-size: 100%;
    width: 66%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .PaymentCellInner {
    position: relative;
    padding: 1.35rem 1rem 1rem 4.6rem;
  }

  .PaymentCellInside {
    position: relative;
  }

  .PaymentCellInner .CircularIcon {
    position: absolute;
    left: 1.4rem;
    top: 1.4rem;
  }

  .PaymentCellInnerRow1 {
    width: 100%;
    display: block;
  }

  .PaymentAction {
    color: #d7477a;
    right: 0;
    position: absolute;
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border: 1px solid transparent;
    border-radius: 99rem;
  }

  .PaymentAction:hover {
    background: rgba(0,0,0,0.03);
  }
  
  .PaymentAction:active {
    background: rgba(0,0,0,0.08);
  }

  .ChangePaymentRow .PaymentAction {
    top: -0.15rem;
  }

  .ChangeNetworkFeeRow .PaymentAction {
    top: -0.25rem;
  }

  .ChangeNetworkFeeRow .PaymentAmountInLocalCurrency {
    font-size: 130%;
    line-height: 1.8rem;
  }
  
  .ChangeNetworkFeeRow .CircularIcon {
    top: 1.2rem;
  }
`;

export default PaymentCSS;
