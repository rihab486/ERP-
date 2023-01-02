from django.contrib import admin 
from  django.contrib.auth.models  import  Group


from .models import *
from import_export.admin import ImportExportModelAdmin 

class UserAdminConfig(ImportExportModelAdmin):
   
    model = NewUser 
    search_fields = ('matricule','email', 'user_name','role__rolename','equipe__nomequipe' , 'planning_planning')
    list_filter = ('matricule','email', 'user_name', 'role','equipe')
    ordering = ('matricule',)
    list_display = ('email', 'user_name', 'matricule','equipe', 'role')

      
admin.site.register(role )   
admin.site.register(arborescence)         
admin.site.register(pointage)  
admin.site.register(pointeuse)  
admin.site.register(motif_abs) 
admin.site.register(absence) 
admin.site.register(NewUser) 
admin.site.register(plansemaine)   
admin.site.register(horairejour)   
admin.site.register(planning)   
admin.site.register(Conges)  