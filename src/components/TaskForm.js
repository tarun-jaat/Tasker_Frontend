import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ addTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            addTask({ title, description });
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Add new task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="task-input"
            />
            <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="task-textarea"
            />
            <button type="submit" className="add-task-button">Add Task</button>
        </form>
    );
};

export default TaskForm;
