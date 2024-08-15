from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fnmatch
import chardet  # For detecting file encoding

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mapping extensions to languages
EXTENSION_TO_LANGUAGE = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.java': 'Java',
    '.py': 'Python',
    '.html': 'HTML',
    '.css': 'CSS',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.swift': 'Swift',
    '.go': 'Go',
    '.rs': 'Rust',
    '.kt': 'Kotlin',
    '.sql': 'SQL',
    '.xml': 'XML',
    '.json': 'JSON',
    '.sh': 'Shell Script',
    '.md': 'Markdown',
    '.yml': 'YAML',
    # Add more as needed
}

# Function to load and parse .gitignore
def load_gitignore(folder_path):
    gitignore_path = os.path.join(folder_path, '.gitignore')
    ignore_patterns = []
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r') as gitignore_file:
            for line in gitignore_file:
                line = line.strip()
                if line and not line.startswith('#'):
                    ignore_patterns.append(line)
    return ignore_patterns

# Check if a file should be ignored
def should_ignore(file_path, ignore_patterns):
    for pattern in ignore_patterns:
        if fnmatch.fnmatch(file_path, pattern) or fnmatch.fnmatch(os.path.basename(file_path), pattern):
            return True
    return False

# Check if a file is text-based and readable
def is_readable_text_file(file_path):
    try:
        with open(file_path, 'rb') as f:
            raw_data = f.read(1024)  # Read the first 1024 bytes
            result = chardet.detect(raw_data)  # Detect the encoding
            encoding = result['encoding']
            if encoding:
                return encoding.lower() not in ['binary', 'unknown']
        return False
    except Exception:
        return False

# Count lines in files by extension
def count_lines_by_extension(folder_path, ignore_patterns):
    line_counts = {}
    file_counts = {}
    language_counts = {}
    total_lines = 0  # Initialize total line count

    for root, dirs, files in os.walk(folder_path):
        # Filter out ignored directories
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d), ignore_patterns)]

        for file in files:
            file_path = os.path.join(root, file)
            if should_ignore(file_path, ignore_patterns):
                continue

            file_extension = os.path.splitext(file)[1].lower()  # Get the file extension

            # Check if the file is readable and text-based
            if not is_readable_text_file(file_path):
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    line_count = len(lines)
                    total_lines += line_count  # Add to total line count

                    if file_extension not in line_counts:
                        line_counts[file_extension] = 0
                        file_counts[file_extension] = 0

                    line_counts[file_extension] += line_count
                    file_counts[file_extension] += 1

                    # Map the file extension to a programming language
                    language = EXTENSION_TO_LANGUAGE.get(file_extension, 'Unknown')
                    if language not in language_counts:
                        language_counts[language] = {"files": 0, "lines": 0}

                    language_counts[language]["files"] += 1
                    language_counts[language]["lines"] += line_count

            except Exception as e:
                print(f"Could not read file {file_path}: {str(e)}")
                continue

    return file_counts, line_counts, total_lines, language_counts

@app.route('/count-lines', methods=['POST'])
def count_lines():
    data = request.json
    folder_path = data.get('folderPath', '')

    if not folder_path:
        return jsonify({"error": "No folder path provided"}), 400

    ignore_patterns = load_gitignore(folder_path)
    file_counts, line_counts, total_lines, language_counts = count_lines_by_extension(folder_path, ignore_patterns)

    return jsonify({
        "fileCounts": file_counts,
        "lineCounts": line_counts,
        "totalLines": total_lines,  # Return total line count
        "languageCounts": language_counts  # Return language-wise file and line counts
    })

if __name__ == '__main__':
    app.run(debug=True)
