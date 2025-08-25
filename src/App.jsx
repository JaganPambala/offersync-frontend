import React from 'react';
import AppRoutes from './routes/appRoutes';
import './App.css';
import { Toaster } from "react-hot-toast";

function App() {
  return <AppRoutes />;
  <Toaster position="top-right" reverseOrder={false} />
}

export default App;
