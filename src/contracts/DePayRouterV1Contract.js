import EthersProvider from '../utils/EthersProvider';
import DePayRouterV1Abi from '../abi/DePayRouterV1Abi';
import { ethers } from 'ethers';

const DePayRouterV1Contract = function(){
  return new ethers.Contract('0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92', DePayRouterV1Abi, EthersProvider());
}

export default DePayRouterV1Contract;
