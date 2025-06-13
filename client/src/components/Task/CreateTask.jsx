import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaCalendarAlt, FaFlag, FaPen } from 'react-icons/fa';

const CreateTask = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/task/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          dueDate: data.dueDate,
          status: data.status,
          priority: data.priority
        })
        
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An error occurred while creating the task.');
      }

      const responseData = await res.json();
      console.log('Task Created:', responseData);
      reset();
      navigate('/viewTasks'); 
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="fullscreen-bg d-flex align-items-center justify-content-center p-4"   style={{ minHeight: "100vh" }}>
      <div className='shadow p-4 border rounded bg-white bg-opacity-75 backdrop-blur my-4 ' style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className='text-center text-success mb-4'>Create New Task</h2>

        {isSubmitting && (
          <div className="d-flex justify-content-center mb-3">
            <div className="spinner-border text-success" role="status" />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="form-floating mb-3">
            <input
              {...register("name", { required: "Task name is required" })}
              type="text"
              className="form-control"
              id="name"
              placeholder="Task Name"
            />
            <label htmlFor="name"><FaTasks className="me-2" />Task Name</label>
            {errors.name && <div className="text-danger mt-1">{errors.name.message}</div>}
          </div>

          <div className="form-floating mb-3">
            <textarea
              {...register("description")}
              className="form-control"
              placeholder="Description"
              id="description"
              style={{ height: "100px" }}
            ></textarea>
            <label htmlFor="description"><FaPen className="me-2" />Description</label>
          </div>

          <div className="form-floating mb-3">
            <input
              {...register("dueDate", { required: "Due date is required" })}
              type="date"
              className="form-control"
              id="dueDate"
              min={new Date().toISOString().split('T')[0]} 

              placeholder="Due Date"
            />
            <label htmlFor="dueDate"><FaCalendarAlt className="me-2" />Due Date</label>
            {errors.dueDate && <div className="text-danger mt-1">{errors.dueDate.message}</div>}
          </div>

          <div className="form-floating mb-3">
            <select
              {...register("status", { required: "Status is required" })}
              className="form-select"
              id="status"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <label htmlFor="status"><FaFlag className="me-2" />Status</label>
            {errors.status && <div className="text-danger mt-1">{errors.status.message}</div>}
          </div>

          <div className="form-floating mb-3">
            <select
              {...register("priority", { required: "Priority is required" })}
              className="form-select"
              id="priority"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <label htmlFor="priority"><FaFlag className="me-2" />Priority</label>
            {errors.priority && <div className="text-danger mt-1">{errors.priority.message}</div>}
          </div>

          <input type="submit" value="Create Task" className="btn btn-success w-100 mt-3 shadow-sm" />
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
