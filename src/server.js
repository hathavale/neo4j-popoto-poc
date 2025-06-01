const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Neo4j connection configuration
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'caviar-Gravity-beyond-export-castle-3106'), // Update with your Neo4j credentials
  { disableLosslessIntegers: true }
);

// Verify Neo4j connection on startup
async function verifyNeo4jConnection() {
  const session = driver.session();
  try {
    await session.run('RETURN 1');
    console.log('Successfully connected to Neo4j');
  } catch (error) {
    console.error('Failed to connect to Neo4j:', error.message);
  } finally {
    await session.close();
  }
}
verifyNeo4jConnection();

// API endpoint to fetch graph data
app.post('/graph', async (req, res) => {
  const session = driver.session();
  try {
    let cypher = req.body.query;

    // Handle non-string query formats (e.g., Popoto.js structured query)
    if (cypher && typeof cypher === 'object' && cypher.statements && cypher.statements[0]) {
      cypher = cypher.statements[0].statement;
      console.log('Converted structured query to Cypher:', cypher);
    }
    if (!cypher || typeof cypher !== 'string') {
      throw new Error('Invalid or missing Cypher query');
    }
    console.log('Executing Cypher query:', cypher);
    const result = await session.run(cypher);
    
    // Transform Neo4j result to Popoto-compatible format
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    result.records.forEach(record => {
      // Process nodes
      record._fields.forEach(field => {
        if (field && field.labels) { // Node
          const nodeId = field.identity.toString();
          if (!nodeMap.has(nodeId)) {
            nodeMap.set(nodeId, true);
            const properties = field.properties || {};
            nodes.push({
              id: nodeId,
              label: field.labels[0],
              value: properties.name || properties.title || nodeId
            });
          }
        }
      });

      // Process relationships
      const rel = record._fields[1]; // Assuming r is the relationship
      if (rel && rel.start && rel.end) {
        links.push({
          source: rel.start.toString(),
          target: rel.end.toString(),
          type: rel.type
        });
      }
    });

    console.log('Returning data:', { nodes: nodes.length, links: links.length });
    res.json({ nodes, links });
  } catch (error) {
    console.error('Error in /graph endpoint:', {
      message: error.message,
      stack: error.stack,
      query: req.body.query
    });
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Cleanup on process exit
process.on('SIGINT', async () => {
  await driver.close();
  process.exit();
});