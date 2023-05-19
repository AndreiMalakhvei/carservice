from django.shortcuts import render
from carservice.orm_queries.ormq import find_clients, cities_receipts

def run_sql1(request):
    a = cities_receipts()

