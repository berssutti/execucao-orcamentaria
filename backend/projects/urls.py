from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import ProjectViewSet, AreaViewSet, InstallmentViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'areas', AreaViewSet, basename='area')
router.register(r'installments', InstallmentViewSet, basename='installment')

urlpatterns = [
    path('', include(router.urls)),
] 
