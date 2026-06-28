import './App.css'
import HomePage from './Pages/homePage';
import LoginPage from './Pages/loginPage';
import RegisterPage from './Pages/registerPage';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './Pages/adminPage';
import TestPage from './Pages/testPage';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
   <div className="w-full h-screen"> {/* 1st Div  -->  h-screen */}
    <Toaster position="top-right" /> {/* for toast notifications */}

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/test" element={<TestPage />} />
    </Routes> 
  </div>
  )
}

export default App