const { expect } = require("chai");
const { ethers } = require("hardhat");

const BASE = 1000n;
const DEFAULT_FEE = 36n;
const PRICE = ethers.parseEther("1");

async function expectRevert(promise, expected) {
  try {
    await promise;
  } catch (err) {
    expect(err.message).to.include(expected);
    return;
  }
  throw new Error(`Expected revert including: ${expected}`);
}

async function deployMunity() {
  const [owner, creator, buyer, other] = await ethers.getSigners();
  const Munity = await ethers.getContractFactory("Munity");
  const munity = await Munity.deploy();
  await munity.waitForDeployment();
  return { munity, owner, creator, buyer, other };
}

async function registerDefault(munity, creator, overrides = {}) {
  const price = overrides.price ?? PRICE;
  const supply = overrides.supply ?? 100n;
  const discount = overrides.discount ?? 0n;
  const uri = overrides.uri ?? "ipfs://munity/community/1";
  const tx = await munity.connect(creator).registerCommunity(price, supply, discount, uri);
  await tx.wait();
  return { id: 1n, price, supply, discount, uri };
}

describe("Munity", function () {
  it("deploys with the expected metadata and default fee", async function () {
    const { munity } = await deployMunity();

    expect(await munity.name()).to.equal("Munity");
    expect(await munity.symbol()).to.equal("MU");
    expect(await munity.getCommunityFee()).to.equal(DEFAULT_FEE);
    expect(await munity.totalCommunities()).to.equal(0n);
  });

  it("registers a community and configures ERC2981 royalties", async function () {
    const { munity, creator } = await deployMunity();
    const registered = await registerDefault(munity, creator, {
      supply: 25n,
      discount: 100n,
      uri: "ipfs://munity/community/custom",
    });

    const details = await munity.getCommunityDetails(registered.id);
    expect(details.price).to.equal(PRICE);
    expect(details.supply).to.equal(25n);
    expect(details.discount).to.equal(100n);
    expect(details.creator).to.equal(creator.address);
    expect(await munity.uri(registered.id)).to.equal(registered.uri);
    expect(await munity.totalCommunities()).to.equal(1n);

    const royalty = await munity.royaltyInfo(registered.id, 10000n);
    expect(royalty[0]).to.equal(creator.address);
    expect(royalty[1]).to.equal(350n);
  });

  it("rejects invalid community registration inputs", async function () {
    const { munity, creator } = await deployMunity();

    await expectRevert(
      munity.connect(creator).registerCommunity(0n, 1n, 0n, "ipfs://x"),
      "PriceCantBeZero",
    );
    await expectRevert(
      munity.connect(creator).registerCommunity(PRICE, 0n, 0n, "ipfs://x"),
      "SupplyCantBeZero",
    );
    await expectRevert(
      munity.connect(creator).registerCommunity(PRICE, 1n, BASE + 1n, "ipfs://x"),
      "InvalidDiscount",
    );
  });

  it("buys keys, updates supply, and splits the platform fee", async function () {
    const { munity, owner, creator, buyer } = await deployMunity();
    await registerDefault(munity, creator, { supply: 10n });

    const amount = 2n;
    const total = PRICE * amount;
    const ownerFee = (total * DEFAULT_FEE) / BASE;
    const creatorTake = total - ownerFee;

    const ownerBefore = await ethers.provider.getBalance(owner.address);
    const creatorBefore = await ethers.provider.getBalance(creator.address);

    await (await munity.connect(buyer).buy(1n, amount, { value: total })).wait();

    expect(await munity.balanceOf(buyer.address, 1n)).to.equal(amount);
    expect(await munity.getMinting(buyer.address, 1n)).to.equal(amount);
    const details = await munity.getCommunityDetails(1n);
    expect(details.supply).to.equal(8n);
    expect(await ethers.provider.getBalance(owner.address)).to.equal(ownerBefore + ownerFee);
    expect(await ethers.provider.getBalance(creator.address)).to.equal(creatorBefore + creatorTake);
    expect(await ethers.provider.getBalance(await munity.getAddress())).to.equal(0n);
  });

  it("applies whitelist discounts and refunds excess payment", async function () {
    const { munity, owner, creator, buyer } = await deployMunity();
    await registerDefault(munity, creator, { supply: 10n, discount: 500n });
    await (await munity.connect(creator).addWhiteListing(1n, [buyer.address])).wait();

    const amount = 2n;
    const discountedUnit = PRICE / 2n;
    const discountedTotal = discountedUnit * amount;
    const ownerFee = (discountedTotal * DEFAULT_FEE) / BASE;
    const creatorTake = discountedTotal - ownerFee;

    const ownerBefore = await ethers.provider.getBalance(owner.address);
    const creatorBefore = await ethers.provider.getBalance(creator.address);

    await (await munity.connect(buyer).buy(1n, amount, { value: PRICE * amount })).wait();

    expect(await munity.balanceOf(buyer.address, 1n)).to.equal(amount);
    expect(await ethers.provider.getBalance(owner.address)).to.equal(ownerBefore + ownerFee);
    expect(await ethers.provider.getBalance(creator.address)).to.equal(creatorBefore + creatorTake);
    expect(await ethers.provider.getBalance(await munity.getAddress())).to.equal(0n);
  });

  it("allows creators to mint their own community keys without payment", async function () {
    const { munity, creator } = await deployMunity();
    await registerDefault(munity, creator, { supply: 3n });

    await (await munity.connect(creator).buy(1n, 2n)).wait();

    expect(await munity.balanceOf(creator.address, 1n)).to.equal(2n);
    const details = await munity.getCommunityDetails(1n);
    expect(details.supply).to.equal(1n);
  });

  it("enforces amount, supply, and per-wallet mint limits", async function () {
    const { munity, creator, buyer } = await deployMunity();
    await registerDefault(munity, creator, { supply: 60n });

    await expectRevert(munity.connect(buyer).buy(1n, 0n), "AmountCantBeZero");
    await (await munity.connect(buyer).buy(1n, 50n, { value: PRICE * 50n })).wait();
    await expectRevert(
      munity.connect(buyer).buy(1n, 1n, { value: PRICE }),
      "LimitExceeded",
    );

    const { munity: limited, creator: limitedCreator, buyer: limitedBuyer } = await deployMunity();
    await registerDefault(limited, limitedCreator, { supply: 2n });
    await expectRevert(
      limited.connect(limitedBuyer).buy(1n, 3n, { value: PRICE * 3n }),
      "NotEnoughSupply",
    );
  });

  it("restricts platform fee changes to owner and caps the value", async function () {
    const { munity, buyer } = await deployMunity();

    await expectRevert(
      munity.connect(buyer).changeCommunityFee(50n),
      "OwnableUnauthorizedAccount",
    );
    await expectRevert(munity.changeCommunityFee(101n), "FeeTooHigh");

    await (await munity.changeCommunityFee(100n)).wait();
    expect(await munity.getCommunityFee()).to.equal(100n);
  });

  it("blocks ERC1155 receiver reentrancy during buy", async function () {
    const { munity, creator, buyer } = await deployMunity();
    await registerDefault(munity, creator, { supply: 10n });

    const ReentrantBuyer = await ethers.getContractFactory("ReentrantBuyer");
    const attacker = await ReentrantBuyer.deploy(await munity.getAddress());
    await attacker.waitForDeployment();

    await (await attacker.connect(buyer).attack(1n, 1n, { value: PRICE })).wait();

    const attackerAddress = await attacker.getAddress();
    expect(await attacker.attempted()).to.equal(true);
    expect(await attacker.blocked()).to.equal(true);
    expect(await munity.balanceOf(attackerAddress, 1n)).to.equal(1n);
    expect(await munity.getMinting(attackerAddress, 1n)).to.equal(1n);
  });
});
