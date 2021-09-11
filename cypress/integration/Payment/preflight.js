import DePayWidgets from '../../../src'
import React from 'react'
import ReactDOM from 'react-dom'

describe('Payment widget preflight', () => {
  
  it('requires you to set a blockchain', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          accept: [{ blockchain: undefined }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the blockchain your want to receive the payment on!')
      })
    })
  })

  it('requires you to set a supported blockchain', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          accept: [{ blockchain: 'notsupported' }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set a supported blockchain!')
      })
    })
  })

  it('requires you to set an amount', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          accept: [{ blockchain: 'ethereum', amount: undefined }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the amount you want to receive as payment!')
      })
    })
  })

  it('requires you to set a token', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          accept: [{ blockchain: 'ethereum', amount: '20', token: undefined }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the token you want to receive as payment!')
      })
    })
  })

  it('requires you to set a receiver', ()=> {
    let criticalError
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document)=>{
        DePayWidgets.Payment({
          document,
          accept: [{ blockchain: 'ethereum', amount: '20', token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', receiver: undefined }],
          critical: (error)=>{ criticalError = error }
        })
      })
      cy.wait(200).then(()=>{
        expect(criticalError.toString()).to.eq('You need to set the receiver address that you want to receive the payment!')
      })
    })
  })
})
