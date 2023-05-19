from carservice.models import Car, Order, ServiceWork, ServiceBill
import random
from django.utils import timezone
from datetime import timedelta


def generate_orders(qty: int) -> None:

    cars = Car.objects.all()
    now = timezone.now()
    lim_cars = cars.count()
    services = ServiceWork.objects.all()
    lim_serv = services.count()

    for _ in range(qty):
        new_order = Order.objects.create(
            car=cars[random.randrange(lim_cars)],
            date=now - timedelta(days=random.randrange(30))
        )
        billing = []
        for __ in range(random.randrange(1, 5)):
            service = services[random.randrange(lim_serv)]
            items_qty = random.randrange(1,5)
            new_billing_item = ServiceBill(
                order=new_order,
                work=service,
                quantity=items_qty,
                totalprice=round(service.price * items_qty, 2)
                )
            billing.append(new_billing_item)
        ServiceBill.objects.bulk_create(billing)
