import { ethers, upgrades, run } from "hardhat";
import contract from "../deployed/contract.json";

async function main() {
  console.log("========== UPGRADE ==========");
  const SimpleTokenSwap = await ethers.getContractFactory("SimpleTokenSwap");
  await upgrades.upgradeProxy(contract.SimpleTokenSwap, SimpleTokenSwap);

  const simpleTokenSwapImplAddress =
    await upgrades.erc1967.getImplementationAddress(contract.SimpleTokenSwap);
  console.log("simpleTokenSwap verify", simpleTokenSwapImplAddress);
  console.log("========== UPGRADE SUCCESS ==========");

  console.log("========== VERIFY ==========");
  await run("verify:verify", {
    address: "0x132c4959a9C84FB9C0Ed89Bf53654bC818f5B1Dd",
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
