from django.db import migrations


def seed_rooms(apps, schema_editor):
    Room = apps.get_model("hotel", "Room")

    seed_data = [
        {"id": 1, "number": "101", "room_type": "double", "price_per_night": 4500, "capacity": 2},
        {"id": 2, "number": "102", "room_type": "single", "price_per_night": 2500, "capacity": 1},
        {"id": 3, "number": "201", "room_type": "family_suite", "price_per_night": 9000, "capacity": 4},
        {"id": 4, "number": "202", "room_type": "double", "price_per_night": 5500, "capacity": 2},
        {"id": 5, "number": "301", "room_type": "double", "price_per_night": 7500, "capacity": 2},
        {"id": 6, "number": "302", "room_type": "family_suite", "price_per_night": 10500, "capacity": 3},
        {"id": 7, "number": "401", "room_type": "double", "price_per_night": 6800, "capacity": 2},
        {"id": 8, "number": "402", "room_type": "single", "price_per_night": 1800, "capacity": 1},
        {"id": 9, "number": "501", "room_type": "double", "price_per_night": 11500, "capacity": 2},
        {"id": 10, "number": "502", "room_type": "family_suite", "price_per_night": 12000, "capacity": 4},
    ]

    for room in seed_data:
        Room.objects.update_or_create(
            id=room["id"],
            defaults={
                "number": room["number"],
                "room_type": room["room_type"],
                "price_per_night": room["price_per_night"],
                "capacity": room["capacity"],
                "is_available": True,
            },
        )


class Migration(migrations.Migration):

    dependencies = [
        ("hotel", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_rooms, migrations.RunPython.noop),
    ]

