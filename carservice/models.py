from django.db import models
from django.utils import timezone

class City(models.Model):
    cityname = models.CharField(max_length=50, blank=False, null=False)

    class Meta:
        verbose_name_plural = 'Cities'

    def __str__(self):
        return self.cityname


class CarBrand(models.Model):
    brandname = models.CharField(max_length=50, blank=False, null=False)

    def __str__(self):
        return self.brandname


class ServiceWork(models.Model):
    work = models.CharField(max_length=500, blank=False, null=False)
    price = models.FloatField(blank=False, null=False)

    def __str__(self):
        return self.work


class Customer(models.Model):
    firstname = models.CharField(max_length=50, blank=False, null=False)
    lastname = models.CharField(max_length=50, blank=False, null=False)
    passport = models.CharField(max_length=10, blank=False, null=False)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['firstname', 'lastname', 'passport']

    def __str__(self):
        return f'{self.firstname} {self.lastname}'


class Car(models.Model):
    vin = models.CharField(max_length=17, primary_key=True)
    regnumber = models.CharField(max_length=10, blank=False, null=False)
    carmodel = models.CharField(max_length=20, blank=False, null=False)
    brand = models.ForeignKey(CarBrand, on_delete=models.CASCADE)
    owner = models.ForeignKey(Customer, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.regnumber} {self.brand} {self.carmodel} of {self.owner}'


class Order(models.Model):
    car = models.ForeignKey(Car, on_delete=models.RESTRICT)
    date = models.DateTimeField(blank=False, default=timezone.now)

    def __str__(self):
        return f'{self.car} {self.date.date()}'


class ServiceBill(models.Model):
    order = models.ForeignKey(Order, on_delete=models.RESTRICT)
    work = models.ForeignKey(ServiceWork, on_delete=models.RESTRICT)
    quantity = models.IntegerField(blank=False, null=False)
    totalprice = models.FloatField(blank=True, null=False)

    def __str__(self):
        return f'{self.id} {self.order} {self.order} {self.work} {self.totalprice}'

    def save(self, *args, **kwargs):
        self.totalprice = round(self.work.price * self.quantity, 2)
        super().save(*args, **kwargs)
