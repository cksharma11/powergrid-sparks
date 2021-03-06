const PowerPlantMarket = require("../../src/model/powerplantMarket");
const chai = require("chai");
const sinon = require("sinon");

describe("PowerPlantMarket", function() {
  const powerplantDetails = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten"
  };

  const powerplants = new PowerPlantMarket(powerplantDetails);

  describe("shuffleDeck", () => {
    it("should shuffle the deck", () => {
      const expectedOutput = ["10", "9"];
      const shuffler = sinon.stub();
      shuffler.onFirstCall().returns(["10", "9"]);
      powerplants.shuffleDeck(shuffler);
      const actualOutput = powerplants.deck;
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe("sellPowerPlant", () => {
    it("should remove given powerplant from the current market", () => {
      powerplants.sellPowerPlant("3");
      const expectedOutput = ["1", "2", "4", "5", "6", "7", "8"];
      const actualOutput = powerplants.currentMarket;
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe("getCurrentMarket", () => {
    it("should remove given powerplant from the current market", () => {
      powerplants.updateCurrentMarket();
      const expectedOutput = ["1", "2", "4", "5", "6", "7", "8", "10"];
      const actualOutput = powerplants.currentMarket;
      chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
    });
  });

  describe("rearrange", function() {
    it("should rearrange current market", function() {
      powerplants.rearrange();
      chai.expect(powerplants.deck).to.be.an("Array");
      chai.expect(powerplants.currentMarket).to.be.of.length(8);
    });
  });
});
