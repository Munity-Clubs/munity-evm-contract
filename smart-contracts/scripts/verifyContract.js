const { run } = require("hardhat");

const verify = async (contractAddress, args = []) => {
  if (!contractAddress) {
    throw new Error("Contract address is required for verification.");
  }

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message?.toLowerCase().includes("already verified")) {
      console.log("Already verified.");
    } else {
      throw err;
    }
  }
};

module.exports = { verify };
