export default ()=>{
  return(`

    .TextLeft, .TextLeft * {
      text-align: left;
    }

    .TextCenter, .TextCenter * {
      text-align: center;
    }

    .TextGrey {
      color: grey;
    }

    .ErrorSnippetText {
      background: rgb(30, 30, 20);
      border-radius: 1.2rem;
      border: 0.5rem solid rgb(30, 30, 20);
      color: #00FF41;
      font-size: 0.9rem;
      font-style: italic;
      height: 100px;
      overflow-wrap: break-word;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `)
}
