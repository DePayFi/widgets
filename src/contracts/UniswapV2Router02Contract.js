import EthersProvider from '../utils/EthersProvider';
import UniswapV2Router02Abi from '../abi/UniswapV2Router02Abi';
import { ethers } from 'ethers';

const UniswapV2Router02Contract = function(){
  return new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', UniswapV2Router02Abi, EthersProvider());
}

export default UniswapV2Router02Contract;
