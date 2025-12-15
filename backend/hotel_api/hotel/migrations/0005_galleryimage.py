from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("hotel", "0004_alter_room_room_type"),
    ]

    operations = [
        migrations.CreateModel(
            name="GalleryImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(blank=True, max_length=150)),
                ("image", models.ImageField(upload_to="gallery/")),
                ("is_featured", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-is_featured", "-created_at", "id"],
            },
        ),
    ]

