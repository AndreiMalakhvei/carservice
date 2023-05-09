from django.contrib import admin

from .models import Car, CarBrand, Customer, Order, ServiceWork, ServiceBill

admin.site.register(Car)
admin.site.register(CarBrand)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(ServiceWork)
admin.site.register(ServiceBill)
