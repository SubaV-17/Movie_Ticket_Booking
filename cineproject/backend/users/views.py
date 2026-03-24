import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from movietime.db import get_collection, hash_password, check_password, generate_token, auth_required, doc_to_dict

@csrf_exempt
def register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    phone    = data.get('phone', '').strip()
    password = data.get('password', '')

    if not all([name, email, password]):
        return JsonResponse({'error': 'Name, email and password are required'}, status=400)
    if len(password) < 6:
        return JsonResponse({'error': 'Password must be at least 6 characters'}, status=400)

    users = get_collection('users')
    if users.find_one({'email': email}):
        return JsonResponse({'error': 'Email already registered'}, status=400)

    result = users.insert_one({
        'name':     name,
        'email':    email,
        'phone':    phone,
        'password': hash_password(password),
        'created_at': __import__('datetime').datetime.utcnow().isoformat(),
    })

    token = generate_token(result.inserted_id, email, name)
    return JsonResponse({'token': token, 'name': name, 'email': email}, status=201)


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    users = get_collection('users')
    user  = users.find_one({'email': email})

    if not user or not check_password(password, user['password']):
        return JsonResponse({'error': 'Invalid email or password'}, status=401)

    token = generate_token(user['_id'], email, user['name'])
    return JsonResponse({'token': token, 'name': user['name'], 'email': email})


@csrf_exempt
@auth_required
def me(request):
    return JsonResponse({'name': request.user_name, 'email': request.user_email})
