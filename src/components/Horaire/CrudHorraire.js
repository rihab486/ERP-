import useFetch from '../useFetch';
import { Component } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import * as React from 'react';
import { DataGrid, selectedIdsLookupSelector } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import { Redirect, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { format } from 'date-fns';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import NumberFormat from 'react-number-format';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AjouterdesHoraires from './AjouterdesHoraires';
import ScrollContainer from 'react-indiana-drag-scroll'
import MenuItem from '@mui/material/MenuItem';

import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";

import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5';



import $ from "jquery";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString

    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
function CrudHorraire() {
  const { data: horaires = [] } = useFetch("http://127.0.0.1:8000/horaire/")

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






,

    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const classes = useStyle()



  const [horaireId, sethoraire] = useState(null)
  const [HoraireIddelete, setHoraireIddelete] = useState(null)
  //const [gettime, setgtime] = useState({debut : format(new Date(), 'HH:mm:ss'), fin : format(new Date(), 'HH:mm:ss') , debutentree :  format(new Date(), 'HH:mm:ss'), finentree :  format(new Date(), 'HH:mm:ss'), margeretard : format(new Date(), 'HH:mm:ss') ,margedepartant : format(new Date(), 'HH:mm:ss'), debutpause : format(new Date(), 'HH:mm:ss') , finpause :format(new Date(), 'HH:mm:ss') , debutsortie : format(new Date(), 'HH:mm:ss'), finsortie : format(new Date(), 'HH:mm') ,  nom :"aa",motif_horaire:null});

  const [debut, setdebut] = useState(format(new Date(), 'HH:mm:ss'))
  const [fin, setfin] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutentree, setdebutentree] = useState(format(new Date(), 'HH:mm:ss'))
  const [finentree, setfinentree] = useState(format(new Date(), 'HH:mm:ss'))
  const [margeretard, setmargeretard] = useState(format(new Date(), 'mm'))
  const [margedepartant, setmargedepartant] = useState(format(new Date(), 'mm'))
  const [debutpause, setdebutpause] = useState(format(new Date(), 'HH:mm:ss'))
  const [finpause, setfinpause] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutsortie, setdebutsortie] = useState(format(new Date(), 'HH:mm:ss'))
  const [finsortie, setfinsortie] = useState(format(new Date(), 'HH:mm:ss'))
  const [nom, setnom] = useState("")
  const [jourtravaille, setjour] = useState('')
  const [varnuit, setVarnuit] = useState('')
  const [margeheuresupp, setmargeheuresupp] = useState(format(new Date(), 'mm'))


  //const [aff, setaff] = useState({debutaf : new Date(), finaf :  new Date() , debutentreeaf :  new Date() , finentreeaf :  new Date() , margeretardaf : new Date() , margedepardantaf : new Date() , debutpauseaf : new Date(), finpauseaf : new Date(), debutsortieaf : new Date(), finsortieaf : new Date()});
  const [debutaf, setDebutaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finaf, setfinaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutentreeaf, setEntreAf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finentreeaf, setfinentreeaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [margeretaraf, setMargeretardAf] = useState(format(new Date(), 'mm'))
  const [margedepartantaf, setmargedepardantaf] = useState(format(new Date(), 'mm'))
  const [debutpauseaf, setdebutpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finpauseaf, setfinpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutsortieaf, setdebutsortieaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finsortieaf, setfinsortieaf] = useState(format(new Date(), 'HH:mm:ss'))

  const [nomaf, setNom] = useState('aa')
  const [jourtravailleaf, setJourtravaille] = useState('')
  const [varnuits,setvarnuit] = useState('')
  const [margeheuresuppf, setmargeheuresuppf] = useState(format(new Date(), 'mm'))

  const [checked, setChecked] = React.useState(false);
  const handleChanges = (event) => {
    setChecked(!checked);
  };

  function SelectHoraire(id) {
    fetch("http://127.0.0.1:8000/horaire/" + id).then((result) => {
      result.json().then((resp) => {
        sethoraire(resp.id);
        setJourtravaille(resp.jourtravaille)
        setNom(resp.nom)
        setvarnuit(resp.varnuit)

        setDebutaf(new Date('2018-02-14T' + resp.debut + '.000'))
        setfinaf(new Date('2019-01-01T' + resp.fin + '.000'))
        setEntreAf(new Date('2018-02-14T' + resp.debutentree + '.000'))
        setfinentreeaf(new Date('2018-02-14T' + resp.finentree + '.000'))

        setMargeretardAf(new Date('2018-02-14T00:' + resp.margeretard + ':00.000'))
        setmargedepardantaf(new Date('2018-02-14T00:' + resp.margedepartant + ':00.000'))
        setmargeheuresuppf(new Date('2018-02-14T00:' +resp.margeheuresupp  + ':00.000'))

        setdebutpauseaf(new Date('2018-02-14T' + resp.debutpause + '.000'))
        setfinpauseaf(new Date('2018-02-14T' + resp.finpause + '.000'))

        setdebutsortieaf(new Date('2018-02-14T' + resp.debutsortie + '.000'))
        setfinsortieaf(new Date('2018-02-14T' + resp.finsortie + '.000'))
        setnom(resp.nom)
        setdebut(resp.debut)
        setfin(resp.fin)
        setVarnuit(resp.varnuit)
        setmargeheuresupp(resp.margeheuresupp)

        setdebutentree(resp.debutentree)
        setfinentree(resp.finentree)
        setmargeretard(resp.margeretard)
        setmargedepartant(resp.margedepartant)
        setdebutpause(resp.debutpause)
        setfinpause(resp.finpause)
        setdebutsortie(resp.debutsortie)
        setfinsortie(resp.finsortie)
        setjour(resp.jourtravaille)
       

      })
    })
  }



  const DeleteHoraire = (horaireId) => {
    fetch('http://127.0.0.1:8000/horaire/' + horaireId, {
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
  const UpdateHoraire = () => {
if (debutentree!="00:00:00" && finentree!="00:00:00" && debutsortie!="00:00:00" && finsortie!="00:00:00") {
    const gettime = { debut, fin, debutentree, finentree, margeretard, margedepartant, debutpause, finpause, debutsortie, finsortie, nom, jourtravaille,margeheuresupp,varnuit}

    fetch('http://127.0.0.1:8000/horaire/' + horaireId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gettime)
    }).then(() => {
      
      //alert('erreur update horaire')

    }

    ).catch((e) => {

  
      console.log("error", e)
    })} else {
      alert('il faut que debut entrée ,fin entrée ,debut sortie et fin sortie differents de zéro !')

    }
  }



  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
              {localStorage.getItem('view_horaire_rh')=="true"?"": 
                <AjouterdesHoraires />}
              </div>
              <div className="table-responsive">
              <ScrollContainer className="scroll-container">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>

                      <th scope="col" style={{width:"5%"}}>Nom</th>
             


                      <th style={{width:"5%"}} scope="col">debut </th>
                      <th style={{width:"5%"}} scope="col">fin </th>
                      <th style={{width:"10%"}} scope="col">d.Entrée</th>
                      <th style={{width:"5%"}} scope="col">f.Entrée</th>
                      <th style={{width:"5%"}} scope="col">m.retard </th>
                      <th style={{width:"5%"}} scope="col">m dep ant </th>
                      <th style={{width:"5%"}} scope="col">m.h.Supp</th>
                      <th style={{width:"10%"}}  scope="col">d. pause </th>
                      <th style={{width:"10%"}} scope="col">f. pause </th>
                      <th style={{width:"5%"}} scope="col">d. sortie  </th>
                      <th style={{width:"5%"}} scope="col">f.sortie  </th>
                      <th style={{width:"5%"}} scope="col">Jr Trav</th>
                      <th style={{width:"5%"}} scope="col">Motif</th>
                      <th style={{width:"25%"}} scope="col">Action  </th>

                    </tr>
                  </thead>
                  <tbody>


                    {horaires.map(horaire =>
                      <tr key={horaire.id}>
                         <td>{horaire.nom}</td>
                        <td>{horaire.debut}</td>
                        <td>{horaire.fin}</td>
                        <td>{horaire.debutentree}</td>
                        <td>{horaire.finentree}</td>
                        <td>{horaire.margeretard}</td>
                        <td>{horaire.margedepartant}</td>
                        <td>{horaire.margeheuresupp}</td>

                        <td>{horaire.debutpause}</td>
                        <td>{horaire.finpause}</td>
                        <td>{horaire.debutsortie}</td>
                        <td>{horaire.finsortie}</td>

                        <td>{horaire.jourtravaille}</td>
                        <td>{horaire.varnuit==1 ?"Jour ":"Nuit"}</td>
                        <td>
                          <div className="row">
                            <div className="col-md-6">
                              <a onClick={() => SelectHoraire(horaire.id)} data-toggle="modal" data-target="#updateHoraire" ><EditIcon
                                className={classes.icon}
                              /></a>
                            </div>
                            <div className="col-md-6">
                              <a onClick={() => { handleClickOpen(); setHoraireIddelete(horaire.id); }}  ><DeleteIcon className={classes.icon} /></a>
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
                        {"supprimer un horaire"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer cet Horaire ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteHoraire(HoraireIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </tbody>
                </table>
              </ScrollContainer>
              </div>
            </div></div>
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="modal fade" id="updateHoraire" role="dialog" aria-labelledby="updateHoraire" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modifier l'horaire</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">

                        <form>
                          <div className="row">

                            <div className="col-md-6  pt-4">
                              <div className="form-group">


                                <input className="form-control" placeholder="Nom d'horaire" value={nomaf} name="nom" onChange={(e) => { setnom(e.target.value); setNom(e.target.value) }} type="text" />
                              </div>
                            </div>

                            <div className='col-md-6'>
                            <TextField
                        id="outlined-select-currency"
                        select
                        label="Jour Travail"
                        value={jourtravailleaf}
                        onChange={(e) => { setJourtravaille(e.target.value); setjour(e.target.value) }} 
                        helperText=""
                        margin='normal'
                        fullWidth
                      >

                        <MenuItem key="1" value="1">
                        1
                        </MenuItem>
                        <MenuItem key="2" value="0.5">
                    0.5
                        </MenuItem>
                     

                      </TextField>

                           
                            </div>





                          </div>
                          <div className="row">
                          <div className='col-md-5'>
                                    
                                    
                                    <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Choix"
                                    value={varnuits}
                                    onChange={(e) => {setVarnuit(e.target.value) ; setvarnuit(e.target.value) }}
                                    helperText="faite le choix"
                                    margin='normal'
                                    fullWidth
                                    >
                                     <MenuItem value={true} key="1">Jour</MenuItem>
                                      <MenuItem value={false} key="2">Nuit</MenuItem>
                                    
                                    </TextField>
            
                                          </div>
                          <div className="col-md-5">
                            <div className="form-group">

                                <div className="input-group input-group-merge input-group-alternative">


                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker

                                    views={['minutes']}
                                    inputFormat="mm"

                                    label="Marge heure supp(min)"
                                    ampm={false}
                                    value={margeheuresuppf}

                                    onChange={(h) => {
                                        setmargeheuresuppf(h)
                                        setmargeheuresupp(h.toLocaleTimeString([], { minute: '2-digit' }))

                                    }}
                                    renderInput={props => <TextField {...props} />}
                                    />
                                </LocalizationProvider>              </div>
                                </div>
                                                            </div></div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">

                                <div className="input-group input-group-merge input-group-alternative">


                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker

                                      views={['minutes']}
                                      inputFormat="mm"

                                      label="Marge de retard(min)"
                                      ampm={false}
                                      value={margeretaraf}

                                      onChange={(h) => {
                                        setMargeretardAf(h)
                                        setmargeretard(h.toLocaleTimeString([], { minute: '2-digit' }))

                                      }}
                                      renderInput={props => <TextField {...props} />}
                                    />
                                  </LocalizationProvider>              </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">


                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Marge de Dp.anticipé(min)"
                                      ampm={false}
                                      format="HH:mm"
                                      openTo="minutes"
                                      views={['minutes']}
                                      inputFormat="mm"


                                      value={margedepartantaf}
                                      onChange={(h) => {
                                        setmargedepardantaf(h)

                                        setmargedepartant(h.toLocaleTimeString([], { minute: '2-digit' }))
                                      }}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>



                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="debut"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutaf}
                                      onChange={(h) => {
                                        setDebutaf(h)

                                        setdebut(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="fin"
                                      ampm={false}
                                      format="HH:mm"
                                      value={finaf}
                                      onChange={(h) => {
                                        setfinaf(h)
                                        setfin(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début Entrée"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutentreeaf}
                                      onChange={(h) => {
                                        setEntreAf(h)

                                        setdebutentree(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin Entrée "
                                      ampm={false}
                                      format="HH:mm"
                                      value={finentreeaf}
                                      onChange={(h) => {
                                        setfinentreeaf(h)


                                        setfinentree(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début Sortie"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutsortieaf}
                                      onChange={(h) => {
                                        setdebutsortieaf(h)


                                        setdebutsortie(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin Sortie"
                                      ampm={false}
                                      format="HH:mm"
                                      value={finsortieaf}
                                      onChange={(h) => {
                                        setfinsortieaf(h)


                                        setfinsortie(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row" >
                            <div className="col-md-6" style={{ marginLeft: 120 }} >
                              <div className="form-group" >
                                <div className="input-group input-group-merge input-group-alternative"  >
                                  <FormGroup style={{ marginLeft: 65 }} >
                                    <FormControlLabel control={<Checkbox onChange={handleChanges}
                                    />} label="pause" />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          </div>
                          {checked && <> <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début pause"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutpauseaf}
                                      onChange={(h) => {
                                        setdebutpauseaf(h)
                                        setdebutpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin pause"
                                      ampm={false}
                                      format="HH:mm"
                                      value={finpauseaf}
                                      onChange={(h) => {
                                        setfinpauseaf(h)



                                        setfinpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                    </>
                          }
                          <div className="form-group"><button className="btn btn-primary" onClick={UpdateHoraire}>Valider</button></div>    </form>


                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div></div>
        

        </div>

  )
}
export default CrudHorraire;