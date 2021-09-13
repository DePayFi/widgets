import format from 'src/helpers/format'

describe('format', () => {

  it('formats numbers (especially thousand separators) in local format', () => {
    expect(format(1221)).toEqual('1,221')
  });

  it('does not format numbers below 1', () => {
    expect(format(0.00032)).toEqual('0.00032')
  });

  it('keeps decimals if formatted', () => {
    expect(format(1121.00032)).toEqual('1,121.00032')
  });
});
