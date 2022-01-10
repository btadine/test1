const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const cityHacksContractFactory = await hre.ethers.getContractFactory('CityHacks');
  const cityHacksContract = await cityHacksContractFactory.deploy();
  await cityHacksContract.deployed();

  console.log("Contract deployed to:", cityHacksContract.address);
  console.log("Contract deployed by:", owner.address);

  let hacksCount;
  hacksCount = await cityHacksContract.getTotalHacks();
  console.log(hacksCount.toNumber());

  let postHackTxn = await cityHacksContract.postHack('beers place in plaza catalunya');
  await postHackTxn.wait();

  postHackTxn = await cityHacksContract.connect(randomPerson).postHack('Carrot café is a cool place to work from without paying coworking');
  await postHackTxn.wait(); // Wait for the transaction to be mined

  let allHacks = await cityHacksContract.getAllHacks();
  console.log(allHacks);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();