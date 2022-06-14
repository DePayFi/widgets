import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'

describe('Sale Widget: preflight', () => {
  
  it('requires you to set accept', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to configure at least 1 "blockchain": "token"')
      })
    })
  })

  it('requires you to set accept', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          sale: {},
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to configure at least 1 "blockchain": "token"')
      })
    })
  })

})
