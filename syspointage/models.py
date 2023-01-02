from pickle import FALSE, TRUE
from django.db import models
from django.db.models.deletion import SET_DEFAULT, SET_NULL
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import datetime
from django.db.models.signals import post_save,pre_save
from datetime import datetime, date,timedelta
class CustomAccountManager(BaseUserManager):

    def create_superuser(self, email,  password, matricule, user_name , **other_fields):   
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)
        
        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')

        return self.create_user( email,  password, matricule, user_name , **other_fields)

    def create_user(self, email,  password, matricule, user_name , **other_fields):

        
        if not email:
            raise ValueError(_('You must provide an email address'))

        email = self.normalize_email(email)
        user = self.model(email=email, password = password  , matricule = matricule ,user_name=user_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

  
class pointeuse (models.Model):
    nom_pointeuse = models.CharField(max_length=200 , null=False)
    adresse_ip = models.CharField(max_length=200 ,  unique=True)
    SIV = models.CharField(max_length=200 , null=False)
    port =  models.CharField(max_length=200 , null=False)
    
class role (models.Model):
      rolename  = models.CharField(max_length=200 )   
      DRH=models.BooleanField(default=False)
      view_conge=models.BooleanField(default=False)
      view_authorisation=models.BooleanField(default=False)
      view_employé=models.BooleanField(default=False)
      view_departements=models.BooleanField(default=False)
      view_espacepdg=models.BooleanField(default=False)
      view_contrats=models.BooleanField(default=False)
      view_pointeuse=models.BooleanField(default=False)
      view_horaire=models.BooleanField(default=False)
      view_absence=models.BooleanField(default=False)
      view_planing=models.BooleanField(default=False)
      view_rapports=models.BooleanField(default=False)
      view_mouchard=models.BooleanField(default=False)
      view_historique=models.BooleanField(default=False)

      def __bool__(self):
          return self.view_pointeuse

def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)           
def default_start_time():
    now = datetime.now()
    start_time = now.replace(hour=00, minute=0, second=0, microsecond=0)
    return start_time  
def minute_interval(start, end):
        reverse = False
        if start > end:
            start, end = end, start
            reverse = True

        delta = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0
        if reverse:
            delta = 24*60 - delta
        return delta      
def minutes_hours(minutes):
   seconde=00
   hours=minutes // 60
   minutes= minutes % 60
   x="%s:%s:%s" % (int(hours), int(minutes),int(seconde))
   return x
     
class horairejour (models.Model):   
    nom  = models.TextField(max_length=250 , null=True , blank=True  ) 

    jourtravaille=models.CharField(max_length=200 , null=True ,blank=True)
    debut = models.TimeField('%H:%M %p' ,blank=True, null=True) 
    fin = models.TimeField('%H:%M %p',blank=True, null=True) 
    debutentree = models.TimeField('%H:%M %p' ,blank=True, null=True) 
    finentree = models.TimeField('%H:%M %p' ,blank=True, null=True) 
    margeretard =models.IntegerField( blank=True, null=True,default=0)
    margedepartant =models.IntegerField( blank=True, null=True,default=0)
    margeheuresupp=models.IntegerField( blank=True, null=True,default=0)
    debutpause = models.TimeField('%H:%M %p',blank=True, null=True) 
    finpause =models.TimeField('%H:%M %p',blank=True, null=True)
    debutsortie= models.TimeField('%H:%M %p',blank=True, null=True)
    finsortie= models.TimeField('%H:%M %p',blank=True, null=True)
    motif_horaire=models.CharField(max_length=200 , null=True ,blank=True)
    varnuit=models.BooleanField(default=False)
    
    
    def __str__(self):
        ttzero=datetime.strptime("00:00:00","%H:%M:%S").time()
        if self.varnuit is True:
        
            Presence_normale=datetime.combine(date.today(), self.fin) - datetime.combine(date.today(),self.debut)-(datetime.combine(date.today(), self.finpause)-datetime.combine(date.today(), self.debutpause))
           
            return str(Presence_normale)
        else:
            pausenoramle=minute_interval(ttzero,datetime.strptime(str(self.finpause),'%H:%M:%S').time())-minute_interval(ttzero,datetime.strptime(str(self.debutpause),'%H:%M:%S').time())
            presence=minute_interval(ttzero,datetime.strptime(str(self.fin),'%H:%M:%S').time() ) + (1440) - minute_interval(ttzero,datetime.strptime(str(self.debut),'%H:%M:%S').time())
               
            Presence_normale=presence-pausenoramle
          
            return str(minutes_hours(Presence_normale))




   
class plansemaine  (models.Model):      
        nomsemaine = models.CharField(max_length=200 , null=True ,blank=True)
        lundi = models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='lundi+' ,  verbose_name='lundi')
        mardi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='mardi +' ,  verbose_name='mardi')
        mercredi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='mercredi+' ,  verbose_name='mercredi')
        jeudi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='jeudi+' ,  verbose_name='jeudi')
        vendredi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='vendredi+' ,  verbose_name='vendredi')
        samedi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='samedi+' ,  verbose_name='samedi')
        dimanche = models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='dimanche+' ,  verbose_name='dimanche')

class planning (models.Model): 
    title  = models.TextField(max_length=250 , null=True , blank=True ) 
    start = models.DateField(blank=True,null=True)
    end = models.DateField(blank=True,null=True)
    motif=models.TextField(max_length=250 , null=True , blank=True ) 
    plantravail = models.ForeignKey( plansemaine, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='plansemaine' ,  verbose_name='plansemaine')
    def __str__(self):
            return self.title

class contrat(models.Model):
    contratname=models.CharField(max_length=200)
    def __str__(self):
        return self.contratname    

class NewUser(AbstractBaseUser, PermissionsMixin):  
     sex  = (
        ('homme' , 'homme'),
        ('femme','femme')
       
    )
     is_staff = models.BooleanField(default=False)
     is_active = models.BooleanField(default=True)
     matricule = models.CharField(max_length=200 , blank=True, null=True)
     user_name =  models.CharField(max_length=200 , blank=True, null=True)
     email =  models.EmailField(_('email address'), unique=True)
     password =  models.CharField(max_length=200 , null=False)
     matriculecnss = models.CharField(max_length=200 , blank=True, null=True ,default=None)
     sex= models.CharField(choices= sex ,max_length=50,blank=True)
     role = models.ForeignKey( role, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='role' ,  verbose_name='role de l employe ')
     arborescence= models.ManyToManyField('syspointage.arborescence',null=True,blank=True,related_name='modelname_set')
     planningemp = models.ManyToManyField('syspointage.planning',null=True,blank=True,related_name='xxx_set')
     datedemarrage= models.DateTimeField(blank=True, null=True,auto_now_add=True)
     datefin= models.DateTimeField(blank=True, null=True,auto_now_add=True)
     rappel1= models.DateTimeField(blank=True, null=True,auto_now_add=True)
     rappel2= models.DateTimeField(blank=True, null=True,auto_now_add=True)
     démarrageContrat= models.DateTimeField(blank=True, null=True,auto_now_add=True)
     idcontrat = models.ForeignKey( contrat, blank=True , null=True,  on_delete=SET_DEFAULT,  default=None , related_name='contrat' ,  verbose_name='contrat de l employe'  )
     datedenaissance= models.DateTimeField(blank=True, null=True,auto_now_add=True)
     CIN = models.CharField(max_length=200 , blank=True, null=True)
     nbEnfants = models.IntegerField(max_length=200 , blank=True, null=True)
     tel = models.CharField(max_length=200 , blank=True, null=True)
     commentaire = models.CharField(max_length=200 , blank=True, null=True)
     objects = CustomAccountManager()
     USERNAME_FIELD = 'email'
     REQUIRED_FIELDS = ['password', 'matricule' ,'user_name']
     solde=models.IntegerField(max_length=30,blank=True, null=True)
     image=models.ImageField(upload_to='users/%Y/%m/%d/',verbose_name='image', null=True, blank=True)
     situation_sociale=models.CharField(max_length=200 , blank=True, null=True)
     teletravail=models.CharField(max_length=200 , blank=True, null=True)
     motifparti=models.CharField(max_length=200 , blank=True, null=True)
     dateparti= models.DateTimeField(blank=True, null=True)
     daterepris= models.DateTimeField(blank=True, null=True)
     last_name=models.CharField(max_length=200 , blank=True, null=True)
     newpassword=models.CharField(max_length=200 , null=True,blank=True)
    
 
class pointage (models.Model): 
    pointeuse = models.ForeignKey( pointeuse, blank=True,null=True,   on_delete=SET_DEFAULT,  default=None)
    date_pointage = models.DateTimeField(blank=True,null=True)
    employes = models.ForeignKey(NewUser , blank=True, null=True, on_delete=SET_DEFAULT,  default=None)
     
class motif_abs(models.Model): 
    motif =  models.CharField(max_length=200 , null=True ,blank=True)
    motifConge=models.BooleanField(default=False)
    nombrejours_ouvres=models.IntegerField( blank=True, null=True)
    
    def __str__(self):
        return self.motif
    
class absence (models.Model):
    employes =  models.ForeignKey( NewUser , blank=True, null=True,  on_delete=SET_DEFAULT,  default=None)
    raison =  models.TextField(max_length=250 , null=True , blank=True ) 
    datedebut = models.DateTimeField()
    datefin =  models.DateTimeField()
    motif_abs = models.ForeignKey( motif_abs , blank=True,null=True,  on_delete=SET_DEFAULT,  default=None)
    justifie=models.BooleanField(default=False)       

class arborescence (models.Model):
    nom = models.CharField(max_length=200 )                                                                    
    parent = models.ForeignKey('self' , blank=True, null=True, related_name='children' ,  on_delete=SET_DEFAULT,  default=None)
    rh = models.ForeignKey(NewUser , blank=True, null=True, on_delete=SET_DEFAULT,  default=None,related_name='rhofemployes')
    chef = models.ForeignKey(NewUser , blank=True, null=True, on_delete=SET_DEFAULT,  default=None,related_name='chefofemployes')
    #directeur = models.ForeignKey(NewUser , blank=True, null=True, on_delete=SET_DEFAULT,  default=None,related_name='directeurofemployes')
    def __str__(self):
        return ' chef={0},id={1}, rh={2}'.format(self.chef,self.id,self.rh)
    def getNullParent(self):
        if self.parent==None:
            return arborescence.objects.none()
        return arborescence.objects.filter(pk=self.parent.pk) | self.parent. getNullParent()
    
class Conges(models.Model):
    motif_abs=models.ForeignKey(motif_abs , blank=True, null=True, on_delete=SET_DEFAULT,  default=None)
    datedebut=models.DateField(blank=True,null=True)
    datefin=models.DateField(blank=True,null=True)
    date_autorisation=models.DateField(blank=True,null=True)
    contact=models.CharField(max_length=200,blank=True,null=True)
    adresse=models.CharField(max_length=200,blank=True,null=True)
    heure_debut=models.TimeField(blank=True,null=True)
    heure_fin=models.TimeField(blank=True,null=True)
    employes = models.ForeignKey(NewUser , blank=False, null=False, on_delete=models.CASCADE, default=None)
    etat_abs = models.CharField(max_length=200,blank=True)
    etat_absrh=models.CharField(max_length=200,blank=True)
    nbjours=models.IntegerField(blank=True,null=True)
    justif=models.CharField(max_length=200,blank=True,null=True)

class JourFerie(models.Model):
    nom=models.CharField(max_length=200,blank=True)
    etat_jour=models.CharField(max_length=200,blank=True)
    date= models.DateTimeField(blank=True, null=True)
    datefin= models.DateTimeField(blank=True, null=True)
    def __str__(self):
        return self.nom
class Historique(models.Model):
    date=models.DateTimeField(blank=True, null=True)
    departement_update=models.CharField(max_length=200,blank=True)
    
    employe=models.ForeignKey( NewUser , blank=True, null=True,  on_delete=SET_DEFAULT,  default=None)
class MinTimeResponse(models.Model):
     motif =  models.CharField(max_length=200 , blank=True, null=True)
     Entree=models.TimeField(blank=True,null=True)
     Sortie=models.TimeField(blank=True,null=True)
     earlyEntree=models.CharField(max_length=200 , blank=True, null=True)
     lateEntree=models.CharField(max_length=200 , blank=True, null=True)
     earlySortie=models.CharField(max_length=200 , blank=True, null=True)
     lateSortie=models.CharField(max_length=200 , blank=True, null=True)
     user_name=models.CharField(max_length=200 , blank=True, null=True)
     matricule =models.CharField(max_length=200 , blank=True, null=True)
     date_pointage =models.DateTimeField(blank=True,null=True)
     planing=models.CharField(max_length=200 , blank=True, null=True)
     heuretravail=models.CharField(max_length=200 , blank=True, null=True)
     heurenuit=models.CharField(max_length=200 , blank=True, null=True)
     heurenuitmajoree=models.CharField(max_length=200 , blank=True, null=True)
     pause=models.CharField(max_length=200 , blank=True, null=True)
     presencenormal=models.CharField(max_length=200 , blank=True, null=True)
     jourtravaille=models.IntegerField( blank=True, null=True)
     entreepointage=models.TimeField(blank=True,null=True)
     sortiepointage=models.TimeField(blank=True,null=True)
     debutpause=models.CharField(max_length=200 , blank=True, null=True)
     finpause=models.CharField(max_length=200 , blank=True, null=True)
     heureauthorisation=models.CharField(max_length=200 , blank=True, null=True)
     deficit=models.CharField(max_length=200 , blank=True, null=True)
     iduser=models.IntegerField( blank=True, null=True)
     tempsabsence=models.CharField(max_length=200 , blank=True, null=True)
     jourconge=models.CharField(max_length=200 , blank=True, null=True)
     tempsMission=models.CharField(max_length=200 , blank=True, null=True)

class Mouchard(models.Model):
    anciennevaluer =  models.CharField(max_length=200 , blank=True, null=True)
    nouvellevaluer =  models.CharField(max_length=200 , blank=True, null=True)
    employe=models.ForeignKey(NewUser,max_length=200 , blank=True, null=True,on_delete=models.CASCADE)#on_delete=models.CASCADE
    datenow=models.DateTimeField(default=datetime.now, blank=True)
    idper_modifie=models.IntegerField(max_length=200 , blank=True, null=True)
    objet=models.CharField(max_length=200 , blank=True, null=True)
    def __str__(self):
        return str(self.employe)


