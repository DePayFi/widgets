export default function(address, length = 4){
  if(address === undefined) { return address }
  let _address = "";
  _address += address.slice(0,length+2);
  _address += '...';
  _address += address.slice(address.length-length, address.length);
  return _address;
}
