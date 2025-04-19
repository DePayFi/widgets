export default (style)=>{
  return(`

    .Card {
      align-items: center;
      background: ${style.colors.cardBackground};
      border: 1px solid transparent;
      border-radius: 13px;
      box-shadow: 0 0 8px rgba(0,0,0,0.03);
      cursor: pointer;
      display: flex;
      flex-direction: row;
      margin-bottom: 8px;
      min-height: 76px;
      padding: 16px 10px;
      width: 100%;
    }

    .Card.transparent {
      background: none;
    }

    .Card:focus:not(.disabled) {
      border: 1px solid ${style.colors.primary};
    }

    .Card.center {
      justify-content: center;
    }

    .Card.Row {
      border-radius: 0;
      margin-bottom: 0;
      box-shadow: none;
      min-height: 69px;
      padding: 7px 21px;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .Card.Row .CardText {
      font-size: 19px;
      line-height: 40px;
    }

    .CardTokenSymbol {
      width: 40%;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .CardTokenFullName {
      width: 100%;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .CardTokenName {
      text-align: right;
      opacity: 0.5;
      width: 60%;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .Card.Row .CardTokenName .CardText {
      font-size: 17px;
    }

    .Card.Row .CardImage {
      width: 40px;
    }

    .Card.Row .CardImage img {
      height: 30px;
      width: 30px;
    }

    a.Card, a.Card * {
      color: inherit;
      text-decoration: none;
    }

    .Card.transparent {
      background: none;
      box-shadow: none;
    }

    .Card.tiny {
      border-radius: 4px;
      min-height: auto;
      padding: 0 3px;
    }
    
    .Card.tiny img {
      width: 18px;
      height: 18px;
      position: relative;
      top: 3px;
      marginRight: 2px;
    }

    .Card.small {
      min-height: auto;
      padding: 8px 8px;
      margin: 0;
    }

    .CardImage.small {
      width: 27px;
    }

    .CardImage.small img {
      height: 27px;
      width: 27px;
    }

    .CardImage.large {
      width: 58px;
    }

    .CardImage.large img {
      height: 58px;
      width: 58px;
    }

    .Card.disabled {
      cursor: default;
    }

    .Card:hover:not(.disabled) {
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 90%, ${style.colors.mixActive} 10%);
      box-shadow: 0 0 0 rgba(0,0,0,0); 
    }

    .Card:active:not(.disabled) {
      background-color: color-mix(in srgb, ${style.colors.cardBackground} 85%, ${style.colors.mixActive} 15%);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.02);
      color: inherit;
    }

    .Card:hover:not(.disabled) .CardAction {
      opacity: 0.4;
    }

    .CardImage, .CardBody, .CardAction, .CardInfo {
      align-items: center;
      display: flex;
      min-width: 0;
      padding: 0 7px;
    }

    .CardImage {
      display: inline-flex;
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: center;
      position: relative;
      width: 58px;
    }

    .CardBody {
      flex-basis: auto;
      flex-grow: 1;
      flex-shrink: 1;
      line-height: 27px;
      padding-left: 10px;
      text-align: left;
    }

    .CardBodyWrapper {
      min-width: 0;
    }

    .CardAction {
      flex-basis: auto;
      flex-shrink: 0;
      flex-grow: 0;
      padding-right: 0;
      margin-left: auto;
    }

    .Card.disabled .CardAction {
      opacity: 0;  
    }

    .CardInfo {
      display: flex;
      flex-basis: auto;
      flex-direction: column;
      flex-grow: 0;
      flex-shrink: 1;
      justify-content: center;
      margin-left: auto; 
      padding-right: 0;
    }

    .CardImage img {
      background: ${style.colors.background};
      border-radius: 9999px;
      border: 1px solid ${style.colors.cardBackground};
      height: 45px;
      position: relative;
      vertical-align: middle;
      width: 45px;
    }

    .CardImage.rounded img {
      border-radius: 8px !important;
    }

    .CardImage.square img {
      border-radius: 0;
    }

    .CardImage img.transparent {
      border: none;
      background: none;
      box-shadow: none;
    }
    
    .CardTitle {
      font-size: 15px;
      color: rgb(150,150,150);
      line-height: 20px;
    }

    .CardText.small .CardTitle {
      line-height: 14px;
    }
    
    .CardText, a .CardText {
      color: ${style.colors.text};
      flex: 1;
      font-size: 21px;
      line-height: 26px;
    }

    .CardText strong {
      font-weight: 500;
    }

    .CardText.small, .CardText.small small {
      font-size: 17px;
      color: rgb(150,150,150);
      line-height: 20px;
    }

    .CardAction {
      opacity: 0.2;
    }

    .Card.inlineBlock {
      display: inline-block;
      width: auto;
    }
    
    .Card.More {
      display: inline-block;
      text-align: center;
    }
  `)
}
