from django.contrib.auth.models import User
from rest_framework import generics, permissions, status, parsers, mixins, viewsets
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
    RoomSerializer,
    BookingSerializer,
    CustomTokenObtainPairSerializer,
    TeamMemberSerializer,
    GalleryImageSerializer,
    AdminBookingSerializer,
    ContactMessageSerializer,
)
from .models import Room, Booking, TeamMember, GalleryImage, ContactMessage


# ---------- AUTH VIEWS ----------

class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for immediate login after signup
        token_serializer = CustomTokenObtainPairSerializer(
            data={"username": user.username, "password": request.data.get("password")}
        )
        token_serializer.is_valid(raise_exception=True)
        token_data = token_serializer.validated_data

        return Response(token_data, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Uses JWT for login
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """
    GET /api/auth/me/
    PUT/PATCH /api/auth/me/
    Get current logged-in user profile
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, parsers.MultiPartParser, parsers.FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        return self._update(request, partial=False)

    def patch(self, request):
        return self._update(request, partial=True)

    def _update(self, request, partial):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        avatar_file = request.FILES.get("avatar")
        serializer.save()
        if avatar_file:
            profile = getattr(request.user, "profile", None)
            if not profile:
                from .models import Profile  # local import to avoid circular
                profile, _ = Profile.objects.get_or_create(user=request.user)
            profile.avatar = avatar_file
            profile.save()
        # Return full user payload for frontend
        return Response(UserSerializer(request.user, context={"request": request}).data)


class CustomTokenRefreshView(TokenRefreshView):
    """
    POST /api/auth/token/refresh/
    """
    permission_classes = [permissions.AllowAny]


# ---------- ROOM VIEWS ----------

class RoomListCreateView(generics.ListCreateAPIView):
    """
    GET /api/rooms/        -> list all rooms
    POST /api/rooms/       -> create a room (admin or for demo anyone)
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    parser_classes = [JSONParser, parsers.MultiPartParser, parsers.FormParser]

    # For demo: allow read for anyone, write for authenticated
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/rooms/<id>/
    PUT/PATCH/DELETE /api/rooms/<id>/
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    parser_classes = [JSONParser, parsers.MultiPartParser, parsers.FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


# ---------- BOOKING / RESERVATION VIEWS ----------

class BookingListCreateView(generics.ListCreateAPIView):
    """
    GET /api/bookings/         -> list bookings of current user
    POST /api/bookings/        -> create new booking (reservation)
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return bookings of logged-in user
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/bookings/<id>/
    PUT/PATCH/DELETE /api/bookings/<id>/
    Only owner can access
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


# ---------- ABOUT / TEAM ----------

class TeamMemberListView(generics.ListAPIView):
    """
    GET /api/team/
    Public list of team members for About Us section.
    """
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.AllowAny]


# ---------- GALLERY ----------

class GalleryImageListView(generics.ListAPIView):
    """
    GET /api/gallery/
    Public list of gallery images uploaded via admin.
    """

    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.AllowAny]


class GalleryImageAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD for gallery images (upload/delete).
    """

    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [JSONParser, parsers.MultiPartParser, parsers.FormParser]


class RoomAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD for rooms.
    """

    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [JSONParser, parsers.MultiPartParser, parsers.FormParser]


class BookingAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD/list for all bookings.
    """

    queryset = Booking.objects.select_related("user", "room").all()
    serializer_class = AdminBookingSerializer
    permission_classes = [permissions.IsAdminUser]


class UserAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD for users.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [JSONParser, parsers.MultiPartParser, parsers.FormParser]


class TeamMemberAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD for team members.
    """

    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAdminUser]


# ---------- CONTACT MESSAGES ----------

class ContactMessageCreateView(generics.CreateAPIView):
    """
    POST /api/contact/
    Public endpoint for users to submit contact messages.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]


class ContactMessageAdminViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD for contact messages.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAdminUser]
