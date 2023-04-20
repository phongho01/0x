import { ethers, run } from "hardhat";

async function main() {
  console.log("========== DEPLOY ==========");
  const WETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
  const EXCHANGE_PROXY = '0xf91bb752490473b8342a3e964e855b9f9a2a668e';
  const FEE = 500;
  // const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
  // const simpleTokenSwap = await SimpleTokenSwap.deploy(WETH, EXCHANGE_PROXY, FEE);
  // await simpleTokenSwap.deployed();

  // console.log('simpleTokenSwap', simpleTokenSwap.address);
  // console.log("========== DEPLOY SUCCESS ==========");

  console.log("========== VERIFY ==========");
  await run('verify:verify', {
    address: "0x29Faf2B881A47D27DBF537840cDF325847cD7Ea9",
    constructorArguments: [WETH, EXCHANGE_PROXY, FEE]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
