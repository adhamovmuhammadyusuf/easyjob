from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Company, Category, Skill, Vacancy
import random
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

CATEGORIES = [
    {"name": "Software Development", "description": "Software development and engineering positions"},
    {"name": "Design", "description": "UI/UX and graphic design roles"},
    {"name": "Marketing", "description": "Digital and traditional marketing positions"},
    {"name": "Sales", "description": "Sales and business development roles"},
    {"name": "Customer Service", "description": "Customer support and service positions"},
    {"name": "Finance", "description": "Finance and accounting roles"},
    {"name": "HR", "description": "Human resources and recruitment positions"},
    {"name": "Education", "description": "Teaching and training roles"},
]

SKILLS = [
    "Python", "JavaScript", "React", "Node.js", "Django", "PostgreSQL",
    "UI Design", "UX Design", "Figma", "Adobe XD", "Photoshop",
    "Digital Marketing", "SEO", "Content Marketing", "Social Media",
    "Sales", "CRM", "Customer Service", "Communication",
    "Financial Analysis", "Accounting", "HR Management", "Recruiting"
]

COMPANIES = [
    {
        "name": "TechCraft Solutions",
        "description": "Leading software development company focused on delivering innovative solutions for businesses of all sizes.",
        "location": "Tashkent",
        "website": "https://techcraft.uz"
    },
    {
        "name": "Design Masters",
        "description": "Premier design agency creating beautiful and functional digital experiences.",
        "location": "Samarkand",
        "website": "https://designmasters.uz"
    },
    {
        "name": "Marketing Pro",
        "description": "Full-service digital marketing agency helping businesses grow their online presence.",
        "location": "Tashkent",
        "website": "https://marketingpro.uz"
    },
    {
        "name": "Innovate Finance",
        "description": "Leading fintech company revolutionizing financial services in Uzbekistan.",
        "location": "Tashkent",
        "website": "https://innovatefinance.uz"
    },
    {
        "name": "EduTech Systems",
        "description": "Educational technology company making learning accessible to everyone.",
        "location": "Bukhara",
        "website": "https://edutech.uz"
    }
]


class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
          # Clear existing data
        self.stdout.write('Clearing existing data...')
        Vacancy.objects.all().delete()
        Company.objects.all().delete()
        Category.objects.all().delete()
        Skill.objects.all().delete()
        User.objects.all().delete()

        # Create superuser
        admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="admin123",
            first_name="Admin",
            last_name="User"
        )
        self.stdout.write('Created superuser')

        # Create categories
        for category_data in CATEGORIES:
            category = Category.objects.create(
                name=category_data["name"],
                description=category_data["description"]
            )
            self.stdout.write(f'Created category: {category.name}')

        # Create skills
        for skill_name in SKILLS:
            skill = Skill.objects.create(name=skill_name)
            self.stdout.write(f'Created skill: {skill.name}')

        # Create companies and their vacancies
        categories = list(Category.objects.all())
        skills = list(Skill.objects.all())
        
        for company_data in COMPANIES:
            company = Company.objects.create(
                user=admin_user,  # All companies are owned by admin user for now
                name=company_data["name"],
                description=company_data["description"],
                location=company_data["location"],
                website=company_data["website"]
            )
            self.stdout.write(f'Created company: {company.name}')
              # Create vacancies for each company
            for _ in range(random.randint(3, 8)):
                category = random.choice(categories)
                job_type = random.choice(['full_time', 'part_time', 'contract', 'internship'])
                salary_min = random.randint(500, 3000)
                salary_max = salary_min + random.randint(500, 2000)
                vacancy = Vacancy.objects.create(
                    company=company,
                    title=f"{category.name} Specialist",
                    description=f"We are looking for a talented {category.name} specialist to join our team. The ideal candidate will have experience in {category.name.lower()} and a passion for innovation.",
                    requirements=f"• {random.randint(2, 5)}+ years of experience in {category.name}\n" +
                               f"• Strong communication and teamwork skills\n" +
                               f"• Bachelor's degree or equivalent experience\n" +
                               f"• Proven track record of success in {category.name.lower()} projects",
                    category=category,
                    location=company.location,
                    job_type=job_type,
                    experience_level=random.choice(['entry', 'mid', 'senior']),
                    salary_min=salary_min,
                    salary_max=salary_max,
                    is_active=True,
                    created_at=timezone.now() - timedelta(days=random.randint(0, 30))
                )
                
                # Add random skills (3-6 skills per vacancy)
                vacancy_skills = random.sample(skills, random.randint(3, 6))
                vacancy.skills.set(vacancy_skills)
                
                self.stdout.write(f'Created vacancy: {vacancy.title} at {company.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
