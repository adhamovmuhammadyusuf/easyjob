from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Company, Category, Skill, Vacancy, Resume, Application
from faker import Faker
import random

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = 'Generate fake data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Generating fake data...')

        # Create categories
        categories = []
        category_names = [
            'Software Development', 'Data Science', 'DevOps',
            'UI/UX Design', 'Project Management', 'Marketing',
            'Sales', 'Customer Support', 'Human Resources'
        ]
        for name in category_names:
            category = Category.objects.create(
                name=name,
                description=fake.text()
            )
            categories.append(category)
        self.stdout.write(f'Created {len(categories)} categories')

        # Create skills
        skills = []
        skill_names = [
            'Python', 'JavaScript', 'React', 'Node.js', 'Django',
            'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
            'UI Design', 'UX Research', 'Agile', 'Scrum', 'SEO',
            'Content Writing', 'Social Media', 'Analytics'
        ]
        for name in skill_names:
            skill = Skill.objects.create(name=name)
            skills.append(skill)
        self.stdout.write(f'Created {len(skills)} skills')

        # Create users
        users = []
        for _ in range(20):
            user_type = random.choice(['job_seeker', 'employer'])
            user = User.objects.create_user(
                email=fake.email(),
                password='password123',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                user_type=user_type,
                phone_number=fake.phone_number()
            )
            users.append(user)
        self.stdout.write(f'Created {len(users)} users')

        # Create companies
        companies = []
        employer_users = [u for u in users if u.user_type == 'employer']
        for user in employer_users:
            company = Company.objects.create(
                user=user,
                name=fake.company(),
                description=fake.text(),
                website=fake.url(),
                location=fake.city()
            )
            companies.append(company)
        self.stdout.write(f'Created {len(companies)} companies')

        # Create vacancies
        vacancies = []
        for company in companies:
            for _ in range(random.randint(1, 5)):
                vacancy = Vacancy.objects.create(
                    company=company,
                    title=fake.job(),
                    description=fake.text(),
                    requirements=fake.text(),
                    category=random.choice(categories),
                    experience_level=random.choice(['entry', 'junior', 'mid', 'senior', 'lead']),
                    job_type=random.choice(['full_time', 'part_time', 'contract', 'internship']),
                    salary_min=random.randint(30000, 50000),
                    salary_max=random.randint(60000, 100000),
                    location=fake.city(),
                    is_active=True
                )
                vacancy.skills.set(random.sample(skills, random.randint(3, 8)))
                vacancies.append(vacancy)
        self.stdout.write(f'Created {len(vacancies)} vacancies')

        # Create resumes
        resumes = []
        job_seeker_users = [u for u in users if u.user_type == 'job_seeker']
        for user in job_seeker_users:
            resume = Resume.objects.create(
                user=user,
                title=f'Resume of {user.get_full_name()}',
                experience=fake.text(),
                education=fake.text()
            )
            resume.skills.set(random.sample(skills, random.randint(4, 10)))
            resumes.append(resume)
        self.stdout.write(f'Created {len(resumes)} resumes')

        # Create applications
        applications = []
        for resume in resumes:
            for _ in range(random.randint(1, 3)):
                vacancy = random.choice(vacancies)
                application = Application.objects.create(
                    user=resume.user,
                    vacancy=vacancy,
                    resume=resume,
                    cover_letter=fake.text(),
                    status=random.choice(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'])
                )
                applications.append(application)
        self.stdout.write(f'Created {len(applications)} applications')

        self.stdout.write(self.style.SUCCESS('Successfully generated fake data')) 