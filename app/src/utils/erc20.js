import ERC20ABI from '../ABI/ERC20.json';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const balanceOf = async (contractAddress, account) => {
    const contract = new ethers.Contract(contractAddress, ERC20ABI, provider);
    return contract.balanceOf(account);
}

export const getContractSymbol = async (contractAddress) => {
    const contract = new ethers.Contract(contractAddress, ERC20ABI, provider);
    return contract.symbol();
}