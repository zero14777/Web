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
from PeterNet import views as PeterNet

urlpatterns = [
    url(r'^$', PeterNet.home, name='home'),
	url(r'^lab1/', PeterNet.lab1, name='lab1'),
	url(r'^lab2/', PeterNet.lab2, name='lab2'),
	url(r'^lab3/', PeterNet.lab3, name='lab3'),
	url(r'^lab4/', PeterNet.lab4, name='lab4'),
	url(r'^lab5/', PeterNet.lab5, name='lab5'),
	url(r'^warp/', PeterNet.warp, name='warp'),
    url(r'^admin/', admin.site.urls),
]
