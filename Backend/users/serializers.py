from rest_framework import serializers


class RegisterInputSerializer(serializers.Serializer):
    """
    Plain input validator — there's no Django model backing this anymore,
    since farmer profile data now lives in Firestore, not Postgres/SQLite.
    """
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, default='')
    district = serializers.CharField(required=False, default='Dambulla')
    age = serializers.IntegerField(required=False, allow_null=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)