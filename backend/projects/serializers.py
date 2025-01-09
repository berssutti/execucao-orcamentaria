from rest_framework import serializers
from .models import Project, Area, ProjectArea, Installment

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'projects']

class ProjectAreaSerializer(serializers.ModelSerializer):
    area_name = serializers.CharField(source='area.name')

    class Meta:
        model = ProjectArea
        fields = ['area_name', 'percentage']

class ProjectSerializer(serializers.ModelSerializer):
    areas = ProjectAreaSerializer(source='projectarea_set', many=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'total_unb_amount_expected',
            'total_fcte_amount_expected',
            'coordinator',
            'substitute_coordinator',
            'academic_supervisor',
            'processo_sei',
            'status',
            'nota_dotacao',
            'ptres',
            'ugr',
            'areas',
        ]

    # Override create and update methods to handle nested data from ProjectAreaSerializer, so projects and areas percentages can be created in one request
    def create(self, validated_data):
        # Might not be the best way to handle nested data, but it works (projectarea_set is automatically created by django but is not a field in the model)
        areas_data = validated_data.pop('projectarea_set', [])

        project = Project.objects.create(**validated_data)

        for area_data in areas_data:
            area_info = area_data.pop('area')
            area, created = Area.objects.get_or_create(**area_info)
            ProjectArea.objects.create(project=project, area=area, **area_data)

        return project
    
    def update(self, instance, validated_data):
        areas_data = validated_data.pop('projectarea_set', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if areas_data is not None:
            existing_areas = set(instance.projectarea_set.values_list('area_id', flat=True))
            new_areas = set()

            for area_data in areas_data:
                area_info = area_data.pop('area')
                # Verify for area by id or name, this way frontend can send either id or name
                if 'id' in area_info:
                    area = Area.objects.get(id=area_info['id'])
                elif 'name' in area_info:
                    area = Area.objects.get(name=area_info['name'])
                else:
                    raise ValueError("Cada área precisa ter um identificador 'id' ou 'name'.")

                ProjectArea.objects.update_or_create(
                    project=instance, area=area, defaults=area_data)

                new_areas.add(area.id)

            instance.projectarea_set.exclude(area_id__in=new_areas).delete()

        return instance
    

class InstallmentSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    
    class Meta:
        model = Installment
        fields = '__all__'
