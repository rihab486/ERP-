# Generated by Django 3.2.4 on 2022-11-22 16:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('syspointage', '0007_rename_role_drh_role_drh'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conges',
            name='employes',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]