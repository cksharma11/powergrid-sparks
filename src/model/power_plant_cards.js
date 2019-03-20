class PowerPlantMarket {
  constructor(cards) {
    this.cards = cards;
    this.deck = Object.keys(this.cards);
    this.currentMarket = this.deck.splice(0, 8);
  }

  shuffleDeck(shuffler) {
    this.deck = shuffler(this.deck);
  }

  sellPowerPlant(powerplant) {
    this.currentMarket.splice(this.currentMarket.indexOf(powerplant), 1);
  }

  getCurrentPowerPlants() {
    const currentCards = {};
    this.currentMarket.forEach(card => (currentCards[card] = this.cards[card]));
    return currentCards;
  }

  updateCurrentMarket() {
    const newPowerPlant = this.deck.shift();
    this.currentMarket.push(newPowerPlant);
    this.currentMarket = this.currentMarket.sort((x, y) => x - y);
  }

  addSelectedPowerPlant(powerplantCost) {
    this.currentMarket.forEach(powerplant => {
      this.cards[powerplant].isSelected = false;
      if (powerplant == powerplantCost) {
        this.cards[powerplant].isSelected = true;
      }
    });
  }

  rearrange() {
    const lastCard = this.currentMarket.pop();
    this.updateCurrentMarket();
    this.deck.push(lastCard);
  }
}

module.exports = PowerPlantMarket;
