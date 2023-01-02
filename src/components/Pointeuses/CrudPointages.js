

import ImporterPointage from './ImporterPointage'

import useFetch from '../useFetch';


import * as React from 'react';

import { makeStyles } from '@mui/styles';



import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Mouchard from '../Mouchardd/Mouchard';
function CrudPointages() {
  const { data: pointeuses, isloading, error } = useFetch("http://127.0.0.1:8000/pointeuse/")
  const { data: employees, isloading: zz, error: ee } = useFetch("http://127.0.0.1:8000/user/")
  const { data: pointages = [], loadin, err } = useFetch("http://127.0.0.1:8000/pointage/")
  const [date_pointage, setDatePointage] = useState('');
  const [employes, setemploye] = useState('');
  const [pointeuse, setPointeuse] = useState(null);
 
  
  const [pointageId, setPointageId] = useState(null)
  const [pointageIddelete, setPointageIddelete] = useState(null)

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
      color: '#5e72e4',

    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const[dapointage,setdapointage]=useState('')
  const classes = useStyle()
  function SelectPointage(id) {
    fetch("http://127.0.0.1:8000/pointage/" + id).then((result) => {
      result.json().then((resp) => {

        setDatePointage(resp.date_pointage);
        setemploye(resp.employes);

        setPointeuse(resp.pointeuse);
        setPointageId(resp.id)
      
      setdapointage(resp.date_pointage)
      })
    })





  }
  const DeletePointage = (pointageId) => {
    fetch('http://127.0.0.1:8000/deletpointage/' + pointageId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json'
      },
    }).then(() => {
      setOpen(false);
      Mouchard("en cours","supprimé",employ,localStorage.getItem('id'),"Supprimer un pointage")
      window.location.reload(false);
    }
    )


  }
  const UpdatePointage = () => {

    let pointageList = { date_pointage, employes, pointeuse }
    console.warn("item", pointageList)

    fetch('http://127.0.0.1:8000/updatepointage/' + pointageId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pointageList)
    }).then(() => {

      if(date_pointage!=dapointage){
        Mouchard(dapointage,date_pointage,employes,localStorage.getItem('id'),"Modifier : date et heure de pointage")
        }

    }

    )
  }

const[employ,setEmploId]=useState('')

  return (
    <div>
    <div className="container-fluid mt-5">
  <div className="row">
    <div className="col">
    <div className="card shadow">
<div className="card-header border-0">
            <ImporterPointage />
            
            </div>
            <div className="table-responsive">
        <table className="table align-items-center table-flush">
          <thead className="thead-light">
            <tr>
                    <th scope="col">Date et heure de  pointage</th>
                    <th scope="col">Employe</th>
                    <th scope="col">Pointeuse</th>
                
                    <th scope="col">Action</th>

                  </tr>
                </thead>
                <tbody>

                  {pointages.map(pointage =>
                    <tr>
                      <td>{pointage.date_pointage}</td>
                      <td>{pointage.employe}</td>
                      <td>{pointage.pointeusename}</td>
                 
                     
                     
                      <td>
                        <div className="row">
                          <div className="col-md-6">

                            <a onClick={() => SelectPointage(pointage.id)} data-toggle="modal" data-target="#pointageupdate" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>
                          <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setPointageIddelete(pointage.id); setEmploId(pointage.employe)}}  ><DeleteIcon className={classes.icon} /></a>
                                

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
                      {"supprimer un pointage"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        êtes-vous sûr de vouloir supprimer ce pointage ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>non</Button>
                      <Button onClick={() => { DeletePointage(pointageIddelete) }}>
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



                <div className="modal fade" id="pointageupdate"  role="dialog" aria-labelledby="pointageupdate" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="pointageupdate">Modifier Pointage</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">



                        <form>

                        <div className="row">


<div className="col-md-6">

                          <div className="form-group">
                            <div className="input-group input-group-merge input-group-alternative">

                              <input className="form-control" placeholder="Nom et Prénom Utilisateur" value={date_pointage} name="date" onChange={(e) => setDatePointage(e.target.value)} type="datetime-local" />
                            </div>
                          </div>
                          </div>
                         
                    </div>
                          <div className="row">


                            <div className="col-md-6">


                              <TextField
                                id="outlined-select-currency"
                                select
                                label="pointeuse"

                                onChange={(e) => { setPointeuse(e.target.value) }}
                                helperText="Please select pointeuse"
                                margin='normal'
                                fullWidth
                                value={pointeuse}
                              >
                                {pointeuses.map((option) => (
                                  <MenuItem key={option.nom_pointeuse} value={option.id}>
                                    {option.nom_pointeuse}
                                  </MenuItem>
                                ))}
                              </TextField >
                            </div>
                        
                          </div>
                          <div className="row">
                          <div className="col-md-6">
                            <TextField
                              id="outlined-select-currency"
                              select
                              label="employé"
                              value={employes}
                              onChange={(e) => { setemploye(e.target.value) }}
                              helperText="Please select employé"
                              margin='normal'
                              fullWidth
                            >
                              {employees.map((option) => (
                                <MenuItem key={option.username} value={option.id}>
                                  {option.user_name}
                                </MenuItem>
                              ))}

                            </TextField>
                          </div>
</div>

                          <div className="form-group"><button className="btn btn-primary" onClick={UpdatePointage}>Valider</button></div>    </form>


                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div></div></div></div>)

}
export default CrudPointages;