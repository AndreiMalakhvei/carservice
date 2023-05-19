from django.db.models import Max, Sum, Avg, Count, F, Q, Subquery, Value, OuterRef, Window, Func
from django.db.models.functions import Coalesce
from django.db import models


from carservice.models import Car, Order, ServiceWork, ServiceBill, Customer, City, CarBrand

# 1. Найти всех клиентов из указанного города с суммой чека меньше указанного на 1000

def find_clients():
    bills = Order.objects.annotate(billamount=Sum('servicebill__totalprice')).filter(billamount__lt=2000)
    objs = Customer.objects.filter(city__cityname='Minsk').filter(car__order__in=Subquery(bills.values('id'))).\
                                                            annotate(numberofbills=Count('car__order'))
    return objs


# Вывести по порядку убывания выручки всех городов за указанный период времени
def cities_receipts_1():
    qset1 = City.objects.filter(customer__car__order__date__range=["2023-04-28", "2023-05-07"]).annotate(
        orderf=Sum('customer__car__order__servicebill__totalprice'))
    City.objects.annotate(totals=Subquery(qset1.filter(id=OuterRef('id')).values('orderf'))).order_by('-totals')


# 3. Найти все заказы, сумма которых выше на 20% BYN среднего заказа по данному городу
def cities_receipts2():
    sub = Order.objects.filter(car__owner__city__cityname='Minsk').annotate(billsum=Sum('servicebill__totalprice'))
    avg_bill = sub.aggregate(avg_bill=Avg('billsum'))
    sobj = sub.filter(billsum__gt=avg_bill['avg_bill'])


class SubAvg(Subquery):
    template = "(SELECT avg(targetfield) FROM (%(subquery)s) _avg)"
    output_field = models.IntegerField()

# -- 4. *Найти всех клиентов средний чек у которых на 10% выше чем средний чек по их городу

def cities_receipts5():
    avg_bills_cust = Order.objects.filter(car__owner=OuterRef('pk')).annotate(targetfield=Sum('servicebill__totalprice')).values('targetfield')
    av_customer = Customer.objects.annotate(avg_cust=SubAvg(avg_bills_cust)).values('id', 'city', 'avg_cust')
    avg_bills_city = Order.objects.filter(car__owner__city_id=OuterRef('pk')).annotate(targetfield=Sum('servicebill__totalprice')).values('targetfield')
    av_city = City.objects.annotate(avg_city=SubAvg(avg_bills_city)).values('id', 'avg_city')
    city_sub = av_city.filter(id=OuterRef('city')).values('avg_city')
    fin_res = av_customer.filter(avg_cust__gt=Subquery(city_sub))
    print()


def cities_receipts():
    bills = Order.objects.annotate(billamount=Sum('servicebill__totalprice'))
    print()
    bills.annotate(
        average_in_city=Window(
            expression=Avg(F('billamount')),
            partition_by=[F('car__owner__city__cityname')]
        ),
        average_for_customer=Window(
            expression=Avg(F('billamount')),
            partition_by=[F('car_owner')]
        )
    )
    print()
    