from rest_framework import serializers
from carservice.models import City, Customer, Order, Car, ServiceWork, CarBrand


class CustomerInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    firstname = serializers.CharField()
    lastname = serializers.CharField()

class Task1Serializer(CustomerInfoSerializer):
    numberofbills = serializers.CharField()

class Task2Serializer(serializers.Serializer):
    id = serializers.IntegerField()
    cityname = serializers.CharField()
    totals = serializers.IntegerField()

class Task3Serializer(CustomerInfoSerializer):
    billsum = serializers.IntegerField()


class Task4Serializer(CustomerInfoSerializer):
    cityname = serializers.CharField()
    avg_cust = serializers.FloatField()
    avg_citys = serializers.FloatField()


class CitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'cityname']


class CustomerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class BrandsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrand
        fields = '__all__'


class CustomersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'firstname', 'lastname']


class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceWork
        fields = '__all__'


class CarsSerializer(serializers.ModelSerializer):
    brandname = serializers.CharField(source='brand.brandname')

    class Meta:
        model = Car
        fields = ['vin', 'brandname', 'carmodel', 'regnumber' ]


class CarCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'