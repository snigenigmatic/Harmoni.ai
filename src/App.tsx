import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Resolve from './pages/Resolve';
import Meditation from './pages/Meditation';
import Profile from './pages/Profile';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resolve" element={<Resolve />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;