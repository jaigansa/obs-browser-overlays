// ================= Shared Data =================
let gameInfo = [];
let missions = [];
let selectedGameIndex = 0;
let selectedMissionIndex = 0;
let socialLinks = [];
let socialIndex = 0;

let missionInterval;
let socialInterval;

// ================= Channel Data =================
async function fetchChannelData() {
  try {
    const response = await fetch('/get-channel-data');
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    if (!data) return null;

    return {
      avatarUrl: data.avatarUrl,
      title: data.title,
      subscribers: formatCount(data.subscribers),
      views: formatCount(data.views),
      videos: data.videos,
    };
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return null;
  }
}

function formatCount(number) {
  if (number < 1000) return number.toString();
  const suffixes = ["k", "M", "B", "T"];
  let idx = -1;
  let num = number;
  while (num >= 1000 && idx < suffixes.length - 1) {
    idx++;
    num /= 1000;
  }
  return num.toFixed(1) + suffixes[idx];
}

// ================= DOM Elements =================
const avatarDiv = document.getElementById("avatar-image");
const titleDiv = document.getElementById("channel-title");
const subscribersDiv = document.getElementById("subscribers-count");
const totalChannelViewsDiv = document.getElementById("total-channel-views");
const totalChannelVideosDiv = document.getElementById("total-channel-videos");

// ================= Update Channel Info =================
async function updateChannelInfo() {
  const data = await fetchChannelData();
  if (!data) return;

  avatarDiv.innerHTML = `<img src="${data.avatarUrl}" alt="Avatar" class="rounded-full" />`;
  titleDiv.textContent = data.title;
  subscribersDiv.textContent = data.subscribers;
  totalChannelViewsDiv.textContent = data.views;
  totalChannelVideosDiv.textContent = data.videos;
}

// ================= Load Data =================
async function loadData() {
  try {
    const response = await fetch("data/db.json");
    const allData = await response.json();

    gameInfo = allData.game_info.filter(g => g.status === "Show");
    missions = allData.missions.filter(m => m.progress.status === "Show");
    socialLinks = [
      { name: "YouTube", url: allData.social_links.youtube },
      { name: "Website", url: allData.social_links.website },
      { name: "Instagram", url: allData.social_links.instagram },
    ];

    renderGame();
    renderMission();
    startMissionLoop();
    startSocialLoop();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// ================= General Render Function =================
function selectItem(type, direction = 1) {
  if (type === "game" && gameInfo.length) {
    selectedGameIndex = (selectedGameIndex + direction + gameInfo.length) % gameInfo.length;
    renderGame();
  } else if (type === "mission" && missions.length) {
    selectedMissionIndex = (selectedMissionIndex + direction + missions.length) % missions.length;
    renderMission();
  }
}

// ================= Render Game =================
function renderGame() {
  const container = document.getElementById("games");
  const buttons = document.getElementById("buttonadd");

  if (!gameInfo.length) {
    container.innerHTML = "<p>No games available</p>";
    buttons.innerHTML = "";
    return;
  }

  const game = gameInfo[selectedGameIndex];

  container.innerHTML = `
    <div class="text-center font-teko">
      <h2 class="text-2xl tracking-widest pt-2 font-bold">${game.title}</h2>
      <p>${game.platform} ${game.version}</p>
    </div>
  `;

  buttons.innerHTML = `
    <div class="inline-flex p-2 items-center justify-center w-full space-x-2">
      <button onclick="selectItem('game', -1)" class="w-6 h-6 p-2 bg-gray-300 hover:bg-gray-400 flex items-center justify-center rounded-full"></button>
      <button onclick="selectItem('game', 1)" class="w-6 h-6 p-2 bg-gray-300 hover:bg-gray-400 flex items-center justify-center rounded-full"></button>
    </div>
  `;
}

// ================= Render Mission =================
function renderMission() {
  const container = document.getElementById("missions");
  const buttons = document.getElementById("mission-buttons");

  if (!missions.length) {
    container.innerHTML = "<p>No missions available</p>";
    buttons.innerHTML = "";
    return;
  }

  const mission = missions[selectedMissionIndex];
  const progress = Math.floor((mission.progress.current / mission.progress.total) * 100);

  container.innerHTML = `
    <div class="text-center font-teko text-2xl">
      <h2 class="text-4xl">${mission.title}</h2>
      <p>${mission.objective}</p>
      <p>Reward: ${mission.rewards}</p>
      <p>Progress: ${mission.progress.current}/${mission.progress.total}</p>
      <div class="w-[90%] mx-auto bg-gray-300 h-4 mb-2 rounded-full">
        <div class="bg-black h-full rounded-full" style="width: ${progress}%"></div>
      </div>
    </div>
  `;

  buttons.innerHTML = `
    <div class="inline-flex p-2 items-center justify-center w-full space-x-2">
      <button onclick="selectItem('mission', -1)" class="w-6 h-6 p-2 bg-gray-300 hover:bg-gray-400 flex items-center justify-center rounded-full"></button>
      <button onclick="selectItem('mission', 1)" class="w-6 h-6 p-2 bg-gray-300 hover:bg-gray-400 flex items-center justify-center rounded-full"></button>
    </div>
  `;
}

// ================= Auto-loop Missions =================
function startMissionLoop() {
  if (!missions.length) return;

  if (missionInterval) clearInterval(missionInterval);
  missionInterval = setInterval(() => selectItem("mission", 1), 6000);
}

// ================= QR Code & Social =================
function createQRCode(divId, text, label) {
  const qrDiv = document.getElementById(divId);
  qrDiv.innerHTML = "";

  const qrImage = document.createElement("img");
  qrImage.src = `/qr?text=${encodeURIComponent(text)}`;
  qrImage.alt = "QR Code";
  qrImage.className = "m-auto rounded-xl";
  qrImage.width = 200;
  qrImage.height = 200;

  qrDiv.appendChild(qrImage);

  document.getElementById("qr-label").textContent = label;
}

function startSocialLoop() {
  if (!socialLinks.length) return;

  if (socialInterval) clearInterval(socialInterval);
  createQRCode("qrcode", socialLinks[socialIndex].url, socialLinks[socialIndex].name);

  socialInterval = setInterval(() => {
    socialIndex = (socialIndex + 1) % socialLinks.length;
    createQRCode("qrcode", socialLinks[socialIndex].url, socialLinks[socialIndex].name);
  }, 10000);
}

// ================= Initialize =================
document.addEventListener("DOMContentLoaded", () => {
  updateChannelInfo();
  loadData();
});
