export default ()=>{
  return(`
        
    .TokenAmountRow {
      min-width: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
    }
    
    .TokenAmountRow.small {
      font-size: 17px;
      line-height: 17px;
    }

    .TokenAmountCell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .TokenSymbolCell {
    }
  `)
}
