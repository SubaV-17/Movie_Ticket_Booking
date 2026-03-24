import json
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from movietime.db import get_collection

@csrf_exempt
def submit_contact(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name       = data.get('name', '').strip()
    email      = data.get('email', '').strip()
    booking_id = data.get('booking_id', '').strip()
    subject    = data.get('subject', '').strip()
    message    = data.get('message', '').strip()

    if not all([name, email, message]):
        return JsonResponse({'error': 'Name, email, and message are required'}, status=400)

    get_collection('contacts').insert_one({
        'name':       name,
        'email':      email,
        'booking_id': booking_id,
        'subject':    subject,
        'message':    message,
        'submitted_at': datetime.utcnow().isoformat(),
        'resolved':   False,
    })

    return JsonResponse({'message': 'Message received! We will reply within 2 hours.'}, status=201)
