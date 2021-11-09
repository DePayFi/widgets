import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'

describe('Donation widget preflight', () => {
  
  it('requires you to set accept', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          amount: undefined,
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the tokens you accept as donation!')
      })
    })
  })

  it('requires you to set accept', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          amount: undefined,
          accept: [],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the tokens you accept as donation!')
      })
    })
  })

  it('requires you to set the blockchain for each accept configuration', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          accept: [{}],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the blockchain you want to receive the donation on!')
      })
    })
  })

  it('requires you to set a supported blockchain for each accept configuration', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          accept: [{ blockchain: 'muqh' }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set a supported blockchain!')
      })
    })
  })

  it('requires you to set a supported blockchain for each accept configuration', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          accept: [{ blockchain: 'muqh' }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set a supported blockchain!')
      })
    })
  })

  it('requires you to set the token for each accept configuration', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          accept: [{ blockchain: 'ethereum' }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the token you want to receive as donation!')
      })
    })
  })

  it('requires you to set the receiver for each accept configuration', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Donation({
          document,
          accept: [{ blockchain: 'ethereum', token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb' }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the receiver address that you want to receive the donation!')
      })
    })
  })
})
