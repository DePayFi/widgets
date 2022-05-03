export default ()=>{
  return(`

    .ButtonCircular {
      border-radius: 9999px;
      cursor: pointer;
      height: 34px;
      opacity: 0.5;
      padding: 5px 4px 4px 4px;
      width: 34px;
    }

    .ButtonCircular:hover {
      background: rgba(0,0,0,0.1);
      opacity: 1;
    }

    .ButtonCircular:active {
      background: rgba(0,0,0,0.25);
      opacity: 1;
    }
  `)
}
