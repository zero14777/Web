from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,"PeterNet/home.html")

def lab1(request):
    return render(request,"PeterNet/lab1.html")

def lab2(request):
    return render(request,"PeterNet/lab2.htm")

def lab3(request):
    return render(request,"PeterNet/lab3.html")

def lab4(request):
    return render(request,"PeterNet/lab4.html")

def lab5(request):
    return render(request,"PeterNet/lab5.html")