from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def count_lines_of_code(folder_path):
    line_counts = {}
    total_lines = 0

    def traverse_dir(dir_path):
        nonlocal total_lines
        for root, _, files in os.walk(dir_path):
            for file in files:
                if file.endswith('.js'):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            lines = f.readlines()
                            line_counts[file_path] = len(lines)
                            total_lines += len(lines)
                    except Exception as e:
                        print(f"Could not read file {file_path}: {e}")

    traverse_dir(folder_path)
    return line_counts, total_lines

@app.route('/count-lines', methods=['POST'])
def count_lines():
    data = request.json
    folder_path = data.get('folderPath')

    if not folder_path:
        return jsonify({'error': 'Folder path is required'}), 400

    try:
        line_counts, total_lines = count_lines_of_code(folder_path)
        return jsonify({'lineCounts': line_counts, 'totalLines': total_lines})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
