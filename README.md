xCounter
Description
xCounter is a robust tool designed to calculate the total number of lines of code in a given project by counting all the lines in every file from a provided GitHub repository link. The application leverages Flask for the backend and React for the frontend, running inside Docker containers to ensure a consistent development and production environment.

Features
Line Counting: Analyze a GitHub repository to count the total number of lines of code across all files.
Real-time Results: Get instant feedback with the total line count displayed on the frontend.
Dockerized Setup: The entire application runs inside Docker containers, ensuring compatibility across different environments.
Simple and Intuitive UI: An easy-to-use interface to input the GitHub repository URL and display the results.
Prerequisites
Before running xCounter, ensure you have the following installed:

Docker
Docker Compose
Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/yourusername/xCounter.git
cd xCounter
Set Up Environment Variables:

Create a .env file in the project root with any necessary environment variables for your Flask backend or other services.

Build and Start the Containers:

To build and start the containers, run the following command:

bash
Copy code
docker-compose up --build
This will build the Docker images and start the containers for both the backend and frontend.

Access the Application:

Once the containers are running, access the application in your web browser at:

arduino
Copy code
http://localhost:3000
Rebuilding Containers
If you make any changes to the code and need to rebuild the containers, use the following command:

bash
Copy code
docker-compose up --build
To rebuild a specific service (e.g., backend or frontend):

bash
Copy code
docker-compose up --build <service_name>
To force Docker to recreate containers with the new images:

bash
Copy code
docker-compose up --force-recreate --build
Accessing Logs
To view logs from all running containers:

bash
Copy code
docker-compose logs
To view logs from a specific service:

bash
Copy code
docker-compose logs <service_name>
Shutting Down the Containers
To stop and remove the containers, networks, and volumes created by Docker Compose:

bash
Copy code
docker-compose down
.gitignore Configuration
Ensure your .gitignore file is correctly set up to avoid committing unnecessary files. The following directories and files should be included:

bash
Copy code
# Node.js
node_modules/

# React build directory
build/

# Docker-related files
*.env
*.log

# Python
__pycache__/
*.pyc

# System files
.DS_Store
Troubleshooting
Fill Plugin Warning: If you encounter the warning Tried to use the 'fill' option without the 'Filler' plugin enabled, ensure that the 'Filler' plugin is imported and registered in your Chart.js configuration.
Node Modules in Subdirectories: If node modules in subdirectories are being added to your Git repository, make sure that each subdirectory has its own .gitignore file with node_modules/ listed.
