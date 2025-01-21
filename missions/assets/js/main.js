let missions = [];

// Load missions, game info, and player info from respective JSON files
async function loadMissions() {
  try {
 
    // Fetch missions data
    const responseMission = await fetch("assets/data/missions.json");
    const allMissions = await responseMission.json();

 
    // Filter out only the incomplete missions
    missions = allMissions.filter((mission) => mission.status === "Incomplete");

    renderContent(); // Call to render both game info and missions
  } catch (error) {
    console.error("Error loading missions or game info:", error);
  }
}

// Render the selected game's info, player info, and missions
function renderContent() {
  const missionList = document.getElementById("missions");


  // Clear previous content
  missionList.innerHTML = "";
 


  // Render missions
  missions.forEach((mission) => {
    const progressPercentage = Math.floor(
      (mission.progress.current / mission.progress.total) * 100
    );

    const li = document.createElement("li");
    li.classList.add("p-4", "bg-secondarybg", "rounded-lg","bg-opacity-50" );

    li.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <strong class="text-2xl text-primary uppercase font-teko">${mission.title}</strong><br>
                    <span class="text-xl text-primary font-courier font-bold">${mission.objective}</span><br>
                    <span class="text-xl text-primary font-teko font-semibold">Reward: ${mission.rewards}</span><br>
                    <span class="text-xl text-primary font-courier font-bold">Progress: ${mission.progress.current}/${mission.progress.total}</span><br>
                    <div class="w-full bg-primarybg h-4 mt-2 rounded-full">
                        <div class="bg-accent h-full rounded-full" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
            </div>
        `;
    missionList.appendChild(li);
  });
}



// Initial load of missions, game info, and player info
loadMissions();
