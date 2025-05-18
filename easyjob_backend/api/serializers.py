from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, Category, Skill, Vacancy, Resume, Application, Contact

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'user_type', 
                 'phone_number', 'profile_image')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class CategorySerializer(serializers.ModelSerializer):
    vacancy_count = serializers.SerializerMethodField()

    def get_vacancy_count(self, obj):
        return obj.vacancies.filter(is_active=True).count()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'vacancy_count']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class VacancySerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    skills_list = SkillSerializer(source='skills', many=True, read_only=True)

    class Meta:
        model = Vacancy
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class ResumeSerializer(serializers.ModelSerializer):
    skills_list = SkillSerializer(source='skills', many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class ApplicationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    vacancy_title = serializers.CharField(source='vacancy.title', read_only=True)
    company_name = serializers.CharField(source='vacancy.company.name', read_only=True)
    resume_title = serializers.CharField(source='resume.title', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'first_name', 
                 'last_name', 'user_type', 'phone_number')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('address', 'phone', 'email', 'latitude', 'longitude', 
                 'working_hours', 'additional_info', 'updated_at')
        read_only_fields = ('updated_at',) 