import React from 'react';

import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';


import ScrollContainer from 'react-indiana-drag-scroll'

import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AjouterUneauthorisation from './AjouterUneauthorisation';
import $ from "jquery";

function CrudAuthorisations(){
  $(document).ready(function () {
    $('#jjj').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
  
  const[congeIddelete,setcongeIddelete]=useState('')
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'



,

    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyle()
  const DeleteCongé = (congeId) => {
    fetch(url+'SupressionConge/' + congeId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json'
      },
    }).then(() => {
      setOpen(false);
      window.location.reload(false);
    }
    )


  }
    const url="http://127.0.0.1:8000/";
    const { data: conges = [], isloading, error } = useFetch(url+"AffichageDemendesConges/"+localStorage.getItem('id'))
    return(
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
      <div className="card-header border-0">
      <AjouterUneauthorisation/>
      </div>
      

      <ScrollContainer className="scroll-container">
      {conges.length==0? <h3>Pas de authorisations</h3>
         :
      <div className="table-responsive">
        
        <table id="jjj" className="display">
        <thead className="thead-light">
    <tr>

     <th scope="col">Employé</th>
       <th scope="col">Type</th>
      
   
      <th scope="col">Contact</th>
      <th scope="col">Adresse</th>
      
      <th scope="col">Justification</th>
     
      <th scope="col">Heure debut</th>
      <th scope="col">Heure fin</th>
      <th scope="col">Date authorisation</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>

    {conges.filter(x=>  x.date_autorisation!=null).map(conge =>
          <tr key={conge.idconge}>
              <td>{conge.user_name}</td>
              <td>{conge.date_autorisation ? "autorisation" :"" }</td>
           
           <td>{conge.contact}</td>
           
           <td>{conge.adresse}</td>
         
       
           <td>{conge.justif}</td>
     
           <td>{conge.heure_debut}</td>
           <td>{conge.heure_fin}</td>
           <td>{conge.date_autorisation}</td>
           <td>
                        
           <a onClick={() => { handleClickOpen(); setcongeIddelete(conge.idconge); }}  ><DeleteIcon className={classes.icon} /></a>

                         
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
  {"supprimer un contrat"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer cette demande de congé ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteCongé(congeIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>

  </tbody>
        </table>
        </div>}</ScrollContainer>
      
  
    </div> 

          </div>
        </div>
        </div>
      </div> )
}
export default CrudAuthorisations;