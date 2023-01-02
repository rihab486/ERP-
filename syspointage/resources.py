from import_export import resources
from .models import  NewUser
class EmployeResource(resources.ModelResource):
    class Meta:
         model = NewUser
         exclude = ('password' )
                       
