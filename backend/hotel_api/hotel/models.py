from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Room(models.Model):
    ROOM_TYPES = (
        ("single", "Single"),
        ("double", "Double"),
        ("suite", "Suite"),
        ("family_suite", "Family Suite"),
    )

    number = models.CharField(max_length=10, unique=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)

    description = models.TextField(blank=True, default="")
    bed_preference = models.CharField(max_length=50, blank=True, default="Queen Size")
    amenities = models.JSONField(default=list, blank=True)
    size = models.CharField(max_length=50, blank=True, default="28 sqm")
    floor = models.IntegerField(blank=True, null=True)
    view = models.CharField(max_length=100, blank=True, default="City View")
    check_in = models.CharField(max_length=50, blank=True, default="2:00 PM")
    check_out = models.CharField(max_length=50, blank=True, default="11:00 AM")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    reviews_count = models.IntegerField(default=0)
    cancellation_policy = models.TextField(blank=True, default="Free cancellation available.")
    room_service = models.CharField(max_length=100, blank=True, default="Available 24/7")
    breakfast_included = models.BooleanField(default=True)
    pets_allowed = models.BooleanField(default=False)
    smoking_policy = models.CharField(max_length=100, blank=True, default="Non-smoking")
    parking = models.CharField(max_length=100, blank=True, default="On-site parking")
    accessible = models.BooleanField(default=True)
    special_features = models.JSONField(default=list, blank=True)

    # Media
    cover_image = models.ImageField(upload_to="rooms/", blank=True, null=True)

    def __str__(self):
        return f"Room {self.number} ({self.room_type})"


class RoomImage(models.Model):
    """Additional gallery images for a room."""

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="rooms/gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "id"]

    def __str__(self):
        return f"Image for room {self.room.number}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.user.username}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user.username} for Room {self.room.number}"


class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    image_url = models.URLField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.name} - {self.role}"


class GalleryImage(models.Model):
    """Simple gallery for marketing photos uploaded via Django admin."""

    title = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to="gallery/")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "-created_at", "id"]

    def __str__(self):
        return self.title or f"Image {self.id}"


class ContactMessage(models.Model):
    """Contact messages from users via contact us form."""

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "id"]

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
