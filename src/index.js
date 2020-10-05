import EthersProvider from './utils/EthersProvider';
import Payment from './Payment';
import TokenSelector from './TokenSelector';
import { ethers } from 'ethers';

ethers.provider = EthersProvider;

window.DePay = {
  ethers,
  Payment,
  TokenSelector
};

export default window.DePay;
