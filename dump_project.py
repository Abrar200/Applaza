import os

# Root directory (current directory)
ROOT_DIR = "."
OUTPUT_FILE = "project_dump.txt"

# Folders and files to ignore
EXCLUDE_DIRS = {"node_modules", ".git", "dist", "build", "__pycache__"}
EXCLUDE_FILES = {"package-lock.json", "project_dump.txt"}

def should_exclude(path):
    parts = path.split(os.sep)
    for part in parts:
        if part in EXCLUDE_DIRS:
            return True
    return False

def main():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        for root, dirs, files in os.walk(ROOT_DIR):
            # Remove excluded directories from traversal
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in files:
                if file in EXCLUDE_FILES:
                    continue

                file_path = os.path.join(root, file)

                if should_exclude(file_path):
                    continue

                relative_path = os.path.relpath(file_path, ROOT_DIR)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    outfile.write(f"My {relative_path}:\n\n")
                    outfile.write('"\n')
                    outfile.write(content)
                    outfile.write('\n"\n\n')
                except Exception as e:
                    print(f"Skipping {relative_path}: {e}")

    print(f"\n✅ Project dumped to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
