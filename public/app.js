// Load Neo4j driver for browser
//import neo4j from 'https://cdn.skypack.dev/neo4j-driver';

// Check if Popoto.js and Neo4j driver are loaded
if (typeof popoto === 'undefined') {
  console.error('Popoto.js is not loaded. Check the CDN URL or use a local copy.');
} else if (typeof neo4j === 'undefined') {
  console.error('Neo4j driver is not loaded. Check the CDN URL.');
} else {
  console.log('Popoto.js and Neo4j driver loaded successfully');
  
  // Configure Popoto.js
  popoto.logger.level = popoto.logger.DEBUG;

  // Create Neo4j driver for client-side connection
  const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'caviar-Gravity-beyond-export-castle-3106'),
    { disableLosslessIntegers: true }
  );

  // Set the driver for Popoto
  popoto.runner.DRIVER = driver;

  // Define node providers with string values instead of enum
  popoto.provider.node.Provider = {
    Person: {
      returnAttributes: ['name'],
      constraintAttribute: 'name',
      displayAttribute: 'name',
      getDisplayType: () => "TEXT", // Use string instead of enum
      getIsLeaf: () => false,
      getRelationshipTypes: () => ['ACTED_IN']
    },
    Movie: {
      returnAttributes: ['title'],
      constraintAttribute: 'title', 
      displayAttribute: 'title',
      getDisplayType: () => "TEXT", // Use string instead of enum
      getIsLeaf: () => true
    }
  };

  // Initialize Popoto
  popoto.graph.containerId = 'popoto-graph';
  popoto.start('Person');
}