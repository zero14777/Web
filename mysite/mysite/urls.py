"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from home import views as home
from users import views as users

urlpatterns = [
    url(r'^$', home.Home, name='home'),
    url(r'^home/page2/$', home.Page2, name='page2'),
    url(r'^accounts/login/$', users.Login, name='login'),
    url(r'^accounts/logout/$', users.Logout, name='logout'),
    url(r'^accounts/signup/$', users.Signup, name='signup'),
    url(r'^accounts/profile/$', users.Profile, name='profile'),
    url(r'^accounts/change_password/$', users.Change_Password, name='change_password'),
    url(r'^admin/', admin.site.urls),
]
