import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from bson import ObjectId
from movietime.db import get_collection, doc_to_dict

# ── Admin auth check ─────────────────────────────────────
def is_admin(request):
    key = request.headers.get('X-Admin-Key', '')
    return key == getattr(settings, 'ADMIN_SECRET_KEY', 'movietime-admin-2025')

def admin_required(fn):
    from functools import wraps
    @wraps(fn)
    def wrapper(request, *args, **kwargs):
        if not is_admin(request):
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        return fn(request, *args, **kwargs)
    return wrapper

# ── Movies CRUD ──────────────────────────────────────────
@csrf_exempt
@admin_required
def movie_list(request):
    movies = [doc_to_dict(m) for m in get_collection('movies').find()]
    return JsonResponse(movies, safe=False)

@csrf_exempt
@admin_required
def add_movie(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    data = json.loads(request.body)
    required = ['title', 'language', 'genre', 'price', 'duration']
    for f in required:
        if not data.get(f):
            return JsonResponse({'error': f'{f} is required'}, status=400)
    # Set defaults
    data.setdefault('type', '2D')
    data.setdefault('rating', 'U')
    data.setdefault('imdb', 7.0)
    data.setdefault('votes', '0')
    data.setdefault('year', 2025)
    data.setdefault('tag', '')
    data.setdefault('director', '')
    data.setdefault('cast', [])
    data.setdefault('desc', '')
    data.setdefault('image', '/images/black.jpg')
    data.setdefault('bg_image', '/images/black.jpg')
    data.setdefault('shows', [])
    result = get_collection('movies').insert_one(data)
    return JsonResponse({'message': 'Movie added!', 'id': str(result.inserted_id)}, status=201)

@csrf_exempt
@admin_required
def edit_movie(request, movie_id):
    if request.method != 'PUT':
        return JsonResponse({'error': 'PUT required'}, status=405)
    data = json.loads(request.body)
    data.pop('_id', None)   # remove _id if present
    get_collection('movies').update_one({'_id': ObjectId(movie_id)}, {'$set': data})
    return JsonResponse({'message': 'Movie updated!'})

@csrf_exempt
@admin_required
def delete_movie(request, movie_id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)
    get_collection('movies').delete_one({'_id': ObjectId(movie_id)})
    return JsonResponse({'message': 'Movie deleted!'})

# ── Dashboard stats ──────────────────────────────────────
@csrf_exempt
@admin_required
def dashboard(request):
    movies   = get_collection('movies').count_documents({})
    bookings = get_collection('bookings').count_documents({})
    users    = get_collection('users').count_documents({})
    contacts = get_collection('contacts').count_documents({})
    confirmed = get_collection('bookings').count_documents({'status': 'confirmed'})
    revenue = list(get_collection('bookings').aggregate([
        {'$match': {'status': 'confirmed'}},
        {'$group': {'_id': None, 'total': {'$sum': '$total_amount'}}}
    ]))
    total_revenue = revenue[0]['total'] if revenue else 0
    recent_bookings = [doc_to_dict(b) for b in get_collection('bookings').find().sort('booked_at', -1).limit(5)]
    return JsonResponse({
        'movies': movies, 'bookings': bookings, 'users': users,
        'contacts': contacts, 'confirmed': confirmed, 'revenue': total_revenue,
        'recent_bookings': recent_bookings,
    })

# ── All bookings ─────────────────────────────────────────
@csrf_exempt
@admin_required
def all_bookings(request):
    bookings = [doc_to_dict(b) for b in get_collection('bookings').find().sort('booked_at', -1)]
    return JsonResponse(bookings, safe=False)

# ── All contacts ─────────────────────────────────────────
@csrf_exempt
@admin_required
def all_contacts(request):
    contacts = [doc_to_dict(c) for c in get_collection('contacts').find().sort('submitted_at', -1)]
    return JsonResponse(contacts, safe=False)

@csrf_exempt
@admin_required
def resolve_contact(request, contact_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    get_collection('contacts').update_one({'_id': ObjectId(contact_id)}, {'$set': {'resolved': True}})
    return JsonResponse({'message': 'Marked as resolved'})

# ── All users ────────────────────────────────────────────
@csrf_exempt
@admin_required
def all_users(request):
    users = []
    for u in get_collection('users').find({}, {'password': 0}):  # exclude password
        users.append(doc_to_dict(u))
    return JsonResponse(users, safe=False)
