import os
from pathlib import Path
from dotenv import load_dotenv

# Proje dizinini (görev_yönetimi) tanımlar
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# --- Django Temel Ayarları ---
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY ortam de?i?keni eksik.")
# Geliştirme modu aktif
DEBUG = True

ALLOWED_HOSTS = []

# --- Uygulama Tanımları ---
INSTALLED_APPS = [
    # Django Varsayılanları
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Üçüncü Parti Uygulamalar (API, Güvenlik)
    'rest_framework',           # REST API geliştirmek için temel paket
    'rest_framework.authtoken', # Token tabanlı kimlik doğrulama için gerekli uygulama
    'corsheaders',              # Frontend (React) erişimine izin vermek için

    # Kendi Uygulamalarımız
    'authentication',           # Kullanıcı kayıt ve giriş mantığı
    'tasks',                    # Görev yönetimi mantığı ve modelleri
]

# --- Ara Katman Yazılımları (Middleware) ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',            # CORS: Frontend'den gelen isteklere izin verir
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Kullanıcı oturumlarını yönetir
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# ... (TEMPLATES ve WSGI ayarları standart bırakılmıştır) ...

# core/settings.py dosyanıza eklenmesi gereken kısım:

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True, # Bu, Django'nun uygulamalar içindeki 'templates' klasörlerini bulmasını sağlar.
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug', # Debug bilgilerini şablonlara ekler (Sadece DEBUG=True iken)
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth', # Kullanıcı bilgilerini şablonlara ekler (Admin için kritik)
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'core.wsgi.application' (Bu, zaten kodunuzun başka bir yerinde var)

# --- Veritabanı Ayarları ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3', # Varsayılan SQLite veritabanı
    }
}

# --- Şifre Doğrulama Kuralları ---
# Django'nun varsayılan şifre karmaşıklık kurallarını içerir
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- Dil ve Saat Ayarları ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- Statik Dosyalar ---
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Güvenlik ve API Ayarları ---

# CORS: Sadece React geliştirme sunucusuna (localhost:3000) erişim izni verir
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# REST Freamwork Ayarları: API'ler için varsayılan güvenlik ve yetkilendirme kurallarını belirler
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # API'lere yapılan her istekte Token başlığını (Authorization: Token XXX) kontrol eder
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        # Varsayılan olarak tüm API'lerin sadece giriş yapmış kullanıcılar (IsAuthenticated) tarafından erişilmesini sağlar
        'rest_framework.permissions.IsAuthenticated',
    )
}