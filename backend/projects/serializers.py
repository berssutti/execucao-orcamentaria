from rest_framework import serializers
from decimal import Decimal
from .models import Project, Area, ProjectArea, Installment


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class ProjectAreaSerializer(serializers.ModelSerializer):
    area = serializers.PrimaryKeyRelatedField(queryset=Area.objects.all())    
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=Decimal('0.00'),
        max_value=Decimal('100.00'),
        )
    
    class Meta:
        model = ProjectArea
        fields = ['project', 'area', 'percentage']

class InstallmentSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    
    class Meta:
        model = Installment
        fields = '__all__'