# Uncomment the required imports before adding the code

from django import http
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime
import os
import requests
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
# from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign out request
@csrf_exempt
def logout_request(request):
    # Terminate user session
    logout(request)
    data = {"userName":""}
    return JsonResponse(data)

# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    if request.method == "POST":
        try:
            # Load JSON data from the request body
            data = json.loads(request.body)
            username = data['userName']
            password = data['password']
            first_name = data['firstName']
            last_name = data['lastName']
            email = data['email']
            username_exist = False
            email_exist = False
            try:
                # Check if user already exists
                User.objects.get(username=username)
                username_exist = True
            except:
                # If not, simply log this is a new user
                logger.debug("{} is new user".format(username))

            # If it is a new user
            if not username_exist:
                # Create user in auth_user table
                user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name, password=password, email=email)
                # Login the user and redirect to list page
                login(request, user)
                data = {"userName": username, "status": "Authenticated"}
                return JsonResponse(data)
            else:
                data = {"userName": username, "error": "Already Registered"}
                return JsonResponse(data)
        except Exception as e:
            return JsonResponse({"status": "Failed", "message": str(e)})
    else:
        return JsonResponse({"status": "Failed", "message": "Only POST method allowed"})

        


# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
def get_dealerships(request):
    url = "http://localhost:3030/fetchDealers"

    try:
        response = requests.get(url)
        dealers = response.json()
    except:
        dealers = []

    return JsonResponse(dealers, safe=False)


def get_dealer_reviews(request, dealer_id):
    url = f"http://localhost:3030/fetchReviews/dealer/{dealer_id}"
    try:
        response = requests.get(url)
        reviews = response.json()
    except:
        reviews = []

    return JsonResponse(reviews, safe=False)

# Create a `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    url = settings.BACKEND_URL + f"/fetchDealer/{dealer_id}"
    try:
        response = requests.get(url)
        dealer = response.json()
    except:
        dealer = {}

    return JsonResponse(dealer, safe=False)

# Create a `get_cars` view to return available car make/model pairs
def get_cars(request):
    car_records_path = os.path.join(settings.BASE_DIR, 'database', 'data', 'car_records.json')
    try:
        with open(car_records_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        cars = data.get('cars', [])
        seen = set()
        car_models = []
        for car in cars:
            make = car.get('make')
            model = car.get('model')
            if make and model:
                key = (make, model)
                if key not in seen:
                    seen.add(key)
                    car_models.append({'CarMake': make, 'CarModel': model})
    except Exception:
        car_models = []

    return JsonResponse({'CarModels': car_models})

# Create an `add_review` view to submit a review
@csrf_exempt
def add_review(request):
    if request.method != 'POST':
        return JsonResponse({'status': 400, 'error': 'POST required'}, status=400)

    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({'status': 400, 'error': 'Invalid JSON body', 'details': str(e)}, status=400)

    url = settings.BACKEND_URL + '/insert_review'
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        review_response = response.json()
        return JsonResponse({'status': 200, 'result': review_response})
    except requests.RequestException as e:
        return JsonResponse({'status': 500, 'error': 'Failed to insert review', 'details': str(e)}, status=500)
