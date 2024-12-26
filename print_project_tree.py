import os
from pathspec import PathSpec

def load_gitignore_patterns(root_directory):
    """Load and parse .gitignore patterns from the specified directory."""
    gitignore_path = os.path.join(root_directory, ".gitignore")
    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r") as f:
            lines = f.read().splitlines()
        # Filter out empty lines and comments
        patterns = [line for line in lines if line.strip() and not line.strip().startswith('#')]
        return PathSpec.from_lines('gitwildmatch', patterns)
    return None

def print_tree(start_path, prefix="", spec=None, root_dir=None):
    """Recursively print directories and files starting from start_path 
    in a tree format, ignoring files and folders matched by spec."""
    # Get and sort items in this directory
    items = sorted(os.listdir(start_path))
    
    # Filter out items that match .gitignore patterns
    if spec and root_dir:
        filtered_items = []
        for item in items:
            relative_path = os.path.relpath(os.path.join(start_path, item), root_dir)
            # Only include if not matched by the .gitignore spec
            if not spec.match_file(relative_path):
                filtered_items.append(item)
        items = filtered_items

    for index, item in enumerate(items):
        path = os.path.join(start_path, item)
        connector = "└── " if index == len(items) - 1 else "├── "
        
        print(prefix + connector + item)
        
        # If it's a directory, recurse deeper
        if os.path.isdir(path):
            new_prefix = prefix + ("    " if index == len(items) - 1 else "│   ")
            print_tree(path, new_prefix, spec=spec, root_dir=root_dir)

if __name__ == "__main__":
    # Starting from the current directory
    start_directory = os.path.abspath(".")
    spec = load_gitignore_patterns(start_directory)
    
    print(os.path.basename(start_directory) if os.path.basename(start_directory) else start_directory)
    print_tree(start_directory, spec=spec, root_dir=start_directory)
