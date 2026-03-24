from django.urls import path
from . import views

urlpatterns = [
    path('',          views.movie_list),
    path('<str:movie_id>/', views.movie_detail),
]
