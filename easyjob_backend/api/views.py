from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from .models import Company, Category, Skill, Vacancy, Resume, Application, Contact
from .serializers import (
    UserSerializer, CompanySerializer, CategorySerializer, SkillSerializer,
    VacancySerializer, ResumeSerializer, ApplicationSerializer, UserRegistrationSerializer,
    ContactSerializer
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'list']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'location']
    filterset_fields = ['location']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        companies = self.get_queryset().annotate(
            vacancy_count=Count('vacancies', filter=Q(vacancies__is_active=True))
        ).order_by('-vacancy_count')[:10]
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Category.objects.annotate(
            vacancy_count=Count('vacancies', filter=Q(vacancies__is_active=True))
        )

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class VacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all()
    serializer_class = VacancySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'company__name', 'location']
    filterset_fields = ['category', 'experience_level', 'job_type', 'is_active', 'company']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.filter(is_active=True)
        return queryset

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        vacancy = self.get_object()
        user = request.user
        resume_id = request.data.get('resume')
        cover_letter = request.data.get('cover_letter')

        if not resume_id or not cover_letter:
            return Response(
                {'error': 'Both resume and cover letter are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            resume = Resume.objects.get(id=resume_id, user=user)
        except Resume.DoesNotExist:
            return Response(
                {'error': 'Resume not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        application = Application.objects.create(
            user=user,
            vacancy=vacancy,
            resume=resume,
            cover_letter=cover_letter
        )

        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Returns the latest 6 active vacancies from top companies"""
        top_companies = Company.objects.annotate(
            vacancy_count=Count('vacancies', filter=Q(vacancies__is_active=True))
        ).order_by('-vacancy_count')[:5].values_list('id', flat=True)
        
        featured_jobs = self.get_queryset().filter(
            is_active=True,
            company_id__in=top_companies
        ).order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_jobs, many=True)
        return Response(serializer.data)

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'employer':
            return Application.objects.filter(vacancy__company__user=user)
        return Application.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status not in dict(Application.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Contact.objects.first()

    def list(self, request, *args, **kwargs):
        instance = self.get_queryset()
        if instance is None:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
