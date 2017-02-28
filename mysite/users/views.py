from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from mysite import settings
from .forms import UserCreateForm, UpdateProfile
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

# Create your views here.
def Login(request):
    #how to query
    #new_entry = Card.objects.get(card_id=4)
    #print new_entry.front
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                return HttpResponse("Inactive user.")
        else:
            #invalid login
            #https://docs.djangoproject.com/en/dev/topics/auth/default/#user-objects
            messages.error(request, "Invalid username/password")
            return HttpResponseRedirect(settings.LOGIN_URL)


    return render(request, "users/login.html", {})

# The logout function, just logsout a user
def Logout(request):
    logout(request)
    return HttpResponseRedirect("/")


#http://stackoverflow.com/questions/21126005/how-to-get-django-view-to-return-form-errors
# Sign Up a new user by processing the UserCreateForm
def Signup(request):
    if request.method == "POST":
        form = UserCreateForm(request.POST)
        if form.is_valid():
            # log user in
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            #add the user to the database
            new_user = User.objects.create_user(username = username,
                email= form.cleaned_data.get('email'), password = password,
                first_name = form.cleaned_data.get('first_name'), last_name= form.cleaned_data.get('last_name'))
            # login user
            user = authenticate(username=username, password=password)
            login(request, user)

            return HttpResponseRedirect('/')
    else:
        form = UserCreateForm(auto_id=False)
    context = {
        "form" : form,
    }
    return render(request,"users/signup.html", context)

# Editable Profile page
@login_required
def Profile(request):
    if request.method == "POST":
        form = UpdateProfile(request.POST, instance=request.user)
        if form.is_valid():
            user = form.save(commit=False)
            user.save()
            return HttpResponseRedirect('/')
    else:
        form = UpdateProfile(instance=request.user)
    context = {
        "form" : form
    }
    return render(request,"users/profile.html",context)

#http://stackoverflow.com/questions/26457279/passwordchangeform-with-custom-user-model
def Change_Password(request):
    form = PasswordChangeForm(user=request.user)

    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return HttpResponseRedirect('/')
    context = {
        "form" : form,
    }

    return render(request, "users/change_password.html", context)