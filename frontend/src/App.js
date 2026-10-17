// frontend/src/App.js
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';   // Giriş ve Kayıt Formu
import TaskList from './components/TaskList';   // Görev Listesi (Dashboard)
import './index.css';                         // Uygulamanın temel stilleri

// Uygulamanın ana bileşeni ve durum yöneticisi
function App() {
  // --- Oturum Durumu (State) ---
  // Uygulama yüklendiğinde, tarayıcıda kayıtlı bir token olup olmadığını kontrol eder.
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('task_manager_token') 
  );

  // --- Başarılı Giriş Fonksiyonu ---
  // AuthForm'dan çağrılır. Token'ı alır ve kullanıcıyı oturum açmış duruma geçirir.
  const handleLoginSuccess = (token) => {
    localStorage.setItem('task_manager_token', token); // Token'ı tarayıcıya kaydet
    setIsLoggedIn(true); // Oturum durumunu true yaparak TaskList'i gösterir
  };

  // --- Çıkış Yapma Fonksiyonu ---
  // TaskList'ten çağrılır. Kullanıcının oturumunu kapatır.
  const handleLogout = () => {
    localStorage.removeItem('task_manager_token'); // Kayıtlı token'ı sil
    setIsLoggedIn(false); // Oturum durumunu false yaparak AuthForm'a geri döner
  };

  // --- Arayüz (JSX) ---
  return (
    <div className="App">
      {/* Koşullu Render: Oturum durumuna göre hangi ekranın gösterileceğine karar verilir */}
      {isLoggedIn ? (
        // Kullanıcı giriş yapmışsa: Görev Listesini (Dashboard) gösterir
        <TaskList handleLogout={handleLogout} /> 
      ) : (
        // Kullanıcı giriş yapmamışsa: Giriş/Kayıt Formunu gösterir
        <AuthForm handleLoginSuccess={handleLoginSuccess} /> 
      )}
    </div>
  );
}

export default App;