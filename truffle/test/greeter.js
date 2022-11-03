const Greeter = artifacts.require("Greeter");

contract('Greeter', () => {
  it('should read default value', async () => {
    const GreeterInstance = await Greeter.deployed();
    const value = (await GreeterInstance.greet.call());

    assert.equal(value, 'Fab', "Fab wasn't the initial value");
  });
});
