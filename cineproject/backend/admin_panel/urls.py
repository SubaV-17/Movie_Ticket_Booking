from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/',                    views.dashboard),
    path('movies/',                       views.movie_list),
    path('movies/add/',                   views.add_movie),
    path('movies/edit/<str:movie_id>/',   views.edit_movie),
    path('movies/delete/<str:movie_id>/', views.delete_movie),
    path('bookings/',                     views.all_bookings),
    path('contacts/',                     views.all_contacts),
    path('contacts/resolve/<str:contact_id>/', views.resolve_contact),
    path('users/',                        views.all_users),
]
