# Generated by Django 3.2.4 on 2022-10-28 15:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('syspointage', '0006_role_role_drh'),
    ]

    operations = [
        migrations.RenameField(
            model_name='role',
            old_name='role_DRH',
            new_name='DRH',
        ),
    ]
