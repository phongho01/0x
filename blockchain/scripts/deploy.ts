import { ethers, run, upgrades } from "hardhat";

async function main() {
  console.log("========== DEPLOY ==========");
  const accounts = await ethers.getSigners();
  const WETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
  const EXCHANGE_PROXY = "0xf91bb752490473b8342a3e964e855b9f9a2a668e";
  const FEE = 500;
  const PARTNER = accounts[0].address;
  console.log(PARTNER);
  const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
  const simpleTokenSwap = await upgrades.deployProxy(SimpleTokenSwap, [
    WETH,
    EXCHANGE_PROXY,
    FEE,
    PARTNER
  ]);
  // const simpleTokenSwap = await SimpleTokenSwap.deploy(WETH, EXCHANGE_PROXY);
  await simpleTokenSwap.deployed();

  const simpleTokenSwapImplAddress =
    await upgrades.erc1967.getImplementationAddress(simpleTokenSwap.address);
  console.log("simpleTokenSwap proxy", simpleTokenSwap.address);
  console.log("simpleTokenSwap verify", simpleTokenSwapImplAddress);

  console.log("========== DEPLOY SUCCESS ==========");

  console.log("========== VERIFY ==========");
  await run("verify:verify", {
    address: simpleTokenSwap.address,
  });

  // await run("verify:verify", {
  //   address: "0x22C74FA9FFb4e97AB62B563C6340c72120a490bB",
  //   constructorArguments: [WETH, EXCHANGE_PROXY],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
