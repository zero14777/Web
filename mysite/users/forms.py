from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

# http://stackoverflow.com/questions/13202845/removing-help-text-from-django-usercreateform
class UserCreateForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.TextInput(attrs={'class':"form-control", 'placeholder':"Email"}))
    first_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'class':"form-control", 'placeholder':"First Name"}))
    last_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'class':"form-control", 'placeholder':"Last Name"}))
    username = forms.CharField(required=True, widget=forms.TextInput(attrs={'class':"form-control", 'placeholder':"Username"}))
    password1 = forms.CharField(required=True, widget=forms.PasswordInput(attrs={'class':"form-control", 'placeholder':"Password"}))
    password2 = forms.CharField(required=True, widget=forms.PasswordInput(attrs={'class':"form-control", 'placeholder':"Confirm Password"}))

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username",  "password1", "password2")
    # Check that username doesn't already exist
    def clean_username(self):
        username=self.cleaned_data['username']
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError('The username is already taken. Please try with another.')

    # Check for a valid email accounts
    def clean_email(self):
        email = self.cleaned_data.get('email')
        email_base, provider = email.split("@")
        domain, extension = provider.split('.')
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return email
        raise forms.ValidationError('The email is already in use. Please try another')

    # Check that passwords match
    def clean_password2(self):
    	password1 = self.cleaned_data.get('password1')
    	password2 = self.cleaned_data.get('password2')
    	if password1 != password2:
    		raise forms.ValidationError("Passwords don't match!")
    	return password2

    def __init__(self, *args, **kwargs):
        super(UserCreateForm, self).__init__(*args, **kwargs)

        for fieldname in ['username', 'password1', 'password2', 'email', 'first_name', 'last_name']:
            self.fields[fieldname].help_text = None
            self.fields[fieldname].label = ""

class UpdateProfile(forms.ModelForm):
    email = forms.EmailField(required=False, widget=forms.TextInput(attrs={'class':"form-control"}))
    first_name = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':"form-control"}))
    last_name = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':"form-control"}))
    username = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':"form-control"}))

    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email")

    # Check that username doesn't already exist
    def clean_username(self):
        username=self.cleaned_data['username']
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        if "username" in self.changed_data:
            raise forms.ValidationError('The username is already taken. Please try with another.')
        return username


    # Check for a valid email accounts
    def clean_email(self):
        email = self.cleaned_data.get('email')
        email_base, provider = email.split("@")
        domain, extension = provider.split('.')
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return email
        if "email" in self.changed_data:
            raise forms.ValidationError('The email is already in use. Please try another')
        return email