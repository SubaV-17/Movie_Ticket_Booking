import json
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from movietime.db import get_collection, auth_required, doc_to_dict

@csrf_exempt
@auth_required
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    movie_id   = data.get('movie_id')
    movie_title= data.get('movie_title')
    theatre    = data.get('theatre')
    show_id    = data.get('show_id')
    show_time  = data.get('show_time')
    show_date  = data.get('show_date', 'Today')
    seats      = data.get('seats', [])
    price      = data.get('price', 200)

    if not seats:
        return JsonResponse({'error': 'Select at least one seat'}, status=400)

    # Check if any seat already booked for this show
    bookings = get_collection('bookings')
    existing = bookings.find({'show_id': show_id, 'status': 'confirmed'})
    booked_seats = []
    for b in existing:
        booked_seats.extend(b.get('seats', []))

    conflict = [s for s in seats if s in booked_seats]
    if conflict:
        return JsonResponse({'error': f'Seats already booked: {", ".join(conflict)}'}, status=400)

    total = len(seats) * price

    result = bookings.insert_one({
        'user_id':     request.user_id,
        'user_name':   request.user_name,
        'movie_id':    movie_id,
        'movie_title': movie_title,
        'theatre':     theatre,
        'show_id':     show_id,
        'show_time':   show_time,
        'show_date':   show_date,
        'seats':       seats,
        'total_amount': total,
        'status':      'confirmed',
        'booked_at':   datetime.utcnow().isoformat(),
    })

    return JsonResponse({
        'booking_id': str(result.inserted_id),
        'total':      total,
        'message':    'Booking confirmed!'
    }, status=201)


@csrf_exempt
@auth_required
def my_bookings(request):
    bookings = get_collection('bookings')
    data = [doc_to_dict(b) for b in bookings.find({'user_id': request.user_id}).sort('booked_at', -1)]
    return JsonResponse(data, safe=False)


@csrf_exempt
@auth_required
def cancel_booking(request, booking_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    from bson import ObjectId
    bookings = get_collection('bookings')
    result   = bookings.update_one(
        {'_id': ObjectId(booking_id), 'user_id': request.user_id},
        {'$set': {'status': 'cancelled'}}
    )
    if result.matched_count == 0:
        return JsonResponse({'error': 'Booking not found'}, status=404)
    return JsonResponse({'message': 'Booking cancelled'})


@csrf_exempt
def booked_seats(request, show_id):
    """Return all booked seats for a show — used by seat map."""
    bookings = get_collection('bookings')
    seats = []
    for b in bookings.find({'show_id': show_id, 'status': 'confirmed'}):
        seats.extend(b.get('seats', []))
    return JsonResponse({'booked_seats': seats})
