import EthersProvider from '../utils/EthersProvider';
import MooniFactoryAbi from '../abi/MooniFactoryAbi';
import { ethers } from 'ethers';

const MooniFactoryContract = new ethers.Contract('0x71cd6666064c3a1354a3b4dca5fa1e2d3ee7d303', MooniFactoryAbi, EthersProvider);

export default MooniFactoryContract;
