import useFetch from '../useFetch';

import AjouterMotif from './AjouterMotif';
import * as React from 'react';

import { makeStyles } from '@mui/styles';



import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";

import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function CrudMotif() {
 

 
  const { data: motifs = [] } = useFetch("http://127.0.0.1:8000/motif/")

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
  const [motifIddelete, setmotifIddelete] = useState(null)
  const [motif, setNomMotif] = useState('')
  const [motifId, setMotifId] = useState(null)
  
  const[motifConge,setmotifConge]=useState(false)
  const handleChangeMotifCongé = () => {
    setmotifConge(!motifConge)
   };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyle()



  function SelectMotif(id) {
    fetch("http://127.0.0.1:8000/motif/" + id).then((result) => {
      result.json().then((resp) => {
        setNomMotif(resp.motif);
        setMotifId(resp.id)
setmotifConge(resp.motifConge)
      })
    })





  }
  const DeleteMotif = (motifId) => {
    fetch('http://127.0.0.1:8000/motif/' + motifId, {
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

  const Updatemotif = () => {

    let motifList = { motif,motifConge }


    fetch('http://127.0.0.1:8000/motif/' + motifId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(motifList)
    }).then(() => {



    }

    )
  }
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <AjouterMotif />
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>

                      <th scope="col">Motifs</th>
                      <th scope="col">type de Motif</th>
                  

                      <th scope="col">Action</th>

                    </tr>
                  </thead>
                  <tbody>


                    {motifs.map(mot =>
                      <tr key={mot.id}>
                        <td>{mot.motif}</td>
                 
                          <td>{mot.motifConge ? "congé" :"abscence" }</td>

                     
                     

                        <td>
                          <div className="row">

                            <div className="col-md-6">

                              <a onClick={() => SelectMotif(mot.id)} data-toggle="modal" data-target="#modalmotif" ><EditIcon
                                className={classes.icon}
                              /></a>
                            </div>
                            <div className="col-md-6">
                              <a onClick={() => { handleClickOpen(); setmotifIddelete(mot.id); }}  ><DeleteIcon className={classes.icon} /></a>


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
                        {"supprimer un motif"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer un motif ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteMotif(motifIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>




                  </tbody>
                </table>
              </div>
            </div>
            <div className="container">

              <div className="row">
                <div className="col-md-3">



                  <div className="modal fade" id="modalmotif" role="dialog" aria-labelledby="modalmotif" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Modifier un motif</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>



                            <div className="form-group">
                              <div className="input-group input-group-merge input-group-alternative">

                                <input className="form-control" placeholder="Nom de motif" value={motif} name="rolename" onChange={(e) => setNomMotif(e.target.value)} type="text" />
                              </div>
                            </div>
                            <div className='row'>
 

</div>



                            <div className="form-group"><button className="btn btn-primary" onClick={Updatemotif}>Valider</button></div>    </form>


                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>



          </div></div></div></div>
  )



}


export default CrudMotif;