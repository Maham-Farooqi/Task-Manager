import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/User/Login';
import SignUp from "./components/User/SignUp";
import Profile from "./components/User/Profile";
import ViewTasks from "./components/Task/ViewTasks";
import CreateTask from "./components/Task/CreateTask";
import EditTask from "./components/Task/EditTask";
const App = () => {
  return (
    <div>
      <Router>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/viewTasks" element={<ViewTasks />} />
            <Route path="/createTask" element={<CreateTask />} />
            <Route path="/editTask/:id" element={<EditTask />} />
          </Routes>
      </Router>
    </div>
  )
}

export default App
