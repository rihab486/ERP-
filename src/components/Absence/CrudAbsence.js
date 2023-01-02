import React, { useState } from 'react'
import AjouterAbsence from './AjouterAbsence'
import useFetch from '../useFetch'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Mouchard from '../Mouchardd/Mouchard';

import { makeStyles } from '@mui/styles';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ScrollContainer from 'react-indiana-drag-scroll'
import $ from "jquery";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
function CrudAbsence() {
  $(document).ready(function () {
    $('#example').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
const [openn, setOpenn] = useState(false)
const [post, setPost] = useState(false)

  const { data: absences, isload, err } = useFetch("http://127.0.0.1:8000/Absence/")
  const { data: users = [], isl, er } = useFetch("http://127.0.0.1:8000/user/")
  const { data: motifs = [], isloading, error } = useFetch("http://127.0.0.1:8000/motif/")
  const [employes, setemployes] = useState('');
  const [raison, setRaison] = useState('');
  const [datedebut, setDateDebut] = useState('');
  const [datefin, setDatefin] = useState('');
  const [motif_abs, setMotifabsence] = useState('')
  const [absenceId, setabsenceId] = useState('')
  const [open, setOpen] = useState(false);
  const [absenceIddelete, setabsenceIddelete] = useState(null)
  const[justifie,setJustifie]=useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeJustifie = () => {
    setJustifie(!justifie)
   };
  //
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'


    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const classes = useStyle()
  
  function SelectAbsence(id) {
    fetch("http://127.0.0.1:8000/Absence/" + id).then((result) => {
      result.json().then((resp) => {

        setemployes(resp.employes);
        setRaison(resp.raison);

        setDateDebut(resp.datedebut)
        setDatefin(resp.datefin)
        setabsenceId(resp.id)
        setMotifabsence(resp.motif_abs)
        setJustifie(resp.justifie)
     
      })
    })
  }
  const DeleteAbsence = (id) => {

    fetch('http://127.0.0.1:8000/Absence/' + id, {
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

  const UpdateAbsence = () => {

    let absenceList = { raison, datedebut, datefin, motif_abs, employes,justifie }


    fetch('http://127.0.0.1:8000/Absence/' + absenceId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(absenceList)
    }).then((response) =>{
      if(!response.ok){
        alert("ERROR")
      }
      Mouchard("-","modifié",employes,localStorage.getItem('id'),"Modifier abscence  "+datedebut+"au"+datefin)
  }).then((e) => {

 
  }) }

return(
<>
<div className="container-fluid mt-5">
<div className="row">
  <div className="col">
  <div className="card shadow">
  <div className="card-header border-0">
  <AjouterAbsence />

</div>
  

<ScrollContainer className="scroll-container">    
{absences.length==0? <h3>Pas de congés</h3>
                    :     
<div className="table-responsive" >

<table  id="example" className="display">
    <thead className="thead-light">
   <tr>
   <th>Nom & Prénom Employé</th>
    <th>Motif Absence</th>
    <th>Date de début</th>
    <th>Date de fin</th>
    <th>Raison</th>
    <th>Justifié</th>
    <th>Action</th>
    
   </tr>
    </thead>       
    <tbody>
      
    {absences.map(us=>
      
<>  
<tr>
<td>{us.employee}</td>

<td>{us.motif} </td>
<td>{us.datedebut}</td>
<td>{us.datefin}</td>

<td>{us.raison}</td>
<td>{us.justifie? "oui" : "Non"}</td>
<td>
<div className="row">
        
        <div className="col-md-2">
        <a onClick={() => {SelectAbsence(us.id);}} data-toggle="modal" data-target="#absenceupdate" ><EditIcon
          className={classes.icon}
        /></a>
  
        </div>
        <div className="col-md-2">
        <a onClick={() => { handleClickOpen(); setabsenceIddelete(us.id); }}  ><DeleteIcon className={classes.icon} /></a>
        </div>
      </div>
</td>
</tr>

</>
)
}


    </tbody>


   
  </table>

<Dialog

BackdropProps={{ invisible: true }}
className={classes.dialog}
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"supprimer une absence"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer cette absence?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteAbsence(absenceIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>
</div>  }</ScrollContainer> 
 
<div className="container">

<div className="row">
  <div className="col-md-3">



    <div className="modal fade" id="absenceupdate" role="dialog" aria-labelledby="absenceupdate" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Absence</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>



              <div className='row'>
                <div className='col-md-6'>

                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Employé"
                    value={employes}
                    onChange={(e) => { setemployes(e.target.value) }}
                    helperText="Svp sélectionner un employé"
                    margin='normal'
                    fullWidth
                  >
                    {users.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.user_name}
                      </MenuItem>
                    ))}

                  </TextField>

                </div>
                <div className='col-md-6'>
                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Motif"
                    value={motif_abs}
                    onChange={(e) => { setMotifabsence(e.target.value) }}
                    helperText="Svp sélectionner une moti"
                    margin='normal'
                    fullWidth
                  >
                    {motifs.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.motif}
                      </MenuItem>
                    ))}

                  </TextField>
                </div>
              </div>




              <div className='row'>
                <div className='col-md-6'>
                  <div className="form-group">
                    <input className="form-control" value={datedebut} onChange={(e) => setDateDebut(e.target.value)} id="datedebut" placeholder="datedebut" type="datetime"
                    />
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="form-group">
                    <input className="form-control" id="datefin" placeholder="datefin" type="datetime" value={datefin} onChange={(e) => setDatefin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <textarea className='form-control' placeholder='Raison' rows="4" cols="40" value={raison} onChange={(e) => setRaison(e.target.value)}></textarea>
                </div>
                <div className='col-md-6'>

                  <FormControlLabel control={<Checkbox />}  checked={justifie ? true:false} label='Justifié' value={justifie} onChange={handleChangeJustifie} />

                </div>
              </div>





              <br />


              <div className="form-group"><button className="btn btn-primary" onClick={UpdateAbsence}>Valider</button></div>    </form>

          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</div>



</div></div></div></div></>)
}
export default CrudAbsence;