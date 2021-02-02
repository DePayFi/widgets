export default function(style){
  return `
    .CallToAction {
      background: `+style.colors.primary+`;
      border-radius: 999rem;
      border: 1px solid transparent;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      color: white;
      display: inline-block;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.1s;
    }

    .CallToAction:not(.disabled){
      cursor: pointer;
    }

    .CallToAction:not(.disabled):hover {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);
    }

    .CallToAction:not(.disabled):active {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);
    }
  `; 
}
