from django.db import migrations


def create_default_admin(apps, schema_editor):
    User = apps.get_model("auth", "User")
    username = "admin"
    email = "admin@example.com"
    password = "Admin123!"
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_superuser(username=username, email=email, password=password)
        user.save()


def remove_default_admin(apps, schema_editor):
    User = apps.get_model("auth", "User")
    User.objects.filter(username="admin", email="admin@example.com").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("hotel", "0005_galleryimage"),
    ]

    operations = [
        migrations.RunPython(create_default_admin, reverse_code=remove_default_admin),
    ]

