export default function(style){
  return `

    .Label.highlight {
      background: `+style.colors.primary+`;
      border-radius: 20rem;
      border: 1px solid rgb(210,210,210);
      display: inline-block;
      font-size: 80%;
      padding: 0.1rem 0.6rem 0.15rem;
    }

    .Label.small {
      font-size: 70%;
      padding: 0.1rem 0.5rem 0.15rem;
    }
  `;
}
