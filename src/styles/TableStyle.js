export default (style)=>{
  return(`

    .Table {
      border-collapse: separate;
      border-radius: 0.4rem;
      border-style: hidden;
      border: 1px solid rgba(0,0,0,0.1);
      font-size: 94%;
      width: 100%;
    }

    .Table tr.small td {
      font-size: 90%;
    }

    .Table tr td {
      border-bottom: 1px solid rgba(0,0,0,0.1);
      word-break: break-all;
    }
    
    .Table tr:last-child td {
      border-bottom: none;
    }
    
    .Table tr td {
      padding: 0.5rem 0.9rem;
      text-align: left;
    }
    
    .Table tr td:first-child {
      width: 30%
    }

    .Table tr td:last-child {
      width: 70%
    }
    
    .Table .TableSubTitle {
      font-weight: 300;
      opacity: 0.7;
    }

    .Table tr td:last-child {
      font-weight: 500;
    }
  `)
}
