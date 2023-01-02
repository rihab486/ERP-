import React,{useState} from "react";
import useFetch from "../useFetch";

import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Mouchard from '../Mouchardd/Mouchard';
import ScrollContainer from 'react-indiana-drag-scroll'
import $ from "jquery";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
const ListeAutorisations = () => {
  
  $(document).ready(function () {
    $('#example').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});

  const [opensupprimer, setopensupprimer] = useState(false);
  const[idcongesupp,setIdcongeSupp]=useState('')
   const handleClickOpensupprimer = (ids) => {

     setopensupprimer(true);
     setIdcongeSupp(ids)
   };
   const handleClosesupprimer = () => {
     setopensupprimer(false);
   };
    const url="http://127.0.0.1:8000/";
    const { data: Conges = [] } = useFetch(url+"TestAutorisationsList/"+localStorage.getItem("id"))
    const[congeIddelete,setcongeIddelete]=useState(null)
    const [open, setOpen] = useState(false);
    const useStyle = makeStyles({
      icon: {
        marginRight: 10,
      marginLeft: 10,    
      visibility: 'visible',
      color: '#5ac2df'
  
  
      },
      hidesubmit: {
        visibility: 'hidden'
      }
    });

    const classes = useStyle()
    const SupprimerConge = (id) => {
      fetch('http://127.0.0.1:8000/SupressionConge/' + id, {
          method: 'DELETE',
          headers: {
  
              'Content-Type': 'application/json'
          },
      }).then(() => {
          setOpen(false);
          Mouchard("encours","supprimé",iduser,localStorage.getItem('id'),"Suppression d'autorisation de "+ddebut+"au "+dfin)
          window.location.reload(false);
      }
      )
  
  
  }
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  const is_active = true  
  const ValiderConge =(id,iduser,heuredebut,heurefin,etat_absrh,etat_abs,is_active) => {
  
 
     
    
    
      fetch('http://127.0.0.1:8000/RetrieveUpdateConge/' + id+"/"+etat_absrh + "/"+etat_abs, {
          method: 'get',
       
       
      }).then(() => {
        Mouchard("encours","confirmé",iduser,localStorage.getItem('id'),"Validation d'autorisation de "+heuredebut+"au"+heurefin)

       window.location.reload(false)
    
    
      }
    
      )
    }
  const RefuserConge = (id,iduser,heuredebut,heurefin,etat_absrh,etat_abs,is_active) => {

      let List = {etat_absrh,etat_abs }
    
    
      fetch('http://127.0.0.1:8000/RefusConge/' + id, {
          method: 'PUT',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(List)
      }).then(() => {
        Mouchard("encours","refusé",iduser,localStorage.getItem('id'),"Refus d'autorisation de " +heuredebut+"au "+heurefin)
       window.location.reload(false)
    
      }
    
      )
    }
    const[iduser,setIdUser]=useState('')
    const[ddebut,setddebut]=useState('')
    const[dfin,setdfin]=useState('')
    const sendMail= (email,objet,message) =>{
  
   
      fetch("http://127.0.0.1:8000/SendMail/"+email+"/"+objet+"/"+message , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" 
        },
       
      }).then(() =>{
       
  
    }).catch((e)=>{
    
     
    })
    } 
    const onClick = (idconge,iduser,date_autorisation,etat_absrh,etat_abs,rhid_grand,emaildirec,iddirecteur,emailchef,emailrh,usernamed,user_name,heure_debut,heure_fin) => {

    
      if(rhid_grand==localStorage.getItem('id')){
        if (etat_absrh=="confirmé par rh"){
          alert('L Authorisation est déja validé')
        }else{
        
          sendMail(emaildirec,
            "IPS Time: Validation de authorisation fait par RH","Bonjour "+usernamed+", <br> Nous attenderons votre décision finale de valider la demande de authorisation pour "+date_autorisation+" du "+heure_debut+" à "+heure_fin+" pour l'employé "+user_name+" par une avis favorable!<br>IPS Time")
          sendMail(emailrh,"Validation de authorisation par RH","Vous avez validé l'authorisation de votre employé  "+user_name+"")

        if ((etat_abs=='') ||(etat_abs=='en cours') ) {
          const etat_absrh="confirmé par rh"
          const etat_abs='en cours'
          return  ValiderConge(idconge,iduser,heure_debut,heure_fin,etat_absrh,etat_abs)

        }}}
      else if(iddirecteur==localStorage.getItem('id'))
      {
        if (etat_abs=="confirmé par Dir"){
          alert('L Authorisation est déja validé pr Directeur')
        }else{
          sendMail(emaildirec,"Validation de L Authorisation par Directeur","Bonjour "+usernamed+", <br>Vous avez validé L Authorisation pour l'employé "+user_name+"")
          sendMail(emailchef,"Validation de L Authorisation par Directeur","Votre directeur a validé L Authorisation de votre employé  "+user_name+"")
          if ((etat_absrh="Refusé par rh") && ((etat_abs= "en cours") || (etat_abs= "Refusé par Dir") ))
          {
                 const etat_absrh="Refusé par rh"
                 const etat_abs="confirmé par Dir"
                 
                 return  ValiderConge(idconge,iduser,heure_debut,heure_fin,etat_absrh,etat_abs)
     
           }
        
        }}

     
    };
    const onClickrefus = (idconge,iduser,date_autorisation,etat_absrh,etat_abs,rhid_grand,emaildirec,iddirecteur,emailchef,emailrh,usernamed,user_name,heure_debut,heure_fin) => {
   
      if(rhid_grand==localStorage.getItem('id')){
        if (etat_absrh=="Refusé par rh"){
          alert('L Authorisation est déja refusé')
        }else{

          sendMail(emailrh," IPS Time: Refus de l'authorisation par RH","Vous avez refusé l'authorisation  pour le date de"+date_autorisation+" du "+heure_debut+" à "+heure_fin+" <br> pour l'employé "+user_name+"<br>IPS Time ")
          sendMail(emaildirec,"IPS Time:  Refus de l'authorisation fait par RH","Bonjour "+usernamed+", <br> Nous attenderons votre décision finale de refuser l'authorisation pour le date de"+date_autorisation+" du "+heure_debut+" à "+heure_fin+" pour l'employé "+user_name+"  par votre avis !<br>IPS Time")
         
        const etat_absrh="Refusé par rh"
        if ((etat_abs=="en cours") || (etat_abs=="")){
          const etat_abs="en cours"
          
          return  ValiderConge(idconge,iduser,heure_debut,heure_fin,etat_absrh,etat_abs)

        }}
    } else if(iddirecteur==localStorage.getItem('id'))
    { 
      if (etat_abs=="refusé par Dir"){
            alert('L Authorisation est déja refusé pr Directeur')
          }else{
            sendMail(emaildirec,"Refus de  L Authorisation par Directeur","Vous avez refusé  L Authorisation pour l'employé  "+user_name+"")
            sendMail(emailchef,"Refus de  L Authorisation par Directeur","Votre directeur a refusé  L Authorisation de votre employé  "+user_name+"")
          

            if ((etat_absrh="Refusé par rh") && ((etat_abs= "en cours") || (etat_abs= "confirmé par Dir")) )
            {
               const etat_absrh="Refusé par rh"
              const etat_abs="refusé par Dir"
              
              return  ValiderConge(idconge,iduser,heure_debut,heure_fin,etat_absrh,etat_abs)
  
            }
          
          }}};
    const onClicksupp = (idsu) => {

      return  SupprimerConge(idsu)
    };
    return (  
        <div>
  <div className="container-fluid mt-5">
<div className="row">
  <div className="col">
  <div className="card shadow">
  <div className="card-header border-0">
   </div>
  
  <ScrollContainer className="scroll-container">    
  {Conges.length==0? <h3>Pas des authorisations</h3>
                    :  
   
   <div className="table-responsive" >
   <table  id="example" className="display" >
       <thead className="thead-light">
      <tr>
      <th>ID</th>
      <th>Nom & Prénom Employé</th>
      <th>date_autorisation</th>
      <th>Solde</th>
       
       <th>Contact</th>
       <th>Adresse</th>
       <th>Avis RH</th>
       <th>Avis Directeur</th>
       <th>Heure début</th>
       <th>Heure fin</th>
       <th>Id Employé</th>
       <th>Action</th>
       
      </tr>
       </thead>       
       <tbody>
         
       {Conges.map(us=>
         
   <>  
   <tr>
   <td>{us.idconge}</td>
   <td>{us.user_name}</td>
   
   <td>{us.date_autorisation} </td>
   <td>{us.solde}</td>
   
   <td>{us.contact}</td>
   <td>{us.adresse}</td>
   <td>{us.etat_absrh}</td>
   <td>{us.etat_abs}</td>
   <td>{us.heure_debut}</td>
   <td>{us.heure_fin}</td>
   <td>{us.iduser}</td>
   <td>
   <tr>
     <td><div className="row">
     {us.show  ?
             <a   onClick={() => {onClick(us.idconge,us.iduser,us.date_autorisation,us.etat_absrh,us.etat_abs,us.rhid_grand,us.emaildirec,us.iddirecteur,us.emailchef,us.emailrh,us.usernamed,us.user_name,us.heure_debut,us.heure_fin)}}>
   
   <ThumbUpIcon className={classes.icon}/>
   
   </a>:""}
   
   </div></td>
     <td><div className="row">
     
             {us.show ?
                 <a  onClick={() => { onClickrefus(us.idconge,us.iduser,us.date_autorisation,us.etat_absrh,us.etat_abs,us.rhid_grand,us.emaildirec,us.iddirecteur,us.emailchef,us.emailrh,us.usernamed,us.user_name,us.heure_debut,us.heure_fin) }}>
   <ThumbDownIcon className={classes.icon}/>
   
                 </a>:""}
    </div> </td>
     <td ><div className="row">
       <a  onClick={()=>{handleClickOpensupprimer(us.idconge)}}>
        <DeleteIcon className={classes.icon}/>
   
       </a>
       <Dialog
   
   BackdropProps={{ invisible: true }}
   className={classes.dialog}
   open={opensupprimer}
   onClose={handleClosesupprimer}
   aria-labelledby="alert-dialog-title"
   aria-describedby="alert-dialog-description"
   >
   <DialogTitle id="alert-dialog-title">
     {"Supprimer une authorisation"}
   </DialogTitle>
   <DialogContent>
     <DialogContentText id="alert-dialog-description">
       êtes-vous sûr de vouloir supprimer cette authorisation ?
     </DialogContentText>
   </DialogContent>
   <DialogActions>
     <Button onClick={handleClosesupprimer}>non</Button>
     <Button onClick={()=>{onClicksupp(idcongesupp)}}>
       oui
     </Button>
   </DialogActions>
   </Dialog>
   </div></td>
   
   </tr>
   </td>
   </tr>
   
   </>
   )
   }  </tbody>
     </table>
   
     </div>}</ScrollContainer>
       
{/**<div className="table-responsive">
<table className="table align-items-center table-flush">
  <thead className="thead-light">
    <tr>
    <th scope="col">id</th>
  
    <th scope="col">Employé</th>
   
    
 
      <th scope="col">Etat Absence</th>
      <th scope="col">Heure debut</th>
      <th scope="col">Heure fin</th>
      <th scope="col">Date authorisation</th>
    
      <th scope="col">Validation</th>
    </tr>
  </thead>
  <tbody>
     
    {Conges.filter(x=> x.mission==false && x.date_autorisation!=null).map(conge =>
       <tr key={conge.idconge}>
                <td>{conge.idconge}</td>
              <td>{conge.user_name}</td>
          
            
  
           <td>{conge.validation}</td>
           <td>{conge.heure_debut}</td>
           <td>{conge.heure_fin}</td>
           <td>{conge.date_autorisation}</td>
       
      <td>
                <div className="row">
                  <div className="col-md-4">
                  <a onClick={() => {ValiderConge(conge.idconge,conge.iduser,conge.heure_debut,conge.heure_fin);sendMail(conge.email_chef,"Validation d'autorisation","Vous avez validé l'autorisation de votre employé");sendMail(conge.emailemploye,"validation d'autorisation","Votre chef a validé l'autorisation de votre demande")} }><CheckCircleOutlineIcon className={classes.icon}/></a>
                
                  </div>
                  <div className="col-md-4">
              <a onClick={() => {RefuserConge(conge.idconge,conge.iduser,conge.heure_debut,conge.heure_fin);sendMail(conge.email_chef,"Refus d'autorisation","Vous avez refusé l'autorisation de votre employé");sendMail(conge.emailemploye,"Refus d'autorisation","Votre chef a refusé l'autorisation de votre demande")}}><CancelIcon className={classes.icon}/></a>
                  </div>
                  <div className='col-md-4'>
                  
                    <a onClick={() => {handleClickOpen() ; setcongeIddelete(conge.idconge);setIdUser(conge.iduser); ;setddebut(conge.heure_fin);setdfin(conge.heure_fin)}}><DeleteIcon className={classes.icon} /></a>
                  </div>
                                  </div>
              </td> 
       </tr> 
          )}
         
 
<Dialog
BackdropProps={{ invisible: true }}
className={classes.dialog}
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"supprimer l'authorisation"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer cette authorisation ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { SupprimerConge(congeIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>
 
  </tbody>
</table>
</div> */}

</div> 
</div></div></div></div>
    );
}
 
export default ListeAutorisations;