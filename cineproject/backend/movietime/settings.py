from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'movietime-secret-key-change-in-production-2025' 
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'movies',
    'bookings',
    'contact',
    'admin_panel',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'movietime.urls'
WSGI_APPLICATION = 'movietime.wsgi.application'

# ── No SQL database needed — using MongoDB directly via pymongo ──
DATABASES = {}

# ── MongoDB connection settings ──
MONGO_URI  = 'mongodb://localhost:27017'
MONGO_DB   = 'movietime'

# ── CORS — allow React on port 3000 ──
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': []},
}]

ADMIN_SECRET_KEY = 'movietime-admin-2025' 