import EthersProvider from '../utils/EthersProvider';
import UniswapV2PairAbi from '../abi/UniswapV2PairAbi';
import { ethers } from 'ethers';

const UniswapV2PairContract = function(address){
  return new ethers.Contract(address, UniswapV2PairAbi, EthersProvider());
}

export default UniswapV2PairContract;
