from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'companies', views.CompanyViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'skills', views.SkillViewSet)
router.register(r'vacancies', views.VacancyViewSet)
router.register(r'resumes', views.ResumeViewSet, basename='resume')
router.register(r'applications', views.ApplicationViewSet, basename='application')
router.register(r'contact', views.ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 