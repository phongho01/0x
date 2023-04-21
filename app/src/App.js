import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { debounce } from 'lodash';
import { FaEthereum } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import ABI from "./ABI.json";
import { getQuote } from "./api";
import "./App.css";

const CONTRACT_ADDRESS = "0x8b3035Bf4C2bD9923c3852D953B3222E7E849319";
const sellToken = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // WETH
const buyToken = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; // UNI

export default function App() {
  const [sellAmount, setSellAmount] = useState('1');
  const [buyAmount, setBuyAmount] = useState(0);

  const getOutput = async (input) => {
    try {
      const res = await getQuote({
        sellToken,
        buyToken,
        sellAmount: ethers.utils.parseUnits(input.toString(), 18),
      });
      setBuyAmount(res.data.buyAmount);
    } catch (error) {
      console.log('error', error);
    }
  };

  const debouncedGetOutput = debounce(getOutput, 500);

  const handleChangeInput = (e) => {
    setSellAmount(e.target.value);
    debouncedGetOutput(e.target.value);
  };


  const handleSwap = async () => {
    try {
      const res = await getQuote({
        sellToken,
        buyToken,
        sellAmount: ethers.utils.parseUnits(sellAmount.toString(), 18),
      });

      const { sellTokenAddress, buyTokenAddress, sellAmount : parsedSellAmount, allowanceTarget, to, data: swapData } = res.data;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      await contract.fillQuote(sellTokenAddress, buyTokenAddress, parsedSellAmount, allowanceTarget, to, swapData, {
        value: ethers.utils.parseEther(sellAmount.toString())
      });

    } catch (error) {
      console.log(error);
    }
  };

  const formatUnits = (value) => {
    return Math.round(ethers.utils.formatUnits(value, 18) * 100000) / 100000

  }

  useEffect(() => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then()
      .catch((err) => {
        console.error(err);
      });

      getQuote({
        sellToken,
        buyToken,
        sellAmount: ethers.utils.parseUnits(sellAmount.toString(), 18)
      }).then(res => {
        setBuyAmount(res.data.buyAmount);
      });

  }, []);

  return (
    <div className="App">
      <div className="converter_holder">
        <div className="panel left">
          <div className="content">
            <div className="details">
              <div className="detail-wrap">
                <div className="icon">
                  <FaEthereum />
                </div>
                <div className="text">
                  <span className="symbol">WETH</span>
                  <span className="fullname">Wrap ETH</span>
                </div>
              </div>
              <div className="price">
                <input
                  type="text"
                  value={sellAmount}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="circle" onClick={() => getOutput(sellAmount)}>
          <AiOutlineArrowRight size={24} />
        </div>
        <div className="panel right">
          <div className="content">
            <div className="price">{formatUnits(buyAmount)}</div>
            <div className="details">
              <div className="text">
                <span className="symbol">UNI</span>
                <span className="fullname">UNISWAP</span>
              </div>
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M302 357.8c-9.336 47.9-53.78 77.04-117.9 81.34V488c0 13.25-10.81 24-24.06 24s-23.94-10.75-23.94-24v-50.23c-3.416-.3652-6.512-.2383-10-.7227C99.06 433.4 70.16 424.2 44.66 416l-11.88-3.781c-12.62-3.984-19.66-17.45-15.69-30.11c4-12.62 17.31-19.72 30.12-15.67l12.06 3.844c23.62 7.562 50.38 16.14 73.31 19.22c55.44 7.688 114.8-1.938 122.3-40.86C261.9 312.1 235.8 300 154 279.2l-16.03-4.109C90.25 262.6 1.375 239.4 17.97 154.2c9.334-47.94 53.88-77.02 118.1-81.29V24c0-13.25 10.67-24 23.92-24s24.08 10.75 24.08 24v50.13c3.324 .3574 6.42 .3555 9.812 .8262c17.44 2.422 37.5 7.219 63.16 15.11c12.66 3.891 19.78 17.33 15.88 29.98c-3.875 12.67-17.25 19.8-30 15.89c-23.12-7.109-40.81-11.39-55.66-13.45C132 114.8 72.66 124.4 65.09 163.4C58.97 194.8 78.84 210 150.1 228.6l15.75 4.031C230.4 249.1 318.8 271.6 302 357.8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="btn-swap" onClick={handleSwap}>
        SWAP
      </button>
    </div>
  );
}