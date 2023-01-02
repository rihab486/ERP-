import React, { useState } from 'react'
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import Button from '@mui/material/Button';

import Mouchard from '../Mouchardd/Mouchard';

import { DataGrid } from '@mui/x-data-grid';
import ScrollContainer from 'react-indiana-drag-scroll'
import $ from "jquery";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';

function CrudCongé(){
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


  const is_active = true     
  const ValiderConge =async (id,iduser,datedebut,datefin,etat_absrh,etat_abs,is_active) => {
  
      fetch('http://127.0.0.1:8000/RetrieveUpdateConge/' + id+"/"+etat_absrh + "/"+etat_abs,  {
          method: 'get',
       
       
      }).then(() => {
       Mouchard("encours","confirmé",iduser,localStorage.getItem('id'),"Validation de congé de "+datedebut+"au"+datefin)
    
    
      window.location.reload(false)
    
    
      }
    
      )
    }
 
  const url="http://127.0.0.1:8000/";
  
  const { data: Conges = [] } = useFetch(url+"TestConges/"+localStorage.getItem("id"))
  
  const[id,setIdConge]=useState(null)
  const[idconge,setidConge]=useState(null)

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
    },
    dialog: {

      boxShadow: 'none',
    }
  });
  
  const classes = useStyle()
  const[iduser,setIdUser]=useState('')
  const[ddebut,setddebut]=useState('')
  const[dfin,setdfin]=useState('')
  const SupprimerConge = (id) => {

    fetch('http://127.0.0.1:8000/SupressionConge/' + id, {
        method: 'DELETE',
        headers: {

            'Content-Type': 'application/json'
        },
    }).then(() => {
        setOpen(false);
        Mouchard("encours","supprimé",iduser,localStorage.getItem('id'),"Suppression de congé de "+ddebut+"au "+dfin)
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

const onClick = (idconge,iduser,datedebut,datefin,etat_absrh,etat_abs,rhid_grand,emaildirec,iddirecteur,emailchef,emailrh,usernamed,user_name) => {
  // don't select this row after clicking
 
  if(rhid_grand==localStorage.getItem('id')){
    if (etat_absrh=="confirmé par rh"){
      alert('Le congé est déja validé')
    }else{
    
    sendMail(emaildirec,
      "IPS Time: Validation de congé fait par RH","Bonjour "+usernamed+", <br> Nous attenderons votre décision finale de valider la demande de congé du"+datedebut+" à "+datefin+" pour l'employé "+user_name+" par une avis favorable!<br>IPS Time")
    sendMail(emailrh,"Validation de congé par RH","Vous avez validé le congé de votre employé  "+user_name+"")
    

    if ((etat_abs=='') ||(etat_abs=='en cours') ) {
      const etat_absrh="confirmé par rh"
      const etat_abs='en cours'
      return  ValiderConge(idconge,iduser,datedebut,datefin,etat_absrh,etat_abs)

    } 
  
  }}
  else if(iddirecteur==localStorage.getItem('id'))
  {
    if (etat_abs=="confirmé par Dir"){
      alert('Le congé est déja validé pr Directeur')
    }else{
      sendMail(emaildirec,"Validation de congé par Directeur","Bonjour "+usernamed+", <br>Vous avez validé le congé pour l'employé "+user_name+"")
      sendMail(emailchef,"Validation de congé par Directeur","Votre directeur a validé le congé de votre employé  "+user_name+"")
      
     if ((etat_absrh="Refusé par rh") && ((etat_abs= "en cours") || (etat_abs= "Refusé par Dir") ))
         {
                const etat_absrh="Refusé par rh"
                const etat_abs="confirmé par Dir"
                
                return  ValiderConge(idconge,iduser,datedebut,datefin,etat_absrh,etat_abs)
    
          }
      
    
    }}
    };
    
const onClickrefus = (idconge,iduser,datedebut,datefin,etat_absrh,etat_abs,rhid_grand,emaildirec,iddirecteur,emailchef,emailrh,usernamed,user_name) => {
     
        if(rhid_grand==localStorage.getItem('id')){
          if (etat_absrh=="Refusé par rh"){
            alert('Le congé est déja refusé')
          }else{

          sendMail(emailrh," IPS Time: Refus de congé par RH","Vous avez refusé le congé  de"+datedebut+" à "+datefin+" <br> pour l'employé "+user_name+"<br>IPS Time ")
          sendMail(emaildirec,"IPS Time:  Refus de congé fait par RH","Bonjour "+usernamed+", <br> Nous attenderons votre décision finale de refuser le congé  de"+datedebut+" à "+datefin+" pour l'employé "+user_name+"  par votre avis !<br>IPS Time")
          
          const etat_absrh="Refusé par rh"
          if ((etat_abs=="en cours") || (etat_abs=="")){
            const etat_abs="en cours"
            return  ValiderConge(idconge,iduser,datedebut,datefin,etat_absrh,etat_abs)

          }
          
        
        }
      }  else if(iddirecteur==localStorage.getItem('id'))
      { 
        if (etat_abs=="refusé par Dir"){
              alert('Le congé est déja refusé pr Directeur')
            }else{
              sendMail(emaildirec,"Refus de congé par Directeur","Vous avez refusé le congé pour l'employé  "+user_name+"")
              sendMail(emailchef,"Refus de congé par Directeur","Votre directeur a refusé le congé de votre employé  "+user_name+"")

              if ((etat_absrh="Refusé par rh") && ((etat_abs= "en cours") || (etat_abs= "confirmé par Dir")) )
              {
                 const etat_absrh="Refusé par rh"
                const etat_abs="refusé par Dir"
                
                return  ValiderConge(idconge,iduser,datedebut,datefin,etat_absrh,etat_abs)
    
              }
              
            
            }

      }
    
       
    };
    const onClicksupp = (idsu) => {
     
    
      return  SupprimerConge(idsu)
    };

const RefuserConge = (id,iduser,datedebut,datefin,etat_absrh,etat_abs,is_active) => {

    let List = {etat_absrh, etat_abs }
  
  
    fetch('http://127.0.0.1:8000/RefusConge/' + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(List)
    }).then(() => {
      Mouchard("encours","refusé",iduser,localStorage.getItem('id'),"Refus de congé de " +datedebut+"au "+datefin)


   window.location.reload(false)
  
    }).catch((e)=>{
  

    })
  }
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
  
return (
  <div>

  <div className="container-fluid mt-5">
    <div className="row">
      <div className="col">
        <div className="card shadow">
  <div className="card-header border-0">
         </div>
  
<ScrollContainer className="scroll-container">    
{Conges.length==0? <h3>Pas de congés</h3>
                    : 

<div className="table-responsive" >
<table  id="example"  className="display" >
    <thead className="thead-light">
   <tr>
   <th>ID</th>
   <th>Nom & Prénom Employé</th>
   <th>Solde</th>
    
    <th>Date de début</th>
    <th>Date de fin</th>
    <th>Contact</th>
    <th>Adresse</th>
    <th>Avis RH</th>
    <th>Avis Directeur</th>
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

<td>{us.solde} </td>
<td>{us.datedebut}</td>
<td>{us.datefin}</td>
<td>{us.contact}</td>
<td>{us.adresse}</td>
<td>{us.etat_absrh}</td>
<td>{us.etat_abs}</td>
<td>{us.iduser}</td>
<td>
<tr>
  <td><div className="row">
 
  {us.show  ?
          <a   onClick={() => {onClick(us.idconge,us.iduser,us.datedebut,us.datefin,us.etat_absrh,us.etat_abs,us.rhid_grand,us.emaildirec,us.iddirecteur,us.emailchef,us.emailrh,us.usernamed,us.user_name)}}>

<ThumbUpIcon className={classes.icon}/>


</a>:""}</div></td>


  <td><div className="row">
  {us.show ?
              <a  onClick={() => { onClickrefus(us.idconge,us.iduser,us.datedebut,us.datefin,us.etat_absrh,us.etat_abs,us.rhid_grand,us.emaildirec,us.iddirecteur,us.emailchef,us.emailrh,us.usernamed,us.user_name) }}>
<ThumbDownIcon className={classes.icon}/>

              </a>:""}</div></td>
  
            <td> <div className="row"> <a  onClick={()=>{handleClickOpensupprimer(us.idconge)}}>
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
  {"Supprimer un congé"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer ce congé ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClosesupprimer}>non</Button>
  <Button onClick={()=>{onClicksupp(idcongesupp)}}>
    oui
  </Button>
</DialogActions>
</Dialog></div></td>
 


</tr>
</td>
</tr>

</>
)
}


    </tbody>


   
  </table>




  </div>}
</ScrollContainer>
 
    </div></div>
</div> 
</div></div>
)
}
export default CrudCongé;