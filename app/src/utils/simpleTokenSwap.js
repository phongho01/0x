import { ethers } from 'ethers';
import SimpleTokenSwap from '../ABI/SimpleTokenSwap.json';

const CONTRACT_ADDRESS = "0x8b3035Bf4C2bD9923c3852D953B3222E7E849319";

export const getSimpleSwapContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, SimpleTokenSwap, signer);
    return contract;
}