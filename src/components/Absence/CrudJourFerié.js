import React, { useState } from 'react';
import AjouterjourFerié from './AjouterjourFerié';
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ScrollContainer from 'react-indiana-drag-scroll'
import $ from "jquery";

function CrudJourFerié(){
  $(document).ready(function () {
    $('#jrf').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
    const { data: joursFeriés, isload, err } = useFetch("http://127.0.0.1:8000/JourFerie/")
    const [nom, setNom] = useState('');
    const [etat_jour, setetatJour] = useState('');
    const [date, setDate] = useState('');
    const [datefin, setDatefin] = useState('');
    const[idjour,setjourId]=useState(null);
    const[jouriddelet,setJourIddelete]=useState(null)
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
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
      function SelectJour(id) {
        fetch("http://127.0.0.1:8000/JourFerie/" + id).then((result) => {
          result.json().then((resp) => {
       
           setNom(resp.nom);
           setetatJour(resp.etat_jour);
           setDate(resp.date);
           setDatefin(resp.datefin);
          setjourId(resp.id)
          })
        })
      }
      const DeletejourFerié = (id) => {
    
        fetch('http://127.0.0.1:8000/JourFerie/' + id, {
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
    
      const UpdateJourFerié = () => {
    
        let JourFeriéList = { nom,date,datefin,etat_jour }
    
    
        fetch('http://127.0.0.1:8000/JourFerie/' + idjour, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(JourFeriéList)
        }).then(() => {
    
      
    
        }
    
        )
    
    
      }
    
return(
  <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
      <div className="card-header border-0">
            <AjouterjourFerié/>
  </div>
  <ScrollContainer className="scroll-container">  
  {joursFeriés.length==0? <h3>Pas de joursFeriés</h3>
  :

  <div className="table-responsive">
        <table id="jrf" className="display">
          <thead className="thead-light">
            <tr>
              
                    <th scope="col">Nom de jour ferié</th>
                    <th scope="col">Type</th>

                    <th scope="col">Date</th>
                    <th scope="col">Nombre de jours</th>
                   
                    <th scope="col">Action</th>

                  </tr>
                </thead>
                <tbody>

                  {joursFeriés.map(jour =>
                    <tr key={jour.id}>
                      <td>{jour.nom}</td>
                      <td> {jour.etat_jour}</td>
                      <td>{jour.date}</td>
                      <td>{jour.datefin}</td>
                      <td>
                     <div className="row">
                          <div className="col-md-6">

                            <a onClick={() => SelectJour(jour.id)} data-toggle="modal" data-target="#jourupdate" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>
                          <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setJourIddelete(jour.id); }} ><DeleteIcon className={classes.icon} /></a>


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
                      {"supprimer un jour ferié"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        êtes-vous sûr de vouloir supprimer ce jour ferié?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>non</Button>
                      <Button onClick={() => { DeletejourFerié(jouriddelet) }}>
                        oui
                      </Button>
                    </DialogActions>
                  </Dialog>  
                </tbody>
              </table>
            </div>}</ScrollContainer>

            </div>
            <div>

<div className="row">
  <div className="col-md-3">



    <div className="modal fade" id="jourupdate" role="dialog" aria-labelledby="jourupdate" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Jour Ferié</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          
          <form>

<div className='row'>
    <div className='col-md-6'>
        <div className="form-group">


            <input className="form-control" placeholder="nom jour Ferié" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />

        </div>

    </div>
    <div className='col-md-6'>
    <div className="form-group">


<input className="form-control" placeholder="nom jour Ferié" value={etat_jour} name="nom"  onChange={(e) => { setetatJour(e.target.value) }} type="text" />

</div>
     
    </div>
</div>




<div className='row'>
    <div className='col-md-6'>
        <div className="form-group">
            <input className="form-control" value={date} onChange={(e) => setDate(e.target.value)} id="date"  type="datetime-local"
            />
        </div>
    </div>
    <div className='col-md-6'>
        <div className="form-group">


            <input className="form-control" placeholder="nombre de jours feriés" value={datefin} name="Datefin" onChange={(e) => setDatefin(e.target.value)} type="datetime-local" />

        </div>
    </div>
</div>



          
                <div className="form-group"><button className="btn btn-primary" onClick={UpdateJourFerié}>Valider</button></div>    </form>

          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</div>
            </div></div></div></div>)
}
export default CrudJourFerié;