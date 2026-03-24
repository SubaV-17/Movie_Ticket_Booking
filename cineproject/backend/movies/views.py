from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from movietime.db import get_collection, doc_to_dict
from bson import ObjectId

@csrf_exempt
def movie_list(request):
    movies = get_collection('movies')
    data   = [doc_to_dict(m) for m in movies.find()]
    return JsonResponse(data, safe=False)


@csrf_exempt
def movie_detail(request, movie_id):
    movies = get_collection('movies')
    try:
        movie = movies.find_one({'_id': ObjectId(movie_id)})
    except Exception:
        return JsonResponse({'error': 'Invalid ID'}, status=400)
    if not movie:
        return JsonResponse({'error': 'Movie not found'}, status=404)
    return JsonResponse(doc_to_dict(movie))
