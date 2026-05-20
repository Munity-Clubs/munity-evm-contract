const hre = require("hardhat");

async function main() {
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error("No deployer signer available. Set PRIVATE_KEY for live networks.");
  }

  const deployerAddress = await deployer.getAddress();
  console.log(`Network: ${network.name} (${network.config.chainId || "local"})`);
  console.log(`Deployer: ${deployerAddress}`);

  const Munity = await ethers.getContractFactory("Munity");
  const munity = await Munity.deploy();
  await munity.waitForDeployment();

  const contractAddress = await munity.getAddress();
  console.log(`Munity deployed: ${contractAddress}`);

  const shouldVerify =
    process.env.VERIFY === "true" &&
    !["hardhat", "localhost"].includes(network.name);

  if (shouldVerify) {
    const confirmations = Number(process.env.VERIFY_CONFIRMATIONS || 5);
    console.log(`Waiting ${confirmations} confirmations before verification...`);
    await munity.deploymentTransaction().wait(confirmations);

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Verification submitted.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
