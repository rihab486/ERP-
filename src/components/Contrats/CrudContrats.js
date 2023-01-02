import React from 'react';
import AjouterContrat from './AjouterContrat';
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';




import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function CrudContrats() {
    const url="http://127.0.0.1:8000/";
    const { data: contrats = [], isloading, error } = useFetch(url+"contrats/")
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
      const [open, setOpen] = useState(false);
      const [contratIddelete, setcontratIddelete] = useState(null)
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
    
      const [contratname, setNomContrat] = useState('');
    
      const [contratId, setContratId] = useState(null)
      function SelectContrat(id) {
        fetch(url+"contrats/" + id).then((result) => {
          result.json().then((resp) => {
            console.log(resp)
            setNomContrat(resp.contratname);
            setContratId(resp.id)
    
          })
        })
    
    
    
    
    
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'contrats/' + contratId, {
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
    
      const Updatecontrat = () => {
    
        let contratList = { contratname }
    
    
        fetch(url+'contrats/' + contratId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contratList)
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
           <AjouterContrat />
      </div>
      <div className="table-responsive">
        <table className="table align-items-center table-flush">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Contrat</th>
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {contrats.map(contrat =>
                    <tr key={contrat.id}>
                      <td >{contrat.contratname}</td>
                      <td>
                        <div className="row">

                          <div className="col-md-6">

                            <a onClick={() => SelectContrat(contrat.id)} data-toggle="modal" data-target="#modalcontrat" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>
                          <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setcontratIddelete(contrat.id); }}  ><DeleteIcon className={classes.icon} /></a>


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
  {"supprimer un contrat"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer un contrat ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteContrat(contratIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>

             
         
          </tbody>
        </table>
      </div>
  
    </div> 
    <div className="container">





    <div className="modal fade" id="modalcontrat"  role="dialog" aria-labelledby="modalcontrat" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Le Contrat</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



              <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="Nom de Contrat" value={contratname} name="contratname" onChange={(e) => setNomContrat(e.target.value)} type="text" />
                </div>
              </div>



              <div className="form-group"><button className="btn btn-primary" onClick={Updatecontrat}>Valider</button></div>    </form>


          </div>

        </div>
      </div>
   

</div>
</div>
          </div>
        </div>
        </div>
      </div>
    )
}
export default CrudContrats;