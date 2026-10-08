import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiTrash2, FiPlus, FiDownload, FiArrowUpRight } from 'react-icons/fi';
import Footer from '../components/Footer/Footer';
import './TodoAppPage.css';

const INITIAL_TASKS = [
  { id: 1, text: 'Finalize Full Stack Portfolio React Migration', completed: true },
  { id: 2, text: 'Integrate Weather App API Hook & Multi-City Metrics', completed: true },
  { id: 3, text: 'Optimize 3D Canvas LERP Physics Engine at 60 FPS', completed: false },
  { id: 4, text: 'Feature InsiteVerse Magazine Platform Case Study', completed: true }
];

export default function TodoAppPage() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    document.title = 'TaskFlow Todo | Interactive Application | A. AHAD';
    window.scrollTo(0, 0);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputVal('');
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (e, id) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const totalCount = tasks.length;
  const doneCount = tasks.filter((t) => t.completed).length;
  const completionPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="todo-page-wrapper">
      {/* Hero Section */}
      <section className="section-container page-hero">
        <div className="hero-tag">INTERACTIVE UTILITY DEMO</div>
        <h1 className="hero-title">TASKFLOW TODO APPLICATION</h1>
        <p className="hero-subtext">
          An ultra-responsive task management dashboard engineered for high daily productivity, category tags, priority tracking, and local storage data persistence.
        </p>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/Abdul_Ahad_Resume.pdf"
            download="Abdul_Ahad_Resume.pdf"
            className="btn-cv"
          >
            <FiDownload />
            <span>DOWNLOAD MY CV / RESUME</span>
          </a>
          <Link to="/projects/todo-app" className="btn-secondary">
            <span>VIEW CASE STUDY</span>
            <FiArrowUpRight />
          </Link>
        </div>
      </section>

      {/* Interactive Live Widget */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div className="todo-app-card">
          <form className="todo-input-row" onSubmit={addTask}>
            <input
              type="text"
              className="task-input"
              placeholder="Add a new priority task (e.g. Review React Code)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="add-task-btn">
              <FiPlus />
              <span>ADD TASK</span>
            </button>
          </form>

          {/* Progress Header & Fill Bar */}
          <div className="todo-progress-header">
            <span>TASK PROGRESS</span>
            <span>{doneCount} of {totalCount} tasks completed ({completionPercent}%)</span>
          </div>

          <div className="todo-progress-bg">
            <div
              className="todo-progress-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          {/* Task List */}
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-tasks-notice">
                All caught up! Type above to create a new task.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="task-left">
                    <div className="check-box">
                      {task.completed && <FiCheck />}
                    </div>
                    <span>{task.text}</span>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={(e) => deleteTask(e, task.id)}
                    aria-label={`Delete task ${task.text}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Productivity Specs */}
      <section className="section-container">
        <div className="hero-tag">PRODUCTIVITY SPECIFICATIONS</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          WHY TASKFLOW WORKS
        </h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3 className="feature-title">LOCAL STORAGE JSON</h3>
            <p className="feature-desc">
              All task states are instantly serialized and saved in browser LocalStorage across sessions.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏷️</div>
            <h3 className="feature-title">PRIORITY TAGGING</h3>
            <p className="feature-desc">
              Color-coded visual styling for urgent and pending task completion tracking.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">PROGRESS ANALYTICS</h3>
            <p className="feature-desc">
              Dynamic visual progress bar calculating real-time completion percentages.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌙</div>
            <h3 className="feature-title">DARK NEON UI</h3>
            <p className="feature-desc">
              High-contrast dark mode layout designed for reduced eye strain during extended work hours.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
