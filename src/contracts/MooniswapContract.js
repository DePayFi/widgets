import EthersProvider from '../utils/EthersProvider';
import MooniswapAbi from '../abi/MooniswapAbi';
import { ethers } from 'ethers';

const MooniswapContract = function(address){
  return new ethers.Contract(address, MooniswapAbi, EthersProvider());
}

export default MooniswapContract;
