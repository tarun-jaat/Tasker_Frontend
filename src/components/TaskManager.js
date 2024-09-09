import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import SearchBar from './SearchBar';
import './TaskManager.css';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Fetched tasks:', data);
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const addTask = async (task) => {
        try {
            const response = await fetch('http://localhost:3000/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: task.title, description: task.description }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newTask = await response.json();
            console.log('Added task:', newTask);
            setTasks([...tasks, newTask]);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const updateTask = async (id, updatedTask) => {
        try {
            const response = await fetch('http://localhost:3000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id, text: updatedTask.title, description: updatedTask.description, completed: updatedTask.completed }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedData = await response.json();
            console.log('Updated task:', updatedData);
            setTasks(tasks.map(task => task._id === id ? updatedData : task));
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch('http://localhost:3000/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id }),
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const completeTask = async (id) => {
        try {
            const taskToComplete = tasks.find(task => task._id === id);
            await fetch('http://localhost:3000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id, text: taskToComplete.text, description: taskToComplete.description, completed: true }),
            });
            setTasks(tasks.map(task =>
                task._id === id ? { ...task, completed: true } : task
            ));
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    const toggleExpansion = (id) => {
        setExpandedTaskId(expandedTaskId === id ? null : id);
    };

    const getShortDescription = (description) => {
        const words = description.split(' ');
        return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
    };

    const filteredTasks = tasks.filter((task) =>
        task.text && task.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="task-manager">
            <h1 className="task-manager-title">Task Manager</h1>
            <TaskForm addTask={addTask} />
            <SearchBar setSearchQuery={setSearchQuery} />

            <h2>Active Tasks</h2>
            <ul className="task-list">
                {filteredTasks.filter(task => !task.completed).map((task) => (
                    <li key={task._id} className="task-item">
                        <div className="task-header">
                            <span
                                className={`task-title ${task.completed ? 'completed' : ''}`}
                            >
                                {task.text}
                            </span>
                            <button className="complete-button" onClick={() => completeTask(task._id)}>Complete</button>
                            <button className="edit-button" onClick={() => {
                                const newTitle = prompt('Update task title', task.text);
                                const newDescription = prompt('Update task description', task.description);
                                if (newTitle !== null && newDescription !== null) {
                                    updateTask(task._id, { title: newTitle, description: newDescription });
                                }
                            }}>Edit</button>
                            <button className="delete-button" onClick={() => deleteTask(task._id)}>Delete</button>
                        </div>
                        {task.description && (
                            <div className="task-details">
                                {expandedTaskId === task._id
                                    ? <p>{task.description}</p>
                                    : <p>{getShortDescription(task.description)}</p>}
                                {task.description.length > 30 && (
                                    <button onClick={() => toggleExpansion(task._id)}>
                                        {expandedTaskId === task._id ? 'Less' : 'More'}
                                    </button>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <h2>Completed Tasks</h2>
            <ul className="task-list">
                {completedTasks.map((task) => (
                    <li key={task._id} className="task-item">
                        <div className="task-header">
                            <span className="task-title completed">{task.text}</span>
                            <button className="delete-button" onClick={() => deleteTask(task._id)}>Delete</button>
                        </div>
                        {task.description && (
                            <div className="task-details">
                                <p>{task.description}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
