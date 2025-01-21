#!/bin/bash

# Define an array of project directories
PROJECTS=(
    "game-info"
    "missions"
    "youtube-stats"
)

# Function to install dependencies and run server for a project
run_project() {
    local PROJECT=$1

    echo "----------------------------------------"
    echo "Installing dependencies for $PROJECT..."

    # Check if package.json exists and install dependencies
    if [ -f "$PROJECT/package.json" ]; then
        (cd "$PROJECT" && npm install)

        if [ $? -eq 0 ]; then
            echo "Dependencies installed successfully for $PROJECT!"
        else
            echo "Failed to install dependencies for $PROJECT."
            return 1
        fi
    else
        echo "No package.json found in $PROJECT. Skipping..."
        return 1
    fi

    # Start server.js if it exists
    SERVER_FILE="./$PROJECT/server.js"
    if [ -f "$SERVER_FILE" ]; then
        echo "Starting server for $PROJECT..."
        cd "$PROJECT" && node server.js
        echo "Server for $PROJECT is running! "
    else
        echo "No server.js found in $PROJECT. Skipping..."
        return 1
    fi
}

# Check if an argument was provided
if [ $# -eq 1 ]; then
    # Run a specific project based on the argument
    CHOICE=$1
    if [[ "$CHOICE" -ge 1 && "$CHOICE" -le "${#PROJECTS[@]}" ]]; then
        PROJECT="${PROJECTS[$((CHOICE-1))]}"
        echo "Running project: $PROJECT"
        run_project "$PROJECT"
    else
        echo "Invalid choice. Please provide a number between 1 and ${#PROJECTS[@]}."
        exit 1
    fi
else
    # Run all projects if no argument is provided
    echo "No specific project chosen. Running all projects..."
    for PROJECT in "${PROJECTS[@]}"; do
        run_project "$PROJECT"
    done
fi

echo "----------------------------------------"
echo "Script execution completed!"
