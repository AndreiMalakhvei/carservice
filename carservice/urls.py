from django.urls import path
from .views import Task1APIView, Task2APIView, Task3APIView, Task4APIView, Task1APIViewSQL, Task2APIViewSQL,\
    Task3APIViewSQL, Task4APIViewSQL, CityModelView, CustomerCreateView, ServiceModelView, CarsModelView, \
    CustomersModelView, BrandsModelView, CarCreateView


urlpatterns = [
    path('task1/', Task1APIView.as_view(), name="task1"),
    path('task2/', Task2APIView.as_view(), name="task2"),
    path('task3/', Task3APIView.as_view(), name="task3"),
    path('task4/', Task4APIView.as_view(), name="task4"),
    path('task1sql/', Task1APIViewSQL.as_view(), name="task4"),
    path('task2sql/', Task2APIViewSQL.as_view(), name="task4"),
    path('task3sql/', Task3APIViewSQL.as_view(), name="task4"),
    path('task4sql/', Task4APIViewSQL.as_view(), name="task4"),
    path('cities/', CityModelView.as_view(), name="cities"),
    path('customers/', CustomersModelView.as_view(), name="customers"),
    path('brands/', BrandsModelView.as_view(), name="brands"),
    path('services/', ServiceModelView.as_view(), name="services"),
    path('cars/', CarsModelView.as_view(), name="cars"),
    path('addcustomer/', CustomerCreateView.as_view(), name="createcustomer"),
    path('addcar/', CarCreateView.as_view(), name="createcar"),
    ]