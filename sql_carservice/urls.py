from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('carservice.urls'))
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

urlpatterns += [
    path('__debug__/', include('debug_toolbar.urls')),
]
