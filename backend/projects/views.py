from rest_framework import viewsets, status
from rest_framework.response import Response

from rest_framework.decorators import action
from .models import Project, Area, Installment
from .serializers import ProjectSerializer, AreaSerializer, InstallmentSerializer 

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer
