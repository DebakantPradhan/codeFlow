export default async function handler(req, res) {
    // Enable CORS for requests from your extension
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  
    // Handle preflight requests for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    // Store problem data (POST)
    if (req.method === 'POST') {
      try {
        const { data } = req.body;
        
        // Generate a unique ID for this problem
        const problemId = Date.now().toString() + Math.random().toString(36).substring(2, 10);
        
        // Store the problem data in temporary storage
        // In a real implementation, you'd use a database like MongoDB, Redis, etc.
        // For simplicity in this demo, we'll use a global object (not recommended for production)
        if (!global.problems) global.problems = {};
        
        // Store the data with a 30-minute expiration time
        global.problems[problemId] = {
          data,
          expires: Date.now() + 45 * 60 * 1000 // 45 minutes from now
        };
        
        // Clean up expired problems
        Object.keys(global.problems).forEach(key => {
          if (global.problems[key].expires < Date.now()) {
            delete global.problems[key];
          }
        });
        
        // Return the problem ID to the client
        res.status(200).json({ success: true, problemId });
      } catch (error) {
        console.error('Error storing problem data:', error);
        res.status(500).json({ success: false, error: 'Failed to store problem data' });
      }
    }
    
    // Retrieve problem data (GET)
    else if (req.method === 'GET') {
      try {
        const { id } = req.query;
        
        if (!id) {
          res.status(400).json({ success: false, error: 'No problem ID provided' });
          return;
        }
        
        // Check if the problem exists and hasn't expired
        if (!global.problems || !global.problems[id] || global.problems[id].expires < Date.now()) {
          res.status(404).json({ success: false, error: 'Problem not found or expired' });
          return;
        }
        
        // Return the problem data
        res.status(200).json({ 
          success: true, 
          data: global.problems[id].data 
        });
        
      } catch (error) {
        console.error('Error retrieving problem data:', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve problem data' });
      }
    }
    
    // Handle unsupported methods
    else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  }