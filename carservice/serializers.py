from rest_framework import serializers

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

