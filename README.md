# Chess Dashboard API

The Chess Dashboard API is a full-stack application designed to efficiently process and display data from the Lichess.org API, focusing on the top 500 classical chess players. The backend, built with FastAPI and PostgreSQL, handles data retrieval, processing, and storage, while the frontend, developed using Next.js, provides a user-friendly dashboard for interacting with the data.

## Backend Implementation:
The FastAPI backend integrates with the Lichess.org API through custom scripts to gather information on the top players and their 30-day rating histories. These scripts are designed to extract data systematically, providing a seamless and automated process for updating player information. The extracted data is then stored in a PostgreSQL database, with a carefully crafted schema to efficiently manage player usernames and corresponding rating data.

The backend in build using FastAPI. FastAPI is a modern, fast (high-performance), web framework for building APIs with Python. The PostgreSQL database is designed to store player usernames and corresponding rating data and also store user information for authentication using JWT. I ran python scripts to extract data from Lichess API, process it and store it inside our PostgreSQL. Endpoints such as `/top-players`, `/player/{username}/rating-history`, and `/players/rating-history-csv` are implemented to serve various data retrieval needs.

## Frontend Implementation:
The Next.js frontend creates an interactive dashboard for users. It displays a list of the top 50 chess players and visualizes their rating histories through charts. Performance is optimized through efficient data fetching and state management, ensuring a smooth user experience. User authentication is incorporated, allowing users to log in and out. Error handling is implemented to provide meaningful feedback to users in case of issues. I have used TailwindCSS for styling and Recharts for visualizing the rating trend in Line Graph.
