from rest_framework import serializers
from .models import MeditationSession, MeditationMessage

class MeditationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeditationMessage
        fields = ('id', 'content', 'timestamp', 'is_ai')

class MeditationSessionSerializer(serializers.ModelSerializer):
    messages = MeditationMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = MeditationSession
        fields = ('id', 'start_time', 'end_time', 'duration', 'messages')
        read_only_fields = ('start_time', 'end_time')