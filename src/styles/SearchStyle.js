export default (style)=>{
  return(`

    .Search {
      border-radius: 20px;
      border: 0;
      background: none;
      outline: none !important;
      color: ${style.colors.text};
      font-size: 19px;
      padding: 8px 12px;
      width: 100%;
      position: relative !important; // fixes LastPass extension problem
    }

    .Search.small {
      padding: 4px 8px;
      font-size: 16px;
      border-radius: 6px;
    }

    .Search::placeholder {
      color: rgb(180,180,180);
    } 

    .Search:focus, .Search:focus-visible {
      border: 0;
      background: none;
    }

  `)
}
