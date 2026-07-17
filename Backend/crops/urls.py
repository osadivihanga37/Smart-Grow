from django.urls import path
from . import views

urlpatterns = [
    path("advisory/", views.crop_advisory_list, name="crop-advisory-list"),
    path(
        "advisory/<str:crop_name>/",
        views.crop_advisory_detail,
        name="crop-advisory-detail",
    ),
]