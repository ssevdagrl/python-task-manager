// frontend/src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Backend'deki görev API'sinin temel adresi
const API_BASE_URL = 'http://127.0.0.1:8000/api/tasks/';

// isEditing: Düzenlenecek görevi (varsa) içerir.
// setIsFormVisible: Formun görünürlüğünü yönetir.
// onTaskSaved: Başarılı kayıttan sonra görev listesini yenilemek için kullanılır.
function TaskForm({ isEditing = null, setIsFormVisible, onTaskSaved }) {
  // Form alanları için durum değişkenleri (State)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Genel');
  const [status, setStatus] = useState('Yapılacak');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false); // Kayıt işleminin durumunu tutar
  const [error, setError] = useState('');

  // Güvenlik: localStorage'dan kimlik doğrulama token'ını alır
  const token = localStorage.getItem('task_manager_token');

  // Görev durumları için seçenekler
  const STATUS_CHOICES = ['Yapılacak', 'Devam Ediyor', 'Tamamlandı'];

  // Düzenleme (Editing) modu için başlangıç değerlerini yükler
  useEffect(() => {
    if (isEditing) {
      // Eğer düzenleme modundaysa, gelen görev objesinin verilerini state'lere yükle
      setTitle(isEditing.title || '');
      setDescription(isEditing.description || '');
      setCategory(isEditing.category || 'Genel');
      setStatus(isEditing.status || 'Yapılacak');
      // Tarih formatını React input'una uygun hale getirir (YYYY-MM-DD)
      setDueDate(isEditing.dueDate || ''); 
    }
  }, [isEditing]); // isEditing prop'u değiştiğinde bu efekti yeniden çalıştır

  // Form gönderimi (Ekleme/Güncelleme)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // API'ye gönderilecek veri paketi (Payload)
    const payload = { title, description, category, status, dueDate };

    let endpoint = API_BASE_URL;
    let method = 'post'; // Varsayılan olarak ekleme (POST)

    // Düzenleme modu kontrolü: Metodu PUT olarak değiştir ve görev ID'sini ekle
    if (isEditing) {
      endpoint = `${API_BASE_URL}${isEditing.id}/`; // Örn: PUT /api/tasks/12/
      method = 'put';
    }

    try {
      // Yetkilendirilmiş API isteğini gönder
      await axios({
        method: method,
        url: endpoint,
        data: payload,
        headers: {
          'Authorization': `Token ${token}` // Token başlığı ile güvenlik
        }
      });

      // Başarılı olursa: Görev listesini yenile ve formu kapat
      onTaskSaved(); 
      setIsFormVisible(false);
    } catch (err) {
      // Hata durumunda kullanıcıya bildirim göster
      setError('Görev kaydedilirken bir hata oluştu. Lütfen tüm alanları kontrol edin.');
      setLoading(false);
    }
  };

  // --- Arayüz (JSX) ---
  return (
    <div style={styles.formContainer}>
      <h3>{isEditing ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h3>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Başlık Alanı */}
        <input 
          type="text" placeholder="Başlık" 
          value={title} onChange={(e) => setTitle(e.target.value)} 
          required style={styles.input} 
        />
        {/* Açıklama Alanı */}
        <textarea 
          placeholder="Açıklama" 
          value={description} onChange={(e) => setDescription(e.target.value)} 
          style={styles.input} rows="3" 
        />

        {/* Kategori Seçim Alanı */}
        <select 
          value={category} onChange={(e) => setCategory(e.target.value)} 
          style={styles.select} required
        >
          <option value="Genel">Genel</option>
          <option value="İş">İş</option>
          <option value="Kişisel">Kişisel</option>
          <option value="Eğitim">Eğitim</option>
        </select>

        {/* Durum Seçim Alanı */}
        <select 
          value={status} onChange={(e) => setStatus(e.target.value)} 
          style={styles.select} required
        >
          {STATUS_CHOICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Bitiş Tarihi Alanı */}
        <input 
          type="date" 
          value={dueDate} onChange={(e) => setDueDate(e.target.value)} 
          style={styles.input} 
        />

        {/* Buton Grubu */}
        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.saveButton}>
            {/* Buton metnini moda göre ayarlar */}
            {loading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Ekle')}
          </button>
          <button 
            type="button" 
            onClick={() => setIsFormVisible(false)} 
            style={styles.cancelButton}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Bileşen Stilleri ---
const styles = {
  formContainer: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', background: '#f9f9f9' },
  input: { width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '15px' },
  saveButton: { padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  cancelButton: { padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default TaskForm;