from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Company, Category, Skill, Vacancy, Resume, Application, Contact

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'location', 'created_at')
    list_filter = ('location',)
    search_fields = ('name', 'description', 'location')
    raw_id_fields = ('user',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'category', 'experience_level', 'job_type', 'is_active')
    list_filter = ('experience_level', 'job_type', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'requirements', 'company__name')
    raw_id_fields = ('company', 'category')
    filter_horizontal = ('skills',)

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'user__email', 'experience', 'education')
    raw_id_fields = ('user',)
    filter_horizontal = ('skills',)

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'vacancy', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'vacancy__title', 'cover_letter')
    raw_id_fields = ('user', 'vacancy', 'resume')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('address', 'phone', 'email', 'working_hours', 'updated_at')
    search_fields = ('address', 'phone', 'email')
    readonly_fields = ('updated_at',)
