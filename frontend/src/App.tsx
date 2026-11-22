
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { Workspace } from './pages/Workspace';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MainHome } from './pages/MainHome';

import { AppLayout } from './AppLayout';

//routing for the site navbar is here
//uses app layout to decide what goes where
function App() {
 
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mainhome" element={<MainHome />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
