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
    padding: 1rem 1.6rem 2.3rem;
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

  .PaymentIcon {
    background: rgba(255,255,255,0.6);
    border-radius: 99rem;
    border: 1px solid transparent;
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
    height: 2rem;
    margin-right: 1rem;
    position: relative;
    vertical-align: middle;
    width: 2rem;
  }

  .PaymentAmountAndSymbol {
    font-size: 160%;
    position: relative;
    vertical-align: middle;
  }

  .PaymentCellRow2{
    color: rgb(140,140,140);
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    white-space: nowrap;
    width: 100%;
  }

  .ChangeNetworkFeeRow .PaymentAmountAndSymbol {
    font-size: 110%;
  }

  .PaymentToLocalCurrency {
    color: rgb(140,140,140);
    font-size: 100%;
    position: absolute;
    top: 0.53rem;
    right: 0;
  }

  .PaymentCellRow1 {
    position: relative;
  }

  .PaymentCellRow2 {
    color: rgb(140,140,140);
    height: 0;
    overflow: hidden;
    position: absolute;
    padding-top: 0.2rem;
    transition: all 0.3s ease;
    width: 100%;
    font-size: 90%;
  }

  .PaymentCell:hover .PaymentCellRow2,
  .PaymentCell:active .PaymentCellRow2 {
    height: 1.9rem;
  }

  .PaymentRowButton {
    color: #d7477a;
    position: absolute;
    right: 2.54rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid transparent;
    border-radius: 99rem;
    margin-top: -0.4rem;
  }

  .PaymentRowButton:hover {
    background: rgba(0,0,0,0.03);
  }
  
  .PaymentRowButton:active {
    background: rgba(0,0,0,0.08);
  }
`;

export default PaymentCSS;
