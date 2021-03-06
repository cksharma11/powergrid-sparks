const request = require("supertest");
const app = require("../../app");
const Game = require("../../src/model/game");
const Player = require("../../src/model/player");
const PowerPlantMarket = require("../../src/model/powerplantMarket");
const Turn = require("../../src/model/turn");

const powerplantsCards = {
  "3": {
    resource: {
      type: "Oil",
      quantity: 2
    },
    city: 1,
    inDeck: true
  },
  "4": {
    resource: {
      type: "Coal",
      quantity: 2
    },
    city: 1,
    inDeck: true
  },
  "5": {
    resource: {
      type: "Hybrid",
      quantity: 2
    },
    city: 1,
    inDeck: true
  },
  "6": {
    resource: {
      type: "Garbage",
      quantity: 1
    },
    city: 1,
    inDeck: true
  },
  "7": {
    resource: {
      type: "Oil",
      quantity: 3
    },
    city: 2,
    inDeck: true
  },
  "8": {
    resource: {
      type: "Coal",
      quantity: 3
    },
    city: 2,
    inDeck: true
  },
  "9": {
    resource: {
      type: "Oil",
      quantity: 1
    },
    city: 1,
    inDeck: true
  },
  "10": {
    resource: {
      type: "Coal",
      quantity: 2
    },
    city: 2,
    inDeck: true
  },
  "11": {
    resource: {
      type: "Uranium",
      quantity: 1
    },
    city: 2,
    inDeck: true
  },
  "12": {
    resource: {
      type: "Hybrid",
      quantity: 2
    },
    city: 2,
    inDeck: true
  },
  "13": {
    type: "Ecolgical",
    inputs: 0,
    output: 1,
    inDeck: true
  },
  "14": {
    resource: {
      type: "Garbage",
      quantity: 2
    },
    city: 2,
    inDeck: true
  },
  "15": {
    resource: {
      type: "Coal",
      quantity: 2
    },
    city: 3,
    inDeck: true
  }
};

describe("GET /", () => {
  it("should give the homepage with response code 200", done => {
    request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });

  it("should redirect to gameplay if valid cookie is set", done => {
    app.activeGames["3"] = new Game(2);
    app.cookies["123"] = "Ankon";
    request(app)
      .get("/")
      .set("Cookie", ["gameId=3;playerId=123"])
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });

  it("should redirect to gameplay if valid cookie is set", done => {
    app.activeGames["3"] = new Game(0);
    app.cookies["123"] = "Ankon";
    request(app)
      .get("/")
      .set("Cookie", ["gameId=3;playerId=123"])
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });
});

describe("POST /createGame", () => {
  it("should give the waiting page with response code 200", done => {
    request(app)
      .post("/createGame")
      .send({ body: "chandan" })
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });
});

describe("POST /joinGame", () => {
  it("should redirect to the homepage if id is incorrect", done => {
    app.activeGames["2"] = new Game(2);
    request(app)
      .post("/joinGame")
      .send("username=chandan&gameId=1")
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });

  it("should give the waiting page with response code 200 if the id is correct", done => {
    request(app)
      .post("/joinGame")
      .send("username=chandan&gameId=2")
      .expect("Content-Type", /plain/)
      .expect(302, done);
  });

  it("should show that the game has started if game is already active", done => {
    app.activeGames["2"] = new Game(2);
    app.activeGames["2"].start();
    request(app)
      .post("/joinGame")
      .send("username=chandan&gameId=2")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});

describe("GET /createGame", () => {
  it("should give the waiting page with response code 200", done => {
    app.activeGames["2"] = new Game(1);
    request(app)
      .get("/createGame?gameId=2")
      .expect(200, done);
  });

  it("should give to the gameplay page if max player has joined", done => {
    app.activeGames["2"] = new Game(0);
    request(app)
      .get("/createGame?gameId=2")
      .expect(200, done);
  });
});

describe("GET /gameplay", () => {
  it("should show the gameplay page with response code 200", done => {
    app.activeGames["2"] = new Game(0);
    request(app)
      .get("/gameplay")
      .set("Cookie", ["gameId=2;playerId=12345"])
      .expect(200, done);
  });
});

describe("GET /powerplantMarket", () => {
  it("should return the powerplants with status code 200", done => {
    app.activeGames["11"] = new Game(2);
    app.activeGames["11"].powerplantMarket = new PowerPlantMarket(
      powerplantsCards
    );
    app.cookies["12345"] = "Ankon";
    request(app)
      .get("/powerplantMarket")
      .set("Cookie", ["gameId=11;playerId=12345"])
      .expect("Content-Type", /html/)
      .expect(200, done);
  });
});

describe("GET /waitingPage", () => {
  it("should show the waiting page with response code 200", done => {
    app.activeGames["2"] = new Game(2);
    request(app)
      .get("/waitingPage")
      .set("Cookie", ["gameId=2;playerId=12345"])
      .expect(200, done);
  });
});

describe("GET /invalidGameId", () => {
  it("should show the join page with error message", done => {
    request(app)
      .get("/invalidGameId")
      .expect(200, done);
  });
});

describe("GET /currentPlayer", () => {
  it("should return response code 200 if cookie is present", done => {
    app.activeGames["5"] = new Game(2);
    app.cookies["1234"] = "Ankon";
    request(app)
      .get("/currentPlayer")
      .set("Cookie", ["gameId=5;playerId=1234"])
      .expect(200, done);
  });
});

describe("GET /currentPlayer/update", () => {
  it("should return response code 200 if cookie is present", done => {
    app.activeGames["5"] = new Game(2);
    app.cookies["1234"] = "Ankon";
    request(app)
      .get("/currentPlayer/update")
      .set("Cookie", ["gameId=5;playerId=1234"])
      .expect(200, done);
  });
});

describe("POST /resources/buy", function() {
  it("should return code 200 if resource data is registered succesfully", done => {
    app.activeGames["9"] = new Game(2);
    app.cookies["99"] = "Ankon";
    const player1 = new Player("red", "Ankon");
    const player2 = new Player("black", "Gaurav");
    app.activeGames["9"].addPlayer(player1);
    app.activeGames["9"].addPlayer(player2);
    const turn = app.activeGames["9"].getTurn([player1, player2]);
    turn.currentPlayerIndex = 0;
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=9;playerId=99"])
      .send("Coal=1&Uranium=1&Oil=1&Garbage=1&Cost=10")
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    app.activeGames["9"] = new Game(1);
    app.cookies["99"] = "Ankon";
    const player1 = new Player("red", "Ankon");
    app.activeGames["9"].addPlayer(player1);
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=9;playerId=99"])
      .send("Coal=1&Uranium=1&Oil=1&Garbage=1&Cost=10")
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    app.activeGames["99"] = new Game(2);
    app.cookies["999"] = "Ankon";
    const player1 = new Player("red", "Ankon");
    const player2 = new Player("black", "Gaurav");
    app.activeGames[99].addPlayer(player1);
    app.activeGames[99].addPlayer(player2);
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=99;playerId=999"])
      .send("Coal=1&Uranium=1&Oil=1&Garbage=10&Cost=100")
      .expect(200, done);
  });
});

describe("GET /passBuyingResources", function() {
  it("should return code 200 the user passed", done => {
    app.activeGames["9"] = new Game(2);
    app.cookies["99"] = "Ankon";
    app.cookies["999"] = "Gaurav";
    const player1 = new Player("red", "Ankon");
    const player2 = new Player("black", "Gaurav");
    app.activeGames["9"].addPlayer(player1);
    app.activeGames["9"].addPlayer(player2);
    const turn = app.activeGames["9"].getTurn([player1]);
    turn.currentPlayerIndex = 0;
    request(app)
      .get("/passBuyingResources")
      .set("Cookie", ["gameId=9;playerId=99"])
      .expect(200, done);
  });
});

describe("GET /passBuildingCities", function() {
  it("should return code 200 the user passed", done => {
    app.activeGames["9"] = new Game(1);
    app.cookies["99"] = "Ankon";
    const player1 = new Player("red", "Ankon");
    app.activeGames["9"].addPlayer(player1);
    const turn = app.activeGames["9"].getTurn([player1]);
    turn.currentPlayerIndex = 0;
    request(app)
      .get("/passBuildingCities")
      .set("Cookie", ["gameId=9;playerId=99"])
      .expect(200, done);
  });
});

describe("POST /cities/build", () => {
  it("should  add the city details to the player who buys if player has enough money", done => {
    app.activeGames["99"] = new Game(2);
    app.cookies["999"] = "Ankon";
    const player1 = new Player("red", "Ankon");
    const player2 = new Player("black", "Gaurav");
    app.activeGames[99].addPlayer(player1);
    app.activeGames[99].addPlayer(player2);
    request(app)
      .post("/cities/build")
      .send(`price=10&cityCount=2&cityNames=maimi_10`)
      .set("Cookie", ["gameId=99;playerId=999"])
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    app.activeGames["9"] = new Game(1);
    app.cookies["99"] = "Ankon";
    const player1 = new Player("red", "Ankon");
    app.activeGames["9"].addPlayer(player1);
    request(app)
      .post("/cities/build")
      .set("Cookie", ["gameId=9;playerId=99"])
      .send(`price=10&cityCount=2&cityNames=maimi_10`)
      .expect(200, done);
  });

  it("should not  add the city details to the player who buys if player has not enough money", done => {
    app.activeGames["99"] = new Game(1);
    app.cookies["999"] = "Ankon";
    const player = new Player("red", "Ankon");
    app.activeGames[99].addPlayer(player);
    request(app)
      .post("/cities/build")
      .send(`price=60&cityCount=6&cityNames=maimi_10`)
      .set("Cookie", ["gameId=99;playerId=999"])
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    const player1 = new Player("green", "naman");
    player1.addPowerplant({
      value: "3",
      resource: {
        type: "Hybrid",
        quantity: 2
      },
      city: 1
    });
    app.activeGames["869"] = new Game(2);
    app.activeGames["869"].addPlayer(player1);
    app.cookies["863"] = "naman";
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=869;playerId=863"])
      .send("Coal=1_2&Uranium=&Oil=1_2,1_3,1_4,1_5,1_6,1_7&Garbage=&Cost=150")
      .expect(200, done);
  });
});

describe("GET /players", () => {
  it("should return the details of the players with response code 200", done => {
    app.activeGames["99"] = new Game(1);
    app.cookies["999"] = "Ankon";
    const player = new Player("red", "Ankon");
    app.activeGames[99].addPlayer(player);
    request(app)
      .get("/players")
      .set("Cookie", ["gameId=99;playerId=999"])
      .expect(200, done);
  });
  it("should return code 200 if resource data is registered succesfully", done => {
    const player1 = new Player("green", "naman");
    player1.addPowerplant({
      value: "3",
      resource: {
        type: "Oil",
        quantity: 2
      },
      city: 1
    });
    app.activeGames["5"] = new Game(2);
    app.activeGames["5"].addPlayer(player1);
    app.cookies["1234"] = "Ankon";
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=5;playerId=1234"])
      .send("Coal=1&Uranium=1&Oil=1&Garbage=1")
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    const player1 = new Player("green", "naman");
    player1.addPowerplant({
      value: "3",
      resource: {
        type: "Oil",
        quantity: 2
      },
      city: 1
    });
    app.activeGames["8639"] = new Game(2);
    app.activeGames["8639"].addPlayer(player1);
    app.cookies["863"] = "naman";
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=8639;playerId=863"])
      .send("Coal=1_2&Uranium=&Oil=1_2,1_3,1_4,1_5,1_6,1_7&Garbage=&Cost=150")
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    const player1 = new Player("green", "naman");
    player1.addPowerplant({
      value: "3",
      resource: {
        type: "Oil",
        quantity: 2
      },
      city: 1
    });
    app.activeGames["9703"] = new Game(2);
    app.activeGames["9703"].addPlayer(player1);
    app.cookies["97"] = "Ankon";
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=9703;playerId=97"])
      .send("Coal=&Uranium=&Oil=1_2,1_3,2_1,2_3,3_1&Garbage=&Cost=")
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    const player1 = new Player("green", "naman");
    const player2 = new Player("red", "nakka");
    player1.addPowerplant({
      value: "4",
      resource: {
        type: "Oil",
        quantity: 2
      },
      city: 1
    });
    player2.addPowerplant({
      value: "5",
      resource: {
        type: "Coal",
        quantity: 2
      },
      city: 1
    });
    app.cookies["97"] = "Ankon";
    app.activeGames["97035"] = new Game(2);
    app.activeGames["97035"].addPlayer(player1);
    app.activeGames["97035"].addPlayer(player2);
    const turn = app.activeGames["97035"].getTurn([player1, player2]);
    turn.currentPlayerIndex = 0;
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=97035;playerId=97"])
      .send("Coal=&Uranium=&Oil=1_2,1_3,2_1,2_3&Garbage=&Cost=32")
      .expect(200, done);
  });

  it("should return code 200 if resource data is registered succesfully", done => {
    const player1 = new Player("blue", "deepika");
    const player2 = new Player("green", "naman");
    app.activeGames["55"] = new Game(2);
    app.activeGames["55"].addPlayer(player1);
    app.activeGames["55"].addPlayer(player2);
    app.cookies["555"] = "Leela";
    request(app)
      .post("/resources/buy")
      .set("Cookie", ["gameId=55;playerId=555"])
      .send("Coal=1&Uranium=1&Oil=1&Garbage=10&Cost=100")
      .expect(200, done);
  });
});

describe("POST /cities/build", () => {
  it("should  add the city details to the player who buys if player has enough money", done => {
    app.activeGames["99"] = new Game(3);
    app.cookies["999"] = "Ankon";
    const player = new Player("red", "Ankon");
    app.activeGames[99].addPlayer(player);
    request(app)
      .post("/cities/build")
      .send(`price=10&cityCount=2&cityNames=maimi_10`)
      .set("Cookie", ["gameId=99;playerId=999"])
      .expect(200, done);
  });

  it("should not  add the city details to the player who buys if player has not enough money", done => {
    app.activeGames["99"] = new Game(3);
    app.cookies["999"] = "Ankon";
    const player = new Player("red", "Ankon");
    app.activeGames[99].addPlayer(player);
    request(app)
      .post("/cities/build")
      .send(`price=60&cityCount=6&cityNames=maimi_10`)
      .set("Cookie", ["gameId=99;playerId=999"])
      .expect(200, done);
  });
});

describe("GET /players", () => {
  it("should return the details of the players with response code 200", done => {
    app.activeGames["99"] = new Game(3);
    app.cookies["999"] = "Ankon";
    const player = new Player("red", "Ankon");
    app.activeGames[99].addPlayer(player);
    request(app)
      .get("/players")
      .set("Cookie", ["gameId=99;playerId=999"])
      .expect(200, done);
  });
});

describe("GET /cities/light", () => {
  it("should pay for selected lighted cities", done => {
    app.activeGames["992"] = new Game(2);
    app.cookies["991"] = "Ankon";
    const player = new Player("red", "Ankon");
    player.id = "991";
    app.activeGames["992"].addPlayer(player);
    request(app)
      .get("/cities/light")
      .set("Cookie", ["gameId=992;playerId=991"])
      .expect(200, done);
  });

  it("should pay for selected lighted cities", done => {
    app.activeGames["987"] = new Game(2);
    app.cookies["789"] = "Ankon";
    const player = new Player("red", "Ankon");
    player.id = "789";
    player.cities = 3;
    app.activeGames["987"].addPlayer(player);
    request(app)
      .get("/cities/light")
      .set("Cookie", ["gameId=987;playerId=789"])
      .expect(200, done);
  });
});

describe("GET /currentBid", function() {
  it("should respond with 200", function(done) {
    app.activeGames["52"] = new Game(2);
    app.cookies["1234567"] = "Ankon";

    request(app)
      .get("/currentBid")
      .set("Cookie", ["gameId=52;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["52"] = new Game(1);
    app.cookies["1234567"] = "Ankon";
    const player1 = new Player("green", "naman");
    app.activeGames["52"].addPlayer(player1);
    app.activeGames["52"].powerplantMarket = {
      cards: {
        "13": {
          resource: { type: "Oil", quantity: 2 },
          city: 1,
          inDeck: true,
          isSelected: false
        },
        "19": {
          resource: { type: "Garbage", quantity: 1 },
          city: 3,
          inDeck: true,
          isSelected: false
        }
      }
    };
    const player = new Player("red", "Ankon");
    app.activeGames["52"].addPlayer(player);
    app.activeGames["52"].getTurn([player]);

    request(app)
      .get("/currentBid")
      .set("Cookie", ["gameId=52;playerId=1234567"])
      .expect(200, done);
  });
});

describe("GET /player/powerplants", function() {
  it("should respond with 200", function(done) {
    app.activeGames["5"] = new Game(2);
    app.cookies["111"] = "Gaurav";
    const player = new Player("red", "Gaurav");
    player.id = "111";
    app.activeGames["5"].addPlayer(player);
    request(app)
      .get("/player/powerplants")
      .set("Cookie", ["gameId=5;playerId=111"])
      .expect(200, done);
  });
});

describe("POST /returnResources", function() {
  it("should return the player resources ", done => {
    const resources = { Coal: 0, Oil: 0, Uranium: 0, Garbage: 0 };
    const cityCount = 2;
    const player = new Player("green", "gaurav");
    player.id = "7351";
    const powerplantMarket = new PowerPlantMarket(powerplantsCards);
    app.activeGames["420"] = new Game(2);
    app.activeGames["420"].addPlayer(player);
    app.activeGames["420"].initializePowerPlantMarket(powerplantMarket);
    app.cookies["7351"] = "gaurav";
    request(app)
      .post("/returnResources")
      .set("Cookie", ["gameId=420;playerId=7351"])
      .send(`resources=${JSON.stringify(resources)}&cityCount=${cityCount}`)
      .expect(200, done);
  });
});

describe("POST updating powerplant and refilling resources", function() {
  it("should return the player resources ", done => {
    const resources = { Coal: 0, Oil: 0, Uranium: 0, Garbage: 0 };
    const cityCount = 2;
    const player1 = new Player("green", "gaurav");
    const player2 = new Player("black", "naman");
    player1.id = "7351";
    app.activeGames["420"] = new Game(2);
    app.activeGames["420"].addPlayer(player1);
    app.activeGames["420"].addPlayer(player2);
    app.cookies["7351"] = "gaurav";
    app.cookies["7352"] = "naman";
    request(app)
      .post("/returnResources")
      .set("Cookie", ["gameId=420;playerId=7351"])
      .send(`resources=${JSON.stringify(resources)}&cityCount=${cityCount}`)
      .expect(200, done);
  });
});

describe("POST /powerplant/select", function() {
  it("should respond with 200", function(done) {
    app.activeGames["53"] = new Game(1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["53"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .post("/powerplant/select")
      .send("powerplantCost=13")
      .set("Cookie", ["gameId=53;playerId=1234567"])
      .expect(200, done);
  });
});

describe("POST /auction/bid", function() {
  it("should respond with 200", function(done) {
    const player1 = new Player("green", "gaurav");
    app.activeGames["53"] = new Game(1);
    app.activeGames["53"].addPlayer(player1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["53"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .post("/auction/bid")
      .send("bidAmount=13&selectedPowerPlant=powerplant_13")
      .set("Cookie", ["gameId=53;playerId=1234567"])
      .expect(200, done);
  });
});

describe("GET /getGameDetails", function() {
  it("should respond with 200", function(done) {
    app.activeGames["55"] = new Game(1);
    const player1 = new Player("green", "gaurav");
    app.activeGames["55"].addPlayer(player1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["55"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .get("/getGameDetails")
      .set("Cookie", ["gameId=55;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200 ", function(done) {
    app.activeGames["55"] = new Game(1);
    const player1 = new Player("green", "gaurav");
    app.activeGames["55"].addPlayer(player1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["55"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .get("/currentBid")
      .set("Cookie", ["gameId=55;playerId=1234567"])
      .end(done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["55"] = new Game(1);
    const player1 = new Player("green", "gaurav");
    app.activeGames["55"].addPlayer(player1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["55"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    app.activeGames["55"].conductAuction("13","13");

    request(app)
      .get("/getGameDetails")
      .set("Cookie", ["gameId=55;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["55"] = new Game(1);
    const player1 = new Player("green", "gaurav");
    app.activeGames["55"].addPlayer(player1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["55"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .get("/getGameDetails")
      .set("Cookie", ["gameId=55;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["155"] = new Game(1);
    const player1 = new Player("green", "gaurav");
    app.activeGames["155"].addPlayer(player1);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["155"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    app.activeGames["155"].conductAuction("pass","");
    request(app)
      .get("/getGameDetails")
      .set("Cookie", ["gameId=155;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["156"] = new Game(2);
    const player1 = new Player("green", "gaurav");
    const player2 = new Player("red", "gaurav");
    app.activeGames["156"].addPlayer(player1);
    app.activeGames["156"].addPlayer(player2);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["156"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    app.activeGames["156"].conductAuction("19","19");
    app.activeGames["156"].conductAuction("pass");
    request(app)
      .get("/getGameDetails")
      .set("Cookie", ["gameId=156;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["111"] = new Game(3);
    const player1 = new Player("green", "Aaurav");
    const player2 = new Player("red", "Baurav");
    const player3 = new Player("red", "Caurav");
    app.activeGames["111"].addPlayer(player1);
    app.activeGames["111"].addPlayer(player2);
    app.activeGames["111"].addPlayer(player3);
    app.cookies["1234567"] = "Ankon";
    app.activeGames["111"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Hybrid", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    app.activeGames["111"].conductAuction("13","13");
    app.activeGames["111"].conductAuction("pass");
    app.activeGames["111"].conductAuction("pass");

    app.activeGames["111"].conductAuction("pass");
    app.activeGames["111"].conductAuction("pass");
    app.activeGames["111"].auction.isBidOver = true;
    request(app)
      .get("/getGameDetails")
      .set("Cookie", ["gameId=111;playerId=1234567"])
      .expect(200, done);
  });
});

describe("POST /buildingCost", function() {
  it("should respond with 200", function(done) {
    app.activeGames["171"] = new Game(1);
    const player = new Player("red", "Ankon");
    app.cookies["1234567"] = "Ankon";
    app.activeGames["171"].addPlayer(player);
    app.activeGames["171"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .post("/buildingCost")
      .send(`selectedCities=${JSON.stringify(["boston", "buffallo"])}`)
      .set("Cookie", ["gameId=171;playerId=1234567"])
      .expect(200, done);
  });

  it("should respond with 200", function(done) {
    app.activeGames["172"] = new Game(1);
    const player = new Player("red", "Ankon");
    player.cityNames = ["new_york"];
    app.cookies["1234567"] = "Ankon";
    app.activeGames["172"].addPlayer(player);
    app.activeGames["172"].powerplantMarket = new PowerPlantMarket({
      "13": {
        resource: { type: "Oil", quantity: 2 },
        city: 1,
        inDeck: true,
        isSelected: false
      },
      "19": {
        resource: { type: "Garbage", quantity: 1 },
        city: 3,
        inDeck: true,
        isSelected: false
      }
    });

    request(app)
      .post("/buildingCost")
      .send(`selectedCities=${JSON.stringify(["boston", "buffallo"])}`)
      .set("Cookie", ["gameId=172;playerId=1234567"])
      .expect(200, done);
  });
});

describe("GET /logs", function() {
  it("should respond with 200", function(done) {
    const player1 = new Player("green", "gaurav");
    app.activeGames["53"] = new Game(1);
    app.activeGames["53"].addPlayer(player1);

    request(app)
      .get("/logs")
      .set("Cookie", ["gameId=53;playerId=1234567"])
      .expect(200, done);
  });
});


describe("POST /discardPowerplant", function() {
  it("should respond with 200", function(done) {
    const player1 = new Player("green", "gaurav");
    app.activeGames["53"] = new Game(1);
    app.activeGames["53"].addPlayer(player1);

    request(app)
      .post("/discardPowerplant")
      .set("Cookie", ["gameId=53;playerId=1234567"])
      .expect(200, done);
  });
});