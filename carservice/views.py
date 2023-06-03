from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from carservice.models import Order, Customer, City, CarBrand, ServiceWork, ServiceBill, Car
from django.db import models
from django.db.models import Max, Sum, Avg, Count, F, Q, Subquery, Value, OuterRef, Window, Func, FloatField,Case, When, Value
from carservice.serializers import Task1Serializer, Task2Serializer, Task3Serializer, Task4Serializer, CitiesSerializer, \
    CustomerCreateSerializer, CustomersSerializer, BrandsSerializer, ServicesSerializer, CarsSerializer,\
    CarCreateSerializer
from rest_framework.exceptions import ParseError
from datetime import date
from django.db import connection


class SubAvg(Subquery):
    template = "(SELECT avg(targetfield) FROM (%(subquery)s) _avg)"
    output_field = models.IntegerField()


def dictfetchall(cursor):
    res = cursor.fetchall()
    if not len(res):
        raise ParseError(detail="No results found")
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in res]


# 1. Найти всех клиентов из указанного города с суммой чека меньше указанного на 1000
class Task1APIView(APIView):
    def get(self, request):

        try:
            req_city = request.GET['city']
            money_amount = request.GET['limit']
            int_amount = int(money_amount)
            int_city = int(req_city)
        except (KeyError, ValueError):
            raise ParseError(detail="'city' and 'limit' parameters are required")

        bills = Order.objects.annotate(billamount=Sum('servicebill__totalprice')).filter(billamount__lt=int_amount-1000)
        qry = Customer.objects.filter(city__id=int_city).filter(car__order__in=Subquery(bills.values('id'))). \
            annotate(numberofbills=Count('car__order')).values('id', 'firstname', 'lastname', 'numberofbills')
        if not qry.exists():
            raise ParseError(detail="No results found")
        return Response(Task1Serializer(qry, many=True).data)


# 2. Вывести по порядку убывания выручки всех городов за указанный период времени
class Task2APIView(APIView):
    def get(self, request):
        try:
            start = request.GET['start']
            finish = request.GET['fin']
            st = date.fromisoformat(start)
            fin = date.fromisoformat(finish)
        except (KeyError, ValueError):
            raise ParseError(detail="'start' and 'fin' parameters are required")
        if fin < st:
            raise ParseError(detail="fin must be earlier than start")

        qset1 = City.objects.filter(customer__car__order__date__range=[start, finish]).annotate(
            orderf=Sum('customer__car__order__servicebill__totalprice')).filter(id=OuterRef('id')).values('orderf')

        qry = City.objects.annotate(totals=Subquery(qset1)).values('id', 'cityname', 'totals')

        qry = qry.order_by('totals')
        for x in qry:
            if not x['totals']:
                x['totals'] = 0

        if not qry.exists():
            raise ParseError(detail="No results found")
        return Response(Task2Serializer(qry, many=True).data)


# 3. Найти все заказы, сумма которых выше на 20% BYN среднего заказа по данному городу
class Task3APIView(APIView):
    def get(self, request):
        try:
            req_city = request.GET['city']
            int_city = int(req_city)
        except (KeyError, ValueError):
            raise ParseError(detail="'city' parameters is required")
        sub = Order.objects.filter(car__owner__city__id=int_city).annotate(billsum=Sum('servicebill__totalprice'),
                                                                                 firstname=F('car__owner__firstname'),
                                                                                 lastname=F('car__owner__lastname'))
        avg_bill = sub.aggregate(avg_bill=Avg('billsum') * 1.2)
        qry = sub.filter(billsum__gt=avg_bill['avg_bill']).\
            values('id', 'firstname', 'lastname', 'billsum')

        if not qry.exists():
            raise ParseError(detail="No results found")
        return Response({'average_in_city': round(avg_bill['avg_bill'], 2),
                                    'bills_over_avg': Task3Serializer(qry, many=True).data}
                         )


# 4. *Найти всех клиентов средний чек у которых на 10% выше чем средний чек по их городу
class Task4APIView(APIView):
    def get(self, request):
        avg_bills_cust = Order.objects.filter(car__owner=OuterRef('pk')).annotate(
            targetfield=Sum('servicebill__totalprice')).values('targetfield')

        av_customer = Customer.objects.annotate(avg_cust=SubAvg(avg_bills_cust))

        avg_bills_city = Order.objects.filter(car__owner__city_id=OuterRef('pk')).annotate(
            targetfield=Sum('servicebill__totalprice')).values('targetfield')

        av_city = City.objects.annotate(avg_city=SubAvg(avg_bills_city))
        city_sub = av_city.filter(id=OuterRef('city')).values('avg_city')

        qry = av_customer.filter(avg_cust__gt=Subquery(city_sub) * 1.1).\
            annotate(avg_citys=Subquery(city_sub), cityname=F('city__cityname')).\
            values('id', 'firstname', 'lastname', 'avg_cust', 'cityname', 'avg_citys')

        if not qry.exists():
            raise ParseError(detail="No results found")
        return Response(Task4Serializer(qry, many=True).data)


class Task1APIViewSQL(APIView):
    def get(self, request):
        try:
            req_city = request.GET['city']
            money_amount = request.GET['limit']
            int_amount = int(money_amount)
        except (KeyError, ValueError):
            raise ParseError(detail="'city' and 'limit' parameters are required")

        with connection.cursor() as cursor:
            cursor.execute("""SELECT ccust.id, ccust.firstname, ccust.lastname, count(billqry.cordid) AS numberofbills
                FROM carservice_customer ccust
                INNER JOIN carservice_city ccity on ccust.city_id = ccity.id
                INNER JOIN carservice_car ccar1 ON ccust.id = ccar1.owner_id
                INNER JOIN (
                        SELECT ccar.vin cvin, cord.id cordid,  sum(csb.totalprice) FROM carservice_car ccar
                        INNER JOIN carservice_order cord ON ccar.vin = cord.car_id
                        INNER JOIN carservice_servicebill csb on cord.id = csb.order_id
                        GROUP BY ccar.vin, cord.id
                        HAVING sum(csb.totalprice) < %s - 1000
                ) billqry ON ccar1.vin = billqry.cvin
                WHERE ccity.cityname = %s
                GROUP BY ccust.id, ccust.firstname, ccust.lastname""", [money_amount, req_city])

            qry = dictfetchall(cursor)
            return Response({'answer': Task1Serializer(qry, many=True).data})


class Task2APIViewSQL(APIView):
    def get(self, request):
        try:
            start = request.GET['start']
            finish = request.GET['fin']
            st = date.fromisoformat(start)
            fin = date.fromisoformat(finish)
        except (KeyError, ValueError):
            raise ParseError(detail="'start' and 'fin' parameters are required")
        if fin < st:
            raise ParseError(detail="fin must be earlier than start")

        with connection.cursor() as cursor:
            cursor.execute("""SELECT ccity.id, ccity.cityname, coalesce(sum(billed_cust.subtotals), 0) totals FROM carservice_city ccity
                LEFT JOIN (SELECT ccust.id, ccust.city_id cust_city, sum(cs.totalprice) subtotals
                           FROM carservice_customer ccust
                                    INNER JOIN carservice_car cc on ccust.id = cc.owner_id
                                    INNER JOIN carservice_order co on cc.vin = co.car_id
                                    INNER JOIN carservice_servicebill cs on co.id = cs.order_id
                           WHERE co.date BETWEEN %s AND %s
                           GROUP BY ccust.id, cust_city
                           ) billed_cust ON ccity.id = billed_cust.cust_city
                GROUP BY ccity.id, ccity.cityname
                ORDER BY totals DESC""", [start, finish])

            qry = dictfetchall(cursor)
            return Response({'answer': Task2Serializer(qry, many=True).data})


class Task3APIViewSQL(APIView):
    def get(self, request):
        try:
            req_city = request.GET['city']
        except (KeyError):
            raise ParseError(detail="'city' parameters is required")

        with connection.cursor() as cursor:
            cursor.execute("""WITH main_req AS (
                SELECT cord.id, c.firstname, c.lastname, sum(cs.totalprice) billsum FROM carservice_order cord
                INNER JOIN carservice_servicebill cs ON cord.id = cs.order_id
                INNER JOIN carservice_car cc on cord.car_id = cc.vin
                INNER JOIN carservice_customer c on c.id = cc.owner_id
                INNER JOIN carservice_city cc2 on cc2.id = c.city_id
                WHERE cc2.cityname = %s
                GROUP BY cord.id, c.firstname, c.lastname
                )
                SELECT * FROM main_req
                WHERE main_req.billsum > 1.2 * (SELECT avg(billsum) FROM main_req)""", [req_city])

            qry = dictfetchall(cursor)
            return Response({'answer': Task3Serializer(qry, many=True).data})


class Task4APIViewSQL(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""SELECT
                mainq.id, mainq.firstname, mainq.lastname, mainq.cityname,
                mainq.avg_cust, mainq.avg_citys
            FROM
                (SELECT cc.id, cc.firstname firstname , cc.lastname lastname, ccit.cityname cityname,  list_of_bills.billamount,
                       round(avg(list_of_bills.billamount) OVER (PARTITION BY ccit.cityname), 2) avg_citys,
                       round(avg(list_of_bills.billamount) OVER (PARTITION BY cc.lastname), 2) avg_cust
                FROM carservice_customer cc
                INNER JOIN carservice_city ccit on ccit.id = cc.city_id
                INNER JOIN carservice_car c on cc.id = c.owner_id
                INNER JOIN carservice_order co  on c.vin = co.car_id
                INNER JOIN (
                    SELECT ord.id ids, round(SUM(s.totalprice)::numeric, 2) billamount
                    FROM carservice_order ord
                    INNER JOIN carservice_servicebill s on ord.id = s.order_id
                    GROUP BY ids
                    ) list_of_bills ON co.id = list_of_bills.ids) AS mainq
            
            WHERE avg_cust > avg_citys * 1.1
            GROUP BY mainq.id, mainq.firstname, mainq.lastname, mainq.cityname,
                    mainq.avg_cust, mainq.avg_citys""")

            qry = dictfetchall(cursor)
            return Response({'answer': Task4Serializer(qry, many=True).data})


class CityModelView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitiesSerializer
    permission_classes = [AllowAny, ]


class BrandsModelView(generics.ListAPIView):
    queryset = CarBrand.objects.all()
    serializer_class = BrandsSerializer


class CustomersModelView(generics.ListAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomersSerializer


class CarsModelView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarsSerializer

    def get_queryset(self):
        if self.request.query_params:
            try:
                customer = int(self.request.query_params.get('customer'))
            except (ValueError, TypeError):
                raise ParseError(detail="'customer' parameters is invalid")
            return Car.objects.filter(owner_id=customer)
        return Car.objects.all()




class ServiceModelView(generics.ListAPIView):
    queryset = ServiceWork.objects.all()
    serializer_class = ServicesSerializer


class CustomerCreateView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerCreateSerializer

    # def post(self, request, *args, **kwargs):
    #     print()
    #     print()

class CarCreateView(generics.CreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarCreateSerializer

