import DePayWidgets from 'dist/cjs/index.js'

describe('Payment', () => {

  it('exports a function to open a Payment dialog', async ()=> {
    expect(typeof DePayWidgets.Payment === 'function').toEqual(true)
  })
});
