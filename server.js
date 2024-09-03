const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to store the bus requests
const requestsFilePath = path.join(__dirname, 'busRequests.json');

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(requestsFilePath)) {
    fs.writeFileSync(requestsFilePath, JSON.stringify([]));
}

// API route to handle bus generation requests
app.post('/api/bus-request', (req, res) => {
    const { startPoint, endPoint, selectedRoute } = req.body;

    if (!startPoint || !endPoint || !selectedRoute) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new request object
    const newRequest = {
        id: Date.now(),
        startPoint,
        endPoint,
        selectedRoute,
        date: new Date(),
    };

    // Read the current data from the JSON file
    const requests = JSON.parse(fs.readFileSync(requestsFilePath, 'utf-8'));

    // Add the new request to the array
    requests.push(newRequest);

    // Save the updated array back to the file
    fs.writeFileSync(requestsFilePath, JSON.stringify(requests, null, 2));

    res.status(201).json({ message: 'Bus request submitted successfully', data: newRequest });
});

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
