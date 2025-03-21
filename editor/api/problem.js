export default async function handler(req, res) {
  // Set proper CORS headers to allow requests from LeetCode and GeeksForGeeks
  const allowedOrigins = [
    'https://leetcode.com',
    'https://practice.geeksforgeeks.org',
    'http://localhost:3000',
    'http://127.0.0.1:5500'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For browser extensions that might not send proper origin
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Required for preflight OPTIONS requests
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight OPTIONS requests correctly
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Rest of your handler code...
  if (req.method === 'POST') {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({ success: false, error: 'No problem data provided' });
      }
      
      // Generate a unique ID for this problem
      const problemId = Date.now().toString() + Math.random().toString(36).substring(2, 10);
      
      // Store in memory (will be replaced with proper storage in production)
      if (!global.problems) global.problems = {};
      
      global.problems[problemId] = {
        data,
        expires: Date.now() + 30 * 60 * 1000 // 30 minutes
      };
      
      // Clean up expired problems
      Object.keys(global.problems).forEach(key => {
        if (global.problems[key].expires < Date.now()) {
          delete global.problems[key];
        }
      });
      
      return res.status(200).json({ success: true, problemId });
    } catch (error) {
      console.error('Error storing problem data:', error);
      return res.status(500).json({ success: false, error: 'Failed to store problem data' });
    }
  }
  
  // Retrieve problem data (GET)
  else if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'No problem ID provided' });
      }
      
      if (!global.problems || !global.problems[id]) {
        return res.status(404).json({ success: false, error: 'Problem not found' });
      }
      
      if (global.problems[id].expires < Date.now()) {
        delete global.problems[id];
        return res.status(404).json({ success: false, error: 'Problem data has expired' });
      }
      
      return res.status(200).json({ success: true, data: global.problems[id].data });
    } catch (error) {
      console.error('Error retrieving problem data:', error);
      return res.status(500).json({ success: false, error: 'Failed to retrieve problem data' });
    }
  }
  
  else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}