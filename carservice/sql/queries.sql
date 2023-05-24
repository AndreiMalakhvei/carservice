-- Найти всех клиентов из указанного города с суммой чека меньше указанного на 1000
SELECT ccust.id, ccust.firstname, ccust.lastname, count(billqry.cordid) AS numberofbills
FROM carservice_customer ccust
INNER JOIN carservice_city ccity on ccust.city_id = ccity.id
INNER JOIN carservice_car ccar1 ON ccust.id = ccar1.owner_id
INNER JOIN (
        SELECT ccar.vin cvin, cord.id cordid,  sum(csb.totalprice) FROM carservice_car ccar
        INNER JOIN carservice_order cord ON ccar.vin = cord.car_id
        INNER JOIN carservice_servicebill csb on cord.id = csb.order_id
        GROUP BY ccar.vin, cord.id
        HAVING sum(csb.totalprice) < 2000
) billqry ON ccar1.vin = billqry.cvin
WHERE ccity.cityname = 'Minsk'
GROUP BY ccust.id, ccust.firstname, ccust.lastname


-- 2. Вывести по порядку убывания выручки всех городов за указанный период времени
SELECT ccity.cityname, coalesce(sum(billed_cust.totals), 0) subtotal FROM carservice_city ccity
LEFT JOIN (SELECT ccust.id, ccust.city_id cust_city, sum(cs.totalprice) totals
           FROM carservice_customer ccust
                    INNER JOIN carservice_car cc on ccust.id = cc.owner_id
                    INNER JOIN carservice_order co on cc.vin = co.car_id
                    INNER JOIN carservice_servicebill cs on co.id = cs.order_id
           WHERE co.date BETWEEN '2023-04-28' AND '2023-05-07'
           GROUP BY ccust.id, cust_city
           ) billed_cust ON ccity.id = billed_cust.cust_city
GROUP BY ccity.cityname
ORDER BY subtotal DESC

-- 3. Найти все заказы, сумма которых выше на 20% BYN среднего заказа по данному городу
WITH main_req AS (
SELECT cord.id, c.firstname, c.lastname, sum(cs.totalprice) billsum FROM carservice_order cord
INNER JOIN carservice_servicebill cs ON cord.id = cs.order_id
INNER JOIN carservice_car cc on cord.car_id = cc.vin
INNER JOIN carservice_customer c on c.id = cc.owner_id
INNER JOIN carservice_city cc2 on cc2.id = c.city_id
WHERE cc2.cityname = 'Minsk'
GROUP BY cord.id, c.firstname, c.lastname
)
SELECT * FROM main_req
WHERE main_req.billsum > 1.2 * (SELECT avg(billsum) FROM main_req)


-- 4. *Найти всех клиентов средний чек у которых на 10% выше чем средний чек по их городу
SELECT
    mainq.id, mainq.firstname, mainq.lastname, mainq.cityname,
    mainq.avg_cust, mainq.average_in_city
FROM
    (SELECT cc.id, cc.firstname firstname , cc.lastname lastname, ccit.cityname cityname,  co.id orderid, list_of_bills.billamount,
           round(avg(list_of_bills.billamount) OVER (PARTITION BY ccit.cityname), 2) average_in_city,
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

WHERE avg_cust > average_in_city * 1.1
GROUP BY mainq.id, mainq.firstname, mainq.lastname, mainq.cityname,
        mainq.avg_cust, mainq.average_in_city



-- * Разобраться с оконными функциями SQL. row_number, dense_rank, rank.
-- Написать по одному запросу с использованием каждой из эих функций
-- row_number ко всему запросу (нумеруем сумму чека от большей к меньшей)
SELECT c.id, c.firstname, c.lastname, co.id num_order, sum(cs.totalprice) bill_amount,
        row_number() over (ORDER BY sum(cs.totalprice) DESC) AS bill
FROM carservice_customer c
INNER JOIN carservice_car cc on c.id = cc.owner_id
INNER JOIN carservice_order co on cc.vin = co.car_id
INNER JOIN carservice_servicebill cs on co.id = cs.order_id
GROUP BY c.id, c.firstname, c.lastname,  co.id
ORDER BY num_order
--
-- row_number к партиции (нумеруем сумму чека от большей к меньшей по каждому клиенту)

SELECT c.id, c.firstname, c.lastname, co.id num_order, sum(cs.totalprice) bill_amount,
        row_number() OVER (PARTITION BY c.id ORDER BY sum(cs.totalprice) DESC) AS bill
FROM carservice_customer c
INNER JOIN carservice_car cc on c.id = cc.owner_id
INNER JOIN carservice_order co on cc.vin = co.car_id
INNER JOIN carservice_servicebill cs on co.id = cs.order_id
GROUP BY c.id, c.firstname, c.lastname,  co.id

-- dense_rank VS rank
SELECT c.id, c.firstname, c.lastname, cc2.brandname, count(co.id) total_orders,
        rank() OVER (PARTITION BY brandname ORDER BY count(co.id)) ranking
FROM carservice_customer c
INNER JOIN carservice_car cc on c.id = cc.owner_id
INNER JOIN carservice_carbrand cc2 on cc2.id = cc.brand_id
INNER JOIN carservice_order co on cc.vin = co.car_id
INNER JOIN carservice_servicebill cs on co.id = cs.order_id
GROUP BY c.id, c.firstname, c.lastname, cc2.brandname


SELECT c.id, c.firstname, c.lastname, cc2.brandname, count(co.id) total_orders,
        rank() OVER (ORDER BY brandname) ranking
FROM carservice_customer c
INNER JOIN carservice_car cc on c.id = cc.owner_id
INNER JOIN carservice_carbrand cc2 on cc2.id = cc.brand_id
INNER JOIN carservice_order co on cc.vin = co.car_id
INNER JOIN carservice_servicebill cs on co.id = cs.order_id
GROUP BY c.id, c.firstname, c.lastname, cc2.brandname

SELECT c.id, c.firstname, c.lastname, cc2.brandname, count(co.id) total_orders,
        dense_rank() OVER (ORDER BY brandname) ranking
FROM carservice_customer c
INNER JOIN carservice_car cc on c.id = cc.owner_id
INNER JOIN carservice_carbrand cc2 on cc2.id = cc.brand_id
INNER JOIN carservice_order co on cc.vin = co.car_id
INNER JOIN carservice_servicebill cs on co.id = cs.order_id
GROUP BY c.id, c.firstname, c.lastname, cc2.brandname


SELECT c.id, c.firstname, c.lastname, cc2.brandname, count(co.id) total_orders,
        row_number() OVER (ORDER BY brandname) ranking
FROM carservice_customer c
INNER JOIN carservice_car cc on c.id = cc.owner_id
INNER JOIN carservice_carbrand cc2 on cc2.id = cc.brand_id
INNER JOIN carservice_order co on cc.vin = co.car_id
INNER JOIN carservice_servicebill cs on co.id = cs.order_id
GROUP BY c.id, c.firstname, c.lastname, cc2.brandname
