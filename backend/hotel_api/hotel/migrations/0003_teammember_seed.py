from django.db import migrations, models


def seed_team(apps, schema_editor):
    TeamMember = apps.get_model("hotel", "TeamMember")
    seed = [
        {"name": "Sujal Shrestha", "role": "General Manager", "order": 1,
         "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"},
        {"name": "Prakash Poudel", "role": "Head Chef", "order": 2,
         "image_url": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80"},
        {"name": "Anisha Adhikari", "role": "Spa Manager", "order": 3,
         "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"},
        {"name": "Sandhya Basnet", "role": "Concierge Lead", "order": 4,
         "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"},
    ]
    for member in seed:
        TeamMember.objects.update_or_create(
            name=member["name"],
            defaults=member,
        )


class Migration(migrations.Migration):

    dependencies = [
        ("hotel", "0002_seed_rooms"),
    ]

    operations = [
        migrations.CreateModel(
            name="TeamMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("role", models.CharField(max_length=100)),
                ("image_url", models.URLField(blank=True, default="")),
                ("order", models.PositiveIntegerField(default=0)),
            ],
            options={
                "ordering": ["order", "id"],
            },
        ),
        migrations.RunPython(seed_team, migrations.RunPython.noop),
    ]

