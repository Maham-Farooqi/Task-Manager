import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoFilter } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import Navbar from '../Navbar';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const isDueToday = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    return due.getTime() === today.getTime();
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/task/delete/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task.');
    }
  };

  const toggleStatus = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

      const res = await fetch(`http://localhost:3000/task/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const updatedTask = { ...task, status: updatedStatus };
      setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
    } catch (err) {
      console.error(err);
      alert('Could not toggle task status.');
    }
  };


  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      setLoading(true);

      try {
        const res = await fetch('http://localhost:3000/task/tasks', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
        setFilteredTasks(data);
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false);
      }

    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch = task.name?.toLowerCase().includes(search.toLowerCase()) || task.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Completed' && task.status === 'Completed') ||
        (filterStatus === 'Pending' && task.status === 'Pending') ||
        (filterStatus === 'Due Today' && isDueToday(task.dueDate));

      const matchesPriority =
        filterPriority === 'All' ||
        task.priority?.toLowerCase() === filterPriority.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredTasks(filtered);
  }, [search, filterStatus, filterPriority, tasks]);

  const resetFilters = () => {
    setFilterStatus('All');
    setFilterPriority('All');
    setSearch('');
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2">Loading task data...</p>
      </div>
    );
  }

  return (
    <div className="fullscreen-bg text-slate pb-3" style={{ minHeight: '100vh' }}>
      <Navbar />

      <div className="container my-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 w-75 mx-auto">
          <Link to="/createTask" className="btn btn-primary">+ Create Task</Link>

          <div className="position-relative" style={{ maxWidth: '500px', width: '100%' }}>
            <FaSearch
              className="position-absolute"
              style={{
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search tasks by name, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="position-relative" >
            <button
              className="btn btn-dark d-flex align-items-center"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <IoFilter className="me-1" />
              Filter
            </button>

            {showFilterDropdown && (
              <div
                className="position-absolute bg-white border shadow p-3 mt-1 rounded"
                style={{ zIndex: 1000, width: '250px' }}
              >
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Due Today">Due Today</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <button className="btn btn-sm btn-secondary w-100" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-muted text-center">No tasks match your criteria.</p>
        ) : (
          <div className="row">
            {filteredTasks.map((task) => (
              <div key={task._id} className="col-md-4 mb-4">
                <div className={`card h-100 shadow-sm border-${task.status === 'Completed' ? 'success' : 'danger'} position-relative`}>
                  <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                    <FaEdit
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/editTask/${task._id}`)}
                    />
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(task._id)}
                    />
                    {task.status === 'Completed' ? (
                      <FaCheckCircle
                        className="text-success"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleStatus(task._id)}
                        title="Mark as Pending"
                      />
                    ) : (
                      <FaRegCircle
                        className="text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleStatus(task._id)}
                        title="Mark as Completed"
                      />
                    )}
                  </div>

                  <div className="card-body pt-5">
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text">{task.description}</p>
                    <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                    <span className={`badge bg-${task.status === 'Completed' ? 'success' : isDueToday(task.dueDate) ? 'warning' : 'danger'}`}>
                      {task.status === 'Completed' ? 'Completed' : isDueToday(task.dueDate) ? 'Due Today' : 'Pending'}
                    </span>
                    {task.priority && (
                      <span className="badge bg-info text-dark ms-2">{task.priority}</span>
                    )}
                  </div>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTasks;
