from django.contrib import admin
from django.urls import path, include

from carservice.views import run_sql1

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sql1/', run_sql1)
]

# pip install django-schema-graph
from schema_graph.views import Schema
urlpatterns += [
    path("schema/", Schema.as_view()),
    ]

# pip install django-spaghetti-and-meatballs
urlpatterns += [
    path("plate/", include('django_spaghetti.urls')),
    ]

# pip install django-extensions
# install in OS: https://graphviz.org/download/
# pip install pygraphviz