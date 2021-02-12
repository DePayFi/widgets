import EthersProvider from '../utils/EthersProvider';
import DePayPaymentsV1Abi from '../abi/DePayPaymentsV1Abi';
import { ethers } from 'ethers';

const DePayPaymentsV1Contract = new ethers.Contract('0xa5eC11D6A58B5cC03d1F28DEbB5077d41287ACD2', DePayPaymentsV1Abi, EthersProvider);

export default DePayPaymentsV1Contract;
