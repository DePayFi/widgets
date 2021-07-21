export default (style)=>{
  return(`

    .Card {
      background: rgb(255,255,255);
      border-radius: 0.8rem;
      box-shadow: 0 0 8px rgba(0,0,0,0.03);
      cursor: pointer;
      display: flex;
      flex-direction: row;
      margin-bottom: 0.5rem;
      min-height: 4.78rem;
      padding: 1rem 0.6rem;
    }

    .Card:hover {
      background: rgb(240,240,240);
      box-shadow: 0 0 0 rgba(0,0,0,0); 
    }

    .Card:active {
      background: rgb(235,235,235);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.02); 
    }

    .Card:hover .CardAction {
      opacity: 0.4;
    }

    .CardImage, .CardBody, .CardAction {
      align-items: center;
      display: flex;
      padding: 0 0.4rem;
    }

    .CardAction {
      padding-right: 0;
    }

    .CardAction {
      margin-left: auto;
    }

    .CardBody {
      line-height: 1.4rem;
      padding-left: 0.6rem;
      text-align: left;
    }

    .CardImage img {
      background: rgb(240,240,240);
      border-radius: 99rem;
      border: 1px solid white;
      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
      height: 2.8rem;
      position: relative;
      vertical-align: middle;
      width: 2.8rem;
    }
    
    .CardText {
      font-size: 1.3rem;
    }

    .CardText strong {
      font-weight: 500;
    }

    .CardText small {
      font-size: 1.1rem;
      color: rgb(150,150,150);
    }

    .CardAction {
      opacity: 0.2;
    }

    .Card.More {
      display: inline-block;
      text-align: center;
    }
  `)
}
