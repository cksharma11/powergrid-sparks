// const currentPhase={phase:"buyPowerPlant"};let gameEtag=1;const polling=function(){setInterval(()=>{highlightPhase(currentPhase.phase),fetch("/getGameDetails",{headers:{"If-None-Match":gameEtag}}).then(e=>(gameEtag=e.headers.get("ETag"),200==e.status?e.json():(new Promise).reject())).then(e=>{const{player:a,players:s,resources:t,phase:r,playerStats:h,logs:n,winner:c}=e;handleTurn(a),showPlayerDetails(e.players),Object.keys(t).forEach(e=>{Object.keys(t[e]).forEach(a=>{Object.keys(t[e][a]).forEach(s=>{displayResource(t,e,a,s)})})}),"buyResources"==r&&"buyResources"!=currentPhase.phase&&(designResourceMarket(),startBuyResourcePhase(),currentPhase.phase="buyResources"),"buildCities"==r&&(s.forEach(e=>updateMap(e)),"buildCities"!=currentPhase.phase&&(document.getElementById("map").innerHTML=getMapTemplate(),displayMap(),refreshMap(),currentPhase.phase="buildCities")),"bureaucracy"==r&&"bureaucracy"!=currentPhase.phase&&(getLightedCities(),selectPowerplant(),currentPhase.phase="bureaucracy"),"buyPowerPlant"==r&&(displayPowerPlants(e),"buyPowerPlant"!=currentPhase.phase&&(displayMarket(),currentPhase.phase="buyPowerPlant")),"endGame"==r&&(currentPhase.phase="endGame",displayWinningMessage(c+" has won the game !")),updatePlayerStatsDiv(h),displayLog(n)}).catch(()=>console.log("rejected"))},500)};
