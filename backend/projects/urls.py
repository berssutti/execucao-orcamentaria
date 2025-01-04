from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import ProjectViewSet, AreaViewSet, InstallmentViewSet, ProjectAreaViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

projects_router = routers.NestedSimpleRouter(router, r'projects', lookup='project')
projects_router.register(r'areas', ProjectAreaViewSet, basename='project-area')

router.register(r'areas', AreaViewSet, basename='area')
router.register(r'installments', InstallmentViewSet, basename='installment')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(projects_router.urls)),
] 
