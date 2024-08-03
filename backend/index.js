const express = require('express');
const app = express();
const storage = require('node-persist');
const bodyParser = require('body-parser');

// Initialize Node-persist storage
storage.init();
// Clear Node-persist data on application restart


const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// Route for adding a task
app.post('/tasks', async (req, res) => {
  const { input } = req.body;
  await storage.init();
  await storage.setItem(input, input);
  res.send('Task added successfully');
});

// Route for retrieving tasks
app.get('/tasks', async (req, res) => {
  await storage.init();
  const tasks = await storage.values();
  res.send(tasks);
});

// Route for clearing Node-persist data
app.get('/clear', async (req, res) => {
  await storage.init();
  await storage.clear();
  res.send('Node-persist data cleared');
});

// Start the server
app.listen(3001, () => {
  console.log('Server has started');
});

// Route for deleting a task by task name
app.delete('/tasks/:taskName', async (req, res) => {
  const { taskName } = req.params;
  await storage.init();
  
  try {
    // Remove the task from storage
    await storage.removeItem(taskName);
    res.send(`Task "${taskName}" deleted successfully`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error deleting task');
  }
});
