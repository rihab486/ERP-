
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from django.conf import settings  
from django.conf.urls.static import static
admin.site.site_header = "ipsoft"
admin.site.site_title = "-he"
admin.site.index_title= "gestion de pointage"

from django.urls import include, path
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('syspointage.urls')),
    path('__debug__/', include('debug_toolbar.urls')),
]
if settings.DEBUG:  
        urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)  