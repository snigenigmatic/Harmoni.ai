from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import MeditationSession, MeditationMessage
from .serializers import MeditationSessionSerializer, MeditationMessageSerializer
import requests
import os

NGROK_URL = "https://2052-35-233-198-252.ngrok-free.app/"
if not NGROK_URL:
    raise ValueError("NGROK_URL is not set in the environment variables")

def get_ai_response(user_input, chat_history):
    try:
        formatted_history = [
            {"role": "assistant" if msg["is_ai"] else "user", "content": msg["content"]}
            for msg in chat_history
        ]

        response = requests.post(
            f"{NGROK_URL}/chat/",
            json={"user_message": user_input, "chat_history": formatted_history},
            headers={"Content-Type": "application/json"}
        )
        if response.ok:
            data = response.json()
            ai_messages = [msg["content"] for msg in data["chat_history"] if msg.get("role") == "assistant"]
            return ai_messages[-1] if ai_messages else "No response from AI."
        return "AI is unavailable."
    except requests.exceptions.RequestException:
        return "AI is unreachable at the moment."
        return "AI is unreachable at the moment."

class MeditationSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MeditationSessionSerializer
    queryset = MeditationSession.objects.all()

    def get_queryset(self):
        return MeditationSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        session = self.get_object()
        message = request.data.get('message', '')

        # Save user message first
        user_message = MeditationMessage.objects.create(session=session, content=message, is_ai=False)

        # Fetch updated chat history
        chat_history = list(session.messages.values("content", "is_ai"))  
        ai_message = get_ai_response(message, chat_history)

        # Save AI response
        ai_response = MeditationMessage.objects.create(session=session, content=ai_message, is_ai=True)

        return Response({
            'user_message': MeditationMessageSerializer(user_message).data,
            'ai_response': MeditationMessageSerializer(ai_response).data
        })
