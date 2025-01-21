#!/bin/bash

# List of project directories
PROJECTS=(
    "game-info"
    "missions"
    "youtube-stats"
)

# Function to install dependencies and start the server
run_project() {
    local PROJECT=$1
    echo "----------------------------------------"
    echo "Processing: $PROJECT"

    # Install dependencies if package.json exists
    if [ -f "$PROJECT/package.json" ]; then
        (cd "$PROJECT" && npm install)
        if [ $? -ne 0 ]; then
            echo "Failed to install dependencies for $PROJECT."
            return 1
        fi
        echo "Dependencies installed for $PROJECT."
    else
        echo "No package.json found in $PROJECT. Skipping dependencies."
    fi

    # Start server.js if it exists
    local SERVER_FILE="$PROJECT/server.js"
    if [ -f "$SERVER_FILE" ]; then
        (cd "$PROJECT" && node server.js &)
        echo "Server started for $PROJECT."
    else
        echo "No server.js found in $PROJECT. Skipping server start."
    fi
}

# Run a specific project or all projects
if [ $# -eq 1 ]; then
    # Run the project corresponding to the argument
    CHOICE=$1
    if [[ "$CHOICE" -ge 1 && "$CHOICE" -le "${#PROJECTS[@]}" ]]; then
        run_project "${PROJECTS[$((CHOICE-1))]}"
    else
        echo "Invalid choice. Enter a number between 1 and ${#PROJECTS[@]}."
        exit 1
    fi
else
    # Run all projects if no argument is provided
    echo "No specific project selected. Running all projects..."
    for PROJECT in "${PROJECTS[@]}"; do
        run_project "$PROJECT"
    done
fi

echo "----------------------------------------"
echo "All tasks completed!"
