import format from 'src/helpers/format'

describe('format', () => {

  it('formats numbers (especially thousand separators) in local format', () => {
    expect(format(1221)).toEqual('1,221')
  });

  it('does format numbers below 0', () => {
    expect(format(0.00032)).toEqual(0.00032)
  });
});
