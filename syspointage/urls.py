from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from . views import *
from . import views

urlpatterns = [
 path('UsersOfChef/', UsersOfChef.as_view(), name="test"),
 path('user/', Userlist.as_view(), name="liste user"),
 path('create/', CustomUserCreate.as_view(), name="create_user"),
  path('UsersOfDepartement/',views.UsersOfDepartement.as_view(),name="users of departement"),
 path('UsersOfChefRHRapports/<id>/',views.UsersOfChefRHRapports.as_view(),name="users of chef rh rapports"),
 path('UsersOfDepartChef/',views.UsersOfDepartChef.as_view(), name=" uses of departement par login "),
 path('userdelete/<int:pk>',UserDelete.as_view(), name="delete_user"),

 path('user/<int:pk>', UpdateUser.as_view(), name="update user"),

 path('employespartis/',EmployesPartis.as_view(),name="Employés partis"),
 path('quitteremploye/<id>/<motif>/<datepart>',QuitterEmploye.as_view(),name="quitter employé"),
 path('reprisremploye/<id>',ReprisEmploye.as_view(),name="repris employé"),
 path('role/' , views.Rolelist.as_view(), name="role list"),
 path('role/<int:pk>' , views.Roleupdate.as_view(), name="role list by ID"),
 path('pointeuse/' , views.Pointeuselist.as_view(), name="liste de pointeuse"),
 path('pointeuse/<int:pk>' , views.Pointeuseupdate.as_view(), name="liste de pointeuse"),
 path('pointage/' , views.Pointagelist.as_view(), name="liste de pointage"),
 path('createpointage/' , views.CreatePointage.as_view(), name="create pointage"),

 path('deletpointage/<int:pk>',views.DeletePointage.as_view(),name="delete pointage"),
 path('getpointagebyid/<int:pk>/',views.GetPointageById.as_view(),name="getby id pointage"),

 path('pointage/<int:pk>' , views.PointageRetrieve.as_view(), name="pointage par ID"),
 path('motif/' , views.Motiflist.as_view(), name="liste de motif"),
 path('motif/<int:pk>' , views.Motifupdate.as_view(), name="motif par ID"),
 path('Absence/',views.AbsencesList.as_view(),name="Liste des absences"),
 path('Absence/<int:pk>', views.AbscenceUpdate.as_view(),name="absence by Id"),
 path('arbo/',views.ArborescenceList.as_view(),name="Liste des arborescences"),
 path('arbo/<int:pk>',views.ArborescenceUpdate.as_view(),name="absences"),
 path('horaire/' , views.Horairejourlist.as_view(), name="liste des horaires"),
 path('horaire/<int:pk>' , views.HoraireJourupdate.as_view(), name="horaire par ID"),
 path('plansemaine/' , views.Plansemainelist.as_view(), name="liste de ² semaine"),
 path('plansemaine/<int:pk>' , views.plansemaineupdate.as_view(), name="planning semaine par ID"),
 path('planning/' , views.Planninglist.as_view(), name="liste des planning"),
 path('GetUsersbyplanings/<int:pk>',views.GetUsersbyplanings.as_view(),name="get users by planing"),
 path('planning/<int:pk>' , views.Planningupdate.as_view(), name="planning par ID"),
 path('RemoveUserbyplanning/<iduser>/<idplaningactuelle>',views.DeleteUserbyplanning.as_view(),name="delette User byplanning"),
 path('updateUserbyplanning/<iduser>/<idplaningactuelle>/',views.updateUserbyplanning.as_view(),name="updateUserbyplanning"),
 path('contrats/',views.ContratList.as_view(),name="Liste des contrats"),
 path('contrats/<int:pk>' , views.contratupdate.as_view(), name="contrat list by ID"),
 path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
 path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
 path('exportemploye/', views.exportemploye),

 path('JourFerie/',views.JoursFeriesList.as_view(),name="Liste des joursFeries"),
 path('JourFerie/<int:pk>', views.JourFeriéUpdate.as_view(),name="jour ferie by Id"),
 path('demendeconges/<int:pk>/<type>/<date1>/<date2>/<employe_id>' , views.Demendeconges.as_view(), name="demande de congé "),
 #path('CongésList/',views.CongésList.as_view(),name="list of conge"),
 path('TestConges/<int:pk>',views.TestCongésList.as_view(),name="liste de congés de chef et rh"),
 path('TestAutorisationsList/<int:pk>',views.TestAutorisationsList.as_view(),name="liste auto de chef et rh"),
 path('ChartParJournee/<date1>/<date2>/<nbaa>/<nbcc>/<nbabse>/',views.ChartsParJourneeDynamique.as_view(),name='chart journee des employés'),
 path('selectArborescence/<int:pk>',views.selectArborescence.as_view(),name="select  département"),
 path('api/token/',views.MyTokenObtainPairView.as_view(),name='data of user after login'),

 path('rapportpointage/<date1>/<date2>/',views.RapportPointage.as_view(),name='rapport pointage'),
 path('rapportjour/<date1>/<date2>/',views.RapportJournalier.as_view(),name='rapport journalier'),
 path('rapportanomalie/<date1>/<date2>/',views.RapportAnomalie.as_view(),name='rapport anomalie'),
 path('rapportabsence/<date1>/<date2>/',views.RapportAbsences.as_view(),name='rapport absence'),
 path('rapportsemaine/<date1>/<date2>/',views.RapportSemaine.as_view(),name='rapport semaine'),
 path('rapportsynthese/<date1>/<date2>/',views.RapportSynthese.as_view(),name='rapport synthese'),
 path('accuiel/<int:pk>',views.Accueil.as_view(),name="légende du tableau"),
 path('HistoriqueDemendesConges/<int:pk>',views.HistoriqueDemendesConges.as_view(),name="tableau historique dans accueil"),
 path('HeuresDeTravailJours/<int:pk>',views.HeuresDeTravailJours.as_view(),name="heures de travail par jour dans accueil"),
 path('SupressionConge/<int:pk>',views.SupressionConge.as_view(),name='Supression de Conge'),
 path('RetrieveUpdateConge/<id>/<etat_absrh>/<etat_abs>/',views.ValidationConge.as_view(),name='Validation de Conge'),
 path('RefusConge/<int:pk>',views.RefusConge.as_view(),name='Refus de Conge'),
 path('SendMail/<email>/<objet>/<message>',views.SendMaill,name='envoyer mail de compte ipstime vers chef et employé (front END)'),
 path('CreateplaningByDep/',views.CreateplaningByDep.as_view(),name='CreateplaningByDep'),
 path('Historique/<idemploye>/<departement>',views.Historiquecreate.as_view(),name='Historique'),
 path('HistoriqueList/',views.HistoriqueList.as_view(),name='Historique list'),
 path('HistoriqueById/<int:pk>',views.HistoriqueById.as_view(),name='historique pour chaque employé'),
 path('GetUserById/<int:pk>',views.GetUserById.as_view(),name="get user by id"),
 path('RapportMensuelle/<date1>/<date2>/',views.RapportMensuelle.as_view(),name="RapportMensuelle"),
 path('RapportAnuellement/<date1>/<date2>/',views.RapportAnuellement.as_view(),name="RapportAnuellement"),
 #path('fichiertxt/',views.fichiertxt,name="fichier text horaire,rapport journalier,mensuel"),
 path('Mouchardcreate/<previous>/<new>/<idemploye>/<idpersonne>/<obj>',views.Mouchardcreate.as_view(),name="mouchard"),

 path('MouchardList/',views.MouchardList.as_view(),name='mouchard list'),
 path('AffichageDemendesConges/<int:pk>',views.AffichageDemendesConges.as_view(), name='AffichageDemendesConges'),
 
path('AcceuilHistoriqueCongeparchef/<int:pk>',views.AcceuilHistoriqueCongeparchef.as_view(), name='AffichageDemendesConges'),


 #http://127.0.0.1:8000/updateUserbyplanning/4/39/?idplanning=37,38


 ]
 