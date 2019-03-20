const currentMarketCards = {};

const selectedPowerPlants = [];

let hasBought = false;

const resources = {
  Garbage: '<i class="fas fa-trash-alt"></i>',
  Coal: '<i class="fas fa-cubes"></i>',
  Oil: '<i class="fas fa-oil-can"></i>',
  Uranium: '<i class="fas fa-radiation-alt"></i>',
  Hybrid: '<i class="fas fa-hands-helping"></i>',
  Ecological: '<i class="fas fa-bolt"></i>'
};

const increaseBid = function() {
  const currentBid = getInnerText("bid-amount");
  setInnerText("bid-amount", +currentBid + 1);
};

const fetchMarket = function() {
  fetch("/powerplantMarket")
    .then(res => res.json())
    .then(powerplantCards => {
      displayPowerPlantMarket(powerplantCards);
    });
};

const displayPowerPlantMarket = function(powerplantCards) {
  const market = document.getElementById("market");
  market.appendChild(generatePowerPlantMarket(powerplantCards));
};

const updatePriceDiv = function(price) {
  setInnerText("bid-amount", price);
};

const selectPowerPlant = function(element) {
  const powerplantCost = element.id.split("_")[1];
  fetch("/powerplant/select", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `powerplantCost=${powerplantCost}`
  });
  selectedPowerPlants.pop();
  selectedPowerPlants.push(element.id);
  resetBidAmount();
  updatePriceDiv(powerplantCost);
};

const handleMarketState = function(state, powerplantDiv, powerplantCost) {
  if (state == "currentMarket") {
    powerplantDiv.onclick = selectPowerPlant.bind(null, powerplantDiv);
    powerplantDiv.style.cursor = "pointer";
    currentMarketCards[powerplantCost] = {
      isSelected: false,
      powerplant: powerplantDiv
    };
  }
};

const generatePowerPlantInfo = function(powerplantDetails) {
  const infoDiv = document.createElement("div");
  infoDiv.className = "card-details";
  infoDiv.innerHTML = `${resources[powerplantDetails.resource.type]} 
                               ${powerplantDetails.resource.quantity} 
                               <i class='fas fa-arrow-right' ></i >  
                               <i class="fas fa-house-damage"></i>
                               ${powerplantDetails.city}`;
  return infoDiv;
};

const arrangeMarket = function(market, powerplantCost, powerplantDetails) {
  const powerplantId = `powerplant_${powerplantCost}`;
  const powerplantDiv = generateDiv("unselected-card", powerplantId);
  const priceDiv = generatePowerPlantPriceDiv(powerplantCost);
  const resourceDiv = generatePowerPlantInfo(powerplantDetails);
  appendChildren(powerplantDiv, [priceDiv, resourceDiv]);
  market.appendChild(powerplantDiv);
  handleMarketState(market.id, powerplantDiv, powerplantCost);
};

const generateMarket = function(powerplants, startingIndex, endingIndex, id) {
  const marketDiv = generateDiv("single-market", id);
  const market = Object.keys(powerplants).slice(startingIndex, endingIndex);
  market.forEach(powerplant =>
    arrangeMarket(marketDiv, powerplant, powerplants[powerplant])
  );
  return marketDiv;
};

const persistCardClass = function(powerplants, currentMarketDiv) {
  const selectedPowerPlant = Object.keys(powerplants).filter(
    powerplantCost => powerplants[powerplantCost].isSelected
  );
  currentMarketDiv.childNodes.forEach(node => {
    if (node.id == `powerplant_${selectedPowerPlant[0]}`) {
      node.className = "selected-card";
      document.getElementById("make-bid").onclick = makeBid;
      document.getElementById("make-bid").className = "bid-option-enabled";
    }
  });
  fetch("/currentBid")
    .then(res => res.json())
    .then(auction => {
      const {
        currentBid,
        players,
        phase,
        isBidOver,
        isAuctionStarted,
        hasMoreThenThreePowerplants,
        powerplants,
        currentPlayerId
      } = auction;
      if (
        hasMoreThenThreePowerplants &&
        readCookie(document.cookie).playerId == currentPlayerId
      ) {
        displayDiscardingPowerplantOption(powerplants);
        return;
      }

      if (phase == "buyResources") {
        designResourceMarket();
        startBuyResourcePhase();
        return;
      }
      const powerplantCards = document.getElementById("currentMarket")
        .childNodes;
      if (!isBidOver && isAuctionStarted) {
        powerplantCards.forEach(
          powerplantCard => (powerplantCard.onclick = null)
        );
      } else {
        powerplantCards.forEach(
          powerplantCard =>
            (powerplantCard.onclick = selectPowerPlant.bind(
              null,
              powerplantCard
            ))
        );
      }
      const cost = document.getElementById("bid-amount").innerText;
      fetch("/currentPlayer")
        .then(res => res.json())
        .then(player => {
          if (players.includes(+player.id)) {
            if (+currentBid >= +cost) return updatePriceDiv(currentBid);
            return;
          }
          updateCurrentPlayer();
        });
    });
};

const displayPowerPlants = function({ powerplants, phase }) {
  powerplants = JSON.parse(powerplants);
  if (phase == "buyPowerPlant") {
    const currentMarketDiv = generateMarket(powerplants, 0, 4, "currentMarket");
    const futureMarketDiv = generateMarket(powerplants, 4, 8, "futureMarket");
    const powerplantDiv = generateDiv("power-plant-cards", "power-plant-cards");
    appendChildren(powerplantDiv, [currentMarketDiv, futureMarketDiv]);
    persistCardClass(powerplants, currentMarketDiv);
    const market = document.getElementById("market").children[0];
    market.replaceChild(powerplantDiv, market.childNodes[0]);
  }
};

const fetchCurrentPowerPlants = function() {
  fetch("/currentPowerPlants")
    .then(res => res.json())
    .then(displayPowerPlants);
};

const generateBidDiv = function() {
  const biddingDiv = generateDiv("bidding-section", "bidding-section");
  biddingDiv.innerHTML = getBiddingSectionTemplate();
  const logsDiv = generateDiv("one-line-log", "one-line-log");
  document.getElementById("info").appendChild(logsDiv);
  document.getElementById("info").appendChild(biddingDiv);
};

const generatePowerPlantMarket = function(powerplantCards) {
  const powerplants = powerplantCards;
  const powerplantDiv = generateDiv("power-plant-cards", "power-plant-cards");
  const currentMarketDiv = generateMarket(powerplants, 0, 4);
  const futureMarketDiv = generateMarket(powerplants, 4, 8);
  appendChildren(powerplantDiv, [currentMarketDiv, futureMarketDiv]);
  const resourceMarketDiv = generateResourceMarketDiv();
  generateBidDiv();
  const marketDiv = document.createElement("div");
  marketDiv.className = "market-div";
  marketDiv.id = "market-div";
  appendChildren(marketDiv, [powerplantDiv, resourceMarketDiv]);
  return marketDiv;
};

const generatePowerPlantPriceDiv = function(powerplantCost) {
  const priceDiv = generateDiv("price-details");
  const price = generateDiv("price");
  price.innerHTML = powerplantCost;
  priceDiv.appendChild(price);
  return priceDiv;
};

const resetBidAmount = function() {
  document.getElementById("bid-amount").innerText = 0;
};

const addPowerPlantToPlayer = function(count, powerplants, powerplantCost) {
  const powerplantDiv = document.getElementById(`powerplant-${count}`);
  powerplantDiv.innerHTML = "";
  arrangeMarket(powerplantDiv, powerplantCost, powerplants[powerplantCost]);
};

const makeBid = function() {
  const bidAmount = getInnerText("bid-amount");
  const selectedPowerPlant = selectedPowerPlants[0];
  document.getElementsByClassName;
  fetch("/auction/bid", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `bidAmount=${bidAmount}&selectedPowerPlant=${selectedPowerPlant}`
  }).then(res => updateCurrentPlayer());
};

const pass = function() {
  fetch("/auction/bid", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `bidAmount=pass&selectedPowerPlant=`
  }).then(res => updateCurrentPlayer());
};

const displayLog = function(logs) {
  const log = document.getElementById("one-line-log");
  const latestActivityHeadDiv = generateDiv(
    "latest-activity-header",
    "latest-activity-header"
  );
  latestActivityHeadDiv.innerHTML = "Latest Activity";
  const latestActivityDiv = generateDiv("", "");
  latestActivityDiv.innerText = logs[0].log;
  log.innerText = "";
  log.appendChild(latestActivityHeadDiv);
  log.appendChild(latestActivityDiv);
};

const displayDiscardingPowerplantOption = function(powerplants) {
  document.getElementById("discarding-powerplant-popup").style.visibility =
    "visible";
  document.getElementById(
    "discarding-powerplant-popup"
  ).innerText = JSON.stringify(powerplants);

  const allPowerplants = generateMarket(powerplants, 0, 3, "map123");
  const bureaucracyDiv = document.getElementById("discarding-powerplant-popup");
  const heading = generateDiv("bureaucracy-heading", "");
  const discardingButton = document.createElement("button");
  discardingButton.className = "bid-option-enabled";
  discardingButton.style.width = "25%";
  discardingButton.innerText = "Discard";
  discardingButton.onclick = discardPowerplant;
  heading.innerText = "Select Powerplant to discard";
  bureaucracyDiv.innerHTML = "";
  const msgDiv = generateDiv("bureaucracy-err-msg", "err-msg");
  appendChildren(bureaucracyDiv, [
    heading,
    allPowerplants,
    msgDiv,
    discardingButton
  ]);
  const market = bureaucracyDiv.childNodes;
  const playersPowerplant = market[1].childNodes;
  playersPowerplant.forEach(powerplant => {
    powerplant.onclick = selectDiv.bind(null, powerplant);
  });
};

const discardPowerplant = function() {
  fetch("/discardPowerplant", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `powerplant=${selectedPowerPlant[0]}`
  }).then(res => {
    selectedPowerPlant.pop();
    document.getElementById("discarding-powerplant-popup").style.visibility =
      "hidden";
  });
};
