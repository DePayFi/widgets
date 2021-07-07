import React from 'react'
import ReactDOM from 'react-dom'
import { ReactDialog } from '../../src'

describe('close ReactDialog', () => {

  it('closes and unmounts when user clicks ESC', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        let closeDialog = function(){
          ReactDOM.render(
            React.createElement(ReactDialog, { document: document, open: false, close: closeDialog }, React.createElement('h1', {}, 'I am a dialog!')),
            document.getElementById('app')
          );
        }
        
        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true, close: closeDialog }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
        
        cy.get('body').trigger('keydown', { key: "Escape", code: "Escape", which: 27 });
        
        cy.get('.ReactDialog.ReactDialogOpen').should('not.exist');
        cy.get('h1').should('not.exist');
      })
    })
  })

  it('does not close when set to unclosable and unmount when user clicks ESC', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        let closeDialog = function(){
          return false;
        }

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true, close: closeDialog }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
        
        cy.get('body').trigger('keydown', { key: "Escape", code: "Escape", which: 27 });

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
      })
    })
  })

  it('closes and unmounts when user clicks modal background', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        let closeDialog = function(){
          ReactDOM.render(
            React.createElement(ReactDialog, { document: document, open: false, close: closeDialog }, React.createElement('h1', {}, 'I am a dialog!')),
            document.getElementById('app')
          );
        }

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true, close: closeDialog }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
        
        cy.get('.ReactDialogBackground').trigger('click');
        
        cy.get('.ReactDialog.ReactDialogOpen').should('not.exist');
        cy.get('h1').should('not.exist');
      })
    })
  })

  it('does not close when set to unclosable and unmount when user clicks modal background', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        let closeDialog = function(){
          return false;
        }

        ReactDOM.render(
          React.createElement(ReactDialog, { document: document, open: true, close: closeDialog }, React.createElement('h1', {}, 'I am a dialog!')),
          document.getElementById('app')
        );

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
        
        cy.get('.ReactDialogBackground').trigger('click');

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
      })
    })
  })

  it('does not close when set user clicks within the inner dialog content', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        let updateDialog = function(open){
          ReactDOM.render(
            React.createElement(
              ReactDialog,
              { document: document, open: open, close: ()=>updateDialog(false) },
              React.createElement(
                'div',
                { 
                  className: 'ReactDialogInner',
                  style: {
                    position: 'relative'
                  }
                },
                React.createElement('h1', {}, 'I am a dialog!')
              )
            ),
            document.getElementById('app')
          );
        }

        updateDialog(true);

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
        
        cy.get('.ReactDialogCell .ReactDialogInner').trigger('click');

        cy.get('h1').should('exist');
        cy.get('.ReactDialog.ReactDialogOpen').should('exist');
      })
    })
  })
})
