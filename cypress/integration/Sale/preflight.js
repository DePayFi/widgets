import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'

describe('Sale widget preflight', () => {
  
  it('requires you to set the amount', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: undefined,
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the amount!')
      })
    })
  })

  it('requires you to set the amount.min', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: {},
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set amount.min!')
      })
    })
  })

  it('requires you to set the amount.step', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: { min: 1 },
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set amount.step!')
      })
    })
  })

  it('requires you to set the amount.start', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: { min: 1, step: 1 },
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set amount.start!')
      })
    })
  })

  it('requires you to set the token', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: { min: 1, step: 1, start: 10 },
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set a token!')
      })
    })
  })

  it('requires you to set blockchains', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: { min: 1, step: 1, start: 10 },
          token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set blockchains!')
      })
    })
  })

  it('requires you to set blockchains', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: { min: 1, step: 1, start: 10 },
          token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          blockchain: [],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set blockchains!')
      })
    })
  })

  it('requires you to set only blockchains that are supported', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Sale({
          document,
          amount: { min: 1, step: 1, start: 10 },
          token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          blockchains: ['notexisting'],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set only supported blockchains!')
      })
    })
  })
})
