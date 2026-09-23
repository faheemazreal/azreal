import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import WatchPage from './pages/WatchPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anime/:id" element={<AnimeDetailPage />} />
      <Route path="/watch/:id" element={<WatchPage />} />
    </Routes>
  );
}
