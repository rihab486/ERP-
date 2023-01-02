import React,{useState} from "react";
import useFetch from "../useFetch";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';



import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Mouchard from '../Mouchardd/Mouchard';
const Missions = () => {
    const url="http://127.0.0.1:8000/";
    const { data: Conges = [], isloading, error } = useFetch(url+"TestConges/"+localStorage.getItem("id"))
    const[congeIddelete,setcongeIddelete]=useState(null)
    const [open, setOpen] = useState(false);
    const useStyle = makeStyles({
      icon: {
        marginRight: 10,
        marginLeft: 10,
        color: '#5e72e4'
  
  
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
  
  const ValiderConge =(id,iduser,heuredebut,heurefin) => {
  
    const etat_abs='confirmé'
     
    
    
      fetch('http://127.0.0.1:8000/RetrieveUpdateConge/' + id, {
          method: 'get',
       
       
      }).then(() => {
        Mouchard("encours","confirmé",iduser,localStorage.getItem('id'),"Validation d'autorisation de "+heuredebut+"au"+heurefin)

        window.location.reload(false)
    
    
      }
    
      )
    }
  const RefuserConge = (id,iduser,heuredebut,heurefin) => {
    const etat_abs='refusé'
      let List = { etat_abs }
    
    
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
    return (  
        <div>
  <div className="container-fluid mt--7">
<div className="row">
  <div className="col">
  <div className="card shadow">
  <div className="card-header border-0">
          
      </div>
<div className="table-responsive">
<table className="table align-items-center table-flush">
  <thead className="thead-light">
    <tr>
      
  
    <th scope="col">Employé</th>
   
    
   
  
      <th scope="col">Etat Absence</th>
      <th scope="col">Heure debut</th>
      <th scope="col">Heure fin</th>
      <th scope="col">Date authorisation</th>
   
      <th scope="col">Validation</th>
    </tr>
  </thead>
  <tbody>

     
    {Conges.filter(x=>x.heure_debut !==null && x.mission==true).map(conge =>
       <tr>
              
              <td>{conge.user_name}</td>
          
     
     
           <td>{conge.etat_abs}</td>
           <td>{conge.heure_debut}</td>
           <td>{conge.heure_fin}</td>
           <td>{conge.date_autorisation}</td>
        
      <td>
                <div class="row">

                  <div className="col-md-4">
                  <a onClick={() => {ValiderConge(conge.id,conge.iduser,conge.heure_debut,conge.heure_fin);sendMail(conge.email_chef,"Validation de mission","Vous avez validé la mission de votre employé");sendMail(conge.emailemploye,"validation de  mission","Votre chef a validé la mission de votre demende")} }><CheckCircleOutlineIcon className={classes.icon}/></a>
                
                  </div>
                  <div className="col-md-4">
              <a onClick={() => {RefuserConge(conge.id,conge.iduser,conge.heure_debut,conge.heure_fin);sendMail(conge.email_chef,"Refus de mission","Vous avez refusé la mission de votre employé");sendMail(conge.emailemploye,"Refus de mission","Votre chef a refusé la mission de votre demende")}}><CancelIcon className={classes.icon}/></a>

                  </div>
                  <div className='col-md-4'>
                  
                    <a onClick={() => {handleClickOpen() ; setcongeIddelete(conge.id);setIdUser(conge.iduser); ;setddebut(conge.heure_fin);setdfin(conge.heure_fin)}}><DeleteIcon className={classes.icon} /></a>
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
  {"supprimer un role"}
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
</div>

</div> 
</div></div></div></div>
    );
}
 
export default Missions;