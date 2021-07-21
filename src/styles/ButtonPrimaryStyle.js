export default (style)=>{
  return(`

    .ButtonPrimary {
      background: `+style.colors.primary+`;
      border-radius: 9999rem;
      border: 1px solid transparent;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      color: white;
      display: inline-block;
      font-size: 1.3rem;
      font-weight: 400;
      min-height: 2.96rem;
      min-width: 13rem;
      padding: 0.7rem 1.4rem 0.6rem;
      text-decoration: none;
      transition: background 0.1s;
    }

    .ButtonPrimary.circular {
      padding: 0;
      width: 3.4rem;
      height: 3.4rem;
      line-height: 3.2rem;
    }

    .ButtonPrimary.disabled {
      background: rgb(210,210,210);
    }

    .ButtonPrimary:not(.disabled){
      cursor: pointer;
    }
    .ButtonPrimary:not(.disabled):hover {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);
    }
    .ButtonPrimary:not(.disabled):active {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);
    }
  `)
}
