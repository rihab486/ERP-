
from ast import Not
from asyncio.windows_events import NULL
from pickle import FROZENSET
import string
from rest_framework import viewsets, filters, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from django.http import HttpResponse,JsonResponse
from syspointage.resources import EmployeResource
from .models import *
from django.db.models import Max, Min
from rest_framework.permissions import AllowAny
from syspointage.serializers import *
from django.core.mail import send_mail
from pointage import settings
from itertools import chain
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.generic import TemplateView
from rest_framework import status
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from calendar import day_name, different_locale
import locale
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)

import json
import pandas as pd
#from isoweek import Week
from datetime import date, timedelta
import datetime
import calendar
import itertools
import collections
from django.core.cache import cache
from datetimerange import DateTimeRange
from dateutil.relativedelta import relativedelta
from datetime import timedelta
import threading    
import time 

from schedule import Scheduler

from dateutil import rrule
from rest_framework.permissions import IsAuthenticated 
import jwt
import xlwt

class UsersOfChefRHRapports(APIView):

    def get(self, request, **kwargs):
        listEmployes=[]
       
        a=arborescence.objects.values().all()
        listids=request.query_params.getlist('id')[0].split(',') # get list departemnt from url 
        u=False
        
        idarboresence=None
        dd=NewUser.objects.select_related('role').filter(role__DRH=True).values().all()
        
        if NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['id']):
           u=NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['id'])[0].get('is_superuser')
        
        for idd in listids:
           idurlarbo=int(idd)
           
           for b in a:#parccourir la liste d'arboresence
                  
                  if(int(kwargs['id'])==b.get('chef_id') or int(kwargs['id'])==b.get('rh_id') ):#id id dans url de l'employé (front) égale à chef id of arboresence 
                     idarboresence=b.get('id')
                     if idarboresence==int(idurlarbo):
                      
                        #query pour parccourir la liste children of departement
                        query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
                  
                        cursor = connection.cursor()
                        cursor.execute(query)
                        data = cursor.fetchall()
                        for obj in data:
                        
                           quer="SELECT u.matricule,u.user_name,a.nom,u.id,u.image from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u  where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id"%str(int(''.join(map(str, obj))))
                           #is_active=1 c'a dire emlpoyés non partis ont un compte active
                           
                           cc=connection.cursor()
                           cc.execute(quer)
                           employes=cc.fetchall()
                           
                           json_data = []
                           for objj in employes:
                              json_data.append({"matricule":objj[0],"label":objj[1],"Nomarbo":objj[2],'value':objj[3],'image':objj[4]})
                           listEmployes.extend(list(json_data))
                           
                      
                  elif (u==True or dd):

                        query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idurlarbo
                     
                        cursor = connection.cursor()
                        cursor.execute(query)
                        data = cursor.fetchall()
                        for obj in data:
                            querr="SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.image,u.démarrageContrat,u.email,u.datedemarrage,u.datefin,u.rappel1,u.rappel2 from syspointage_newuser as u left join syspointage_role as r on r.id=u.role_id  left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on a.id=ua.arborescence_id where  ua.arborescence_id =%s"%str(int(''.join(map(str, obj))))
                  
                            ccc=connection.cursor()
                            ccc.execute(querr)
                            employes=ccc.fetchall()
                            json_data = []
                            for objj in employes:
                                json_data.append({"matricule":objj[0],"label":objj[1],"role":objj[2],"Nomarbo":objj[3],'value':objj[4],'image':objj[5],'démarrageContrat':objj[6],"email":objj[7],"datedemarrage":objj[8],"datefin":objj[9],"rappel1":objj[10],"rappel2":objj[11]})
                            listEmployes.extend(list(json_data))
                  return JsonResponse(listEmployes, safe=False) 
                    
                      
        return JsonResponse(listEmployes, safe=False) 


class UsersOfDepartement(APIView):
    
    def get(self, request ,**kwargs):
        listEmployes=[]
        listids=request.query_params.getlist('id')[0].split(',') # get list departemnt from url 
        
       
        for idd in listids:
            
            idarboresence=int(idd)
            query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
             
            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            for obj in data:
                  
                quer="SELECT u.user_name,u.id from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id"%str(int(''.join(map(str, obj))))
                cc=connection.cursor()
                cc.execute(quer)
                employes=cc.fetchall()
                #print(employes)
                json_data = []
                for objj in employes:
                    json_data.append({"label":objj[0],"value":objj[1]})
                #print(json_data)
                listEmployes.extend(list(json_data))
        return JsonResponse(listEmployes, safe=False) 

class UsersOfDepartChef(APIView):
   def get(self, request ,**kwargs):
       listEmployes=[]
       a=arborescence.objects.values().all()
       idchefs=request.query_params.getlist('id')[0].split(',')[0] # get dep  of chef
       Admin=False
       dd=NewUser.objects.select_related('role').filter(role__DRH=True,id=int(idchefs))
       if NewUser.objects.values().filter(is_superuser=True,id=int(idchefs)):
           Admin=NewUser.objects.values().filter(is_superuser=True,id=int(idchefs))[0].get('is_superuser')
          
       for i in a :
        
         if i.get('chef_id') == int(idchefs) or  i.get('rh_id') == int(idchefs):
            idarboresence=i.get('id')
            
             #query pour parccourir la liste children of departement
            query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            for obj in data:
               idarboresence=i.get('id')
               quer="SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.image,u.démarrageContrat,u.email,u.datedemarrage,u.datefin,u.rappel1,u.rappel2 ,u.solde from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id and  u.is_active=1"%str(int(''.join(map(str, obj)))) #is_active=1 c'a dire emlpoyés non partis ont un compte active
               cc=connection.cursor()
               cc.execute(quer)
               employes=cc.fetchall()
               json_data = []
               for objj in employes:
                  json_data.append({"matricule":objj[0],"user_name":objj[1],"role":objj[2],"Nomarbo":objj[3],'id':objj[4],'image':objj[5],'démarrageContrat':objj[6],"email":objj[7],"datedemarrage":objj[8],"datefin":objj[9],"rappel1":objj[10],"rappel2":objj[11] ,"solde":objj[12]})
               listEmployes.extend(list(json_data))

            return JsonResponse(listEmployes, safe=False)  
         elif Admin==True or dd:
            idarboresence=i.get('id')
            
            query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            for obj in data:
               idarboresence=i.get('id')
               quer="SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.image,u.démarrageContrat,u.email,u.datedemarrage,u.datefin,u.rappel1,u.rappel2,u.solde from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id and  u.is_active=1"%str(int(''.join(map(str, obj)))) #is_active=1 c'a dire emlpoyés non partis ont un compte active
               cc=connection.cursor()
               cc.execute(quer)
               employes=cc.fetchall()
               json_data = []
               for objj in employes:
                  json_data.append({"matricule":objj[0],"user_name":objj[1],"role":objj[2],"Nomarbo":objj[3],'id':objj[4],'image':objj[5],'démarrageContrat':objj[6],"email":objj[7],"datedemarrage":objj[8],"datefin":objj[9],"rappel1":objj[10],"rappel2":objj[11],"solde":objj[12]})
               listEmployes.extend(list(json_data)) 
            return JsonResponse(listEmployes, safe=False)        
       return JsonResponse(json_data, safe=False)
      
class UsersOfChef(generics.ListAPIView):
   def get(self, request ,**kwargs):
       listEmployes=[]
       dd=''
       #dd=NewUser.objects.select_related('role').filter(role__DRH=True).values().all()

       a=arborescence.objects.values().all()
       
       idchefs=request.query_params.getlist('id')[0].split(',')[0] # get dep  of chef
      
       Admin=False
       
       dd=NewUser.objects.select_related('role').filter(role__DRH=True,id=int(idchefs))
       
       if NewUser.objects.values().filter(is_superuser=True,id=int(idchefs)):
           Admin=NewUser.objects.values().filter(is_superuser=True,id=int(idchefs))[0].get('is_superuser')
          
       for i in a :
         
         if i.get('chef_id') == int(idchefs) or i.get('rh_id') == int(idchefs) :
            idarboresence=i.get('id')
            
             #query pour parccourir la liste children of departement
            query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
             
            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            for obj in data:
               idarboresence=i.get('id')
               quer="SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.image,u.démarrageContrat,u.email,u.datedemarrage,u.datefin,u.rappel1,u.rappel2 ,u.solde from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id and  u.is_active=1"%str(int(''.join(map(str, obj)))) #is_active=1 c'a dire emlpoyés non partis ont un compte active
               cc=connection.cursor()
               cc.execute(quer)
               employes=cc.fetchall()
               json_data = []
               for objj in employes:
                  json_data.append({"matricule":objj[0],"user_name":objj[1],"role":objj[2],"Nomarbo":objj[3],'id':objj[4],'image':objj[5],'démarrageContrat':objj[6],"email":objj[7],"datedemarrage":objj[8],"datefin":objj[9],"rappel1":objj[10],"rappel2":objj[11] ,"solde":objj[12]})
               listEmployes.extend(list(json_data))

            return JsonResponse(listEmployes, safe=False) 
         elif Admin==True or dd:
               idarboresence=i.get('id')
               query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
               
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
               for obj in data:
                  idarboresence=i.get('id')
                  quer="SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.image,u.démarrageContrat,u.email,u.datedemarrage,u.datefin,u.rappel1,u.rappel2,u.solde from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id and  u.is_active=1"%str(int(''.join(map(str, obj)))) #is_active=1 c'a dire emlpoyés non partis ont un compte active
                  cc=connection.cursor()
                  cc.execute(quer)
                  employes=cc.fetchall()
                  json_data = []
                  for objj in employes:
                     json_data.append({"matricule":objj[0],"user_name":objj[1],"role":objj[2],"Nomarbo":objj[3],'id':objj[4],'image':objj[5],'démarrageContrat':objj[6],"email":objj[7],"datedemarrage":objj[8],"datefin":objj[9],"rappel1":objj[10],"rappel2":objj[11],"solde":objj[12]})
                  listEmployes.extend(list(json_data)) 
               return JsonResponse(listEmployes, safe=False)  
               
 
class EmployesPartis(generics.ListAPIView):
  queryset=NewUser.objects.filter(is_active=False).all()
  serializer_class=CustomUserSerializer

class QuitterEmploye(generics.RetrieveUpdateAPIView):
  def get(self,request,**kwargs):
      NewUser.objects.filter(id=kwargs['id']).update(is_active=False,motifparti=kwargs['motif'],dateparti=kwargs['datepart'])
      return JsonResponse({"status":"success"}, safe=False)
class ReprisEmploye(generics.RetrieveUpdateAPIView):
   def get(self , request,**kwargs):
      NewUser.objects.filter(id=kwargs['id']).update(is_active=True,daterepris=datetime.datetime.now())
      return JsonResponse({"status":"success"}, safe=False)

class AffichageDemendesConges(APIView):#demande congés autorisation mission
   def get(self, request,pk):
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.etat_abs,c.datedebut,c.datefin,m.motif,n.solde,c.heure_debut,c.heure_fin,c.date_autorisation,c.id,c.etat_absrh,c.justif,c.adresse,c.contact,c.nbjours FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id where n.id=%s or etat_abs=''"%idemploye)
       data = cursor.fetchall()
       json_data = []
       for obj in data:
           json_data.append({"user_name":obj[0],"etat_abs":obj[1],"datedebut":obj[2],"datefin":obj[3],"motif":obj[4],"solde":obj[5],"heure_debut":obj[6],"heure_fin":obj[7],"date_autorisation":obj[8],"idconge":obj[9],"etat_absrh":obj[10],"justif":obj[11],"adresse":obj[12],"contact":obj[13],"nbjours":obj[14]})
       return JsonResponse(json_data, safe=False)
 
class Userlist(generics.ListAPIView):
      queryset =NewUser.objects.all()
      serializer_class = CustomUserSerializer

class UserDelete(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = NewUser.objects.all()
    serializer_class = CustomUserSerializer   
    
def jwt_payload_handler(user=None):


   return {
      
      'user': CustomUserSerializer(user).data
   }  
class UpdateUser(APIView):
   def get_object(self, todo_id):

       try:
          return NewUser.objects.get(id=todo_id)
       except NewUser.DoesNotExist:
          return None    
   def put(self, request, *args, **kwargs):

        todo_instance = self.get_object(kwargs['pk'])
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
      
        serializer = CustomUserSerializer(instance = todo_instance, data=request.data, partial=True)
        if serializer.is_valid():
           user = serializer.save()
           if user:
              json = serializer.data
             ##print('request.data.password',request.data.get('password'))
              payload = jwt_payload_handler(user)
              token = jwt.encode(payload, settings.SECRET_KEY)
              
              return Response(json, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 
class CustomUserCreate(APIView):
    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            if user:
                json = serializer.data
               
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUserById(generics.RetrieveAPIView):
   queryset=NewUser.objects.prefetch_related('planningemp','arborescence').select_related('role','idcontrat').all()

   serializer_class=CustomUserSerializer

class GetUsersbyplanings(generics.RetrieveAPIView):
       def get(self,request,pk):
        cursor=connection.cursor()
        id=self.kwargs['pk']
        cursor.execute('select u.matricule,u.user_name,p.title,p.id,u.id,u.id from syspointage_newuser  as u left join syspointage_newuser_planningemp as pu on pu.newuser_id=u.id left join   syspointage_planning as p on p.id=pu.planning_id WHERE p.id=%s'%id)
        data = cursor.fetchall()
        json_data = []
        for obj in data:
            json_data.append({"matricule":obj[0],"user_name":obj[1],"nomplanning":obj[2],"idplanactuelle":obj[3],"iduser":obj[4],"iduseractuelle":obj[5]})
        return JsonResponse(json_data, safe=False)   
class DeleteUserbyplanning(APIView):
    def get(self, request, **kwargs):

       iduser=kwargs['iduser']
       idplaningactuelle=kwargs['idplaningactuelle']
       
       user=NewUser.objects.get(id=int(iduser))
       #user.planningemp.clear()  
       user.planningemp.get(id=idplaningactuelle) #séléctionner planning actuelle selecté
       user.planningemp.remove(idplaningactuelle)#effacer planning actuelle selecté
 
       return Response('succes delete', status=status.HTTP_201_CREATED)
class GetPointageById(APIView):
   def get(self, request, **kwargs):

       iduser=kwargs['iduser']
       idplaningactuelle=kwargs['idplaningactuelle']
       
       user=NewUser.objects.get(id=int(iduser))
       #user.planningemp.clear()  
       user.planningemp.get(id=idplaningactuelle) #séléctionner planning actuelle selecté
       user.planningemp.remove(idplaningactuelle)#effacer planning actuelle selecté
 
       return Response('succes delete', status=status.HTTP_201_CREATED)


class updateUserbyplanning(generics.RetrieveUpdateDestroyAPIView):
     def get(self, request, **kwargs):
       listidplaning=request.query_params.getlist('idplanning')[0].split(',')
       
       iduser=kwargs['iduser']
       idplaningactuelle=kwargs['idplaningactuelle']
       user=NewUser.objects.get(id=int(iduser))
        
       user.planningemp.get(id=idplaningactuelle) #séléctionner planning actuelle selecté
       user.planningemp.remove(idplaningactuelle)#effacer planning actuelle selecté
       for objj in listidplaning :
       
           user.planningemp.add(int(objj)) #ajouter nouveau planning
       
       
       return Response('json', status=status.HTTP_201_CREATED)

"""
class GetUserById(APIView):
    def get(self,request,pk):
        cursor=connection.cursor()
        id=self.kwargs['pk']
        cursor.execute('select u.id,u.matricule,u.user_name,u.email,u.password,u.matriculecnss,u.sex,u.datedemarrage,u.datefin,u.rappel1,u.rappel2,u.démarrageContrat,u.datedenaissance,u.CIN,u.nbEnfants,u.tel,u.commentaire,u.solde,u.image,u.situation_sociale,u.teletravail,u.idcontrat_id,pla.id,r.id,a.nom,a.id,u.image,r.rolename,pla.title,c.contratname from syspointage_newuser as u left join syspointage_contrat as c on u.idcontrat_id=c.id left join syspointage_role as r on r.id =u.role_id left join syspointage_newuser_arborescence as ua on u.id=ua.newuser_id left join syspointage_arborescence as a on a.id=ua.arborescence_id Left join syspointage_newuser_planningemp as pu on pu.newuser_id=u.id LEFT join  syspointage_planning as pla on pla.id=pu.planning_id WHERE u.id=%s'%id)
        data = cursor.fetchall()
        json_data = []
        for obj in data:
            return JsonResponse({"id":obj[0],"matricule":obj[1],"user_name":obj[2],"email":obj[3],"password":obj[4],"matriculecnss":obj[5],"sex":obj[6],"datededemarrage":obj[7],"datefin":obj[8],"rappel1":obj[9],"rappel2":obj[10],"démarrageContrat":obj[11],"datedenaissance":obj[12],"CIN":obj[13],"nbEnfants":obj[14],"tel":obj[15],"commentaire":obj[16],"solde":obj[17],"image":obj[18],"situation_sociale":obj[19],"teletravail":obj[20],"idcontrat":obj[21],"planningemp":obj[22],"role":obj[23],'nom':obj[24],'arborescence':obj[25],"image":obj[26],"rolename":obj[27],"nomplaning":obj[28],"nomcontrat":obj[29]}, safe=False)
      
        """
class Rolelist(generics.ListCreateAPIView):
    #test
   
    queryset = role.objects.all()
    serializer_class = RoleSerializer
   
class Roleupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = role.objects.all()
    serializer_class = RoleSerializer     
class Pointeuselist(generics.ListCreateAPIView):
    
    queryset = pointeuse.objects.all()
    serializer_class = pointeusesSerializer
   
class Pointeuseupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = pointeuse.objects.all()
    serializer_class = pointeusesSerializer  
class Pointagelist(generics.ListAPIView):
     
    queryset = pointage.objects.all()
    serializer_class = PointageSerializer
class CreatePointage(generics.CreateAPIView):
    queryset=pointage.objects.all()
    serializer_class=PointageSerializer   

class UpdatePointage(APIView):
   def get_object(self, todo_id):

       try:
          return pointage.objects.get(id=todo_id)
       except pointage.DoesNotExist:
          return None    
   def put(self, request, *args, **kwargs):
        jsondata=[]
        cursor = connection.cursor()
        cursor.execute("""
         select date_pointage,iduser from syspointage_mintimeresponse;
        """)
        e = cursor.fetchall()
        
       
        if e:
           for obj in e:
               jsondata.append({"date":obj[0],"iduser":obj[1]})
        #print(jsondata)
        todo_instance = self.get_object(kwargs['id'])
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
      
        serializer = PointageSerializer(instance = todo_instance, data=request.data, partial = True)
        if serializer.is_valid():
           p=serializer.save()
           json=serializer.data
           if json and jsondata:
              for ob in jsondata:
                  
                  #si ce rapport existe dans le tableau minresponsetemps alors il faut modifier le tableau avec un autre rapport 
                  if datetime.datetime.strptime(str(json.get('date_pointage')),"%Y-%m-%dT%H:%M:%S").date()==ob['date'].date() and ob['iduser']==json.get('employes'):
                     a=Rapportunjour(int(json.get('employes')),str(datetime.datetime.strptime(str(json.get('date_pointage')),"%Y-%m-%dT%H:%M:%S").date()))
                  
                     if a:
                        jsondata.append({"lateEntree":a[0]["lateEntree"],"motif":a[0]["motif"],"jourtravaille":a[0]['jourtravaille'],"date":str(single_date),"day":day})
                     
           return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
class PointageRetrieve(generics.RetrieveAPIView):
    
    queryset = pointage.objects.all()
    serializer_class = PointageSerializer 
class DeletePointage(generics.DestroyAPIView ):
     queryset=pointage.objects.all()
     serializer_class=PointageSerializer


class Motiflist(generics.ListCreateAPIView):
        
    queryset = motif_abs.objects.all()
    serializer_class = MotifabsSerializer
   
class Motifupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = motif_abs.objects.all()
    serializer_class = MotifabsSerializer     
    
class Horairejourlist(generics.ListCreateAPIView):
        
    queryset = horairejour.objects.all()
    serializer_class = HoraireJourSerializer
   
class HoraireJourupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = horairejour.objects.all()
    serializer_class = HoraireJourSerializer

class Plansemainelist(generics.ListCreateAPIView):
        
    queryset = plansemaine.objects.all()
    serializer_class = PlanSemaineSerializer
   
class plansemaineupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = plansemaine.objects.all()
    serializer_class = PlanSemaineSerializer
    
class Planninglist(generics.ListCreateAPIView):
       
    queryset = planning.objects.all()
    serializer_class = PlanningSerializer
   
class Planningupdate(generics.RetrieveUpdateDestroyAPIView):
   
    
    #queryset = planning.objects.prefetch_related('xxx_set')
    queryset = planning.objects.all()
    serializer_class = PlanningSerializer 

class CreateplaningByDep(APIView):

      def post(self, request,**kwargs):
          listids=request.query_params.getlist('id')[0].split(',')
          serializer = PlanningSerializer(data=request.data) 
          if serializer.is_valid():
             planing = serializer.save()
             #print(planing)
             for obj in listids:
              
                 user=NewUser.objects.get(id=int(obj))
                 
                 user.planningemp.add(planing)
          return Response('json', status=status.HTTP_201_CREATED)


class ContratList(generics.ListCreateAPIView):
    queryset=contrat.objects.all()
    serializer_class = ContratSerializer
class contratupdate(generics.RetrieveUpdateDestroyAPIView):
    queryset= contrat.objects.all()
    serializer_class=ContratSerializer

class AbsencesList(generics.ListCreateAPIView):
    queryset=absence.objects.all()
    serializer_class=AbsenceSerializer

class AbscenceUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset=absence.objects.all()
    serializer_class=AbsenceSerializer  

class ArborescenceList(generics.ListCreateAPIView):
    queryset=arborescence.objects.filter(parent__isnull = True)
    serializer_class=arborenscenceSerializer

class ArborescenceUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset=arborescence.objects.all()
    serializer_class=arborenscenceSerializer 


def exportemploye(request):
    zied = EmployeResource()
    dataset = zied.export()
    response = HttpResponse(dataset.xls, content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="projet.xls"'
    return response

class selectArborescence(APIView):


    def get(self,request,pk):
        cursor=connection.cursor()
        id=self.kwargs['pk']
        cursor.execute("select a.id,a.nom,a.chef_id,a.rh_id ,COALESCE(NULLIF(u.user_name,''), ''),COALESCE(NULLIF(u.last_name,''), ''),COALESCE(NULLIF(uu.user_name,''), ''),COALESCE(NULLIF(uu.last_name,''),'') from syspointage_arborescence as a left join syspointage_newuser as u on u.id=a.rh_id left join syspointage_newuser as uu on uu.id=a.chef_id where a.id=%s"%id)
        data = cursor.fetchall()

        obj=data[0]
        json_data={"id":obj[0],"nom":obj[1],"chef":obj[2],"rh":obj[3],"nomrh":obj[4],"prenomrh":obj[5],"nomchef":obj[6],"prenomchef":obj[7]}
        
        return JsonResponse(json_data, safe=False)

"""
def pdf_view(request):
    users=NewUser.objects.all()
    listt=[]
    for u in users:
        listt.append(u.email)
        listt.append(u.user_name)
    response = HttpResponse(listt, content_type='application/txt')
    response['Content-Disposition'] = 'attachment; filename="mypdf.txt"'
    return response
"""
class Demendeconges(generics.CreateAPIView):
    def post(self, request, format='json',**kwargs):
        serializer = congesSerializer(data=request.data)
        if serializer.is_valid():
            conge = serializer.save()

            if conge:
                json = serializer.data

        arb=arborescence.objects.values().all()
        aa=NewUser.objects.filter(id=(self.kwargs['pk']))
        
        bb=aa.prefetch_related('arborescence')
        dd=NewUser.objects.select_related('role').filter(role__DRH=True).values().all()
        
      
 
        user_name=NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('user_name')
        employesname=NewUser.objects.filter(id=self.kwargs['employe_id']).values()[0].get('user_name')
       
        chefs=[]
        for i in arb:
         if (self.kwargs['pk']==i.get('chef_id')):
             
             send_mail(
        "IPS Time: Demande de "+self.kwargs['type']+" transmise",
        "<p style='line-height: 300%;'>Bonjour "+user_name+" ,<br> Vous avez fait une demande de "+self.kwargs['type']+" " +self.kwargs['date1'] +"à"+self.kwargs['date2']+"<br> Votre demande a bien été envoyé à votre valideur <br> pour votre employé  "+employesname+" ,<br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>",
        settings.EMAIL_HOST_USER,
        aa,
        fail_silently=False,
        html_message="<p style='line-height: 300%;'>Bonjour "+user_name+" ,<br> Vous avez fait une demande de "+self.kwargs['type']+" "+self.kwargs['date1'] +"à "+self.kwargs['date2']+"<br> Votre demande a bien été envoyé à votre valideur <br>  pour votre employé  "+employesname+" <br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>"
        )
        user_namerh=''
        x=''
        for c in bb[0].arborescence.all():##bb retourne un seule utilisatueur
          
            if c.getNullParent():
               print('tttt',c.getNullParent()[0])
               if c.getNullParent()[0]!=None:
                  x=c.getNullParent()[0].rh
           
        send_mail(
               "IPS Time: Demande de "+self.kwargs['type']+" transmise",
         "<p style='line-height: 300%;'>Bonjour RH  ,<br> Le chef "+user_name+"  a passé une demande de "+self.kwargs['type']+" à partir du" +self.kwargs['date1'] +"jusqu'à"+self.kwargs['date2']+"<br> pour l'employé  "+employesname+" ,<br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>",
         
         settings.EMAIL_HOST_USER,
         [c.rh,x],
         fail_silently=False,
         html_message="<p style='line-height: 300%;'> Bonjour RH  ,<br> Le chef "+user_name+"  a passé une demande de "+self.kwargs['type']+" à partir du" +self.kwargs['date1'] +"jusqu'à"+self.kwargs['date2']+"<br> pour l'employé  "+employesname+",<br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>"

        )
       
        for t in dd:
            emaildiret=t.get('email')
            usernamed=t.get('user_name')
        send_mail(
               "IPS Time: Demande de "+self.kwargs['type']+" transmise",
         "<p style='line-height: 300%;'>Bonjour "+usernamed+"  ,<br> Le chef "+user_name+"  a passé une demande de "+self.kwargs['type']+" à partir du" +self.kwargs['date1'] +"jusqu'à"+self.kwargs['date2']+"<br> pour l'employé  "+employesname+" ,<br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>",
      
            settings.EMAIL_HOST_USER,
            [emaildiret],
            fail_silently=False,
         html_message="<p style='line-height: 300%;'>Bonjour "+usernamed+"  ,<br> Le chef "+user_name+"  a passé une demande de "+self.kwargs['type']+" à partir du" +self.kwargs['date1'] +"jusqu'à"+self.kwargs['date2']+"<br> pour l'employé  "+employesname+",<br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>"

         )
        
        """while c.parent==None:
          
           chefs.append(c.rh)
           print('chefss',chefs)
      
           
           send_mail(
            "IPS Time: Demande de "+self.kwargs['type']+" transmise",
            "<p style='line-height: 300%;'>Bonjour ,<br> Vous avez fait une demande de "+self.kwargs['type']+" " +self.kwargs['date1'] +"à"+self.kwargs['date2']+"<br> Votre demande a bien été envoyé à votre valideur <br> pour votre employé  "+employesname+" <br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>",
      
           settings.EMAIL_HOST_USER,
           chefs,
           fail_silently=False,
           html_message="<p style='line-height: 300%;'>Bonjour  ,<br> Vous avez fait une demande de "+self.kwargs['type']+" "+self.kwargs['date1'] +"à "+self.kwargs['date2']+"<br> Votre demande a bien été envoyé à votre valideur <br> pour votre employé  "+employesname+" ,<br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusé. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>"

           )
           
           break"""

        return JsonResponse({"succes":"true"},safe=False)
class SupressionConge(generics.DestroyAPIView):
    queryset=Conges.objects.all()
    serializer_class=congesSerializer
class ValidationConge(APIView):
    def get(self, request,**kwargs):
      
        Conges.objects.filter(id=kwargs['id']).update(etat_absrh=kwargs['etat_absrh'],etat_abs=kwargs['etat_abs'])
        c=Conges.objects.filter(id=kwargs['id']).values()[0]
        
        if  c.get('etat_abs')=="confirmé par Dir" :

            a=NewUser.objects.filter(id=c.get('employes_id')).values()
            
            if c.get('date_autorisation') ==None:  
               sold=a[0].get('solde')
               nbjours=c.get('nbjours')
               sold=sold-nbjours
               if sold<0:
                  NewUser.objects.filter(id=c.get('employes_id')).update(solde=0)
               else:
                  NewUser.objects.filter(id=c.get('employes_id')).update(solde=sold)
                  
         
        return JsonResponse({"s":"success"},safe=False)
     
class RefusConge(generics.RetrieveUpdateAPIView):
    queryset=Conges.objects.all()
    serializer_class=congesSerializer

"""
class CongésList(generics.ListAPIView):
  
   def get(self, request):
     listconges=[]
     conges=Conges.objects.values().all()
     cheff=""
     #print(conges)
     for c in conges:
         
         user=NewUser.objects.filter(id=c['employes_id']).prefetch_related('arborescence')
         userattributs=NewUser.objects.filter(id=c['employes_id']).values().all()
         #chaque userattributs retourne un seule objet json c'est pourquoi=>userattributs[0]
         #id user has arboresence 
         if user[0].arborescence.all():
            for cc in user[0].arborescence.all():
                #print(cc.chef)
            if cc.chef!=None:
               cheff=cc.chef#retourne le chef de l'employé dans le meme département
            elif cc.parent!=None:
               cheff=cc.parent.chef#retourne le chef de l'employé dans le département parent
            else:
               cheff=""
            if cc.rh!=None:
              rhh=cc.rh
            elif cc.parent!=None:
              rhh=cc.parent.rh
            else:
              rhh=""
            
        
         
            listconges.append({"chef":str(cheff),"user_name":userattributs[0]['user_name'],"solde":userattributs[0]['solde'],"datedebut":c['datedebut'],"datefin":c['datefin'],"contact":c['contact'],"adresse":c['adresse'],"etat_abs":c['etat_abs'],"heure_debut":c['heure_debut'],"heure_fin":c['heure_fin'],"id":c['id'],"rh":str(rhh),"date_autorisation":c['date_autorisation'],"mission":c['mission'],"iduser":c['employes_id']})
         else:
            listconges.append({"chef":"","user_name":userattributs[0]['user_name'],"solde":userattributs[0]['solde'],"datedebut":c['datedebut'],"datefin":c['datefin'],"contact":c['contact'],"adresse":c['adresse'],"etat_abs":c['etat_abs'],"heure_debut":c['heure_debut'],"heure_fin":c['heure_fin'],"id":c['id'],"rh":"","date_autorisation":c['date_autorisation'],"mission":c['mission'],"iduser":c['employes_id']})
     return JsonResponse(listconges,safe=False)
          

"""
"""class TestCongésList(APIView):
    def get(self, request, pk):
        listEmployes=[]
        
        a=arborescence.objects.values().all()
        
        for b in a:#parccourir la liste d'arboresence
           
            
            if(self.kwargs['pk']==b.get('chef_id') or self.kwargs['pk']==b.get('rh_id')):#id id dans url de l'employé (front) égale à chef id of arboresence 
               
               idarboresence=b.get('id')
               emailrh=str(NewUser.objects.filter(id=b.get('rh_id')).values()[0].get('email'))
                
               
               
               #query pour parccourir la liste children of departement
               query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
               #print('data',data)
               
               if data[1:]  == ():
                  
                  for obj in data:

                     
                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where c.etat_abs != 'en_attente' and ua.arborescence_id=%s and date_autorisation is null "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     testlist=[]
                     
                     for objj in employes:
                           
                           if objj[13]==self.kwargs['pk']:
                              json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chef_id":objj[13],"rh_id":objj[14],"show":False,'chefid_grand':''})
                           else :
                              json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chef_id":objj[13],"rh_id":objj[14],"show":True,'chefid_grand':''})

                     listEmployes.extend(list(json_data))
               else:
                  quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id=%s and c.etat_abs != 'en_attente' and date_autorisation is null "%str(idarboresence)
               #is_active=1 c'a dire emlpoyés non partis ont un compte active
               #print('chefid',)
               cc=connection.cursor()
               cc.execute(quer)
               employes=cc.fetchall()
               json_data = []
               testlist=[]
               for objj in employes:
                 
                  json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"emailrh":emailrh,"idconge":objj[11],"etat_absrh":objj[12],"chef_id":'',"rh_id":objj[14],"show":True,'chefid_grand':objj[13]})
               
               listEmployes.extend(list(json_data))


        return JsonResponse(listEmployes, safe=False)"""
class TestCongésList(APIView):
    def get(self, request, **kwargs):
        listEmployes=[]
       
        
        a=arborescence.objects.values().all()
        dd=NewUser.objects.select_related('role').filter(role__DRH=True).values().all()
        for t in dd:
            emaildiret=t.get('email')
            usernamed=t.get('user_name')
            iddirecteur=t.get('id')

        idarboresence=None
        u=False
        x=NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['pk'])
        if x:
           u=x[0].get('is_superuser')
        
        for b in a:#parccourir la liste d'arboresence
            emailrh=''
            if b.get('rh_id') != None:
              emailrh=str(NewUser.objects.filter(id=b.get('rh_id')).values()[0].get('email'))
           
            idchefgrand=b.get('chef_id')
            idrhgrand=b.get('rh_id')
           
            if(self.kwargs['pk']==b.get('rh_id') or dd!=None):#id id dans url de l'employé (front) égale à chef id of arboresence 
               
               idarboresence=b.get('id')
               
               #query pour parccourir la liste children of departement
               query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
               
               if data[1:]  == ():
                  
                  
                  for obj in data:

                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where  ua.arborescence_id=%s and date_autorisation is null "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     
                     emailchef=''
                     for objj in employes:
                        
                        if iddirecteur == self.kwargs['pk'] or idrhgrand == self.kwargs['pk']:
                          
                          
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":True,"emailrh":emailrh,"emaildirec":emaildiret,"iddirecteur":iddirecteur,"usernamed":usernamed})
                        else :
                           ch=NewUser.objects.filter(id=objj[13])
                           if ch:
                              emailchef=str(ch.values()[0].get('email'))
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":False,"emailrh":emailrh})

                     listEmployes.extend(list(json_data))
                      
               else:
                  
                  for obj in data:
                     
                     
                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id=%s and date_autorisation is null "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     emailchef=""
                     for objj in employes:
                       
                        
                        if iddirecteur == self.kwargs['pk'] or idrhgrand == self.kwargs['pk']:
                           
                           ch=NewUser.objects.filter(id=objj[13])
                              
                           if ch:
                           
                              emailchef=str(ch.values()[0].get('email'))
                        
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":idchefgrand,"rhid_grand":idrhgrand,"show":True,"emailrh":emailrh,"emaildirec":emaildiret,"iddirecteur":iddirecteur,"usernamed":usernamed})
                             
                        else :
                           
                           ch=NewUser.objects.filter(id=objj[13])
                           if ch:
                              emailchef=str(ch.values()[0].get('email'))
                             
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":False,"emailrh":emailrh})

                     listEmployes.extend(list(json_data))
                   
                  return JsonResponse(listEmployes, safe=False)
          
            elif u==True:
               idarboresence=b.get('id')
               
               #query pour parccourir la liste children of departement
               query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
               
               if data[1:]  == ():
                  
                  for obj in data:

                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where c.etat_abs != 'en_attente' and ua.arborescence_id=%s and date_autorisation is null "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     testlist=[]
                     
                     for objj in employes:
                           emailemploye=str(NewUser.objects.filter(id=objj[10]).values()[0].get('email'))
                           
                           if objj[13]==self.kwargs['pk']:
                              json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":emailemploye,"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":False,"emailrh":emailrh})
                           else :
                              json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=objj[13]).values()[0].get('email')),"emailemploye":emailemploye,"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":True,"emailrh":emailrh})

                     listEmployes.extend(list(json_data))
                      
               else:
                  
                  
                  for obj in data:
                     
                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id=%s and date_autorisation is null "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     ##print(employes)
                     for objj in employes:
                        emailemploye=str(NewUser.objects.filter(id=objj[10]).values()[0].get('email'))
                        email_chef=str(NewUser.objects.filter(id=objj[13]).values()[0].get('email'))
                        emailchefgrand=str(NewUser.objects.filter(id=idchefgrand).values()[0].get('email'))

                        if idchefgrand==self.kwargs['pk']:
                     
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":email_chef,"emailemploye":emailemploye,"emailrh":emailrh,"idconge":objj[11],"etat_absrh":objj[12],"chef_id":objj[13],"rh_id":objj[14],"show":False,'chefid_grand':idchefgrand,'rhid_grand':idrhgrand,'emailchefgrand':emailchefgrand})
                        else:
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":email_chef,"emailemploye":emailemploye,"emailrh":emailrh,"idconge":objj[11],"etat_absrh":objj[12],"chef_id":objj[13],"rh_id":objj[14],"show":True,'chefid_grand':idchefgrand,'rhid_grand':idrhgrand,'emailchefgrand':emailchefgrand})
                           ##print(" emailchef",str(NewUser.objects.filter(id=objj[13]).values()[0].get('email')))
                     listEmployes.extend(list(json_data))
                     
               return JsonResponse(listEmployes, safe=False)

        
        return JsonResponse(listEmployes, safe=False)
                      
               
class TestAutorisationsList(APIView):
   def get(self, request, pk):
        listEmployes=[]
       
        a=arborescence.objects.values().all()
        dd=NewUser.objects.select_related('role').filter(role__DRH=True).values().all()
        for t in dd:
            emaildiret=t.get('email')
            usernamed=t.get('user_name')
            iddirecteur=t.get('id')
        idarboresence=None
        u=False
        x=NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['pk'])
        if x:
           u=x[0].get('is_superuser')
       
        for b in a:#parccourir la liste d'arboresence
            emailrh=''
            if b.get('rh_id') != None:
             
               emailrh=str(NewUser.objects.filter(id=b.get('rh_id')).values()[0].get('email'))
           
            idchefgrand=b.get('chef_id')
            idrhgrand=b.get('rh_id')
            
            
            if(self.kwargs['pk']==b.get('rh_id') or dd!=None):#id id dans url de l'employé (front) égale à chef id of arboresence 
               
               idarboresence=b.get('id')
               
               
               #query pour parccourir la liste children of departement
               query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
               
               if  data[1:]  == ():
                  
                  for obj in data:
                     
                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs,u.id from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id=%s and date_autorisation is not null "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     
                     json_data = []
                     emailchef=''
                     
                     for objj in employes:
                         emailemploye=str(NewUser.objects.filter(id=objj[10]).values()[0].get('email'))
                         
                         if iddirecteur == self.kwargs['pk'] or idrhgrand == self.kwargs['pk']:
                           
                            
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":emailemploye,"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":True,"emailrh":emailrh,"emaildirec":emaildiret,"iddirecteur":iddirecteur,"usernamed":usernamed})
 
                         else :
                           ch =NewUser.objects.filter(id=objj[13])
                          
                           if ch :
                              emailchef=str(ch.values()[0].get('email'))
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":emailemploye,"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":False,"emailrh":emailrh})

                     listEmployes.extend(list(json_data))
                 
               else:
                 
                  for obj in data:
                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs,u.id from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id=%s and date_autorisation is not null "%str(int(''.join(map(str, obj))))

                     
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     emailchef=''
                     
                     for objj in employes:
                        emailemploye=str(NewUser.objects.filter(id=objj[10]).values()[0].get('email'))
                        ch=NewUser.objects.filter(id=objj[13])
                       

                        if iddirecteur == self.kwargs['pk'] or idrhgrand == self.kwargs['pk']:
                           if ch :
                              emailchef=str(ch.values()[0].get('email'))
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":emailemploye,"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":idchefgrand,"rhid_grand":idrhgrand,"show":True,"emailrh":emailrh,"emaildirec":emaildiret,"iddirecteur":iddirecteur,"usernamed":usernamed})
                              
                        else:
                           
                           if ch:
                              emailchef=str(ch.values()[0].get('email'))
                              
                           json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":emailemploye,"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":False,"emailrh":emailrh})

                     listEmployes.extend(list(json_data))
                  return JsonResponse(listEmployes, safe=False)
             
            elif u==True:
                  idarboresence=b.get('id')
                  
                  
                  #query pour parccourir la liste children of departement
                  query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
               
                  cursor = connection.cursor()
                  cursor.execute(query)
                  data = cursor.fetchall()
                  
                  if data[1:]  == ():
                  
                     for obj in data:

                        
                        quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs,u.id from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id=%s and date_autorisation is not null "%str(int(''.join(map(str, obj))))
                        #is_active=1 c'a dire emlpoyés non partis ont un compte active
                        cc=connection.cursor()
                        cc.execute(quer)
                        employes=cc.fetchall()
                        json_data = []
                        emailchef=''
                        testlist=[]
                        
                        for objj in employes:
                              #print('rh   chef', objj[14] , objj[13])
                              
                              
                              json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":str(NewUser.objects.filter(id=self.kwargs['pk']).values()[0].get('email')),"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"idconge":objj[11],"etat_absrh":objj[12],"chefid_grand":objj[13],"rhid_grand":objj[14],"show":False,"emailrh":emailrh})
                              
                        listEmployes.extend(list(json_data))
            
                           
                  else:
                     for obj in data:
                        quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,a.chef_id,a.rh_id,c.etat_abs,u.id from syspointage_conges as c inner join syspointage_newuser as u   on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where c.etat_abs != 'en_attente' and ua.arborescence_id=%s and date_autorisation is not null "%str(int(''.join(map(str, obj))))

                        
                        #is_active=1 c'a dire emlpoyés non partis ont un compte active
                        cc=connection.cursor()
                        cc.execute(quer)
                        employes=cc.fetchall()
                        json_data = []
                     
                        for objj in employes:
                           ch=NewUser.objects.filter(id=objj[13])
                           
                           if ch:
                              emailchef=str(ch.values()[0].get('email'))
                              
                              json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"email_chef":emailchef,"emailemploye":str(NewUser.objects.filter(id=objj[10]).values()[0].get('email')),"emailrh":emailrh,"idconge":objj[11],"etat_absrh":objj[12],"chef_id":objj[13],"rh_id":objj[14],"show":False,'chefid_grand':idchefgrand,'rhid_grand':idrhgrand,'emailchefgrand':str(NewUser.objects.filter(id=idchefgrand).values()[0].get('email'))})
                              
                        listEmployes.extend(list(json_data))
        return JsonResponse(listEmployes, safe=False)

class JoursFeriesList(generics.ListCreateAPIView):
    queryset=JourFerie.objects.all()
    serializer_class=JourFerieSerializer

class JourFeriéUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset=JourFerie.objects.all()
    serializer_class=JourFerieSerializer 

class ChartsParJourneeDynamique(APIView):
    def get(self, request, **kwargs):
        jsondata=[]
        ##users=NewUser.objects.values().all()
        jourtravai=0
        auth=0
        a=0
        mission=0
        conge=0
        absence=0
        motifs=motif_abs.objects.values().all()
        listchart=[]

        listids=request.query_params.getlist('id')[0].split(',')
        for u in listids:
            for single_date in daterange(datetime.datetime.strptime(kwargs['date1'],"%Y-%m-%d").date(), datetime.datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()):

                #e=Rapportunjour(int(u),str(single_date))
                a=Rapportunjour(int(u),str(single_date))

                if a:
                   jsondata.append({"motif":a[0]["motif"], "lateEntree":a[0]["lateEntree"]})
                     
                
        
        for objj in jsondata:
           
            if objj['motif']=='Authorisation':
               auth=auth+1
            if objj['motif'] =="Congé":
               conge=conge+1
                    
            if objj['motif']=="Absent" or objj["motif"]=="Absence justifié" or objj["motif"]=="Absence non justifié":
               absence=absence+1
         
                     
           
        if kwargs['nbaa']==str(True).lower():
           listchart.append({"name":"nombre jours des autorisations","nombre":auth})
        
        if kwargs['nbcc']==str(True).lower():
           listchart.append({"name":"nombre jours des congés","nombre":conge})
        if kwargs['nbabse']==str(True).lower():
           listchart.append({"name":"nombre jours des absences","nombre":absence})
      
          
    
        return JsonResponse(listchart,safe=False)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

def findDay(date):
    DayL = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
    day, month, year = (int(i) for i in date.split('-'))   
    dates = DayL[datetime.date(day, month, year ).weekday()]
      
    return (dates)
def compare(a, b):
    return (a > b) - (a < b)
def minute_interval(start, end):
     reverse = False
     if start > end:
          start, end = end, start
          reverse = True

     delta = (end.hour - start.hour)*60 + end.minute - start.minute 
     if reverse:
          delta = 24*60 - delta
     return delta
  

class Accueil(APIView):
  def get(self,request,pk):
    legendesemaine=[]
    idemploye=self.kwargs['pk']
    jsondata=[]
    end=datetime.datetime.now()-datetime.timedelta(days=1)
    start=end-datetime.timedelta(days=7)
    
    motifs=motif_abs.objects.values().all()
    
    for single_date in daterange(start.date(), end.date()):
        day=findDay(str(single_date))
        
        a=Rapportunjour(int(idemploye),str(single_date))
        
        
        if a:
           jsondata.append({"lateEntree":a[0]["lateEntree"],"motif":a[0]["motif"],"jourtravaille":a[0]['jourtravaille'],"date":str(single_date),"day":day})
       
    
    for obj in jsondata:
      if obj['motif']=="" or obj['motif']=="Pointage impair":
        present=1
        conge=0
        absent=0
        absencejustifie=0
        absencenonjustifie=0
        mission=0
        ferie=0
        authorisation=0
        repos=0
   
      elif obj['motif'] =="Congé":

        conge=1
        present=0
        absent=0
        absencejustifie=0
        absencenonjustifie=0
        authorisation=0
       
        ferie=0
      elif obj['motif']=="Absent" :
        absent=1
        conge=0
        present=0
        absencejustifie=0
        absencenonjustifie=0
        ferie=0
        repos=0
        authorisation=0
      elif obj["motif"]=="Absence justifié":
        absencejustifie=1
        absencenonjustifie=0
        conge=0
        present=0
        absent=0
        authorisation=0  
        repos=0 
        ferie=0
      elif obj["motif"]=="Absence non justifié":
        absencejustifie=0
        absencenonjustifie=1
        conge=0
        present=0
        absent=0
        authorisation=0 
        repos=0 
        ferie=0
      elif obj["motif"]=="Authorisation":
        absencejustifie=0
        absencenonjustifie=0
        conge=0
        present=0
        absent=0  
        authorisation=1  
        repos=0    
        ferie=0
      elif obj["motif"]=="Repos":
        absencejustifie=0
        absencenonjustifie=0
        conge=0
        present=0
        absent=0  
        authorisation=0
        repos=1
        ferie=0
      elif obj["motif"]=="Jour Ferié":
        absencejustifie=0
        absencenonjustifie=0
        conge=0
        present=0
        absent=0  
        authorisation=0
        repos=0
        ferie=1

      else:
        absent=1
        conge=0
        present=0
        absencejustifie=0
        absencenonjustifie=0
        authorisation=0
        repos=0
        ferie=0 

 
      legendesemaine.append({"absencejustifie":absencejustifie,"absencenonjustifie":absencenonjustifie,"absent":absent,"present":present,"conge":conge,"ferie":ferie,"repos":repos,"authorisation":authorisation,"date":obj['date'],"day":obj['day'],"idemploye":str(idemploye)})  
    return JsonResponse(legendesemaine,safe=False)  
      
     
class HistoriqueDemendesConges(APIView):
   def get(self, request,pk):
       
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.etat_abs,c.datedebut,c.datefin,n.solde,c.heure_debut,c.heure_fin,c.date_autorisation,c.etat_absrh,c.id,n.matricule,c.nbjours,c.justif FROM syspointage_newuser as n inner join syspointage_conges as c on c.employes_id=n.id  where c.etat_abs='confirmé par Dir' and n.id=%s"%idemploye)
       data = cursor.fetchall()
       json_data = []
       for obj in data:
           if obj[7] ==None:
               json_data.append({"user_name":obj[0],"etat_abs":obj[1],"datedebut":obj[2],"datefin":obj[3],"solde":obj[4],"heure_debut":obj[5],"heure_fin":obj[6],"date_autorisation":obj[7], "etat_absrh":obj[8],"idconge":obj[9],"matricule":obj[10],"nbjours":obj[11],"motif":True,"justif":obj[12]})
           else:
               json_data.append({"user_name":obj[0],"etat_abs":obj[1],"datedebut":obj[2],"datefin":obj[3],"solde":obj[4],"heure_debut":obj[5],"heure_fin":obj[6],"date_autorisation":obj[7], "etat_absrh":obj[8],"idconge":obj[9],"matricule":obj[10],"nbjours":obj[11],"motif":False})

       return JsonResponse(json_data, safe=False)
class AcceuilHistoriqueCongeparchef(APIView):
  def get(self, request, **kwargs):
        listEmployes=[]
       
        a=arborescence.objects.values().all()
        idarboresence=None
        
        for b in a:#parccourir la liste d'arboresence
           
            if(self.kwargs['pk']==b.get('chef_id')):#id id dans url de l'employé (front) égale à chef id of arboresence 
               
               idarboresence=b.get('id')
               
               #query pour parccourir la liste children of departement
               query = 'WITH RECURSIVE children (id) AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
              
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
               
               if data[1:]  == ():
                  
                  for obj in data:

                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh ,c.justif,c.nbjours,u.matricule from syspointage_conges as c inner join syspointage_newuser as u on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on ua.arborescence_id=a.id where ua.arborescence_id=%s  "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     
                    
                     for objj in employes:
                        if objj[6] == "confirmé par Dir":
                           
                                json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"idconge":objj[11],"etat_absrh":objj[12],"motif":True,"justif":objj[13],"nbjours":objj[14],"matricule":objj[15]})
                          
                     listEmployes.extend(list(json_data))
               else:
                  
                  for obj in data:
                     
                     quer="SELECT u.user_name,u.solde,c.datedebut,c.datefin,c.contact,c.adresse,c.etat_abs,c.heure_debut,c.heure_fin,c.date_autorisation,c.employes_id,c.id,c.etat_absrh,c.justif,c.nbjours,u.matricule from syspointage_conges as c inner join syspointage_newuser as u on u.id=c.employes_id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on ua.arborescence_id=a.id where ua.arborescence_id=%s  "%str(int(''.join(map(str, obj))))
                     #is_active=1 c'a dire emlpoyés non partis ont un compte active
                     cc=connection.cursor()
                     cc.execute(quer)
                     employes=cc.fetchall()
                     json_data = []
                     
                     for objj in employes:
                          if objj[6] == "confirmé par Dir":
                           
                                json_data.append({"user_name":objj[0],"solde":objj[1],"datedebut":objj[2],"datefin":objj[3],"contact":objj[4],"adresse":objj[5],"etat_abs":objj[6],"heure_debut":objj[7],"heure_fin":objj[8],"date_autorisation":objj[9],"iduser":objj[10],"id":objj[11],"idconge":objj[11],"etat_absrh":objj[12],"motif":True,"justif":objj[13],"nbjours":objj[14],"matricule":objj[15]})
                          
                     listEmployes.extend(list(json_data))
               return JsonResponse(listEmployes, safe=False)

        return JsonResponse(json_data, safe=False)

class HeuresDeTravailJours(APIView):
    def get(self,request,pk):
        idemploye=self.kwargs['pk']
        jsondata=[]
        end=datetime.datetime.now()-datetime.timedelta(days=1)
        start=end-datetime.timedelta(days=7)
    
        for single_date in daterange(start.date(), end.date()):
            cursor = connection.cursor()
            cursor.execute("""
             select heuretravail from syspointage_mintimeresponse where iduser=%s and date_pointage=%s;
             """,
            (idemploye,str(single_date)))
            e = cursor.fetchall()
            day=findDay(str(single_date))
            if e:
               
               jsondata.append({"heuretravail":int(float(e[0][0])// 60),"date":str(single_date),"day":day})
            else:#if il n'ya pas ni de poinatges ni absence niconge ni jour ferie alors absence non effectué
               jsondata.append({"heuretravail":"0.0","date":str(single_date),"day":day}) 
    
        return JsonResponse(jsondata,safe=False)
        



# compte le nombre de jours entre deux dates SQL aaaa-mm-jj
def difference_in_days(date1, date2):
  ymd_date_1 = datetime.datetime.strptime(str(date1),"%Y-%m-%d").date()
  
  ymd_date_2 = datetime.datetime.strptime(str(date2),"%Y-%m-%d").date()
 
  x=abs(ymd_date_1 - ymd_date_2).days 
  return  x +1
  
def get_iso_week_from_date(date):
    
    date = pd.to_datetime(date)
    return date.isocalendar()[1]    
def getDateRangeFromWeek(p_year,p_week):

   firstdayofweek = datetime.datetime.strptime(f'{p_year}-W{int(p_week )}-1', "%Y-W%W-%w").date()
   lastdayofweek = firstdayofweek + datetime.timedelta(days=6.9)
   return firstdayofweek, lastdayofweek 
  
class RapportSemaine(APIView):
    
      def get(self,request,**kwargs):
         d1=kwargs['date1']
         d2=kwargs['date2']
         
         listids=request.query_params.getlist('id')[0].split(',')
         
         listesemaines=[]
         jsondata=[]
         if( cache.get(d1) and cache.get(d2) and cache.get(jsondata) and cache.get(listesemaines)):
            
            d11=cache.get(d1)
            d22=cache.get(d2) 
            jd=cache.get(jsondata)
            ls=cache.get(listesemaines)
            return ls
         else:  
      
            ttzero=datetime.datetime.strptime("00:00:00","%H:%M:%S").time()
            j=0
            jj=0
            
            minuts=0.0
            presencesupl=0.0
            time_zero = datetime.datetime.strptime('00:00:00', '%H:%M:%S').time()
            presencenor=0.0
            comp=0
            
            m=''
            p=''
            sup=''
            for y in listids:
                  jsondata=[]#pour vider la liste a chaque employé
                  comp=0#pour intialliser le numero de semaine pour chaque employé
                 
                  ###########
                  numberweek1=datetime.datetime.strptime(d1,"%Y-%m-%d").isocalendar().week #get number of week1
                  ##print("week1",numberweek1)
                  years=datetime.datetime.strptime(d1,"%Y-%m-%d").isocalendar().year #get year of d1
                  numberweek2=datetime.datetime.strptime(d2,"%Y-%m-%d").isocalendar().week #get number of week2
                  ##print("week2",numberweek2)
                              
                        
                  j=0
                  jj=0
                  nbrjours=0
                  
                  for jj in range (numberweek1,numberweek2+1):
                     
                     tuples=list(getDateRangeFromWeek(years,jj))
                     
                     startweek=tuples[0]
                     endweek=tuples[1]
                     date_debut_semaine=startweek
                     date_fin_semaine=endweek
                     
                     if startweek < datetime.datetime.strptime(d1,"%Y-%m-%d").date():
                        date_debut_semaine=d1
                     if endweek >datetime.datetime.strptime(d2,"%Y-%m-%d").date():
                        date_fin_semaine =d2
      
                     for single_date in daterange(datetime.datetime.strptime((str(date_debut_semaine)),"%Y-%m-%d").date(), datetime.datetime.strptime((str(date_fin_semaine)),"%Y-%m-%d").date()):
                        
                        minuts=0.0
                        presencenor=0.0
                       
                        m=''
                        p=''
                        sup=''
                        a=Rapportunjour(int(y),str(single_date))
                        
                        if a:
                           jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"departant":a[0]["departant"]})  
                          
                     if jsondata :          
                        for i in range (len(jsondata)):
                           minuts=minuts+float(jsondata[i]['heuretravail'])
                           presencenor=presencenor+float(jsondata[i]['presencenormal'])
                        m=str(minutes_hours(minuts))
                        p=str(minutes_hours(presencenor))
                       
                        if (str(minutes_hours(40*60)) < str(m) ):
                           sup=str(minutes_hours(minuts - (40*60)))
                                
                     listesemaines.append({"user_name":str(NewUser.objects.filter(id=int(y)).values()[0].get('user_name')),"matricule":str(NewUser.objects.filter(id=int(y)).values()[0].get('matricule')),"presencereele":m,'presencenormal':p,'suplementaire':sup,'semaine':jj})
                     
                     jsondata=[]
                     jj=0
                     minuts=0.0
                     presencenor=0.0
                     presencesupl=0.0
                     m=''
                     p=''
                     sup=''
                    
            cache.set(
               listesemaines,jsondata
            ) 
            return JsonResponse(listesemaines, safe=False)  

def daterange(start_date, end_date):
    end=end_date+datetime.timedelta(days=1)#to get the last date (date2)
  
    for n in range(int ((end - start_date).days)):
        yield start_date + timedelta(n)  

def Timerange(start_Time, end_Time):
   
    for n in range(int ((end_Time.hour - start_Time.hour))+1):
        yield (start_Time -datetime.datetime.strptime('00:00:00', '%H:%M:%S') +datetime.datetime.strptime("%s:00:00"%n,'%H:%M:%S')).time()

def SearchPlaning(d1,json_data):
    #print('ee',json_data)
    for i in range (len(json_data)):
        
        dateplaning1=planning.objects.filter(id=json_data[i]['idplaning']).values().all()[0]['start']
        dateplaning2=planning.objects.filter(id=json_data[i]['idplaning']).values().all()[0]['end']
        if dateplaning1<=datetime.datetime.strptime(d1,'%Y-%m-%d').date()<=dateplaning2:
           return json_data[i]['idplaning']
    return False


#cette fonction retourne le présence normale elle est appellé dans la fonction rapportjour
def searchDay(day,idemp,idplaning):
    a=planning.objects.select_related('plantravail').filter(id=idplaning).values().all()
    c=plansemaine.objects.filter(id=a[0].get('plantravail_id')).values().all() 
    dayy=findDay(str(day))
    if(dayy=='Lundi'):
      lu=horairejour.objects.filter(id=c[0].get('lundi_id')).all()
      if lu :#si il'ya un horaire dans le tabelau plan semaine
         print('lu',lu)
         return [lu[0],lu[0].debutentree,lu[0].finentree,lu[0].debutsortie,lu[0].finsortie,lu[0].debutpause,lu[0].finpause,lu[0].debut,lu[0].fin,lu[0].margeretard,lu[0].margedepartant,lu[0].margeheuresupp]
      else: 
         return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

    elif(dayy=='Mardi'):
      ma=horairejour.objects.filter(id=c[0].get('mardi_id')).all() 
      if ma:
        
         return [ma[0],ma[0].debutentree,ma[0].finentree,ma[0].debutsortie,ma[0].finsortie,ma[0].debutpause,ma[0].finpause,ma[0].debut,ma[0].fin,ma[0].margeretard,ma[0].margedepartant,ma[0].margeheuresupp]
      else:
         return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

    elif(dayy=='Mercredi'):
      me=horairejour.objects.filter(id=c[0].get('mercredi_id')).all()  
      if me:
         return [me[0],me[0].debutentree,me[0].finentree,me[0].debutsortie,me[0].finsortie,me[0].debutpause,me[0].finpause,me[0].debut,me[0].fin,me[0].margeretard,me[0].margedepartant,me[0].margeheuresupp]
      else:
         return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

         
    elif(dayy=='Jeudi'):
      je=horairejour.objects.filter(id=c[0].get('jeudi_id')).all()
      if je:
         return [je[0],je[0].debutentree,je[0].finentree,je[0].debutsortie,je[0].finsortie,je[0].debutpause,je[0].finpause,je[0].debut,je[0].fin,je[0].margeretard,je[0].margedepartant,je[0].margeheuresupp]
      else:
         return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

    elif(dayy=='Vendredi'):
      ve=horairejour.objects.filter(id=c[0].get('vendredi_id')).all()
      if ve:
         
         return [ve[0],ve[0].debutentree,ve[0].finentree,ve[0].debutsortie,ve[0].finsortie,ve[0].debutpause,ve[0].finpause,ve[0].debut,ve[0].fin,ve[0].margeretard,ve[0].margedepartant,ve[0].margeheuresupp]
      else:
      
        return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

    elif(dayy=='Samedi'):
      sa=horairejour.objects.filter(id=c[0].get('samedi_id')).all()
      if sa:
         return [sa[0],sa[0].debutentree,sa[0].finentree,sa[0].debutsortie,sa[0].finsortie,sa[0].debutpause,sa[0].finpause,sa[0].debut,sa[0].fin,sa[0].margeretard,sa[0].margedepartant,sa[0].margeheuresupp]
      else:
        return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

    elif(dayy=='Dimanche'):#il va calculer le rapport si et seulement si il a un horaire en dimanche
      di=horairejour.objects.filter(id=c[0].get('dimanche_id')).all() 
      if di:
         return [di[0],di[0].debutentree,di[0].finentree,di[0].debutsortie,di[0].finsortie,di[0].debutpause,di[0].finpause,di[0].debut,di[0].fin,di[0].margeretard,di[0].margedepartant,di[0].margeheuresupp]
      else:
         return ["00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00","00:00:00"]

def Dayjour(debutentree,debutpause,finpause,debut,sortie,retard,marge_anticipe,margeheuresupp,ttzero,earlyEntreef,earlySortief,lateSortief,username,matricul,datepoint,nomplannigf,iduserf,heuree,heures,deficitf,idemploye,motifplannigf,idpointf,listpointttttf,listepointages):
      listerapport=[]
      listedepointages=[]
      pointagest=[]
      jourtravaille=0
      heuresnuit=0.0
      lateEntree=0.0
      abse_normale_moins_travail=0.0

      departant=0.0
      
      pausenoramle=minute_interval(ttzero,datetime.datetime.strptime(str(finpause),'%H:%M:%S').time())-minute_interval(ttzero,datetime.datetime.strptime(str(debutpause),'%H:%M:%S').time())
      travailpause=abs(datetime.datetime.combine(date.min, finpause)-datetime.datetime.combine(date.min, debutpause))
      presence=minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time())-minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time())
      pr=presence-pausenoramle
      presencenormale=str(pr)

      heureeffective=datetime.timedelta(hours=0)

      hi=0

      for i in range (0,len(listepointages)-1,2):#pas =2

         entreepoint=listepointages[i]
         
         
         sortiepoint=listepointages[i+1]
         

         if minute_interval(ttzero,datetime.datetime.strptime(str(debutentree),'%H:%M:%S').time()) < minute_interval(ttzero,datetime.datetime.strptime(str(entreepoint),'%H:%M:%S').time()) < (minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time())+ retard) or (minute_interval(ttzero,datetime.datetime.strptime(str(debutentree),'%H:%M:%S').time()) > minute_interval(ttzero,datetime.datetime.strptime(str(entreepoint),'%H:%M:%S').time()) ) :    
            entreepoint=debut
         else:
            entreepoint=entreepoint
         if (minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()) + marge_anticipe ) < minute_interval(ttzero,datetime.datetime.strptime(str(sortiepoint),'%H:%M:%S').time()) < (minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time())+ margeheuresupp)  : 
            sortiepoint=sortie
         else:
            sortiepoint=sortiepoint
         if minute_interval(ttzero,datetime.datetime.strptime(str(entreepoint),'%H:%M:%S').time()) > (retard+minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time())):
            
            late=minute_interval(ttzero,datetime.datetime.strptime(str(entreepoint),'%H:%M:%S').time())-(minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time()))
            lateEntree=str(late)
      
         if minute_interval(ttzero,datetime.datetime.strptime(str(sortiepoint),'%H:%M:%S').time()) < (minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()) - marge_anticipe):
            
            ant=minute_interval(ttzero,datetime.datetime.strptime(str(sortiepoint),'%H:%M:%S').time())-(minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()))
            departant=str(abs(ant))
         if(entreepoint<debutpause and sortiepoint>finpause):
            jourtravaille=1  
         listedepointages.append(datetime.datetime.strptime(str(entreepoint), '%H:%M:%S').time())
            
         listedepointages.append( datetime.datetime.strptime(str(sortiepoint) ,"%H:%M:%S").time())
         pointagest=' '.join([str(elem) for elem in listedepointages])
        
         diffsortieentree=abs(datetime.datetime.combine(date.min, sortiepoint)-datetime.datetime.combine(date.min, entreepoint)-travailpause)
         hi=hi+minute_interval(ttzero, datetime.datetime.strptime(str(diffsortieentree),"%H:%M:%S").time())


         heureeffective=hi
            
         if pr>heureeffective:
            abse_normale_moins_travail=pr-heureeffective#minutes d'absence si l'employé travaille puis sortie (théorique-pratique)
         if heureeffective>=pr and sortie==(" 22:00:00"):
            heuresnuit = minute_interval(ttzero,datetime.datetime.strptime(str("01:00:00"),'%H:%M:%S').time())
         

         
         pause=minute_interval(ttzero,datetime.datetime.strptime(str(finpause),'%H:%M:%S').time())-minute_interval(ttzero,datetime.datetime.strptime(str(debutpause),'%H:%M:%S').time())
         pau=str(pause)

         listerapport.append({"motif":"","Entree":entreepoint,"Sortie":sortiepoint,"earlyEntree":earlyEntreef,"lateEntree":lateEntree,"earlySortie":earlySortief,"lateSortie":lateSortief,"user_name":username,"matricule":matricul,"date_pointage":str(datepoint),"planing":nomplannigf,"heuretravail":str(heureeffective),"pause":pau,"presencenormal":presencenormale,"jourtravaille":jourtravaille,"iduser":iduserf,"entreepointage":heuree,"sortiepointage":heures,"heureauthorisation":"0","deficit":deficitf,"iduser":idemploye,"pointages":pointagest,"tempabsence":abse_normale_moins_travail,"jourconge":"0","tempsMission":"0.0","heuresnuits":str(heuresnuit),"motifplaning":motifplannigf,"departant":departant,"idpoint":idpointf,"listp":listpointttttf})
      
         return listerapport
def Daynuit(debutentree,finentree,debutsortie,finsortie,debutpause,finpause,debut,sortie,retard,marge_anticipe,margeheuresupp,ttzero,pou,username,matricule,datepoint,nomplannigf,iduserf,idemploye,motifplannig,idpointf,listpointttttf,listepointages):
  
    listedepointage=[]
    listerapport=[]
    pointagesnuit=[]
    jourtravaille=0
    heuresnuit=0.0
    lateEntree=0.0
    abse_normale_moins_travail=0.0
    departant=0.0
    tt=0.0
    pt_entree_s=datetime.datetime.strptime("23:59:59","%H:%M:%S").time()
    pt_sortie_s=datetime.datetime.strptime("23:59:59","%H:%M:%S").time()
    
    pausenoramle=minute_interval(ttzero,datetime.datetime.strptime(str(finpause),'%H:%M:%S').time())-minute_interval(ttzero,datetime.datetime.strptime(str(debutpause),'%H:%M:%S').time())
    travailpause=abs(datetime.datetime.combine(date.min, finpause)-datetime.datetime.combine(date.min, debutpause))

    presence=(minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()) + 1440)-minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time())
    pr=presence-pausenoramle
    presencenormale=str(pr)
   
    if listepointages!=[] and pou['date_pointage__min']!=None :
      
      if str(debutsortie) < str(pou['date_pointage__min']).split()[1] < str(finsortie) :
         pt_sortie_s=str(pou['date_pointage__min']).split()[1]
        
      if debutentree < max(listepointages) < finentree :
         pt_entree_s=max(listepointages)
         
         if minute_interval(ttzero,datetime.datetime.strptime(str(debutentree),'%H:%M:%S').time()) < minute_interval(ttzero,datetime.datetime.strptime(str(pt_entree_s),'%H:%M:%S').time()) < (minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time())+ retard) or (minute_interval(ttzero,datetime.datetime.strptime(str(debutentree),'%H:%M:%S').time()) > minute_interval(ttzero,datetime.datetime.strptime(str(pt_entree_s),'%H:%M:%S').time())) :    

            pt_entree_s=debut
         else:
            
            pt_entree_s=pt_entree_s

         if (minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()) - marge_anticipe ) < minute_interval(ttzero,datetime.datetime.strptime(str(pt_sortie_s),'%H:%M:%S').time()) < (minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time())+ margeheuresupp)  : 
            pt_sortie_s=sortie
         else:
            pt_sortie_s=pt_sortie_s
         
         if minute_interval(ttzero,datetime.datetime.strptime(str(pt_entree_s),'%H:%M:%S').time()) > (retard+minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time())):
      
            late=minute_interval(ttzero,datetime.datetime.strptime(str(pt_entree_s),'%H:%M:%S').time())-(minute_interval(ttzero,datetime.datetime.strptime(str(debut),'%H:%M:%S').time()))
            lateEntree=str(late)
      
         if minute_interval(ttzero,datetime.datetime.strptime(str(pt_sortie_s),'%H:%M:%S').time()) < (minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()) - marge_anticipe):
            
            ant=minute_interval(ttzero,datetime.datetime.strptime(str(pt_sortie_s),'%H:%M:%S').time())-(minute_interval(ttzero,datetime.datetime.strptime(str(sortie),'%H:%M:%S').time()))
            departant=str(abs(ant))
         if(pt_entree_s<debutpause and pt_sortie_s>finpause):
               jourtravaille=1
            #####
         
         listedepointage.append(datetime.datetime.strptime(str(pt_entree_s), '%H:%M:%S').time())
         
         listedepointage.append( datetime.datetime.strptime(str(pt_sortie_s) ,"%H:%M:%S").time())
         pointagesnuit=' '.join([str(elem) for elem in listedepointage])
         tt = (minute_interval(ttzero, datetime.datetime.strptime(str(pt_sortie_s) ,"%H:%M:%S").time())+1440)-minute_interval(ttzero, datetime.datetime.strptime(str(pt_entree_s), '%H:%M:%S').time())- pausenoramle
        
         if (( finentree>pt_entree_s > debutentree )and ( debutsortie<pt_sortie_s <finsortie)):

            listerapport.append({"motif":"","Entree":pt_entree_s,"Sortie":pt_sortie_s,"earlyEntree":"0.0","lateEntree":lateEntree,"earlySortie":"0.0","lateSortie":"0.0","user_name":username,"matricule":matricule,"date_pointage":str(datepoint),"planing":nomplannigf,"heuretravail":str(tt),"pause":"0.0","presencenormal":presencenormale,"jourtravaille":"1","iduser":iduserf,"entreepointage":"00:00:00","sortiepointage":"00:00:00","heureauthorisation":"0.0","deficit":"0.0","iduser":idemploye,"pointages":pointagesnuit,"tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","heuresnuits":"0.0","motifplaning":motifplannig,"departant":departant,"idpoint":idpointf,"listp":listpointttttf})   
            
            return listerapport

def Rapportunjour(idemploye,d1):
    json_data=[]
    listerapport=[]
    listepointages=[]  
    rapwithabsence=[]
    rapportwithauthorisaton=[]

    if cache.get(idemploye) and cache.get(d1) and cache.get(json_data) and cache.get(listerapport):
        emp=cache.get(idemploye)
        d11=cache.get(d1)  
        rap=cache.get(listerapport)
        js=cache.get(listerapport)
        return js
       
    else: 
      
       
        user=NewUser.objects.filter(id=idemploye).values().all()
        
        nomplannig=''
        heureauthorisation=0
       
        listauthorisation=[]
        listab=[]
        listj=[]
        lista=[]
        listrepos=[]
        listJour=[]
        compautorisation=0  
        listconges=[]
        listabsences=[]
        lista=[]
        motifplannig='' 
        listJour=[]
        nbpointages=0
         
        rap=[]
        rapportwwithconges=[]
        rapportwithjourferi=[]
        ###si nya pas pointage 
        listaidplanings=[]
        
        cc=connection.cursor()
        requeteidsplannings='SELECT  pl.id,u.id FROM syspointage_newuser as u inner join syspointage_newuser_planningemp as pu on  pu.newuser_id=u.id and u.id=%s   inner join  syspointage_planning as pl  on pl.id=pu.planning_id ' %(idemploye)
        cc.execute(requeteidsplannings)
        ra = cc.fetchall()

        for p in ra:
           listaidplanings.append({"idplaning":p[0]})
        
        cursor = connection.cursor()
        query="SELECT  u.user_name , u.matricule , p.date_pointage , poin.nom_pointeuse,pla.title,p.date_pointage,pla.id,u.id,p.id FROM ((syspointage_pointage as p INNER JOIN syspointage_newuser as u ON p.employes_id = u.id)LEFT join syspointage_newuser_planningemp as pu on pu.newuser_id=u.id  LEFT join syspointage_planning as pla on pla.id=pu.planning_id LEFT JOIN syspointage_pointeuse as poin ON p.pointeuse_id= poin.id) where u.id= %s and CONVERT(p.date_pointage, DATE)='%s'  order by date_pointage" %(idemploye,d1)
        cursor.execute(query)
        r = cursor.fetchall()
        for obj in r:
            json_data.append({"user_name":obj[0],"matricule":obj[1],"date_pointage":obj[2].date(),"nom_pointeuse":obj[3],"planing":obj[4],"heure":datetime.datetime.strptime(str(obj[5].time()).split('.')[0],"%H:%M:%S").time(),'idplaning':obj[6],"iduser":obj[7],"idpoint":obj[8]})
        ttzero=datetime.datetime.strptime("00:00:00","%H:%M:%S").time()
        
        testplaning=SearchPlaning(d1,listaidplanings)  
        if testplaning!=False:
    
           motifplannig=planning.objects.filter(id=testplaning).values()[0].get('motif')

           nomplannig=planning.objects.filter(id=testplaning).values()[0].get('title') 
           serachdayfun=searchDay(d1,idemploye,testplaning)
           presencenormalsearch=str(serachdayfun[0])
           debutentreesearch=serachdayfun[1]
           finentreesearch=serachdayfun[2]
           debutsortieser=serachdayfun[3]
           finsortieser=serachdayfun[4]
           debutpauseser=serachdayfun[5]
           finpauseserc=serachdayfun[6]
           debutserc=serachdayfun[7]
           finserc=serachdayfun[8]
           retardser=float(serachdayfun[9])
           depanticiserc=float(serachdayfun[10])
           margesuppserc=float(serachdayfun[11])

        conge=Conges.objects.filter(employes=idemploye).values().all()
        abse=absence.objects.filter(employes=idemploye).values().all()
        JourFeriess=JourFerie.objects.values().all()
        
        for c in conge:
            if c.get('date_autorisation') == None:
               if( c.get('etat_abs')=="confirmé par Dir") or ((c.get('etat_absrh')=="confirmé par rh") and (c.get('etat_abs')=="refusé par Dir")):
                  listconges.append({"datedebut":c.get('datedebut'),"datefin":c.get('datefin'),"etat_abs":c.get('etat_abs'),"etat_absrh":c.get('etat_absrh') ,"justif":c.get('justif'),"adresse":c.get('adresse'),"contact":c.get('contact'),"nbjours":c.get('nbjours')})

            else:
               if( c.get('etat_abs')=="confirmé par Dir") or ((c.get('etat_absrh')=="confirmé par rh") and (c.get('etat_abs')=="refusé par Dir")):

                   diffeabsence=(datetime.datetime.strptime(str(c.get('heure_fin')),'%H:%M:%S').hour *60 - datetime.datetime.strptime(str(c.get('heure_debut')),'%H:%M:%S').hour *60)+(datetime.datetime.strptime(str(c.get('heure_fin')),'%H:%M:%S').minute-datetime.datetime.strptime(str(c.get('heure_debut')),'%H:%M:%S').minute)
                   dd=str(diffeabsence)
                   listauthorisation.append({"date_authorisation":c.get('date_autorisation'),"heureauthorisation":dd,"etat_abs":c.get('etat_abs'),"etat_absrh":c.get('etat_absrh') ,"justif":c.get('justif'),"adresse":c.get('adresse'),"contact":c.get('contact')})

        for abb in abse:
            if abb.get('justifie')==False:
               listabsences.append({"datedebut":str(abb.get('datedebut').date()),"datefin":str(abb.get('datefin').date()),"timestart":abb.get("datedebut").time(),"timeend":abb.get("datefin").time(),"datetimedebut":abb.get('datedebut'),"datetimefin":abb.get('datefin'),"justifie":False})
            else:
               listabsences.append({"datedebut":str(abb.get('datedebut').date()),"datefin":str(abb.get('datefin').date()),"timestart":abb.get("datedebut").time(),"timeend":abb.get("datefin").time(),"datetimedebut":abb.get('datedebut'),"datetimefin":abb.get('datefin'),"justifie":True})

        for jo in JourFeriess:
               listJour.append({"datedebut":str(jo.get('date').date()),"datefin":str(jo.get('datefin').date())})
         
        for i in range (len(listconges)):

               for single_date in daterange(listconges[i].get('datedebut'), listconges[i].get('datefin')):
                   lista.append(str(single_date))
         
        for i in range (len(listabsences)):
           
            if listabsences[i]["justifie"]==False:
               for single_date in daterange(datetime.datetime.strptime(listabsences[i].get('datedebut'),"%Y-%m-%d").date(), datetime.datetime.strptime(listabsences[i].get('datefin'),"%Y-%m-%d").date()):
                  #ze=datetime.datetime.strptime(listabsences[i].get('datetimefin'), '%Y-%m-%d %H:%M:%S')-datetime.datetime.strptime(listabsences[i].get('datetimedebut'), '%Y-%m-%d %H:%M:%S')
                  
                  listab.append({"dateabsence":str(single_date),"timestart":listabsences[i]["timestart"],"timeend":listabsences[i]["timeend"],"justifie":False,"datetimedebut":listabsences[i]["datetimedebut"],"datetimefin":listabsences[i]["datetimefin"]})
                  
            else:
               for single_date in daterange(datetime.datetime.strptime(listabsences[i].get('datedebut'),"%Y-%m-%d").date(), datetime.datetime.strptime(listabsences[i].get('datefin'),"%Y-%m-%d").date()):
                  #ze=datetime.datetime.strptime(listabsences[i].get('datetimefin'), '%Y-%m-%d %H:%M:%S')-datetime.datetime.strptime(listabsences[i].get('datetimedebut'), '%Y-%m-%d %H:%M:%S')
                  
                  listab.append({"dateabsence":str(single_date),"timestart":listabsences[i]["timestart"],"timeend":listabsences[i]["timeend"],"justifie":True,"datetimedebut":listabsences[i]["datetimedebut"],"datetimefin":listabsences[i]["datetimefin"]})
                  

        for i in range (len(listJour)):
            for single_date in daterange(datetime.datetime.strptime(listJour[i].get('datedebut'),"%Y-%m-%d").date(), datetime.datetime.strptime(listJour[i].get('datefin'),"%Y-%m-%d").date()):
                  listj.append(str(single_date))
                  ##print('jour ferier list',listj)

        
        if testplaning!=False:
         
            
            
            if json_data:
            
                  early=0.0
                  rapImpair=[]
                  listMission=[]
                  nbpointages=0
                  
                  rapsais=[]
                  tempabsence=0.0
                  abse_normale_moins_travail=0.0
                  
                  heureauthorisation=0
                  compautorisation=0
                  arrondi_deficit_absence=0.0
                  ##json_data!=1 pour verifier qu il n'y a pas ue seule pointage 
                  ##jour n'est pas en conge ou jour ferie ou absence confirmé     
                  if json_data: #concatiner la liste de conge et absence  
                     #remplir tous les pointages dans une liste 
               
                     dayofpointage=findDay(str(json_data[0]['date_pointage']))
                     earlyEntree=0.0
                     earlySortie=0.0
                     lateEntree=0.0
                     lateSortie=0.0
                     departant=0.0
                     heuretravail=0.0
                     heuretravailnuit=0.0
                     deficit=0.0
                     tt=0.0
                     presencenormal=0.0
                     heures_suppparj=0.0
                     lis=[]
                     listtest=[]
                     rapImpair=[]
                     
                     diff=0.0
                     pointagesnuit= ''
                    
                     heuresnuit=0.0
                  
                     jourtravaille=0
                     travailpause=datetime.timedelta(hours=0)
                     
                     listepointages=[]
                     listep=[]
                     listpointtttt=[]
                     heureeffective=0.0
                     listpointttttn=[]
                     
                     pointagejoursuivant=pointage.objects.values().filter(employes=idemploye,date_pointage__date=(datetime.datetime.strptime(str(d1),"%Y-%m-%d") + timedelta(days=1)).date()).all()
                     
                    
                     pou=pointagejoursuivant.aggregate(Min('date_pointage'))

                     
                     for obj in json_data:
                           listep.append(obj["heure"])
                           listpointtttt.append({"heure":json_data[0]['heure'],"idpoint":json_data[0]['idpoint'],"date_pointage":json_data[0]['date_pointage']})
                     
                     if listep:
                        if (len(listep))!=1:
                           for i in range (0,len(listep)-1):
               
                     
                              if not minute_interval(ttzero,datetime.datetime.strptime(str(listep[i+1]),'%H:%M:%S').time()) -minute_interval(ttzero,datetime.datetime.strptime(str(listep[i]),'%H:%M:%S').time())<= minute_interval(ttzero,datetime.datetime.strptime("02:00:00",'%H:%M:%S').time()) :                     
                                 #print('ok')
                        
                                 listepointages.append(listep[i])
                           listepointages.append(listep[-1]) 
                           
                        else:
                           listepointages.append(listep[0]) 
                           
                     pointages=' '.join(str(e) for e in listepointages)#transformer la liste de pointages en string pour l'afficher       
                     nbpointages=len(listepointages) 
                     entreepointage=listepointages[0]
                     sortiepointage=listepointages[-1]
                    
                     if(dayofpointage=='Lundi' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:

                           print('ddddd')
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                           
                     elif(dayofpointage=='Mardi' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)

                     elif(dayofpointage=='Mercredi' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)

                     elif(dayofpointage=='Jeudi' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)

                     elif(dayofpointage=='Vendredi' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)

                     elif(dayofpointage=='Samedi' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)

                     elif(dayofpointage=='Dimanche' and presencenormalsearch):
                        if motifplannig== "jour":

                           listerapport= Dayjour(debutentreesearch,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,earlyEntree,earlySortie,lateSortie,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],json_data[0]['heure'],json_data[-1]['heure'],deficit,idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)
                        else:
                           listerapport= Daynuit(debutentreesearch,finentreesearch,debutsortieser,finsortieser,debutpauseser,finpauseserc,debutserc,finserc,retardser,depanticiserc,margesuppserc,ttzero,pou,json_data[0]['user_name'],json_data[0]['matricule'],json_data[0]['date_pointage'],nomplannig,json_data[0]['iduser'],idemploye,motifplannig,json_data[0]['idpoint'],listpointtttt,listepointages)

            listtotal=[]
            

            listtotal.append({"motif":"","Entree": "00:00:00", "Sortie": "00:00:00" ,"earlyEntree": "0.0", "lateEntree": "0.0", "earlySortie": "0.0", "lateSortie": "0.0", "user_name": user[0]['user_name'], "matricule":user[0]['matricule'], "date_pointage": d1, "planing":"", "heuretravail": "0.0", "pause": "0.0", "presencenormal":str(minute_interval(ttzero,datetime.datetime.strptime(presencenormalsearch,'%H:%M:%S').time())), "jourtravaille": 0,"iduser":idemploye,"entreepointage":"00:00:00","sortiepointage":"00:00:00","heureauthorisation":"0.0","deficit":"0.0","iduser":idemploye,"pointages":"","tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","heuresnuits":"0.0","motifplaning":motifplannig,"departant":"0.0","idpoint":"","listp":[]})
          
            for aut in listauthorisation:
                  if d1 in str(datetime.datetime.strptime(str(aut['date_authorisation']),"%Y-%m-%d").date()) and presencenormalsearch!="00:00:00":  
                     if listerapport:
                        listerapport[0]['heureauthorisation']=aut['heureauthorisation']
                        listerapport[0]['motif'] ="Authorisation"
                        return listerapport
                     else:
                        listtotal[0]['motif']="Authorisation"
                        return listtotal

            for a in listab:    
                        
                  if d1 in str(a["dateabsence"]) and presencenormalsearch!="00:00:00":
                     if d1 ==str(a["datetimedebut"].date()):
                        if d1==str(a["datetimefin"].date()):
                           
                           tempabsence=minute_interval(a['timestart'],a['timeend'])
                           
                        else:
                           tempabsence=24*60-minute_interval(ttzero,a['timestart'])
                           
                     elif d1== str(a["datetimefin"].date()):
                        if d1!=str(a["datetimedebut"].date()):
                           tempabsence=minute_interval(ttzero,a["timeend"])
                           

                     if a["justifie"]==False:
                        if listerapport:#if employé  absent mais il travaille
                           listerapport[0]['tempabsence']=str(tempabsence)
                           listerapport[0]['motif'] ="Absence non justifié"
                           return listerapport
                        else:
                           listtotal[0]['motif'] ="Absence non justifié"
                           return listtotal
                     else:
                        if listerapport:#if employé  absent mais il travaille
                           listerapport[0]['tempabsence']=str(tempabsence)
                           listerapport[0]['motif'] ="Absence justifié"
                           return listerapport
                        else:
                           listtotal[0]['motif'] ="Absence justifié"
                           return listtotal
         
            if(nbpointages % 2 !=0) and motifplannig == "jour" :
               if listepointages:
                if presencenormalsearch!="00:00:00":
                     if listerapport:
                        listerapport[0]['pointages'] =pointages
                        listerapport[0]['motif'] ="Pointage impair"
                        return listerapport
                     else :
                        listtotal[0]['listp']=listpointtttt
                        listtotal[0]['pointages'] =pointages
                        listtotal[0]['motif'] ="Pointage impair"
                        return listtotal

            if d1 in listj:
              
               if presencenormalsearch!="00:00:00":
                  if listerapport:#if employé en jour ferié mais il travaille
                     
                     listerapport[0]['motif'] ="Jour Ferié"
                     return listerapport
                  else:
                     listtotal[0]['heuretravail'] = minute_interval(ttzero,datetime.datetime.strptime(str(presencenormalsearch),'%H:%M:%S').time())
                     listtotal[0]['motif'] ="Jour Ferié"
                     return listtotal
            
            elif d1 in lista :
               if presencenormalsearch!="00:00:00":#quand l'employé passe congé de jeudi au lundi par exple ,dimanche et samedi ne sont pas congés=>liste vide
                  if listerapport :#if employé en congé validé mais il travaille
                    
                     listerapport[0]['motif'] ="Congé"
                     return listerapport
                  else:
                     listtotal[0]['heuretravail'] = minute_interval(ttzero,datetime.datetime.strptime(str(presencenormalsearch),'%H:%M:%S').time())
                     listtotal[0]['motif']="Congé"
                     return listtotal
             
            else:
               listpointttttn=[]
               listpointtttt=[]
               
               if presencenormalsearch!="0:00:00":
                   
                  if listerapport:#si il y'a pointages
                           
                     return listerapport
                  else:
                      if motifplannig == "jour":
                        listtotal[0]['motif']="Absent"
                        return listtotal
                      else:
                           
                           pointagejoursuivant=pointage.objects.values().filter(employes=idemploye,date_pointage__date=(datetime.datetime.strptime(str(d1),"%Y-%m-%d") + timedelta(days=1)).date()).all()
                           pou=pointagejoursuivant.aggregate(Min('date_pointage'))
                          
                           if ( (listepointages)!=[] and pou['date_pointage__min']!=None ):
                             
                              if (debutentreesearch > max(listepointages) and  str(pou['date_pointage__min']).split()[1]  > str(finsortieser)) :
                                 listtotal[0]['motif']="Absent"
                                 return listtotal
                           

                           if (listepointages)!=[] :
                              if(debutentreesearch < max(listepointages) < finentreesearch ) :
                                 pt_entree_s=max(listepointages)
                               
                                 listtotal[0]['motif']="Pointage impair"
                                 listtotal[0]['Entree']=pt_entree_s
                                 listtotal[0]['pointages']=pt_entree_s
                                 listtotal[0]['listp']=listpointtttt
                                 return listtotal
                                
                              elif( pou['date_pointage__min']!=None )  :
                                 pt_sortie_s=str(pou['date_pointage__min']).split()[1]
                                 listpointttttn.append({"idpoint":pointagejoursuivant[0]['id'],"heure":str(pou['date_pointage__min']).split()[1],"date_pointage":str(d1)})

                                 listtotal[0]['motif']="Pointage impair"
                                 listtotal[0]['Sortie']=pt_sortie_s
                                 listtotal[0]['pointages']=pt_sortie_s
                                 listtotal[0]['listp']=listpointttttn
                                 return listtotal
                             
                              else:

                                 listtotal[0]['motif']="Absent"
                                 return listtotal
                           else:
                              if pou['date_pointage__min']!=None:
                                 if str(pou['date_pointage__min']).split()[1]  > str(debutentreesearch):
                                    listtotal[0]['motif']="Absent"
                                    return listtotal
                                 else:
                              
                                    pt_sortie_s=str(pou['date_pointage__min']).split()[1]
                                    listpointttttn.append({"idpoint":pointagejoursuivant[0]['id'],"heure":str(pou['date_pointage__min']).split()[1],"date_pointage":str(d1)})

                                    listtotal[0]['motif']="Pointage impair"
                                    listtotal[0]['Sortie']=pt_sortie_s
                                    listtotal[0]['pointages']=pt_sortie_s
                                    listtotal[0]['listp']=listpointttttn
                                    return listtotal
                            
                              else:

                                 listtotal[0]['motif']="Absent"
                                 return listtotal

                             
                           
                              

               else:
                  listtotal[0]['motif']="Repos"
                  listtotal[0]['presencenormal']="0.0"
                  return listtotal
                
                     
        else:
         entreepoint=''
         sortiepoint=''
         listepointages=[]
         listep=[]
         listpointtttt=[]
         heureeffective=0.0
         
         for obj in json_data:
            listep.append(obj["heure"])
      
         if listep:
            if (len(listep))!=1:
               for i in range (0,len(listep)-1):
   
         
                  if not minute_interval(ttzero,datetime.datetime.strptime(str(listep[i+1]),'%H:%M:%S').time()) -minute_interval(ttzero,datetime.datetime.strptime(str(listep[i]),'%H:%M:%S').time())<= minute_interval(ttzero,datetime.datetime.strptime("02:00:00",'%H:%M:%S').time()) :                     
                     #print('ok')
            
                     listepointages.append(listep[i])
               listepointages.append(listep[-1]) 
               
            else:
               listepointages.append(listep[0]) 
               
         pointages=' '.join(str(e) for e in listepointages)#transformer la liste de pointages en string pour l'afficher       
         nbpointages=len(listepointages) 
         
         heureeffective=datetime.timedelta(hours=0)
         hi=0
         for i in range (0,len(listepointages)-1,2):#pas =2
                       
            entreepoint=listepointages[i]
            
            sortiepoint=listepointages[i+1]
 
            diffsortieentree=abs(datetime.datetime.combine(date.min, sortiepoint)-datetime.datetime.combine(date.min, entreepoint))
            hi=hi+minute_interval(ttzero, datetime.datetime.strptime(str(diffsortieentree),"%H:%M:%S").time())
         heureeffective=hi
         listerapport.append({"motif":"Pas de Pointage","Entree": entreepoint, "Sortie": sortiepoint,"earlyEntree": "0.0", "lateEntree": "0.0", "earlySortie": "0.0", "lateSortie": "0.0", "user_name": user[0]['user_name'], "matricule":user[0]['matricule'], "date_pointage": d1, "planing":"", "heuretravail": str(heureeffective),"pause": "0.0", "presencenormal": "0.0", "jourtravaille": 0,"heurenuit":"00:00:00","heurenuitmajoree":0,"iduser":idemploye,"entreepointage":entreepoint,"sortiepointage":sortiepoint,"heureauthorisation":"0.0","deficit":"0.0","iduser":idemploye,"pointages":pointages,"tempabsence":"0.0","jourconge":"1","tempsMission":"0.0","heuresnuits":"0.0","motifplaning":"","departant":"0.0","idpoint":"0.0","listp":[]})
         
         return listerapport
  
class  RapportAnomalie(APIView):
   def get(self, request,**kwargs):
      listAnomalie=[]
      listids=request.query_params.getlist('id')[0].split(',')
      
      d1=kwargs['date1']
      d2=kwargs['date2']    
      json_data=[]
      listc=[]
      listbb=[]
      liste=[]#liste entre 2 dates 
      datecongesconfirme=[]  
      listauth=[]

      jsondata=[]
      if  cache.get(d1) and cache.get(d2) and cache.get(listAnomalie):
         d11=cache.get(d1)
         d22=cache.get(d22)
         listab=cache.get(listAnomalie)
         return listab
      else: 
         motifs=motif_abs.objects.values().all()
         for y in listids:
                 jsondata=[]#pour vider la liste et ajouter la liste de l'autre employé
                 for single_date in daterange(datetime.datetime.strptime(d1,"%Y-%m-%d").date(), datetime.datetime.strptime(d2,"%Y-%m-%d").date()):
                     a=Rapportunjour(int(y),str(single_date))
                     if a:
                        jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"] , "heuresnuits":a[0]["heuresnuits"],"idpoint":a[0]['idpoint'],"listp":a[0]['listp']})  
                  
                   
                 #print('testrapportab',jsondata)    
                 for obj in jsondata:
                     if obj['motif']=="Pointage impair":
                        ##compabs=compabs+1
                        listAnomalie.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"pointages":obj["pointages"],"commentaire":"Pointage Impair","listp":obj['listp'],"iduser":obj['iduser'],"idpoint":obj['idpoint']})
                     

      return JsonResponse(listAnomalie, safe=False)               
 
class RapportJournalier(APIView):
    
    def get(self, request,**kwargs):
        
        
        listids=request.query_params.getlist('id')[0].split(',')
        

        jsondata=[]
        totaleempl=0.0
        d1 = kwargs['date1']
        d2 = kwargs['date2']
        #print("dated1",d1)
        if  cache.get(d1) and cache.get(d2) and cache.get(jsondata) and cache.get(a):
           
           d11=cache.get(d1)  
           d22=cache.get(d2)
           #print("date1 date", d11 ,d22)
           jsonn=cache.get(jsondata)
           aa=cache.get(a)
           return jsonn
        else:
            for i in listids:
              j=0
              for single_date in daterange(datetime.datetime.strptime(d1,"%Y-%m-%d").date(), datetime.datetime.strptime(d2,"%Y-%m-%d").date()):
                  j=j+1
                  a=Rapportunjour(int(i),str(single_date))
                  
                  
                  if a:
                     totaleempl=totaleempl+float(a[0]["heuretravail"])

                     
                     if ((j<7 )and (j != 7)):
                        #print('j>',j)
                        jsondata.append({"nmbrj":"","total":"","motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"],"earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': (a[0]["heuretravail"]) ,'trvailhours':str(minutes_hours(float(a[0]["heuretravail"]))),'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"],"heuresnuits":a[0]["heuresnuits"],"motifplaning":a[0]["motifplaning"],"departant":a[0]["departant"],"idpoint":a[0]['idpoint'],"listp":a[0]['listp']})  
                     if j==7:
                        #print('j=',j)
                        jsondata.append({"nmbrj":j,"total":str(minutes_hours(float(totaleempl))),"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"],"earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': (a[0]["heuretravail"]) ,'trvailhours':str(minutes_hours(float(a[0]["heuretravail"]))),'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"] , "heuresnuits":a[0]["heuresnuits"],"motifplaning":a[0]["motifplaning"],"departant":a[0]["departant"],"idpoint":a[0]['idpoint'],"listp":a[0]['listp']})  
                        j=0 
                     #print(jsondata)
                 
                  
            cache.set(jsondata,a)
            return JsonResponse(jsondata, safe=False)

        return Response("pas de pointages ", status=status.HTTP_400_BAD_REQUEST)

class  RapportPointage(APIView):

      def get(self, request,**kwargs):
          listids=request.query_params.getlist('id')[0].split(',')
          liste=[]
          d1=kwargs['date1']
          d2=kwargs['date2']  
          jsondata=[]
          json_data=[]  
          if  cache.get(d1) and cache.get(d2) and cache.get(liste) and cache.get(jsondata):
              
              d11=cache.get(d1)
              d22=cache.get(d2)
              listt=cache.get(liste)
              jsonn=cache.get(jsondata)
              return listt
          else:
             
              for i in listids: 
                  cursor = connection.cursor()
                  cursor.execute('SELECT DISTINCT u.user_name , u.matricule , p.date_pointage , poin.nom_pointeuse,pl.title,p.date_pointage FROM (syspointage_pointage as p INNER JOIN syspointage_newuser as u ON p.employes_id = u.id) LEFT join syspointage_newuser_planningemp as up on up.newuser_id=u.id LEFT join syspointage_planning as pl on pl.id=up.planning_id  left join syspointage_pointeuse as poin on p.pointeuse_id=poin.id  where  u.id=%s  ORDER by p.date_pointage'%int(i))
                  r = cursor.fetchall()
              
                  for obj in r:
                      print(r)
                      
                      json_data.append({"user_name":obj[0],"matricule":obj[1],"date_pointage":obj[2].date(),"nom_pointeuse":obj[3],"planing":obj[4],"heure":obj[5].time()})   
                     


              for obj in json_data:
                  
                  if d1<=str(obj["date_pointage"])<=d2:
                     liste.append({"user_name":obj["user_name"],"matricule":obj["matricule"],"date_pointage":obj["date_pointage"],"nom_pointeuse":obj["nom_pointeuse"],"planning":obj["planing"],"heure":obj["heure"]})
              
              cache.set(
                 liste,json_data
              )
              
    
              return JsonResponse(liste, safe=False) 


class  RapportAbsences(APIView):

      def get(self, request,**kwargs):
          listAbsences=[]
          listids=request.query_params.getlist('id')[0].split(',')
          datesabsences=[]
          d1=kwargs['date1']
          d2=kwargs['date2']    
          json_data=[]
          listc=[]
          listbb=[]
          liste=[]#liste entre 2 dates 
          datecongesconfirme=[]  
          listauth=[]
 
          jsondata=[]
          if  cache.get(d1) and cache.get(d2) and cache.get(listAbsences):
             d11=cache.get(d1)
             d22=cache.get(d22)
             listab=cache.get(listAbsences)
             return listab
          else: 
             motifs=motif_abs.objects.values().all()


             for y in listids:
                 jsondata=[]#pour vider la liste et ajouter la liste de l'autre employé
                 for single_date in daterange(datetime.datetime.strptime(d1,"%Y-%m-%d").date(), datetime.datetime.strptime(d2,"%Y-%m-%d").date()):
                     a=Rapportunjour(int(y),str(single_date))
                     if a:
                        jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"] , "heuresnuits":a[0]["heuresnuits"]})  
                   
                 for obj in jsondata:
                     if obj['motif']=="Absent":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"absence"})

                     elif obj['motif']=="Absence non justifié":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Absence non justifié"})
                     elif obj['motif']=="Absence justifié":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Absence justifié"})
                     elif obj["motif"]=="Authorisation":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Authorisation"})
             
          return JsonResponse(listAbsences, safe=False)   

class  RapportSynthese(APIView):

      def get(self, request,**kwargs):
          listsynthese=[]
          listids=request.query_params.getlist('id')[0].split(',')
          jsondata=[]
          d1=kwargs['date1']
          d2=kwargs['date2'] 
          liste=[]  
          
          if cache.get(d1) and cache.get(d2) and cache.get(listsynthese) and cache.get(jsondata):
             d11=cache.get(d1)
             d22=cache.get(d22)
             listsy=cache.get(listsynthese)
             js=cache.get(jsondata)
             return listsy
          else:
             
             ttzero=datetime.datetime.strptime("00:00:00","%H:%M:%S").time()
             joursabsence=0
             tempsabsence=0.0
             
             j=0
             minuts=0.0
             presencesupl=0.0
             time_zero = datetime.datetime.strptime('00:00:00', '%H:%M:%S').time()
             presencenor=0.0
             comp=0
            
             m=''
             p=''
             sup1=''
             sup2=''
             tab=''

             for y in listids:
                 jourtravai=0
                 minuts=0.0
                 lates=0.0
                 departsant=0.0
                 m=''
                 minutestravaill=0.0
                 earlysortie=0.0
                 defici=0.0
                 joursabsence=0
                 jourconge=0
                 heuremission=0.0
                 nbrjourtravail=0.0
                 nbrjournrmltravail=0.0
                 heureauthorisation=0.0
                 prnormale=0.0
                 tempsabsences=0.0
                 heuresdimenche=0.0
                 heuresnui=0.0
                 heuressamedinuit=0.0
                 heuressamedinuitj=0.0
                 heuresjf=0.0
                 travails=0.0
                 heuretravn=0.0
                 
                 tab=''
                 hd=''
                 pr=''
                 hnm=''
                 laty=''

                 hn=''
                 hsn=''
                 hsnj=''
                 jf=''
                 totales=''
                 departanticipe=''
                 comp=0
                 j=0
                 
                 for single_date in daterange(datetime.datetime.strptime(d1,"%Y-%m-%d").date(), datetime.datetime.strptime(d2,"%Y-%m-%d").date()):
                       j=j+1
                       a=Rapportunjour(int(y),str(single_date))

                       if a:
                          jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempabsence":a[0]["tempabsence"],"tempsMission":a[0]["tempsMission"],"planing":a[0]['planing'], "heuresnuits":a[0]["heuresnuits"],"motifplaning":a[0]["motifplaning"],"departant":a[0]["departant"],})  
                          day=findDay(str(single_date))
                          
                           #################
                          if a[0]["motifplaning"]== 'jour':
                              print('hrunuit', a[0]["heuretravail"])
                              heuretravn=  heuretravn + float( a[0]["heuresnuits"])
                              hnm=str(minutes_hours(heuretravn))

                          if a[0]['motifplaning'] == 'nuit':
                             heuresnui=heuresnui+float(a[0]["heuretravail"])
                             hn=str(minutes_hours(heuresnui))
                          else: hn=''
                          
                          if(day=='Dimanche'):
                              heuresdimenche=heuresdimenche+float(a[0]["heuretravail"])
                              hd=str(minutes_hours(heuresdimenche))
                              #print('heuresdimenche',heuresdimenche)
                          elif(day=='Samedi'):
                               
                               if a[0]['motifplaning'] == 'nuit':
                                 heuressamedinuit=heuressamedinuit+float(a[0]["heuretravail"])
                                 hsn=str(minutes_hours(heuressamedinuit))
                                 
                               else: hsn=''
                               if a[0]['motifplaning'] == 'jour':
                                    heuressamedinuitj=heuressamedinuitj+float(a[0]["heuresnuits"])
                                    hsnj=str(minutes_hours(heuressamedinuitj))
                                    #print("heuressamedi",hsnj)
                               else: hsnj=''
                        ######semaine######
                       
                       if j==7:
                     
                           if jsondata :          
                                 for i in range (len(jsondata)):
                                    #print("helloooooo")
                                    minuts=minuts+float(jsondata[i]['heuretravail'])
                                    presencenor=presencenor+float(jsondata[i]['presencenormal'])
                                    
                                 m=str(minutes_hours(minuts))
                                
                                 if (str(minutes_hours(40*60)) < str(m) and str(m) < str(minutes_hours(48*60))):
                                    sup1=str(minutes_hours(minuts - (40*60)))
                                    #print('heuressupp',sup1)
                                 if (str(minutes_hours(48*60)) < str(m) ):
                                    sup2=str(minutes_hours(minuts - (40*60)))


                           comp=comp+1
                           
                       ########finsemaine####   
                      
                 if jsondata:
                    for obj in jsondata:   
                    
                       
                        lates=lates+float(obj['lateEntree'])
                        laty=str(minutes_hours(lates))
                        

                        departsant=departsant+float(obj['departant'])
                        departanticipe=str(minutes_hours(departsant))

                        minutestravaill=minutestravaill+float(obj['heuretravail'])
                        
                        defici=defici+float(obj['deficit'])
                        earlysortie=earlysortie+float(obj['earlySortie'])
                        sortieavantheure=str(minutes_hours(earlysortie))
                        
                        travail=str(minutes_hours(minutestravaill))
                        if obj['motif']=="Jour Ferié":
                           if obj["Entree"]!="0.0" and obj["Sortie"]!="0.0":
                              heuresjf=heuresjf+float(obj['heuretravail'])
                              jf=str(minutes_hours(heuresjf))
                              #print("heuresjferié",heuresjf)
                        travails=minutestravaill
                        totales=str(minutes_hours(travails))
                        deficit=str(minutes_hours(defici))
                        prnormale=prnormale+float(obj['presencenormal'])
                        pr=str(minutes_hours(prnormale))
                        
                        if obj["presencenormal"]!="0.0":
                              nbrjournrmltravail=nbrjournrmltravail+1
                        if obj['motif']=="":
                           if obj["Entree"]!="0.0" and obj["Sortie"]!="0.0":
                              nbrjourtravail=nbrjourtravail+1
                              
                        if obj['motif']=="Absent" or obj['motif']=="Absence non justifié" or obj['motif']=="Absence justifié":
                           
                              joursabsence=joursabsence+1
                        if obj['motif'] =="Congé":
                           jourconge=jourconge+1
                        if obj['motif']=="Mission":
                           heuremission=heuremission+float(obj['tempsMission'])
                       
                        if obj['motif']=="Authorisation":
                           heureauthorisation=heureauthorisation+float(obj['heureauthorisation'])

                        tempsauthorisation=str(minutes_hours(heureauthorisation))
                        #print("heuredemission",heuremission)
                        heuresmission=str(minutes_hours(heuremission))
                        
                 listsynthese.append({"tempsabsence":tab,"presencenormale":pr,"user_name":obj['user_name'],"matricule":obj['matricule'],"retard": laty,"departsanticipes":departanticipe,"travail":totales,"earlySortie":sortieavantheure,"deficit":deficit,"joursabsence":joursabsence,"jourconges":jourconge,"heuremission":heuresmission,"heureauthorisation":tempsauthorisation,"nbrjourtravail":nbrjourtravail,"nbrjournrmltravail":nbrjournrmltravail,"heuresdimenche":hd,"heuresjf":jf,"heuresnuit":(hn + hnm),"heuressamedinuit":(hsn + hsnj),"heuressup40" : sup1 , "heuressup48":sup2})
                 jsondata=[]#pour vider la liste jsondata :en premier temps elle prend les objets user1,puis user 2....
                    
         
          return JsonResponse(listsynthese, safe=False)                  

def daterangemonths(start_date, end_date):
    for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date):
      #print('dttt',dt)
      yield dt.date()
  

def rapportmensulle(listids,date1,date2):
        jsondata=[]
        listmois=[]
        minuts=0.0
        ttzero=datetime.datetime.strptime("00:00:00","%H:%M:%S").time()
        presencenor=0.0
        totalheuretheorique=0.0
        totalheureeffective=0.0
        travailminutesindirect=0.0
        travailminutesdirect=0.0
        heuretravail_direct=0.0
        heuretravail_indirect=0.0
        defiTotale=0.0
        earlysoriteTotal=0.0
        retardminutestotale=0.0
        minutes_absence_deficit=0.0
        totalabsencedeficit=0.0
        htt=''
        hte=''
        htdirect=''
        htindirect=''
        tota_ab_defi=''
        rapportmensulle=[]
        for y in listids:
            
            jsondata=[]
            minuts=0.0
            presencenor=0.0
            heuretravail_user_direct=''
            heuretravail_user_indirect=''
            heureavantsortie=0.0
            retard=0.0
            defi=0.0
        
            arrondi_deficit_absence=0.0  
            deficitminutes_total=''
            EarlySortie_totale=''
            rata_total='' 
            travailminutesindirect=0.0 
            travailminutesdirect=0.0  
            minutes_absence_deficit=0.0
            #print("date1",date1)
            #print("date2",date2)
            for ss in daterangemonths (date1,date2):
                #print('sss',ss+timedelta(days=1))
                #print('helloe')
                
                jsondata=[]
                minuts=0.0
                presencenor=0.0
                heureavantsortie=0.0
                defi=0.0
                #print("month",ss.month)
                dayss=calendar.monthrange(ss.year, ss.month)[1]
                travailminutesindirect=0.0
                retard=0.0
                travailminutesdirect=0.0
                heuretravail_direct=0.0 
                minutes_absence_deficit=0.0
                arrondi_deficit_absence=0.0  
                nombrejours=0

                
                for single_date in daterange(ss,(datetime.datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=dayss+1)).date()):
                #for single_date in daterange(ss,(datetime.datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=nombrejours)).date()):
                    a=Rapportunjour(int(idemploye),str(single_date))


        
                    if a:
                       jsondata.append({"lateEntree":a[0]["lateEntree"],"motif":a[0]["motif"],"jourtravaille":a[0]['jourtravaille'],"date":str(single_date),"day":day})
                       #print(jsondata)
                    #print(jsondata)
                for i in range (len(jsondata)):
                    minuts=minuts+float(jsondata[i]['heuretravail'])
                    #print("minutestravail",minuts)
                    presencenor=presencenor+float(jsondata[i]['presencenormal'])
                    retard=retard+float(jsondata[i]['lateEntree'])
                    defi=defi+float(jsondata[i]['deficit'])
                    heuretravail=str(minutes_hours(minuts))
                    Presence_normale=str(minutes_hours(presencenor))
                    heureavantsortie=heureavantsortie+float(jsondata[i]['earlySortie'])
                    r=str(minutes_hours(retard))
                    earlysortie=str(minutes_hours(heureavantsortie))
                    dd=str(minutes_hours(defi))


                       

                #print(jsondata)
                
               
                if jsondata:
                   if defi>=240:#if deficit superieur à 4 heures alores converssion en nombre de jours d'absence
                      nb_jours_absence_deficit=defi/480#Le nombre de jours d’absence est calculé en divisant le déficit horaire du mois par 8 heure 
                      arrondi_deficit_absence=(int)(2*nb_jours_absence_deficit+0.5)/2.0#arrondissant à la demi-journée la plus proche. Exemple : 2,1jr est arrondi à 2jr ; 2,4jr est arrondi à 2,5jr.
                      
                   if NewUser.objects.values().filter(matricule='' , id=jsondata[0]['iduser']):
                      travailminutesindirect=minuts
                      heuretravail_user_indirect=heuretravail
                      heuretravail_user_direct=str(minutes_hours(0))
                       
                   else:
                      travailminutesdirect=minuts
                      heuretravail_user_direct=heuretravail
                      heuretravail_user_indirect=str(minutes_hours(0))
                   listmois.append({"heuretravailindirect":heuretravail_user_indirect,"heuredtravaildirect":heuretravail_user_direct,"user_name":jsondata[0]["user_name"],"matricule":jsondata[0]["matricule"],"presencereele":heuretravail,'presencenormal':Presence_normale,'debutmois':str(ss),'finmois':str((datetime.datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=dayss+1)).date()),"retardEntree":r,"heureavantsortie":earlysortie,"deficit":dd,"prnormalminutes":str(presencenor),"totalheureeffective":str(minuts),"heuretravail_direct":str(travailminutesdirect),"heuretravail_indirect":str(travailminutesindirect),"deficitminutes_total":str(defi),"heureavantsortieminutes":str(heureavantsortie),"retardminutes":str(retard),"iduser":jsondata[0]["iduser"],"absence_defi":str(arrondi_deficit_absence)})
            
        for obj in listmois:
            
            totalheuretheorique=totalheuretheorique+float(obj['prnormalminutes'])#total des heures normales(theoriques)
            htt=str(minutes_hours(totalheuretheorique))
            totalheureeffective=totalheureeffective+float(obj['totalheureeffective'])#total des heures de travail (pratiques/effectives)
            hte=str(minutes_hours(totalheureeffective))
            heuretravail_direct=heuretravail_direct+float(obj['heuretravail_direct'])
            htdirect=str(minutes_hours(heuretravail_direct))          
            heuretravail_indirect=heuretravail_indirect+float(obj['heuretravail_indirect'])
            htindirect=str(minutes_hours(heuretravail_indirect))
            defiTotale=defiTotale+float(obj['deficitminutes_total'])
            deficitminutes_total=str(minutes_hours(defiTotale))
            earlysoriteTotal=earlysoriteTotal+float(obj['heureavantsortieminutes'])
            EarlySortie_totale=str(minutes_hours(earlysoriteTotal))
            retardminutestotale=retardminutestotale+float(obj['retardminutes'])
            rata_total=str(minutes_hours(retardminutestotale))

        #print('aa')
        rapportmensulle.append({"htheorique_total":htt,"heffective_total":hte,"htravail_direct":htdirect,"htravail_indirect":htindirect,"deficit_totale":deficitminutes_total,"earlysoriteTotal":EarlySortie_totale,"retardminutestotale":rata_total,"list":listmois})
        return rapportmensulle




class RapportMensuelle(APIView):
    def get(self, request,**kwargs):
        date1=datetime.datetime.strptime(kwargs['date1'],"%Y-%m-%d").date()
        date2=datetime.datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()
        listids=request.query_params.getlist('id')[0].split(',')
        rap=rapportmensulle(listids,date1,date2)
        return JsonResponse(rap, safe=False)
       

def daterangeAns(start_date, end_date):
    end=end_date#to get the last date (date2)
    #print(start_date.year)
    for n in range(int ((end.year - start_date.year))):
        
        #print('nnnn',n)
        a=start_date + relativedelta(years=+n) 
        yield a

#test


def minutes_hours(minutes):
   hours=minutes // 60
   minutes= minutes % 60
   x="%02i:%02i" % (int(hours), int(minutes))
   return x
class RapportAnuellement(APIView):
    def get(self,request,**kwargs):
      listids=request.query_params.getlist('id')[0].split(',')
      date1=datetime.datetime.strptime(kwargs['date1'],"%Y-%m-%d").date()
      date2=datetime.datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()
      listrapport=[]
      rapport=[]
      heuretravailindirect=0.0
      minuts=0.0
      minutesdirect=0.0
      presencereeleminutes=0.0
      prnormalminutes=0.0
      retardEntreeMinutes=0.0
      heureavantsortieminutes=0.0
      absence_deficitminutes=0.0
      deficitminutes=0.0
      ttzero=datetime.datetime.strptime("00:00:00","%H:%M:%S").time()
      for id in listids:
          
          rap=[]
          
          heuretravailindirect=0.0
          minuts=0.0
          minutesdirect=0.0
          presencereeleminutes=0.0
          prnormalminutes=0.0
          retardEntreeMinutes=0.0
          heureavantsortieminutes=0.0
          absence_deficitminutes=0.0
          deficitminutes=0.0
          absence_deficit=''
          deficit=''
          heureavantsortie=''
          retardEntree=''
          presencenormal=''
          presencereel=''
          travaildirect=''
          travailindirect=''
          for ss in daterangeAns (date1,date2):
              rap=[]

              heuretravailindirect=0.0
              minuts=0.0
              minutesdirect=0.0
              presencereeleminutes=0.0
              prnormalminutes=0.0
              retardEntreeMinutes=0.0
              heureavantsortieminutes=0.0
              absence_deficitminutes=0.0
              deficitminutes=0.0
              absence_deficit=''
              deficit=''
              heureavantsortie=''
              retardEntree=''
              presencenormal=''
              presencereel=''
              travaildirect=''
              travailindirect=''


              rap=rapportmensulle([id],ss,(datetime.datetime.strptime(str(ss),"%Y-%m-%d")+relativedelta(years=1)).date())#chaque employé  en an
       


              for a in rap[0]['list']:
                  
                  minuts=minuts+float(a['heuretravail_indirect'])
                  
                  travailindirect=str(minutes_hours(minuts))
                  minutesdirect=minutesdirect+float(a['heuretravail_direct'])
                  
                  travaildirect=str(minutes_hours(minutesdirect))
                  presencereeleminutes=presencereeleminutes+float(a['totalheureeffective'])
                  presencereel=str(minutes_hours(presencereeleminutes))
                  prnormalminutes=prnormalminutes+float(a['prnormalminutes'])
                  presencenormal=str(minutes_hours(prnormalminutes))
                  retardEntreeMinutes=retardEntreeMinutes+float(a['retardminutes'])
                  retardEntree=str(minutes_hours(retardEntreeMinutes))
                  heureavantsortieminutes=heureavantsortieminutes+float(a['heureavantsortieminutes'])
                  heureavantsortie=str(minutes_hours(heureavantsortieminutes))
                  deficitminutes=deficitminutes+float(a['deficitminutes_total'])
                  
                  deficit=str(minutes_hours(deficitminutes))

              #print('tesstttt',minutes_hours(minuts))    
              #print('rrrrrrrrrrrrrrrr',deficitminutes)    
              listrapport.append({"user_name":str(a['user_name']),"date1":str(ss),"date2":str((datetime.datetime.strptime(str(ss),"%Y-%m-%d")+relativedelta(years=1)).date()),"travailindirect":travailindirect,"travaildirect":travaildirect,"presencereel":presencereel,"presencenormal":presencenormal,"retardEntree":retardEntree,"heureavantsortie":heureavantsortie,"deficit":deficit,"absence_deficit":absence_deficit})
              
      return JsonResponse(listrapport, safe=False)


@csrf_exempt
def SendMaill(request,**kwargs):
    #pour éviter le probléme quand l'employé n'a pas de chef
   
    if kwargs['email']!='undefined':
       send_mail(
       kwargs['objet'],
       kwargs['message'],
       settings.EMAIL_HOST_USER,
       [kwargs['email']],
       fail_silently=False,
       )
    return HttpResponse(status=200)

class Historiquecreate(APIView):
    def post(self, request,**kwargs):
        dataa={}
        dataa['date']=datetime.datetime.now()  
        dataa['departement_update']=kwargs['departement']
        dataa['employe']=kwargs['idemploye']
        serializer = HistoriqueSerializer(data=dataa)
        if serializer.is_valid():
           user = serializer.save()
           if user:
              json = serializer.data
              return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class HistoriqueList(generics.ListAPIView):
    
     def get(self, request):
         cursor = connection.cursor()
         query='select a.nom,h.date,h.id,h.employe_id,u.user_name from syspointage_historique as h,syspointage_arborescence as a ,syspointage_newuser as u where h.departement_update=a.id and h.employe_id=u.id group by employe_id'
         cursor.execute(query)
         r = cursor.fetchall()
         json_data = []
         for obj in r:
             json_data.append({"nom":obj[0],"date":obj[1],"id":obj[2],"employe":obj[3],"user_name":obj[4]})
         return JsonResponse(json_data, safe=False)
   
class HistoriqueById(generics.RetrieveUpdateAPIView):
     def get(self, request,pk):
         cursor = connection.cursor()
         id=self.kwargs['pk']
         query='select a.nom,h.date,h.id,u.id from syspointage_historique as h ,syspointage_arborescence as a,syspointage_newuser as u where u.id=h.employe_id and h.departement_update=a.id and h.employe_id=%s'%id
         cursor.execute(query)
         r = cursor.fetchall()
         json_data = []
         for obj in r:
            json_data.append({"nom":obj[0],"date":obj[1],"id":obj[2]})
         return JsonResponse(json_data, safe=False)

def run_continuously(self, interval=1):


    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run

Scheduler.run_continuously = run_continuously

def InsertinTable():
   
    users=NewUser.objects.values().all()
    listids=[]
    listdates=[]
    for a in users:
        listids.append(a.get("id"))
    
    for i in listids:
        for single_date in daterange((datetime.datetime.now()-datetime.timedelta(days=60)).date(),datetime.datetime.now().date()):

         a=Rapportunjour(int(i),str(single_date))
         if a:
            cursor = connection.cursor()
            cursor.execute("""
               insert into syspointage_mintimeresponse (motif,Entree,Sortie,earlyEntree,lateEntree,earlySortie,lateSortie,user_name,matricule,date_pointage,planing,heuretravail,pause,presencenormal,jourtravaille,entreepointage,sortiepointage,heureauthorisation,deficit,iduser,tempsabsence,jourconge,tempsMission
               ) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
               """,
            (a[0]["motif"],a[0]["Entree"],a[0]["Sortie"],a[0]["earlyEntree"],a[0]["lateEntree"],a[0]["earlySortie"],a[0]["lateSortie"],a[0]["user_name"],a[0]["matricule"],a[0]["date_pointage"],a[0]["planing"],a[0]["heuretravail"], a[0]["pause"],a[0]['presencenormal'],a[0]['jourtravaille'],a[0]['entreepointage'],a[0]['sortiepointage'],a[0]['heureauthorisation'],a[0]["deficit"],a[0]["iduser"],a[0]["tempabsence"],a[0]["jourconge"],a[0]['tempsMission']))
            r = cursor.fetchall()
            #print("ddddd",r)
            #print("eeeee",a[0]['entreepointage'])
    

"""
if a[0]["lateEntree"]!="0" and str(a[0]["lateEntree"])!="0.0":
SendMail(NewUser.objects.filter(id=a[0]["iduser"]).values()[0].get('email'),'Retard à l entrée','Bonjour, Il  Vous avez fait un retard de %s en %s'%(a[0]['lateEntree'],a[0]["date_pointage"]))
"""
def update_solde_Every_three_months():
    users=NewUser.objects.values().all()
    for u in users:
        NewUser.objects.filter(id=u.get("id")).update(solde=u.get('solde')+5.5)


scheduler = Scheduler()
scheduler.every().day.at("11:17:00").do(InsertinTable)#every day at 13 insert in table les données de rapport 





scheduler.every(129600).minutes.do(update_solde_Every_three_months)#ajout solde chaque 3 mois (129600minutes dans 3 mois )
scheduler.run_continuously()

class Mouchardcreate(APIView):
    def post(self, request,**kwargs):
        dataa={}
        #print(kwargs['previous'])
        dataa['anciennevaluer']=kwargs['previous']
        dataa['nouvellevaluer']=kwargs['new']
        dataa['employe']=kwargs['idemploye']
        dataa['idper_modifie']=kwargs['idpersonne']
        dataa['datenow']=datetime.datetime.now()
        dataa['objet']=kwargs['obj']
        serializer = MouchardSerializer(data=dataa)
        if serializer.is_valid():
           a = serializer.save()
           if a:
              json = serializer.data
              return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MouchardList(APIView):
   def get(self, request):

      cursor = connection.cursor()
 
      query="select m.anciennevaluer,m.nouvellevaluer,m.objet,m.datenow,m.idper_modifie,m.employe_id ,u.user_name,u.matricule  from syspointage_mouchard as m left join syspointage_newuser as u on u.id=m.employe_id"
      #query="select anciennevaluer,nouvellevaluer,objet,datenow,p.user_name,u.user_name,u.matricule from syspointage_mouchard as m,syspointage_newuser p,syspointage_newuser u"
      cursor.execute(query)
      r = cursor.fetchall()
      json_data = []
      nomp=''
      for obj in r:
          #if NewUser.objects.filter(id=obj[4]):
            #personne=NewUser.objects.filter(id=obj[4]).values('user_name','last_name')[0]
            #nomp=personne.get('user_name')+" "+personne.get('last_name')
          json_data.append({"anciennevaluer":obj[0],"nouvellevaluer":obj[1],"objet":obj[2],"datenow":obj[3],"personne_name":obj[4],"employe_name":str(obj[6]),"matriculeemploye":obj[7]})
      return JsonResponse(json_data, safe=False)

"""
def fichiertxt(request):
   listids=[]
   jsondata=[]
   response=HttpResponse(content_type='text/plain')
   response['Content-Disposition']='attachment;filename=rapport.txt'
   cursor = connection.cursor()
   cursor.execute("""
#select presencenormal,user_name,matricule,date_pointage,iduser from syspointage_mintimeresponse order by date_pointage;
""")
   a= cursor.fetchall()
   for obj in a:
       jsondata.append({"presencenormal":obj[0],"user_name":obj[1], "matricule":obj[2], "date_pointage": obj[3],"iduser":obj[4],"regime":"J"})  

   horaire=horairejour.objects.values().all()
   response.writelines(str(horaire)+'\n'+str(jsondata))
  
   return response
"""

