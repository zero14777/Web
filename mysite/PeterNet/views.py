from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,"PeterNet/home.html")

def lab1(request):
    return render(request,"PeterNet/gasket2.html")
