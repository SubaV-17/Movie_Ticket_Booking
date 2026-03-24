import jwt
import bcrypt
from datetime import datetime, timedelta
from pymongo import MongoClient
from django.conf import settings
from django.http import JsonResponse
from functools import wraps

# ── MongoDB Connection ──────────────────────────────────
_client = None

def get_db():
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGO_URI)
    return _client[settings.MONGO_DB]

def get_collection(name):
    return get_db()[name]

# ── Password helpers ─────────────────────────────────────
def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ── JWT helpers ──────────────────────────────────────────
def generate_token(user_id, email, name):
    payload = {
        'user_id': str(user_id),
        'email':   email,
        'name':    name,
        'exp':     datetime.utcnow() + timedelta(days=7),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except Exception:
        return None

# ── Auth decorator ───────────────────────────────────────
def auth_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return JsonResponse({'error': 'Login required'}, status=401)
        payload = decode_token(auth.split(' ')[1])
        if not payload:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        request.user_id   = payload['user_id']
        request.user_name  = payload['name']
        request.user_email = payload['email']
        return view_func(request, *args, **kwargs)
    return wrapper

# ── Serialize ObjectId ───────────────────────────────────
def doc_to_dict(doc):
    """Convert MongoDB document to JSON-serializable dict."""
    if doc is None:
        return None
    d = dict(doc)
    if '_id' in d:
        d['_id'] = str(d['_id'])
    return d
