export default function(){
  return `

    .TokenList {
      display: table;
      background: white;
      width: 100%;
    }

    .TokenListItem {
      cursor: pointer;
      display: table-row;
      width: 100%;
    }

    .TokenListCell {
      border-bottom: 1px solid rgb(246,246,246);
      display: table-cell;
      padding: 1rem 1.8rem;
      position: relative;
      text-align: left;
      vertical-align: middle;
    }

    .TokenListCell:hover {
      background: rgb(248,243,245);
    }

    .TokenListCell:active {
      background: rgb(241,232,235);
    }

    .TokenListImage {
      height: 2rem;
      width: 2rem;
      margin-right: 1rem;
      vertical-align: middle;
    }
    
    .TokenListSymbol {
      font-size: 120%;
      vertical-align: middle;
    }

    .TokenListName {
      font-size: 90%;
      position: absolute;
      right: 1.8rem;
      padding-top: 0.3rem;
      color: rgb(110,110,110);
      vertical-align: middle;
    }
  `;
}
