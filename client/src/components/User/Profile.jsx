import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../Navbar';

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [taskData, setTaskData] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    dueToday: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          navigate('/');
          return;
        }

        const responseData = await res.json();
        setProfile(responseData);

        const tasks = await fetch('http://localhost:3000/task/summary', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!tasks.ok) return;

        const responseTasks = await tasks.json();
        setTaskData(responseTasks);

      } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
        navigate('/');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const chartValues = [taskData.completed, taskData.dueToday, taskData.pending];

  const pieChartData = {
    labels: ['Completed', 'Due Today', 'Pending'],
    datasets: [
      {
        data: chartValues,
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const isAllZero = chartValues.every(val => val === 0);

  const noDataPlugin = {
    id: 'no-data',
    beforeDraw: (chart) => {
      if (isAllZero) {
        const { ctx, width, height } = chart;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#888';
        ctx.fillText('No task data available', width / 2, height / 2);
        ctx.restore();
      }
    }
  };

  return (
    <div className="fullscreen-bg text-slate pb-3" style={{ minHeight: '100vh' }}>
      <Navbar />

      <div className="container mt-5">
        <h2 className="mb-4 text-center">Welcome, {profile.name}</h2>
        <div className="row g-4 my-4">
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Tasks</h5>
                <p className="display-6 fw-bold text-primary">{taskData.total}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Completed Tasks</h5>
                <p className="display-6 fw-bold text-success">{taskData.completed}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Due Today</h5>
                <p className="display-6 fw-bold text-warning">{taskData.dueToday}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Pending Tasks</h5>
                <p className="display-6 fw-bold text-danger">{taskData.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-6 mx-auto">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Task Distribution</h5>
                <div style={{ height: '300px' }}>
                  <Pie
                    data={pieChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                    plugins={[noDataPlugin]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center my-5">
          <Link to="/viewTasks" className="btn btn-success btn-lg">View All Tasks</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
