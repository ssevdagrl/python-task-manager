// frontend/src/components/AuthForm.js
import React, { useState } from 'react';
import axios from 'axios';

// Backend API'sinin Kimlik Doğrulama adresi
const API_BASE_URL = 'http://127.0.0.1:8000/api/auth'; 

// App.js'ten başarılı giriş sonrası çağrılacak fonksiyonu prop olarak alır
function AuthForm({ handleLoginSuccess }) {
  // Durum Yönetimi (State Management)
  const [isRegister, setIsRegister] = useState(true); // Kayıt/Giriş modunu tutar
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');     // Kullanıcıya gösterilecek başarı/hata mesajı
  const [isError, setIsError] = useState(false);  // Mesajın hata mı (kırmızı) yoksa başarı mı (yeşil) olduğunu tutar

  // Form gönderildiğinde çalışacak asenkron fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setIsError(false);
    
    // Kullanılacak API uç noktasını belirler
    const endpoint = isRegister ? 'register' : 'login';
    
    // Kayıt için email zorunludur, payload'u moda göre hazırlar
    const payload = isRegister 
      ? { username, email, password }
      : { username, password };

    try {
      // Belirlenen uç noktaya (register/login) POST isteği gönderir
      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, payload);
      
      if (isRegister) {
        // KAYIT BAŞARILI
        setMessage(response.data.message || 'Kayıt başarılı!');
        // Kullanıcıyı otomatik olarak Giriş moduna geçirir
        setIsRegister(false); 
      } else {
        // GİRİŞ BAŞARILI
        const token = response.data.token;
        
        // Üst bileşene (App.js) başarılı girişi bildirerek oturum açmayı sağlar
        handleLoginSuccess(token); 
        
        setMessage('Giriş başarılı! Yönlendiriliyorsunuz...'); 
      }
    } catch (error) {
      // HATA YÖNETİMİ (Geçersiz giriş, kullanıcı adı zaten var vb.)
      const errorMsg = error.response?.data?.error || 'Bir sunucu hatası oluştu.';
      setMessage(errorMsg);
      setIsError(true);
    }
  };

  // --- Arayüz (JSX) ---
  return (
    <div style={styles.card}>
      <h2>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
      
      {/* Mesaj Kutusu: Hata veya başarı mesajını gösterir */}
      {message && (
        <div style={isError ? styles.errorBox : styles.successBox}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Kullanıcı Adı Alanı */}
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        
        {/* E-posta Alanı (Yalnızca Kayıt modunda gösterilir) */}
        {isRegister && (
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        )}
        
        {/* Şifre Alanı */}
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </form>

      {/* Kayıt ve Giriş arasında geçiş linki (Toggle) */}
      <p style={styles.toggleText}>
        {isRegister ? 'Zaten hesabın var mı? ' : 'Hesabın yok mu? '}
        <span 
          onClick={() => setIsRegister(!isRegister)}
          style={styles.toggleLink}
        >
          {isRegister ? 'Giriş Yap' : 'Kayıt Ol'}
        </span>
      </p>
    </div>
  );
}

// --- Bileşen Stilleri (Inline CSS) ---
const styles = {
  // Kartın ana stili
  card: {
    background: '#FFFFFF', // Kart zemini beyaz kalsın
    padding: '35px', 
    borderRadius: '15px', 
    // Daha yumuşak, pembe tonlu gölge
    boxShadow: '0 8px 30px rgba(255, 192, 203, 0.4)', 
    width: '350px', 
    textAlign: 'center',
  },
  // Giriş/Kayıt butonunun stili
  button: {
    width: '100%', 
    padding: '12px', 
    // Ana Tema Rengi: Yumuşak Pastel Pembe
    backgroundColor: '#FF69B4', 
    color: 'white',
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '16px', 
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
  },
  // Input ve Select alanlarının stili
  input: {
    width: 'calc(100% - 20px)', 
    padding: '12px 10px', 
    margin: '10px 0',
    borderRadius: '8px', 
    // Hafif pembe kenarlık
    border: '1px solid #FFC0CB',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  // Toggle (Geçiş) linki stili
  toggleText: { 
    marginTop: '25px', 
    fontSize: '14px', 
    color: '#333',
  },
  toggleLink: { 
    color: '#FF69B4', // Ana pembe renk
    cursor: 'pointer', 
    fontWeight: 'bold', 
  },
  // Başarı Mesajı Stili (Hala yeşil olmalı, ancak pastel ton)
  successBox: {
    padding: '10px', 
    backgroundColor: '#E0FFFF', // Soluk Mavi/Yeşil (Huzur veren ton)
    color: '#008080', 
    borderRadius: '8px', 
    marginBottom: '15px', 
    textAlign: 'left',
    border: '1px solid #008080',
  },
  // Hata Mesajı Stili (Hala kırmızı olmalı, ancak pastel ton)
  errorBox: {
    padding: '10px', 
    backgroundColor: '#FFF0F5', // Lavanta Pembesi (Pastel Kırmızı)
    color: '#C71585',           // Canlı Fuşya (Hata rengi)
    borderRadius: '8px', 
    marginBottom: '15px', 
    textAlign: 'left',
    border: '1px solid #C71585',
  },
};

export default AuthForm;