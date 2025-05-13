import round from './round'

function toNonExponential(num) {
  let str = num.toString();
  if (str.includes('e')) {
    const [base, expStr] = str.split('e');
    const exponent = Number(expStr);
    const [intPart, fracPart = ''] = base.split('.');
    const decimals = exponent < 0
      ? fracPart.length + Math.abs(exponent)
      : Math.max(0, fracPart.length - exponent);
    str = num.toFixed(decimals);
  }
  return str;
}

export default function format(input) {
  const num = Number(input);
  if (isNaN(num)) {
    // non-numeric input: return as-is
    return String(input);
  }

  const s = toNonExponential(num);
  // split integer and fractional parts
  const [intPart, fracPart] = s.split('.');

  // don't add separators for numbers below 1 (including negatives between -1 and 1)
  if (Math.abs(num) < 1) {
    return s;
  }

  // format integer part with grouping
  const formattedInt = new Intl.NumberFormat().format(Math.trunc(num));

  // reattach fractional part if present
  return fracPart !== undefined && fracPart.length > 0
    ? `${formattedInt}.${fracPart}`
    : formattedInt;
}
