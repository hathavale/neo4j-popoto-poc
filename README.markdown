# Neo4j Popoto.js Proof of Concept

This is a proof-of-concept web application showcasing Neo4j graph visualization using Popoto.js 4.0.7, with a Node.js backend and a JavaScript frontend.

## Prerequisites
- **Neo4j**: A local Neo4j instance (e.g., Neo4j Desktop or Community Edition) running on `bolt://localhost:7687`.
  - Default credentials: `neo4j`/`password`. Update `src/server.js` with your credentials if different.
  - Recommended: Load the "Movies" dataset (`:play movies` in Neo4j Browser).
- **Node.js**: Version 16 or higher.
- **npm**: For installing dependencies.

## Setup
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd neo4j-popoto-poc
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Neo4j**:
   - Ensure Neo4j is running locally.
   - Update the Neo4j credentials in `src/server.js` if necessary:
     ```javascript
     neo4j.auth.basic('neo4j', 'your-password')
     ```

4. **Start the Application**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

5. **Access the Application**:
   - Open a browser and navigate to `http://localhost:3000`.
   - The graph visualization should display `Person` and `Movie` nodes connected by `ACTED_IN` relationships.

## Project Structure
- `public/`: Frontend files (HTML, JS, CSS).
- `src/`: Backend Node.js server.
- `package.json`: Node.js dependencies and scripts.

## Notes
- The application fetches data from Neo4j using a Cypher query (`MATCH (n:Person)-[r:ACTED_IN]->(m:Movie) RETURN n,r,m LIMIT 25`).
- Popoto.js 4.0.7 renders the graph interactively in the `#popoto-graph` div.
- If the CDN (`https://cdn.jsdelivr.net/npm/popoto@4.0.7/dist/popoto.min.js`) fails, download `popoto.min.js` from the Popoto.js GitHub (`https://github.com/Nhogs/popoto`, tag `4.0.7`) and place it in `public/`. Update `index.html` to use `<script src="/popoto.min.js"></script>`.
- This is a proof-of-concept and not production-ready. Add authentication, error handling, and scalability for production use.

## Troubleshooting
- **Neo4j Connection Issues**: Verify Neo4j is running and credentials are correct.
- **Blank Graph**: Ensure the Movies dataset is loaded or modify the Cypher query in `app.js` to match your data.
- **CDN Errors**: If Popoto.js fails to load, use the local hosting fallback.
- **Console Errors**: Check the browser Console for errors and verify `https://cdn.jsdelivr.net/npm/popoto@4.0.7/dist/popoto.min.js` loads in the Network tab.

## License
MIT