export default ()=> {
  cy.wait(1500).then(()=>{
    cy.get('body').then((body) => {
      if (body.find('.ReactShadowDOMOutsideContainer').length > 0) {
        cy.get('.ReactShadowDOMOutsideContainer').shadow().find('button[title="Close dialog"]').click()
      }
      cy.wait(1000)
    })
  })
}
