export default (style)=>{
  return(`

    * {
      color: ${style.colors.text};
    }

    .TextLeft, .TextLeft * {
      text-align: left;
    }

    .TextCenter, .TextCenter * {
      text-align: center;
    }

    .TextGrey {
      color: grey;
    }

    .LineHeightL {
      line-height: 2.0rem;
    }

    .ErrorSnippetText {
      background: rgb(30, 30, 20);
      border-radius: 1.2rem;
      border: 0.5rem solid rgb(30, 30, 20);
      color: #00FF41;
      font-size: 0.9rem;
      font-style: italic;
      max-height: 100px;
      padding: 6px;
      overflow-wrap: break-word;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `)
}
