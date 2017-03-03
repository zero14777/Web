from django.shortcuts import render

# Create your views here.
def Home(request):
    return render(request, "home/home.html", {})

def Page2(request):
    return render(request, "home/page2.html", {})