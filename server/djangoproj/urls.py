"""djangoproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf.urls.static import static
from django.conf import settings
import os

BUILD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    'frontend',
    'build',
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    path('', TemplateView.as_view(template_name="Home.html")),
    path('about/', TemplateView.as_view(template_name="About.html")),
    path('contact/', TemplateView.as_view(template_name="Contact.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('register/', TemplateView.as_view(template_name="index.html")),
    path('dealers/', TemplateView.as_view(template_name="index.html")),
    path('manifest.json', serve, {'document_root': BUILD_DIR, 'path': 'manifest.json'}),
    path('favicon.ico', serve, {'document_root': BUILD_DIR, 'path': 'favicon.ico'}),
    path('logo192.png', serve, {'document_root': BUILD_DIR, 'path': 'logo192.png'}),
    path('logo512.png', serve, {'document_root': BUILD_DIR, 'path': 'logo512.png'}),
    path('asset-manifest.json', serve, {'document_root': BUILD_DIR, 'path': 'asset-manifest.json'}),
    path('robots.txt', serve, {'document_root': BUILD_DIR, 'path': 'robots.txt'}),
    path(
        'dealer/<int:dealer_id>',
        TemplateView.as_view(template_name="index.html"),
    ),
    path(
        'postreview/<int:dealer_id>',
        TemplateView.as_view(template_name="index.html"),
    ),





] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
