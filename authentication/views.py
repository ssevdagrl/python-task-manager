from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token 
from django.contrib.auth.models import User # User modelini import etmeyi unutmuşsunuz, ekledim.

# --- Kullanıcı Kayıt API'si ---
# POST /api/auth/register
@api_view(['POST'])
@permission_classes([AllowAny]) 
def register_view(request):
    """
    Yeni kullanıcı kaydı oluşturur. Şifreyi şifreleyerek kaydeder.
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password') 

    # Gerekli alanların kontrolü
    if not all([username, email, password]):
        return Response({'error': 'Kullanıcı adı, e-posta ve şifre zorunludur.'}, status=400)

    try:
        # Django'nun create_user metodu, şifreyi otomatik olarak hash'ler (şifreler).
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'Kayıt başarılı. Lütfen giriş yapın.'}, status=201)
    except Exception:
        # Kullanıcı adı veya e-posta zaten kullanılıyorsa hata döner.
        return Response({'error': 'Bu kullanıcı adı veya e-posta zaten kullanılıyor.'}, status=400)

# --- Kullanıcı Giriş API'si ---
# POST /api/auth/login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Kullanıcı girişi yapar ve başarılı olursa bir kimlik doğrulama token'ı döndürür.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # Django'nun dahili authenticate fonksiyonu kullanılır.
    user = authenticate(username=username, password=password) 

    if user is not None:
        # Başarılı Giriş: Token'ı al veya oluştur.
        token, created = Token.objects.get_or_create(user=user)
        # Token ve kullanıcı ID'sini frontend'e gönder.
        return Response({'token': token.key, 'user_id': user.pk}, status=200)
    else:
        # Başarısız Giriş: Geçersiz kimlik bilgileri hatası.
        return Response({'error': 'Geçersiz Kullanıcı Adı veya Şifre.'}, status=401)