import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState(''); // State to track the input value
  const [tasks, setTasks] = useState([]); // State to store the list of tasks

 useEffect(() => {
    // Clear Node-persist data on application restart
    clearNodePersistData();
  }, []);

  async function clearNodePersistData() {
    try {
      // Send a request to clear Node-persist data
      await fetch('http://localhost:3001/clear');
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchTasks() {
    try {
      // Fetch the list of tasks from the server
      const response = await fetch('http://localhost:3001/tasks');
      const data = await response.json();
      setTasks(data); // Update the tasks state with the fetched data
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (input.trim() !== '') {
      // Check if input is not empty or contains only spaces

      // Update the tasks state by adding the new task
      setTasks([...tasks, input]);

      setInput(''); // Clear the input field

      try {
        const body = { input };
        // Send a POST request to add the task to the server
        await fetch('http://localhost:3001/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        setInput(''); // Clear the input field
        fetchTasks(); // Fetch the updated list of tasks
      } catch (error) {
        console.error(error.message);
      }
    }
  }
  async function handleDeleteTask(taskToDelete) {
    try {
      // Send a DELETE request to remove the task from the server
      await fetch(`http://localhost:3001/tasks/${taskToDelete}`, {
        method: 'DELETE',
      });
      
      // Update the tasks state by filtering out the deleted task
      const updatedTasks = tasks.filter((task) => task !== taskToDelete);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error.message);
    }
  }
  

  return (
    <div className='div'>
      <h1 className='h1'>To Do List App</h1>
      <form onSubmit={handleSubmit} className='form'>
        <label className='label' >Enter the task:</label>
        <input
          type='text'
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className='input'
        />
        <button type='submit' className='button'>
          Add Task
        </button>
      </form>
      <ul className='ul'>
        {tasks.map((task, index) => (
          <li key={index} className='li'>
            {task}
            <button onClick={() => handleDeleteTask(task)} className='delete-button'>
           X
          </button>
          </li>
          
        ))}
      </ul>
      
    </div>
  );
}

export default App;

