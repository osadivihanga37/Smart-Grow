from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import CropAdvisory
from .serializers import CropAdvisorySerializer

from smartgrow.language_utils import get_lang
from smartgrow.translations import get_message


@api_view(["GET"])
@permission_classes([AllowAny])
def crop_advisory_list(request):
    lang = get_lang(request)
    advisories = CropAdvisory.objects.all()
    serializer = CropAdvisorySerializer(advisories, many=True)
    return Response(
        {
            "message": get_message("crop_advisory_fetched", lang),
            "data": serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def crop_advisory_detail(request, crop_name):
    lang = get_lang(request)
    try:
        advisory = CropAdvisory.objects.get(crop_name__iexact=crop_name)
    except CropAdvisory.DoesNotExist:
        return Response(
            {"message": get_message("crop_not_found", lang)},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = CropAdvisorySerializer(advisory)
    return Response(
        {
            "message": get_message("crop_advisory_fetched", lang),
            "data": serializer.data,
        },
        status=status.HTTP_200_OK,
    )