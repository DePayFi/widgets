import isDarkMode from '../helpers/isDarkMode'

export default (style)=>{
  return(`

    .BlockchainLogo {
      border-radius: 6px !important;
    }

    .BlockchainLogo.small {
      border-radius: 4px !important;
      height: 20px;
      width: 20px;
    }

    .BlockchainLogo.bottomRight {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .SolanaPayLogo {
      height: 26px;
      position: relative;
      top: 4px;
    }
    
    .SolanaPayLogo path {
      fill: ${isDarkMode() ? '#FFFFFF' : '#000000'};
    }
  `)
}
