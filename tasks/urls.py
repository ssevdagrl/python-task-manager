# tasks/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
# /api/tasks/ ve /api/tasks/<id>/ uç noktalarını otomatik oluşturur
router.register(r'', TaskViewSet, basename='task') 

urlpatterns = [
    path('', include(router.urls)), 
]
# Uç noktalar:
# GET /api/tasks/       -> List user's tasks [cite: 23]
# POST /api/tasks/      -> Add new task [cite: 23]
# PUT /api/tasks/:id    -> Edit task [cite: 24]
# DELETE /api/tasks/:id -> Delete task [cite: 24]
# GET /api/tasks/stats/ -> Get task statistics [cite: 24]