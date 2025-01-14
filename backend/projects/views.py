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
    serializer_class = InstallmentSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        return Installment.objects.filter(project_id=project_id).order_by('estimated_date')