from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        # Tüm alanları dahil ediyoruz, 'user' alanı otomatik ayarlanacak
        fields = ['id', 'title', 'description', 'category', 'status', 'dueDate', 'dueTime', 'created_at'] 
        # Yalnızca okunabilir alanları tanımlayalım
        read_only_fields = ['user', 'created_at']