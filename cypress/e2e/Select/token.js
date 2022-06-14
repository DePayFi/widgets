import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, resetMocks } from '@depay/web3-mock'

describe('Select Widget', () => {

  const blockchain = 'ethereum'
  const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
  beforeEach(resetMocks)
  beforeEach(()=>fetchMock.restore())

  it('shows a widget allowing you to select a token and resolves with the selected token', () => {
    let selectedToken
    
    cy.document().then(async (document)=>{
      DePayWidgets.Select({ document, what: 'token' }).then((token)=>{
        selectedToken = token
      })
      cy.wait(1000).then(()=>{
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Token')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'ETH')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'USDC')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'ETH').click().then(()=>{
          expect(selectedToken['blockchain']).to.equal('ethereum')
          expect(selectedToken['name']).to.equal('Ether')
          expect(selectedToken['symbol']).to.equal('ETH')
          expect(selectedToken['address']).to.equal('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
          expect(selectedToken['decimals']).to.equal(18)
        })
      })
    })
  })

  describe('wrong configuration', ()=>{

    it('renders an error dialog displaying an error if what has not been configured', async()=>{
      cy.document().then(async (document)=>{
        DePayWidgets.Select({ document })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Oops, Something Went Wrong')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ErrorSnippetText', '"what" needs to be configured!')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'If this keeps happening, please report it.')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })

    it('renders an error dialog displaying an error if what has not been configured to something not supported', async()=>{
      cy.document().then(async (document)=>{
        DePayWidgets.Select({ what: 'cows', document })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Oops, Something Went Wrong')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ErrorSnippetText', 'Unknown "what" configured: cows!')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('strong', 'If this keeps happening, please report it.')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Try again').click()
          cy.get('.ReactShadowDOMOutsideContainer').should('not.exist')
        })
      })
    })
  })

  it('autofocuses the search when it opens', async()=> {
    cy.document().then(async (document)=>{
      DePayWidgets.Select({ document, what: 'token' })
      cy.wait(1000).then(()=>{
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Token')
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').should('have.focus')
      })
    })
  })

  it('allows me to change blockchain', async()=> {
    cy.document().then(async (document)=>{
      DePayWidgets.Select({ document, what: 'token' })
      cy.wait(1000).then(()=>{
        cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.small', 'Ethereum').click().then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Blockchain')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row', 'Binance Smart Chain').click().then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Token').then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.small', 'Binance Smart Chain')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'BNB')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'BUSD')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').should('have.focus')
            })
          })
        })        
      })
    })
  })

  describe('search for other tokens', ()=>{
    
    beforeEach(()=>{
      let typing = ""
      "DEPAY".split("").forEach((letter)=>{
        typing += letter
        fetchMock.get({
          url: `https://public.depay.fi/tokens/search?blockchain=ethereum&term=${typing}`,
          overwriteRoutes: true
        }, [{"id":"a24c61a4-f106-4fc4-af9f-9efdd7ef4cc4","blockchain":"ethereum","external_id":"0xa0bed124a09ac2bd941b10349d8d224fe3c955eb","decimals":18,"created_at":"2021-11-15T07:18:00.103Z","updated_at":"2021-12-27T15:21:14.611Z","name":"DePay","symbol":"DEPAY","reserve_usd_k":208,"volume_usd_k":1,"image":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png","project_name":"DePay","website":"http://depay.fi","telegram":"DePayNews","twitter":"DePayFi","github":"DePayFi","description":"DePay simplifies and improves Web3 Payments with the power of DeFi. Accept any token with on-the-fly conversion. The first truly decentralized payment protocol which addresses the downside of centralization. It's built on top of decentralized finance using state-of-the art Web3 technologies in order to offer a seamless payment experience. ETHOnline Finalist 2020, made in Switzerland (Crypto Valley). DePay tools include: - Payments: Accept Cryptocurrencies - Sales: Sell your Token - Donations: Receive Crypto support - Subscriptions: Recurring payments - Swap: Best price swap - Payroll: Payroll streams - Wallet: Payments \u0026 DeFi - Credit: Streams as collateral - DePay PRO: Analytics \u0026 Insights The DePay difference - Chain Agnostic (Multichain) DePay is extensible around any blockchain, ensuring a competitive cross-chain future. - Permissionless No one can be technically excluded from using DePay and no registration is required. - Trustless Every intermediate step is replaced by smart contracts which are connected to decentralized liquidity pools. - Easy to use Our ambition was to create an even easier user experience than you're used to from shopping in current non-crypto e-commerce stores. - Open Source The DePay protocol will always remain open source. - Multinetwork DePay automatically detects \u0026 switches the network if required.","discord":"https://discord.com/invite/smDs5zK","reddit":"https://www.reddit.com/r/DePayFi/","routable":true,"holders":null,"transfers":11700,"latest_transfer":"2021-12-27T00:00:00.000Z","first_transfer":"2020-09-14T00:00:00.000Z","unique_senders":2717,"unique_receivers":3857}])
      })
    })

    it('allows me to search any kind of token and shows a confirmation if I select a searched token', async()=> {
      let selectedToken
    
      cy.document().then(async (document)=>{
        DePayWidgets.Select({ document, what: 'token' }).then((token)=>{
          selectedToken = token
        })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Token')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').type('DEPAY', { force: true }).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'DEPAY').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Confirm Selection')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', 'Please review this information')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://etherscan.io/token/0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"]', '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'Ethereum')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'DEPAY')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'DePay')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'year')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'Thousands')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Confirm').click().then(()=>{
                expect(selectedToken['address']).to.equal("0xa0bed124a09ac2bd941b10349d8d224fe3c955eb")
                expect(selectedToken['blockchain']).to.equal("ethereum")
                expect(selectedToken['decimals']).to.equal(18)
                expect(selectedToken['logo']).to.equal("https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png")
                expect(selectedToken['name']).to.equal("DePay")
                expect(selectedToken['symbol']).to.equal("DEPAY")
              })
            })
          })
        })
      })
    })

    it('shows major tokens again if reseting search to empty', async()=> {
      let selectedToken
    
      cy.document().then(async (document)=>{
        DePayWidgets.Select({ document, what: 'token' }).then((token)=>{selectedToken = token})
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').type('DEPAY', { force: true }).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'DEPAY')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').clear({ force: true }).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'ETH')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'USDC')
            })
          })
        })
      })
    })

    describe('accepts major tokens without confirmation', ()=>{

      beforeEach(()=>{
        let typing = ""
        "ETH".split("").forEach((letter)=>{
          typing += letter
          fetchMock.get({
            url: `https://public.depay.fi/tokens/search?blockchain=ethereum&term=${typing}`,
            overwriteRoutes: true
          }, [{
            blockchain: 'ethereum',
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
            external_id: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          }])
        })
      })

      it('resolves selection without additional confirmation for major tokens', async()=> {
        let selectedToken
      
        cy.document().then(async (document)=>{
          DePayWidgets.Select({ document, what: 'token' }).then((token)=>{
            selectedToken = token
          })
          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Token')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').type('ETH', { force: true }).then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'ETH').click().then(()=>{
                expect(selectedToken['address']).to.equal("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE")
                expect(selectedToken['blockchain']).to.equal("ethereum")
                expect(selectedToken['decimals']).to.equal(18)
                expect(selectedToken['name']).to.equal("Ether")
                expect(selectedToken['symbol']).to.equal("ETH")
              })
            })
          })
        })
      })
    })
  })

  describe('import tokens', ()=>{
    
    it('allows me to import tokens by pasting the token address', async()=>{
      let selectedToken
    
      cy.document().then(async (document)=>{
        DePayWidgets.Select({ document, what: 'token' }).then((token)=>{
          selectedToken = token
        })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Select Token')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('input.Search').type('0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', { force: true }).then(()=>{

            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.Row .CardTokenSymbol .CardText', 'DEPAY').click().then(()=>{
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Confirm Selection')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', 'Please review this information')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://etherscan.io/token/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"]', '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'Ethereum')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'DEPAY')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('td', 'DePay')
              cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.ButtonPrimary', 'Confirm').click().then(()=>{
                expect(selectedToken['address']).to.equal("0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb")
                expect(selectedToken['blockchain']).to.equal("ethereum")
                expect(selectedToken['decimals']).to.equal(18)
                expect(selectedToken['logo']).to.equal("https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png")
                expect(selectedToken['name']).to.equal("DePay")
                expect(selectedToken['symbol']).to.equal("DEPAY")
              })
            })
          })
        })
      })
    })
  })

  describe('intially selected blockchain', ()=> {

    beforeEach(()=>{
      const accounts = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']
      mock({ blockchain: 'bsc', wallet: 'metamask', accounts: { return: accounts } })
    })

    it('automatically selects the currently connected blockchain when widget opens', async()=>{
      cy.document().then(async (document)=>{
        DePayWidgets.Select({ document, what: 'token' })
        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Card.small', 'Binance Smart Chain')
        })
      })
    })
  })
})
