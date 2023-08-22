export default (style)=>{
  return(`

    .Search {
      border-radius: 13px;
      border: 1px solid rgba(0,0,0,0.2);
      background: white;
      outline: none !important;
      color: ${style.colors.text};
      font-size: 19px;
      padding: 13px;
      width: 100%;
    }
    

    .Search::placeholder {
      color: rgb(180,180,180);
    } 

    .Search:focus, .Search:focus-visible {
      border: 1px solid ${style.colors.primary};
    }

  `)
}
