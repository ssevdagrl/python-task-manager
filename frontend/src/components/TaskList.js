// frontend/src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm'; 

// Backend'deki görev API'sinin temel adresi
const API_BASE_URL = 'http://127.0.0.1:8000/api/tasks/';

// --- TEMA RENKLERİ ---
const THEME_COLORS = {
    PRIMARY: '#FF69B4', // Ana Pembe
    DANGER: '#C71585',  // Silme Kırmızımsı Pembe
    INFO: '#FFC0CB',    // Kart Kenarlık Vurgusu (Açık Pembe)
};

// handleLogout fonksiyonunu App.js'ten prop olarak alır.
function TaskList({ handleLogout }) {
    // --- Durum Yönetimi ---
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false); 
    const [taskToEdit, setTaskToEdit] = useState(null); 
    
    const token = localStorage.getItem('task_manager_token');

    // --- Görev Çekme (READ) Fonksiyonu ---
    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setTasks(response.data);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
                handleLogout(); 
            } else {
                setError('Görevler yüklenirken bir hata oluştu.');
            }
            setLoading(false);
        }
    };

    // --- Görev Silme (DELETE) Fonksiyonu ---
    const handleDelete = async (taskId) => {
        if (!window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
            return; 
        }
        try {
            await axios.delete(`${API_BASE_URL}${taskId}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            fetchTasks(); // Silme başarılı olduktan sonra listeyi yeniler
        } catch (err) {
            setError('Görev silinirken hata oluştu.');
        }
    };
    
    // --- Form Açma Fonksiyonları ---
    const handleOpenAddForm = () => {
        setTaskToEdit(null); // Yeni görev ekleme modu için 'null' gönderilir
        setIsFormVisible(true);
    }
    
    const handleOpenEditForm = (task) => {
        setTaskToEdit(task); // Düzenlenecek görev objesini state'e kaydeder
        setIsFormVisible(true);
    }

    // --- Yaşam Döngüsü (Mounting) ---
    useEffect(() => {
        if (token) {
            fetchTasks();
        } else {
            handleLogout();
        }
    }, [token, handleLogout]); 

    if (loading) return <p>Görevler yükleniyor...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    // --- Arayüz (JSX) ---
    return (
        <div style={styles.dashboard}>
            {/* BAŞLIK VE BUTONLAR */}
            <header style={styles.header}>
                <h2>Görev Paneli ({tasks.length} Görev)</h2>
                <div>
                    {/* YENİ GÖREV EKLE BUTONU */}
                    <button onClick={handleOpenAddForm} style={styles.addButton}>+ Yeni Görev Ekle</button>
                    <button onClick={handleLogout} style={styles.logoutButton}>Çıkış Yap</button>
                </div>
            </header>
            
            {/* GÖREV EKLEME/DÜZENLEME FORMU */}
            {isFormVisible && (
                <TaskForm 
                    isEditing={taskToEdit} 
                    setIsFormVisible={setIsFormVisible} 
                    onTaskSaved={fetchTasks} 
                />
            )}

            {/* GÖREV LİSTESİ */}
            {tasks.length === 0 ? (
                <p>Henüz hiç görev eklemediniz.</p>
            ) : (
                <div style={styles.taskList}>
                    {tasks.map(task => (
                        <div key={task.id} style={styles.taskItem}>
                            <h4 style={styles.taskTitle}>{task.title}</h4>
                            <p>Durum: {task.status}</p>
                            <p>Kategori: {task.category}</p>
                            <p>Bitiş Tarihi: {task.dueDate}</p>

                            <div style={styles.taskActions}>
                                {/* DÜZENLEME BUTONU */}
                                <button onClick={() => handleOpenEditForm(task)} style={styles.editButton}>Düzenle</button>
                                {/* SİLME BUTONU */}
                                <button onClick={() => handleDelete(task.id)} style={styles.deleteButton}>Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Bileşen Stilleri (Pastel Tema) ---
const styles = {
    // Dashboard (Ana Kapsayıcı) Stilleri
    dashboard: { 
        maxWidth: '900px', margin: '0 auto', padding: '25px', 
        background: '#fff', borderRadius: '15px', 
        boxShadow: `0 8px 30px ${THEME_COLORS.INFO}`, // Pastel Pembe gölge
    },
    header: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '20px', borderBottom: `1px solid ${THEME_COLORS.INFO}`, paddingBottom: '10px' 
    },
    // Buton Stilleri
    logoutButton: { padding: '8px 15px', backgroundColor: THEME_COLORS.DANGER, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    addButton: { padding: '8px 15px', backgroundColor: THEME_COLORS.PRIMARY, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    editButton: { padding: '5px 10px', backgroundColor: THEME_COLORS.INFO, color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    deleteButton: { padding: '5px 10px', backgroundColor: THEME_COLORS.DANGER, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    
    // Liste ve Kart Stilleri
    taskList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    taskItem: { 
        padding: '15px', 
        borderLeft: `5px solid ${THEME_COLORS.PRIMARY}`, // Ana pembe kenarlık
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', 
        background: '#fff', 
    },
    taskTitle: { margin: '0 0 10px 0', color: THEME_COLORS.PRIMARY },
    taskActions: { marginTop: '10px', display: 'flex', gap: '5px' },
};

export default TaskList;