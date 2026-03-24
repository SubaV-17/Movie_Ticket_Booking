from django.urls import path
from . import views

urlpatterns = [
    path('create/',                  views.create_booking),
    path('mine/',                    views.my_bookings),
    path('cancel/<str:booking_id>/', views.cancel_booking),
    path('seats/<str:show_id>/',     views.booked_seats),
]
