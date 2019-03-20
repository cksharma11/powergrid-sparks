class Turn {
  constructor(players, index = 0) {
    this.players = players;
    this.currentPlayerIndex = index;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex % this.players.length];
  }

  updateCurrentPlayer() {
    this.currentPlayerIndex++;
  }

  resetTurn() {
    this.currentPlayerIndex = 0;
  }

  isLastPlayer() {
    console.log(this.players);
    console.log(this.players.length-1);
    console.log(this.getCurrentPlayer());
    return this.players[this.players.length - 1] == this.getCurrentPlayer();
  }
}

module.exports = Turn;
