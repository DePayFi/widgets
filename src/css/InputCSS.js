export default function(){
  return `
    .Input {
      background: none;
      border: 1px solid transparent;
      margin: 0;
      outline: none !important;
      padding: 0;
      width: 100%;
    }

    .Input::placeholder {
      color: rgb(210,210,210);
    }
  `;
}
