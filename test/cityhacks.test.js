const { catchRevert } = require('./exceptionsHelpers.js');
var CityHacks = artifacts.require('./CityHacks.sol');

contract('CityHacks', function (accounts) {
  const [contractOwner, alice] = accounts;
  const deposit = web3.utils.toBN(2);

  beforeEach(async () => {
    instance = await CityHacks.new();
  });

  it('ready to be solved!', async () => {
    const eth100 = 100e18;
    assert.equal(await web3.eth.getBalance(alice), eth100.toString());
  });

  it('is owned by owner', async () => {
    assert.equal(
      // Hint:
      //   the error `TypeError: Cannot read property 'call' of undefined`
      //   will be fixed by setting the correct visibility specifier. See
      //   the following two links
      //   1: https://docs.soliditylang.org/en/v0.8.5/cheatsheet.html?highlight=visibility#function-visibility-specifiers
      //   2: https://docs.soliditylang.org/en/v0.8.5/contracts.html#getter-functions
      await instance.owner.call(),
      contractOwner,
      'owner is not correct'
    );
  });

  it('should not allow to post a hack without a description', async () => {
    await catchRevert(instance.postHack('', 1, 1, { from: alice }));
  });

  it('should not allow to post a hack without a city', async () => {
    await catchRevert(instance.postHack('test', 0, 1, { from: alice }));
  });

  it('should not allow to post a hack without a category', async () => {
    await catchRevert(instance.postHack('test', 1, 0, { from: alice }));
  });

  it('should allow to post a hack with a city, category and description', async () => {
    await instance.postHack('test', 1, 1, { from: alice });
    const hackPosted = await instance.getAllHacks()[0];

    assert.equal(hackPosted, undefined, 'hack has not been posted');
  });

  it('should emit the appropriate event when a hack is posted', async () => {
    var result = await instance.postHack('test', 1, 1, { from: alice });

    const address = result.logs[0].args.from;
    const hackId = result.logs[0].args.id.toNumber();
    const hackDescription = result.logs[0].args.description;
    const timestamp = result.logs[0].args.timestamp.toNumber();

    const expectedEventResult = {
      address: alice,
      hackId: 1,
      hackDescription: 'test',
    };

    assert.equal(
      expectedEventResult.address,
      address,
      'NewHack event from property not emitted, check PostHack method'
    );
    assert.equal(
      expectedEventResult.hackId,
      hackId,
      'NewHack event id property not emitted, check PostHack method'
    );
    assert.equal(
      expectedEventResult.hackDescription,
      hackDescription,
      'NewHack event description property not emitted, check PostHack method'
    );

    assert.notEqual(
      undefined,
      timestamp,
      'NewHack event timestamp property not emitted, check PostHack method'
    );
  });

  it('should not allow to vote a hack if sender is the original poster', async () => {
    await instance.postHack('test', 1, 1, { from: alice });
    await catchRevert(instance.voteHack(1, true, { from: alice }));
  });

  it('should allow to vote a hack if sender is not the original poster', async () => {
    await instance.postHack('test', 1, 1, { from: contractOwner });
    await catchRevert(instance.voteHack(2, true, { from: alice }));
  });

  it('should not allow to vote the same that has been voted previously', async () => {
    await catchRevert(instance.voteHack(2, true, { from: alice }));
  });

  // it('should emit the appropriate event when a hack is voted', async () => {
  //   await instance.postHack('test', 1, 1, { from: contractOwner });
  //   var result = await instance.voteHack(8, true, { from: alice });
  //   console.log(result);

  //   const address = result.logs[0].args.from;
  //   const hackId = result.logs[0].args.hackId.toNumber();
  //   const votedPositive = result.logs[0].args._positive;
  //   const timestamp = result.logs[0].args.timestamp.toNumber();

  //   const expectedEventResult = {
  //     address: alice,
  //     hackId: 1,
  //     votedPositive: true,
  //   };

  //   assert.equal(
  //     expectedEventResult.address,
  //     address,
  //     'VotedHack event from property not emitted, check VoteHack method'
  //   );
  //   assert.equal(
  //     expectedEventResult.hackId,
  //     hackId,
  //     'VotedHack event hackId property not emitted, check VoteHack method'
  //   );
  //   assert.equal(
  //     expectedEventResult.votedPositive,
  //     votedPositive,
  //     'VotedHack event _positive property not emitted, check VoteHack method'
  //   );

  //   assert.notEqual(
  //     undefined,
  //     timestamp,
  //     'VotedHack event timestamp property not emitted, check VoteHack method'
  //   );
  // });
});
