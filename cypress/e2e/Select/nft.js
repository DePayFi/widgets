import DePayWidgets from '../../../src'
import fetchMock from 'fetch-mock'
import React from 'react'
import ReactDOM from 'react-dom'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { Token } from '@depay/web3-tokens'

describe('Select Widget: nft', () => {

  let provider
  let blockchain
  let selectedNFT
  let contractAddress
  
  beforeEach(()=>{
    resetMocks()
    resetCache()
    fetchMock.restore()
    selectedNFT = undefined
  })

  describe('evm', ()=>{
  
    describe('ERC-721', ()=>{

      beforeEach(async()=>{
        blockchain = 'ethereum'
        provider = await getProvider(blockchain)
        mock({ blockchain, provider })
        contractAddress = "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"
        mock({
          blockchain,
          provider,
          request: {
            to: contractAddress,
            api: Token[blockchain][1155],
            method: 'balanceOf',
            params: [contractAddress, 1],
            return: new Error('no balance with id')
          }
        })
      })

      it('allows you to select a ERC-721 NFT', ()=>{
        cy.document().then(async (document)=>{
          DePayWidgets.Select({ document, what: 'nft' }).then((nft)=>{
            selectedNFT = nft
          })
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTTokenAddress').type(contractAddress, { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTName').type('CryptoPunks', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTImage').type('https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&dpr=1&w=384', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTLink').type('https://opensea.io/collection/cryptopunks', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary', 'Continue').click()

          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Confirm Selection')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', 'Please review this information')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Ethereum')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://opensea.io/collection/cryptopunks"]', 'CryptoPunks')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://etherscan.io/token/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"]', '0xb47e3c...193bbb')

            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.active .ButtonPrimary', 'Confirm').click()
            
            cy.wait(1000).then(()=>{
              expect(selectedNFT.address).to.eq('0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb')
              expect(selectedNFT.blockchain).to.eq('ethereum')
              expect(selectedNFT.image).to.eq("https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&dpr=1&w=384")
              expect(selectedNFT.link).to.eq("https://opensea.io/collection/cryptopunks")
              expect(selectedNFT.name).to.eq("CryptoPunks")
              expect(selectedNFT.type).to.eq("721")
            })
          })
        })
      })
    })

    describe('ERC-1155', ()=>{

      beforeEach(async()=>{
        blockchain = 'ethereum'
        provider = await getProvider(blockchain)
        mock({ blockchain, provider })
        contractAddress = "0x495f947276749ce646f68ac8c248420045cb7b5e"
        mock({
          blockchain,
          provider,
          request: {
            to: contractAddress,
            api: Token[blockchain][1155],
            method: 'balanceOf',
            params: [contractAddress, 1],
            return: "0"
          }
        })
      })

      it('allows you to select a ERC-1155 NFT', ()=>{
        cy.document().then(async (document)=>{
          DePayWidgets.Select({ document, what: 'nft' }).then((nft)=>{
            selectedNFT = nft
          })
          
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTTokenAddress').type(contractAddress, { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTName').type('Stone - 90,000 BC', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTTokenId').type('35347623114821255323888368639026081793120226253597860997754787919489216283624', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTImage').type('https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=128 128w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=256 256w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=384 384w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=512 512w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=640 640w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=750 750w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=828 828w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=1080 1080w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=1200 1200w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=1920 1920w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=2048 2048w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=3840 3840w', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTLink').type('https://opensea.io/collection/depay-token-evolution', { force: true })
          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary', 'Continue').click()

          cy.wait(1000).then(()=>{
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Confirm Selection')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', 'Please review this information')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Ethereum')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://opensea.io/collection/depay-token-evolution"]', 'Stone - 90,000 BC')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://etherscan.io/token/0x495f947276749ce646f68ac8c248420045cb7b5e"]', '0x495f94...cb7b5e')
            cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('35347623114821255323888368639026081793120226253597860997754787919489216283624')

            cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.active .ButtonPrimary', 'Confirm').click()
            
            cy.wait(1000).then(()=>{
              expect(selectedNFT.address).to.eq('0x495f947276749ce646f68ac8c248420045cb7b5e')
              expect(selectedNFT.blockchain).to.eq('ethereum')
              expect(selectedNFT.id).to.eq("35347623114821255323888368639026081793120226253597860997754787919489216283624")
              expect(selectedNFT.image).to.eq("https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=128 128w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=256 256w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=384 384w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=512 512w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=640 640w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=750 750w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=828 828w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=1080 1080w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=1200 1200w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=1920 1920w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=2048 2048w, https://i.seadn.io/gae/jv6BJbVYH9KasHqYYwSPLNegL_d4SWf5tZkkPwrzWLKMcNT9BcOLrjK2Wn-oaRbWWSZ_TOWaTyn-cyXuuTnDxlSPdkhaYJelDRNMyjo?auto=format&dpr=1&w=3840 3840w")
              expect(selectedNFT.link).to.eq("https://opensea.io/collection/depay-token-evolution")
              expect(selectedNFT.name).to.eq("Stone - 90,000 BC")
              expect(selectedNFT.type).to.eq("1155")
            })
          })
        })
      })
    })
  })

  describe('solana', ()=>{
  
    describe('list of metaplex mints', ()=>{

      let mintAddresses

      beforeEach(async()=>{
        blockchain = 'solana'
        provider = await getProvider(blockchain)
        mock({ blockchain, provider })
        mintAddresses = ["4RYP3yX52g3BawgS4ShHwJqbrm8FcUF8PPA4oP1eP6Cv", "5GAse3WFPMCmbrw5x1RVdRaBttReBrgFLkw7yyqbSqtn"]
      })

      it('allows you to select a list of MINTS on solana', ()=>{
        cy.document().then(async (document)=>{
          DePayWidgets.Select({ document, what: 'nft' }).then((nft)=>{
            selectedNFT = nft
          })
        })

        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTTokenAddresses').type(mintAddresses.join("\n"), { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTName').type('SOL - AD 2020', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTImage').type('https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Farweave.net%2FevHbhPvYxPn3NgtzeHg3WPS-QFwGdibQwTvY8chccrA%3Fext%3Dpng', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('#DePayWidgetsEnterNFTLink').type('https://magiceden.io/marketplace/depay', { force: true })
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.ButtonPrimary', 'Continue').click()

        cy.wait(1000).then(()=>{
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('h1', 'Confirm Selection')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('.Alert', 'Please review this information')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('Solana')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains('a[href="https://magiceden.io/marketplace/depay"]', 'SOL - AD 2020')
          cy.get('.ReactShadowDOMOutsideContainer').shadow().contains(mintAddresses.join(", "))

          cy.get('.ReactShadowDOMOutsideContainer').shadow().find('.active .ButtonPrimary', 'Confirm').click()
          
          cy.wait(1000).then(()=>{
            expect(JSON.stringify(selectedNFT.addresses)).to.eq(JSON.stringify(mintAddresses))
            expect(selectedNFT.blockchain).to.eq('solana')
            expect(selectedNFT.image).to.eq("https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Farweave.net%2FevHbhPvYxPn3NgtzeHg3WPS-QFwGdibQwTvY8chccrA%3Fext%3Dpng")
            expect(selectedNFT.link).to.eq("https://magiceden.io/marketplace/depay")
            expect(selectedNFT.name).to.eq("SOL - AD 2020")
            expect(selectedNFT.type).to.eq("metaplex")
          })
        })
      })
    })
  })
})
