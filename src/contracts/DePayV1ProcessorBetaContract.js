import EthersProvider from '../utils/EthersProvider';
import DePayV1ProcessorBetaAbi from '../abi/DePayV1ProcessorBetaAbi';
import { ethers } from 'ethers';

const DePayV1ProcessorBetaContract = new ethers.Contract('0x9Af62E7A5542FAAc11aA1A06AA30f424736b1775', DePayV1ProcessorBetaAbi, EthersProvider);

export default DePayV1ProcessorBetaContract;
