"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from rest_framework.routers import DefaultRouter

from app.views import (
    BudgetCreateView,
    BudgetListAPIView,
    UserCreateView,
    login_view,
    CategoryViewSet,
    TransactionViewSet,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth APIs
    path('api/signup/', UserCreateView.as_view(), name='signup'),
    path('api/login/', login_view, name='login'),

    # Budget & Goal APIs
    path('api/budget/add/', BudgetCreateView.as_view(), name='budget-add'),
    path('api/budgets/', BudgetListAPIView.as_view(), name='budget-list'),

    # Router APIs
    path('api/', include(router.urls)),
]



