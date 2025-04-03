from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    department = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.email