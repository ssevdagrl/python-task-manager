# tasks/models.py

from django.db import models
from django.contrib.auth.models import User # Django'nun yerleşik Kullanıcı (User) modelini içeri aktarır

class Task(models.Model):
    """
    Görev yönetim sistemi için görev kaydını (Task) temsil eden veritabanı modeli.
    """
    
    # --- İlişki Alanları (Foreign Key) ---
    # Görevin sahibi olan kullanıcıya bağlanır. Kullanıcı silinirse, görevleri de silinir (CASCADE).
    user = models.ForeignKey(User, on_delete=models.CASCADE) 

    # --- Temel Görev Bilgileri ---
    title = models.CharField(max_length=200) # Görevin başlığı (Zorunlu)
    description = models.TextField(blank=True, null=True) # Görevin detaylı açıklaması (Boş bırakılabilir)
    category = models.CharField(max_length=100, default='Genel') # Görevin kategorisi (Varsayılan: 'Genel')

    # --- Durum Yönetimi ---
    # Görev durumu için sabit seçenekler tanımlanır
    STATUS_CHOICES = (
        ('Yapılacak', 'Yapılacak'),
        ('Devam Ediyor', 'Devam Ediyor'),
        ('Tamamlandı', 'Tamamlandı'),
    )
    # Görevin mevcut durumunu tutar
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Yapılacak') 

    # --- Zamanlama Alanları ---
    dueDate = models.DateField(blank=True, null=True) # Görevin bitiş tarihi (Boş bırakılabilir)
    dueTime = models.TimeField(blank=True, null=True) # Görevin bitiş saati (Boş bırakılabilir)
    created_at = models.DateTimeField(auto_now_add=True) # Görevin oluşturulma zamanı (Otomatik ayarlanır)

    def __str__(self):
        # Admin panelinde ve konsolda objeyi başlığı ile temsil eder
        return self.title