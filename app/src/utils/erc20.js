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

export const checkAllowance = async (contractAddress, spender, account, amount) => {
    const contract = new ethers.Contract(contractAddress, ERC20ABI, provider);
    const allowance = await contract.allowance(account, spender);
    return allowance >= amount;
}

export const approveERC20 = async (contractAddress, spender) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
    await contract.approve(spender, ethers.constants.MaxUint256);
}