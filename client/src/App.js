import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Teacher from './Components/Teacher';
import Student from './Components/Student';
import Admin from './Components/Admin';
import Header from './Components/Header';
import Footer from './Components/Footer';

function AppContent() {
  const location = useLocation();

  // الصفحات التي نخفي فيها الهيدر والفوتر
  const hideLayout =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
