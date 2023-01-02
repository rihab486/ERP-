import React, { useState } from 'react';
import useFetch from '../useFetch';
import AjouterPlansemaine from './AjouterPlansemaine';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function CrudPlansemaine() {
  const { data: planssemaines = [], isloadin, err } = useFetch("http://127.0.0.1:8000/plansemaine/")
  const { data: Horraires = [], isloading, error } = useFetch("http://127.0.0.1:8000/horaire/")
  const [open, setOpen] = useState(false);
  const [plansemaineIddelete, setplansemaineIddelete] = useState('')
  const [lundi, setLundii] = useState('');
  const [mardi, setMardii] = useState('');
  const [mercredi, setMercredii] = useState('');
  const [jeudi, setJeudii] = useState('');
  const [vendredi, setVendredii] = useState('');
  const [samedi, setSamedii] = useState('');
  const [dimanche, setDimanchee] = useState('');
  const [plansemaineId, setPlanSemaineId] = useState('')
  const [nomsemaine, setPlansemaine] = useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
  function SelectPlanSemaine(id) {
    fetch("http://127.0.0.1:8000/plansemaine/" + id).then((result) => {
      result.json().then((resp) => {

        setLundii(resp.lundi);
        setMardii(resp.mardi);

        setMercredii(resp.mercredi)
        setJeudii(resp.jeudi)
        setVendredii(resp.vendredi)
        setSamedii(resp.samedi)
        setDimanchee(resp.dimanche)
        setPlanSemaineId(resp.id)
        setPlansemaine(resp.nomsemaine)

      })
    })
  }
  const DeletePlanSemaine = (id) => {

    fetch('http://127.0.0.1:8000/plansemaine/' + id, {
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

  const UpdatePlanSemaine = () => {

    let jourList = { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche, nomsemaine }


    fetch('http://127.0.0.1:8000/plansemaine/' + plansemaineId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jourList)
    }).then(() => {



    }

    ).catch((e) => {

      console.log(plansemaineId)
    })


  }

  
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <AjouterPlansemaine />
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom</th>
                      <th scope="col">Lundi</th>
                      <th scope="col">Mardi</th>
                      <th scope="col">Mercredi</th>
                      <th scope="col">Jeudi</th>
                      <th scope="col">Vendredi</th>
                      <th scope="col">Samedi</th>
                      <th scope="col">Dimanche</th>
                      <th scope="col">action</th>


                    </tr>
                  </thead>
                  <tbody>

                    {planssemaines.map(plansemaine =>
                      <tr key={plansemaine.id}>
                        <td>{plansemaine.nomsemaine}</td>
                        <td>{plansemaine.lu}</td>
                        <td> {plansemaine.ma}</td>
                        <td>{plansemaine.me}</td>
                        <td>{plansemaine.je}</td>
                        <td>{plansemaine.ve}</td>
                        <td>{plansemaine.sa}</td>
                        <td>{plansemaine.di}</td>

                        <td>
                          <div className="row">
                            <div className="col-md-3">
                              <a onClick={() => SelectPlanSemaine(plansemaine.id)} data-toggle="modal" data-target="#plansemaine" ><EditIcon
                                className={classes.icon}
                              /></a>
                            </div>
                            <div className="col-md-3">
                              <a onClick={() => { handleClickOpen(); setplansemaineIddelete(plansemaine.id); }}  ><DeleteIcon className={classes.icon} /></a>
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
                        {"supprimer un plan de semaine"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer un plan de semaine ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeletePlanSemaine(plansemaineIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="container">





              <div className="modal fade" id="plansemaine" role="dialog" aria-labelledby="plansemaine" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Modifier le  Plan de Semaine</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">



                      <form>


                        <div className='row'>
                          <div className='col-md-6'>
                            <div className="form-group">


                              <input className="form-control" placeholder="Nom de plan semaine" value={nomsemaine} name="nom" onChange={(e) => setPlansemaine(e.target.value)} type="text" />

                            </div>
                          </div>
                        </div>



                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Lundi"
                          value={lundi}
                          onChange={(e) => { setLundii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
                          <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>




                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Mardi"
                          value={mardi}
                          onChange={(e) => { setMardii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
                          <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Mercredi"
                          value={mercredi}
                          onChange={(e) => { setMercredii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Jeudi"
                          value={jeudi}
                          onChange={(e) => { setJeudii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Vendredi"
                          value={vendredi}
                          onChange={(e) => { setVendredii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Samedi"
                          value={samedi}
                          onChange={(e) => { setSamedii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Dimanche"
                          value={dimanche}
                          onChange={(e) => { setDimanchee(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>


                        <div className="form-group"><button className="btn btn-primary" type="submit" onClick={UpdatePlanSemaine} >Valider</button></div>    </form>

                    </div>
                    <div className="modal-footer">



                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div></div></div>
  )
}
export default CrudPlansemaine;