from rest_framework import serializers
import json
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Room, Booking, TeamMember, GalleryImage, RoomImage, Profile, ContactMessage


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff", "is_superuser", "avatar"]

    def get_avatar(self, obj):
        request = self.context.get("request")
        profile = getattr(obj, "profile", None)
        if profile and profile.avatar:
            if request:
                return request.build_absolute_uri(profile.avatar.url)
            return profile.avatar.url
        return None


class UserUpdateSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "avatar"]
        extra_kwargs = {
            "username": {"required": False},
            "email": {"required": False},
        }

    def validate_username(self, value):
        user = self.instance
        if value and User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        user = self.instance
        if value and User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Allow login with either username or email and return user payload
    alongside the tokens for easier frontend consumption.
    """

    def validate(self, attrs):
        username_or_email = attrs.get(self.username_field)
        password = attrs.get("password")

        # Attempt lookup by username first, then by email
        user = User.objects.filter(username=username_or_email).first()
        if not user:
            user = User.objects.filter(email=username_or_email).first()

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        # Use the parent serializer for token generation
        data = super().validate({"username": user.username, "password": password})
        data["user"] = UserSerializer(user).data
        return data


class RoomImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = RoomImage
        fields = ["id", "image", "created_at"]

    def get_image(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class RoomSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    amenities = serializers.ListField(child=serializers.CharField(), required=False)
    special_features = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Room
        fields = [
            "id",
            "number",
            "room_type",
            "price_per_night",
            "capacity",
            "is_available",
            "description",
            "bed_preference",
            "amenities",
            "size",
            "floor",
            "view",
            "check_in",
            "check_out",
            "rating",
            "reviews_count",
            "cancellation_policy",
            "room_service",
            "breakfast_included",
            "pets_allowed",
            "smoking_policy",
            "parking",
            "accessible",
            "special_features",
            "image",
            "gallery",
        ]

    def _resolve_list(self, value):
        """
        Accept raw list or JSON-encoded string from multipart submissions.
        """
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return [value] if value else []
        return []

    def create(self, validated_data):
        request = self.context.get("request")
        gallery_files = []
        if request:
            gallery_files = request.FILES.getlist("gallery_images")

        validated_data["amenities"] = self._resolve_list(validated_data.get("amenities", []))
        validated_data["special_features"] = self._resolve_list(validated_data.get("special_features", []))

        room = Room.objects.create(**validated_data)

        for file in gallery_files:
            RoomImage.objects.create(room=room, image=file)

        return room

    def update(self, instance, validated_data):
        request = self.context.get("request")
        gallery_files = []
        if request:
            gallery_files = request.FILES.getlist("gallery_images")

        instance.amenities = self._resolve_list(validated_data.pop("amenities", instance.amenities))
        instance.special_features = self._resolve_list(validated_data.pop("special_features", instance.special_features))

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        for file in gallery_files:
            RoomImage.objects.create(room=instance, image=file)

        return instance

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.cover_image:
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        # Fallback to first gallery image
        first_image = obj.images.first()
        if first_image:
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return ""

    def get_gallery(self, obj):
        request = self.context.get("request")
        gallery_urls = []
        if obj.cover_image:
            gallery_urls.append(request.build_absolute_uri(obj.cover_image.url) if request else obj.cover_image.url)

        for image in obj.images.all():
            gallery_urls.append(request.build_absolute_uri(image.image.url) if request else image.image.url)
        return gallery_urls


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    room_detail = RoomSerializer(source='room', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'room',
            'room_detail',
            'check_in',
            'check_out',
            'guests',
            'status',
            'created_at',
        ]
        read_only_fields = ['status', 'created_at', 'user']


class AdminBookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    room_detail = RoomSerializer(source='room', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'room',
            'room_detail',
            'check_in',
            'check_out',
            'guests',
            'status',
            'created_at',
        ]
        read_only_fields = ['created_at', 'user']


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["id", "name", "role", "image_url", "order"]


class GalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ["id", "title", "image", "is_featured", "created_at"]

    def get_image(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "is_read", "created_at"]
        read_only_fields = ["is_read", "created_at"]
