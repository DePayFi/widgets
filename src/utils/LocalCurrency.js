const LocalCurrency = function(price){
  let displayed = parseFloat(price).toFixed(2);
  return "$"+displayed+" USD";
}

export default LocalCurrency;
