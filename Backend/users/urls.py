from django.urls import path
from .views import RegisterView, LoginView, ProfileView, UpdateLocationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('update-location/', UpdateLocationView.as_view(), name='update-location'),
]