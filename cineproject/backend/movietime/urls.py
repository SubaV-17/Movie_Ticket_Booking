from django.urls import path, include

urlpatterns = [
    path('api/auth/',     include('users.urls')),
    path('api/movies/',   include('movies.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/contact/',  include('contact.urls')),
    path('api/admin/',    include('admin_panel.urls')),
]
