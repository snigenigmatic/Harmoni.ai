from django.db import models
from django.conf import settings

class MeditationSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(help_text='Duration in minutes')
    
    def __str__(self):
        return f'Meditation Session for {self.user.username}'

class MeditationMessage(models.Model):
    session = models.ForeignKey(MeditationSession, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_ai = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['timestamp']