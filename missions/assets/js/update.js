let missions = [];

// Load missions from a local JSON file or from localStorage if available
async function loadMissions() {
    try {
        const response = await fetch("assets/data/missions.json");
        const allMissions = await response.json();

        const savedMissions = localStorage.getItem("missions");
        if (savedMissions) {
            missions = JSON.parse(savedMissions);
        } else {
            missions = allMissions;
        }

        renderMissions();
    } catch (error) {
        console.error("Error loading missions:", error);
    }
}

// Save missions to localStorage
function saveMissions() {
    localStorage.setItem("missions", JSON.stringify(missions));
}

// Render missions on the page
function renderMissions() {
    const missionList = document.getElementById("missions");
    missionList.innerHTML = "";

    missions.forEach((mission, index) => {
        const progressPercentage = Math.floor((mission.progress.current / mission.progress.total) * 100);

        const li = document.createElement("li");
        li.classList.add("p-4", "bg-gray-50", "border", "border-gray-200", "rounded-lg");

        li.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="space-y-2">
                    <strong class="text-lg text-blue-600">${mission.title}</strong><br>
                    <span class="text-sm text-gray-600">${mission.objective}</span><br>
                    <span class="text-sm text-green-600">Reward: ${mission.rewards}</span><br>
                    <span class="text-sm">Progress: ${mission.progress.current}/${mission.progress.total} (${progressPercentage}%)</span><br>
                    <span class="text-sm">Difficulty: ${mission.difficulty}</span><br>
                    <span class="text-sm">Description: ${mission.description}</span><br>
                    <span class="text-sm">Status: <span class="${mission.status === 'Complete' ? 'text-green-600' : 'text-red-600'}">${mission.status}</span></span><br>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg" 
                        onclick="updateMissionProgress(${index}, 1)">+</button>
                    <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded-lg" 
                        onclick="updateMissionProgress(${index}, -1)">-</button>
                    <button class="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-700 rounded-lg" 
                        onclick="editMission(${index})">Edit</button>
                    <button class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-700 rounded-lg" 
                        onclick="removeMission(${index})">Remove</button>
                </div>
            </div>
        `;

        missionList.appendChild(li);
    });
}

// Update mission progress (increase/decrease)
function updateMissionProgress(index, amount) {
    missions[index].progress.current = Math.max(
        0,
        Math.min(
            missions[index].progress.current + amount,
            missions[index].progress.total
        )
    );
    saveMissions();
    renderMissions();
}

// Toggle mission status between Incomplete and Complete
function updateMissionStatus(index) {
    const currentStatus = missions[index].status;
    missions[index].status = currentStatus === "Incomplete" ? "Complete" : "Incomplete";
    saveMissions();
    renderMissions();
}

// Edit a mission
function editMission(index) {
    const mission = missions[index];

    document.getElementById("title").value = mission.title;
    document.getElementById("objective").value = mission.objective;
    document.getElementById("rewards").value = mission.rewards;
    document.getElementById("currentProgress").value = mission.progress.current;
    document.getElementById("totalProgress").value = mission.progress.total;
    document.getElementById("difficulty").value = mission.difficulty;
    document.getElementById("description").value = mission.description;
    document.getElementById("status").value = mission.status;

    document.getElementById("missionForm").setAttribute("data-editing-index", index);
}

// Remove a mission
function removeMission(index) {
    missions.splice(index, 1);
    saveMissions();
    renderMissions();
}

// Download updated missions
function downloadMissions() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(missions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "missions.json");
    downloadAnchor.click();
}

// Add or update a mission
function addMission() {
    const title = document.getElementById("title").value;
    const objective = document.getElementById("objective").value;
    const rewards = document.getElementById("rewards").value;
    const currentProgress = parseInt(document.getElementById("currentProgress").value) || 0;
    const totalProgress = parseInt(document.getElementById("totalProgress").value) || 1;
    const difficulty = document.getElementById("difficulty").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;

    if (title && objective && rewards && difficulty && description) {
        const editingIndex = document.getElementById("missionForm").getAttribute("data-editing-index");

        const updatedMission = {
            mission_id: editingIndex !== null ? missions[editingIndex].mission_id : missions.length + 1,
            title: title,
            objective: objective,
            rewards: rewards,
            progress: { current: currentProgress, total: totalProgress },
            difficulty: difficulty,
            description: description,
            status: status,
        };

        if (editingIndex !== null) {
            missions[editingIndex] = updatedMission;
            document.getElementById("missionForm").removeAttribute("data-editing-index");
        } else {
            missions.push(updatedMission);
        }

        saveMissions();
        renderMissions();
        clearInputFields();
    } else {
        alert("Please fill in all fields!");
    }
}

// Clear input fields
function clearInputFields() {
    document.getElementById("missionForm").reset();
    document.getElementById("missionForm").removeAttribute("data-editing-index");
}

// Load local JSON file for editing
let fileHandle = null;  // Use let to allow re-assignment

async function loadLocalFile() {
    try {
        // Open the file picker to select a JSON file
        const [newFileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: "JSON Files",
                    accept: { "application/json": [".json"] },
                },
            ],
        });

        // Read the file content
        const file = await newFileHandle.getFile();
        const content = await file.text();
        missions = JSON.parse(content);

        // Render missions after loading
        renderMissions();
        alert("Missions loaded successfully!");

        // Update the global file handle
        fileHandle = newFileHandle;  // Correctly assign the new file handle here
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("File picker was canceled or closed without selection.");
            alert("File selection was canceled.");
        } else {
            console.error("Error loading file:", error);
            alert("An error occurred while loading the file.");
        }
    }
}


// Save local JSON file after editing
async function saveToLocalFile() {
    try {
        const options = {
            types: [
                {
                    description: "JSON Files",
                    accept: { "application/json": [".json"] },
                },
            ],
        };

        const fileHandle = await window.showSaveFilePicker(options);
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(JSON.stringify(missions, null, 2));
        await writableStream.close();

        alert("Missions saved to file!");
    } catch (error) {
        console.error("Error saving file:", error);
    }
}

// Load initial missions
loadMissions();
