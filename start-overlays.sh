#!/bin/bash

# Define an array of project directories
PROJECTS=(
    "game-info"
    "missions"
    "youtube-stats"
)

# Loop through each project directory
for PROJECT in "${PROJECTS[@]}"; do
    echo "Installing dependencies for $PROJECT..."

    # Navigate to the project directory and install node modules
    if [ -f "$PROJECT/package.json" ]; then
        (cd "$PROJECT" && npm install)

        # Check if npm install was successful
        if [ $? -eq 0 ]; then
            echo "Dependencies installed successfully for $PROJECT!"
        else
            echo "Failed to install dependencies for $PROJECT."
        fi
    else
        echo "No package.json found in $PROJECT. Skipping..."
    fi

    echo "----------------------------------------"
done

echo "All done!"





# Display the list of projects
echo "Available projects:"
for i in "${!PROJECTS[@]}"; do
    echo "$((i+1)). ${PROJECTS[i]}"
done

# Prompt the user to select a project
read -p "Enter the number of the project you want to run: " choice

# Validate the input
if [[ "$choice" -ge 1 && "$choice" -le "${#PROJECTS[@]}" ]]; then
    PROJECT="${PROJECTS[$((choice-1))]}"
    SERVER_FILE="./$PROJECT/server.js"

    # Check if server.js exists in the selected project
    if [ -f "$SERVER_FILE" ]; then
        echo "Starting server for project: $PROJECT..."
        (cd "$PROJECT" && node server.js)

        # Check if the server process starts successfully
        if [ $? -eq 0 ]; then
            echo "Server for $PROJECT is running!"
        else
            echo "Failed to start the server for $PROJECT."
        fi
    else
        echo "Error: $SERVER_FILE does not exist in the $PROJECT directory."
        exit 1
    fi
else
    echo "Invalid choice. Please run the script again and select a valid option."
    exit 1
fi
