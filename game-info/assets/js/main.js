let gameInfo = [];
let playerInfo = [];
let selectedGameIndex = 0; // Default to game 0
let selectedPlayerIndex = 0; // Default to player 0

// Load missions, game info, and player info from respective JSON files
async function loadMissions() {
  try {
    // Fetch game data
    const responseGame = await fetch("assets/data/game.json");
    const gameData = await responseGame.json();



    // Store game and player data
    gameInfo = gameData.game_info;
    playerInfo = gameData.player_info;


    renderContent(); // Call to render both game info and missions
  } catch (error) {
    console.error("Error loading missions or game info:", error);
  }
}

// Render the selected game's info, player info, and missions
function renderContent() {
  const gameInfoContainer = document.getElementById("games");
  const playerInfoContainer = document.getElementById("players");
  const buttonInfoContainer = document.getElementById("buttonadd");

  // Clear previous content
  gameInfoContainer.innerHTML = "";
  playerInfoContainer.innerHTML = "";
  buttonInfoContainer.innerHTML = "";

  const buttonInfoHTML = `
    <div class="inline-flex p-8 items-center  justify-center w-full">
      <button onclick="selectGame(selectedGameIndex - 1)" ${selectedGameIndex <= 0 ? "disabled" : ""} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l m-2"> &lt; </button>
      <button onclick="selectGame(selectedGameIndex + 1)" ${selectedGameIndex >= gameInfo.length - 1 ? "disabled" : ""} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r m-2">
      &gt; 
      </button>
      <button onclick="selectPlayer(selectedPlayerIndex - 1)" ${selectedPlayerIndex <= 0 ? "disabled" : ""} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l m-2">
        &lt;
      </button>
      <button onclick="selectPlayer(selectedPlayerIndex + 1)" ${selectedPlayerIndex >= playerInfo.length - 1 ? "disabled" : ""} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r m-2">
         &gt;
      </button>
    </div>
  `;
  buttonInfoContainer.innerHTML += buttonInfoHTML;

  // Render the selected game info
  const game = gameInfo[selectedGameIndex];
  const gameInfoHTML = `
        <div class="game-info text-center " id="game-${selectedGameIndex}">
            <h2 class="text-4xl font-bold text-accent  tracking-widest font-ranchers p-4">${game.title}</h2>
            <h3 class="text-2xl font-bold text-primary">${game.developer}</h3>
            <p class="text-lg text-primary">${game.version}</p>
            <p class="text-lg text-primary">${game.description}</p>
            <p class="text-lg text-primary p-4"> <strong>Platform:</strong> ${game.platform}  <p>
        </div>
    `;
  gameInfoContainer.innerHTML += gameInfoHTML;

  // Render the selected player's info
  const player = playerInfo[selectedPlayerIndex];
  const playerInfoHTML = `
        <div class="player-info" id="player-${selectedPlayerIndex}">
            <div class="flex flex-col justify-between items-center">
                <div class="">
                    <img src="${player.avatar}" alt="Avatar" class="size-32 rounded-full border-4 border-gray-300" />
                </div>
                <h2 class="text-4xl font-bold text-accent tracking-widest font-ranchers p-4">${player.player_name}</h2>
                <h3 class="text-4xl  font-bold text-primary font-teko">Level: ${player.player_level}</h3>
                <div class="w-[70%] bg-secondarybg h-4 rounded-full">
                    <div class="bg-accent h-full rounded-full" style="width: ${player.xp_progress?.current}%"></div>
                </div>
            </div>
        </div>
    `;
  playerInfoContainer.innerHTML += playerInfoHTML;
 
}

// Select game by index and reload
function selectGame(index) {
  selectedGameIndex = index; // Set the selected game index
  renderContent(); // Re-render the content with the new selected game
}

// Select player by index and reload
function selectPlayer(index) {
  selectedPlayerIndex = index; // Set the selected player index
  renderContent(); // Re-render the content with the new selected player
}

// Initial load of missions, game info, and player info
loadMissions();
