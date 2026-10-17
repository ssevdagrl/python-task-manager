from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count # Agregasyon fonksiyonunu (Count) kullanmak için gerekli import
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    Görevler için CRUD (Create, Retrieve, Update, Destroy) işlemlerini yönetir.
    GET /api/tasks/, POST /api/tasks/, PUT /api/tasks/:id, DELETE /api/tasks/:id
    """
    serializer_class = TaskSerializer
    
    # Güvenlik: Yalnızca kimliği doğrulanmış kullanıcılara izin verir 
    permission_classes = [permissions.IsAuthenticated] 

    # --- Veri Filtreleme (Authorization) ---
    def get_queryset(self):
        """
        Giriş yapmış kullanıcının sadece kendi görevlerini döndürmesini sağlar.
        """
        # Giriş yapmış kullanıcının (self.request.user) görevlerini filtrele [cite: 23]
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    # --- Görev Oluşturma (Auto-Save) ---
    def perform_create(self, serializer):
        """
        Yeni görev eklerken kullanıcıyı (görevin sahibi) otomatik olarak ayarlar[cite: 23].
        """
        serializer.save(user=self.request.user)

    # --- Özel API Uç Noktası: İstatistikler ---
    # GET /api/tasks/stats 
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Kullanıcının görevlerini kategori ve duruma göre gruplayarak istatistiklerini hesaplar.
        """
        queryset = self.get_queryset()
        total_tasks = queryset.count()
        
        # Kategoriye göre dağılımı hesaplar
        category_distribution = queryset.values('category').annotate(count=Count('category'))

        # Tamamlandı/Tamamlanmadı dağılımını hesaplar [cite: 34]
        status_distribution = queryset.values('status').annotate(count=Count('status'))

        return Response({
            'total_tasks': total_tasks,
            'category_distribution': category_distribution,
            'status_distribution': status_distribution,
            # Bu veri, frontend'de grafiksel gösterim için kullanılacaktır [cite: 30]
        })