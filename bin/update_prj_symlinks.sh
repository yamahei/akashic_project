#!/bin/bash

# This script updates symbolic links to common resources (assets and lib)
# for each project directory under prj/.

# Get the directory of the script itself
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Define the common resource directories using absolute paths
PRJ_DIR="$(dirname "$SCRIPT_DIR")"/prj
COMMON_ASSETS_DIR="$PRJ_DIR"/assets
COMMON_LIB_DIR="$PRJ_DIR"/lib

# Navigate to the prj/ directory
cd "$PRJ_DIR" || { echo "Error: Could not navigate to $PRJ_DIR directory."; exit 1; }

# Iterate through each subdirectory in prj/
for project_dir in */; do
    # Exclude assets/ and lib/ directories themselves
    # Exclude assets/ and lib/ directories themselves
    if [[ "$project_dir" == "assets/" || "$project_dir" == "lib/" ]]; then
        continue
    fi

    echo "Processing project: $project_dir"
    
    # Remove existing symbolic links if they exist
    if [ -L "${project_dir}assets" ]; then
        echo "  Removing existing assets symlink..."
        rm "${project_dir}assets"
    fi
    if [ -L "${project_dir}lib" ]; then
        echo "  Removing existing lib symlink..."
        rm "${project_dir}lib"
    fi
    
    # Create new symbolic links
    echo "  Creating new assets symlink..."
    ln -s "$COMMON_ASSETS_DIR" "${project_dir}assets"
    
    echo "  Creating new lib symlink..."
    ln -s "$COMMON_LIB_DIR" "${project_dir}lib"
done

echo "Symbolic link update complete."