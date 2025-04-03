from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)