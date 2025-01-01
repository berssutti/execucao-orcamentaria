from rest_framework import viewsets
from .models import Project, Area, ProjectArea, Installment
from .serializers import ProjectSerializer, AreaSerializer, ProjectAreaSerializer, InstallmentSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class ProjectAreaViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectAreaSerializer

    def get_queryset(self):
        project_pk = self.kwargs['project_pk']
        return ProjectArea.objects.filter(project=project_pk)
    
    def perform_create(self, serializer):
        project_pk = self.kwargs['project_pk']
        project = Project.objects.get(pk=project_pk)
        serializer.save(project=project)

class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer
