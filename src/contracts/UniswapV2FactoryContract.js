import EthersProvider from '../utils/EthersProvider';
import UniswapV2FactoryAbi from '../abi/UniswapV2FactoryAbi';
import { ethers } from 'ethers';

const UniswapV2FactoryContract = function(){
  return new ethers.Contract('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', UniswapV2FactoryAbi, EthersProvider());
}

export default UniswapV2FactoryContract;
