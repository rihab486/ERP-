from ctypes import pointer
from rest_framework import serializers
from .models import *
from rest_framework_recursive.fields import RecursiveField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    email = serializers.EmailField(required=True)
    user_name = serializers.CharField(required=True)
    
    roles=serializers.CharField(source="role.rolename",read_only=True)
    #idcontrat = serializers.SlugRelatedField(
       # many=True,
      #  read_only=True,
     #   slug_field='contratname'
    # )
    #role=serializers.SlugRelatedField( many=True,read_only=True,slug_field='rolename')
    
   
    
    class Meta:
        model = NewUser
       
        fields = [
         'id',
         'email',
         'user_name', 
         'password',       
         'matricule', 
         'role',
         'sex',
         'planningemp',
         'matriculecnss',
         'datedemarrage',
         'datefin',
         'rappel1',
         'rappel2',
         'démarrageContrat',
         'idcontrat',
         'datedenaissance',
         'CIN' ,
         'nbEnfants',
         'tel' ,
         'commentaire',
         'is_staff', 
         'is_superuser',
         'is_active',
         'arborescence',
         'roles',
         'solde',
         'image',
         'situation_sociale',
         'teletravail',
         'motifparti',
         'last_name',
         'newpassword',
         'dateparti',
         'daterepris'

         #'saisonier'
  
         
         ]
        

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        arborescence = validated_data.pop('arborescence', [])
      
       
        
        obj = super().create(validated_data)
        if password is not None:
            obj.set_password(password)
            obj.arborescence.set(arborescence)
            
        obj.save()
        
        return obj


    def update(self, instance, validated_data):

        if 'password' in validated_data:
            
            password = validated_data.pop('password', None)
            newpassword = validated_data.pop('newpassword', None)
                
            print(newpassword)
            if password==newpassword:
               instance.set_password(password)
            
   
        return super().update(instance, validated_data) 

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        if self.user.role!=None:
               
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['id'] =self.user.id
                data['view_absence'] = self.user.role.view_absence
                data['view_conge'] = self.user.role.view_conge
                data['view_employé'] = self.user.role.view_employé
                data['view_departements'] = self.user.role.view_departements
                data['view_contrats'] = self.user.role.view_contrats
                data['view_horaire'] = self.user.role.view_horaire
                data['view_planing'] = self.user.role.view_planing
                data['view_pointeuse'] = self.user.role.view_pointeuse
                data['view_espacepdg'] = self.user.role.view_espacepdg
                data['view_rapports']=self.user.role.view_rapports
                data['view_historique']=self.user.role.view_historique
                data['view_mouchard']=self.user.role.view_mouchard
                data['user_name']=self.user.user_name    
                data['matricule']=self.user.matricule   
                data['rolename']=self.user.role.rolename     
                data['solde']=self.user.solde 
                data['email']=self.user.email
                data['last_name']=self.user.last_name
               
        else:
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['id'] =self.user.id          
                data['role'] = "admin"
                data['view_absence'] = True
                data['view_conge'] = True
                data['view_employé'] = True
                data['view_departements'] = True
                data['view_contrats'] = True
                data['view_horaire'] = True
                data['view_planing'] = True
                data['view_pointeuse'] = True
                data['view_espacepdg'] = True
                data['view_rapports']=True
                data['view_historique']=True
                data['view_mouchard']=True
                data['user_name']=self.user.user_name 
                data['matricule']=self.user.matricule
                data['rolename']=""
                data['solde']=self.user.solde 
                data['email']=self.user.email
                data['last_name']=self.user.last_name
    
        return data 

class RoleSerializer(serializers.ModelSerializer) : 
    class Meta : 
        model = role
        fields = [
                'id',
                'rolename',
                'DRH',
                'view_conge',
                'view_authorisation',
                'view_employé',
                'view_conge',
                'view_departements',
                'view_espacepdg',
                'view_contrats',
                'view_pointeuse',
                'view_absence',
                'view_planing',
                'view_horaire',
                'view_rapports',
                'view_historique',
                'view_mouchard'
        ]

class pointeusesSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = pointeuse
        fields = [
                'id',
                'nom_pointeuse',
                'adresse_ip', 
                'SIV', 
                'port',
        ]  
class PointageSerializer(serializers.ModelSerializer) : 
     pointeusename = serializers.CharField( source='pointeuse.nom_pointeuse' ,  read_only=True)
     employe=serializers.CharField( source='employes.user_name' ,  read_only=True)
     matricule=serializers.CharField( source='employes.matricule' ,  read_only=True)
     class Meta : 
        model = pointage
        fields = [
    'id',
    'pointeuse' ,
    'pointeusename',
    'date_pointage', 
    'employes',
    'employe',
    'matricule'

    
        ]                                                       
class MotifabsSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = motif_abs
        fields = [
                'id',
                'motif',
                'motifConge',
                'nombrejours_ouvres'
        ] 
class AbsenceSerializer(serializers.ModelSerializer):
        employee = serializers.CharField(source='employes.user_name' ,read_only=True)
        motif = serializers.CharField(source='motif_abs.motif',read_only=True)
        class Meta:
                model=absence
                fields=[
                        'id',
                        'employes',
                        'raison',
                        'datedebut',
                        'datefin',
                        'motif_abs',
                        'employee',
                        'motif',
                        'justifie'
                ]        

class ContratSerializer(serializers.ModelSerializer):
        class Meta:
                model = contrat
                fields=[
                        'id',
                        'contratname',
                ] 
                
class HoraireJourSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = horairejour
        fields = [
          'id',
          'nom', 
          'debut', 
          'fin',
          'debutentree',  
          'finentree',
          'margeretard', 
          'margedepartant',
          'margeheuresupp',
          'debutpause',
          'finpause', 
          'debutsortie',
          'finsortie',
          'motif_horaire',
          'jourtravaille',
          'varnuit',
     
        ]  
      
            
class PlanningSerializer(serializers.ModelSerializer) : 
     
     
     
    
     class Meta : 
        model = planning
        fields = [
                 'id',
                 'title',
                 'start' ,
                 'end' ,
                 'motif',
                 'plantravail',
                

        ]  
        #qs = planning.objects.all()
        
class PlanSemaineSerializer(serializers.ModelSerializer) : 
     
     lu=serializers.CharField(source='lundi.nom',read_only=True)
     ma=serializers.CharField(source='mardi.nom',read_only=True)
     me=serializers.CharField(source='mercredi.nom',read_only=True)
     je=serializers.CharField(source='jeudi.nom',read_only=True)
     ve=serializers.CharField(source='vendredi.nom',read_only=True)
     sa=serializers.CharField(source='samedi.nom',read_only=True)
     di=serializers.CharField(source='dimanche.nom',read_only=True)
     class Meta : 
        model = plansemaine
        fields = [
                 'id',
                 'nomsemaine',
                 'lundi',
                 'lu',
                 'mardi' ,
                 'ma',
                 'mercredi' ,
                 'me',
                 'jeudi',
                 'je',
                 'vendredi',
                 've',
                 'samedi',
                 'sa',
                 'dimanche',
                 'di'
        ]                     
class arborenscenceSerializer(serializers.ModelSerializer):  
        children = RecursiveField(many=True , read_only=True)
        class Meta : 
          model = arborescence      
          fields = [
                'id',
                'nom',
                'parent',
                'children',
                'chef',
                'rh',
                
                
        ]     
class congesSerializer(serializers.ModelSerializer):
        employemail=serializers.CharField(source='employe.email',read_only=True)
        class Meta :
                model=Conges
                fields=[
                'id',
                'motif_abs',
                'datedebut',
                'datefin',
                'contact',
                'adresse',
                'employes',
                'employemail',
                'heure_debut',
                'heure_fin',
                'etat_abs',
                'etat_absrh',
                'date_autorisation',
                'nbjours',
                'justif'
                ]
class JourFerieSerializer(serializers.ModelSerializer):
        class Meta:
                model=JourFerie
                fields=[
                        'id',
                        'nom',
                        'etat_jour',
                        'date',
                        'datefin',
                ]
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        if self.user.role!=None:
                print(self.user.role)
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['id'] =self.user.id
                data['view_absence'] = self.user.role.view_absence
                data['view_conge'] = self.user.role.view_conge
                data['view_authorisation'] = self.user.role.view_authorisation
                data['view_employé'] = self.user.role.view_employé
                data['view_departements'] = self.user.role.view_departements
                data['view_contrats'] = self.user.role.view_contrats
                data['view_horaire'] = self.user.role.view_horaire
                data['view_planing'] = self.user.role.view_planing
                data['view_pointeuse'] = self.user.role.view_pointeuse
                data['view_espacepdg'] = self.user.role.view_espacepdg
                data['view_rapports']=self.user.role.view_rapports
                data['view_historique']=self.user.role.view_historique
                data['view_mouchard']=self.user.role.view_mouchard     
                data['user_name']=self.user.user_name    
                data['matricule']=self.user.matricule   
                data['rolename']=self.user.role.rolename     
                data['role_DRH']=self.user.role.DRH
                data['solde']=self.user.solde 
              
                data['email']=self.user.email
                data['last_name']=self.user.last_name
              
                  
        
        else:
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['id'] =self.user.id          
                data['role'] = "admin"
                data['view_absence'] = True
                data['view_conge'] = True
                data['view_authorisation'] = True
                data['view_employé'] = True
                data['view_departements'] = True
                data['view_contrats'] = True
                data['view_horaire'] = True
                data['view_planing'] = True
                data['view_pointeuse'] = True
                data['view_espacepdg'] = True
                data['view_rapports']=True
                data['view_historique']=True
                data['view_mouchard']=True
                data['user_name']=self.user.user_name    
                data['matricule']=self.user.matricule   
        
                data['solde']=self.user.solde 
              
                data['email']=self.user.email
                data['last_name']=self.user.last_name
               
              
                
        return data 
class HistoriqueSerializer(serializers.ModelSerializer):
        class Meta :
                model=Historique
                fields=[
                'id',
                'date',
                'departement_update',
                'employe'
                ]    
class MinResponseSerializer(serializers.ModelSerializer):
        class Meta:
              model=MinTimeResponse
              fields=[
                'motif' 
                'Entree',
                'Sortie',
                'earlyEntree',
                'lateEntree',
                'earlySortie',
                'lateSortie',
                'user_name',
                'matricule',
                'date_pointage',
                'planing',
                'heuretravail',
                'pause',
                'presencenormal',
                'jourtravaille',
                'heurenuit',
                'heurenuitmajoree',
                'entreepointage',
                'sortiepointage',
                'debutpause',
                'finpause',
                'heureauthorisation',
                'deficit',
                'iduser',
                'tempsabsence',
                'jourconge',
                'tempsMission'
              ]



class MouchardSerializer(serializers.ModelSerializer):
        
        class Meta :
                model=Mouchard
                fields=[
                'id',
                'anciennevaluer',
                'nouvellevaluer',
                'employe',
                'datenow',
                'idper_modifie',
                'objet'
              
                ]  
"""  
class MoisMinResponse(serializers.ModelSerializer):
        class Meta:
                model=Mois_min_timeResponse,
                fields=[
                        'heuretravailindirect',
                        'heuredtravaildirect',
                        'user_name',
                        'presencereele',
                        'presencenormal',
                        'debutmois',
                        'finmois',
                        'retardEntree',
                        'heureavantsortie',
                        'deficit',
                        'prnormalminutes',
                        'totalheureeffective',
                        'heuretravail_direct',
                        'heuretravail_indirect',
                        'deficitminutes_total',
                        'heureavantsortieminutes',
                        'retardminutes',
                        'iduser',
                        'absence_defi',
                        'minutes_absence_deficit'


                ]
"""
