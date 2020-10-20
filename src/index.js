import EthersProvider from './utils/EthersProvider';
import Payment from './Payment';
import Sale from './Sale';
import Swap from './Swap';
import TokenSelector from './TokenSelector';
import { ethers } from 'ethers';

ethers.provider = EthersProvider;

window.DePay = {
  ethers,
  Payment,
  Sale,
  Swap,
  TokenSelector
};

export default window.DePay;
