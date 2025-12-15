import shutil
from pathlib import Path

from django.conf import settings
from django.db import migrations


def seed_room_details(apps, schema_editor):
    Room = apps.get_model("hotel", "Room")
    RoomImage = apps.get_model("hotel", "RoomImage")

    media_root = Path(settings.MEDIA_ROOT)
    gallery_dir = media_root / "gallery"
    rooms_dir = media_root / "rooms"
    rooms_dir.mkdir(parents=True, exist_ok=True)

    # Reuse existing gallery photos so rooms have local images immediately
    source_images = sorted(
        [p for p in gallery_dir.glob("*") if p.is_file()],
        key=lambda p: p.name,
    )

    if not source_images:
        return

    defaults = {
        "description": "Comfortable room with modern amenities.",
        "bed_preference": "Queen Size",
        "amenities": ["WiFi", "Air Conditioner", "TV"],
        "size": "28 sqm",
        "floor": 1,
        "view": "City View",
        "check_in": "2:00 PM",
        "check_out": "11:00 AM",
        "rating": 4.5,
        "reviews_count": 20,
        "cancellation_policy": "Free cancellation up to 24 hours before check-in.",
        "room_service": "Available 24/7",
        "breakfast_included": True,
        "pets_allowed": False,
        "smoking_policy": "Non-smoking",
        "parking": "On-site parking",
        "accessible": True,
        "special_features": ["Great view"],
    }

    for idx, room in enumerate(Room.objects.all().order_by("id")):
        for field, value in defaults.items():
            if getattr(room, field) in (None, "", [], {}):
                setattr(room, field, value)

        src = source_images[idx % len(source_images)]
        dest_name = f"room_{room.id}_{src.name}"
        dest_path = rooms_dir / dest_name

        try:
            if src.exists() and not dest_path.exists():
                shutil.copy(src, dest_path)
            room.cover_image.name = f"rooms/{dest_name}"
            RoomImage.objects.get_or_create(room=room, image=f"rooms/{dest_name}")
        except Exception:
            # If copying fails, still save textual defaults
            pass

        room.save()


class Migration(migrations.Migration):

    dependencies = [
        ("hotel", "0007_room_accessible_room_amenities_room_bed_preference_and_more"),
    ]

    operations = [
        migrations.RunPython(seed_room_details, migrations.RunPython.noop),
    ]

