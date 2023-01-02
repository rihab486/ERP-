import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { Component, useEffect } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { format } from 'date-fns';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import NumberFormat from 'react-number-format';

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
function AjouterdesHoraires() {






  const [time, settime] = useState({ debut: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), fin: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), debutentree: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), finentree: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), margeretard: '00', margedaprdant: '00',margeheuresupp:'00', debutpause: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), finpause: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), debutsortie: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), finsortie: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), nom: null, jourtravaille: '',varnuit:true });
  const [aff, setaff] = useState({ debutaf: new Date(), finaf: new Date(), debutentreeaf: new Date(), finentreeaf: new Date(), margeretardaf: new Date(), margedepartant: new Date(),margeheuresuppf : new Date(), debutpauseaf: new Date(), finpauseaf: new Date(), debutsortieaf: new Date(), finsortieaf: new Date() });


  const handlesubmit = (e) => {
    e.preventDefault()



    fetch("http://127.0.0.1:8000/horaire/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(time)
      }).then(() => {
        alert('ajout horaire avec succes  ')
        window.location.reload(false);
        // history.push('/TableaudesHoraires')
        console.log(time)

      }).catch((e) => {
        alert('Error ! pas d ajout ')

      })


  }
  const handleChanges = (event) => {
    setChecked(!checked);
  };
  const [checked, setChecked] = React.useState(false);

  const [checkeddebut, setcheckeddebut] = React.useState(false);
  const handleChangesdebut = (event) => {
    setcheckeddebut(!checkeddebut);
  };

  return (

    <div >

      <div className="row">

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
          Ajouter Un Horaire
        </button>


        <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Un Horaire</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">




                <form role="form">
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className="form-group">


                        <input className="form-control" placeholder="Nom d'horaire" value={time.nom} name="nom" onChange={(e) => settime({ ...time, nom: e.target.value })} type="text" />



                      </div>
                    </div>
                    <div className='col-md-6'>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Jour Travail"
                        value={time.jourtravaille}
                        onChange={(e) => settime({ ...time, jourtravaille: e.target.value })}
                        helperText="sélectionner une motif d'horaire"
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
                  <div className='row'>
                 
                    <div className='col-md-5'>
                                    <div className="form-group">
                                                <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Choix"
                                                value={time.varnuit}
                                                onChange={(e) => settime({ ...time, varnuit: e.target.value })}
                                                helperText=""
                                                margin='normal'
                                                fullWidth
                                                >
                                                <MenuItem value={true} key="1">Jour</MenuItem>
                                                <MenuItem value={false} key="2">Nuit</MenuItem>
                                               


                                                </TextField>

                                            </div>

                                    </div>
                                    <div className='col-md-6'>
                                    <div className="form-group">

                                    <div className="input-group input-group-merge input-group-alternative">


                                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileTimePicker

                                          views={['minutes']}
                                          inputFormat="mm"

                                          label="Marge heure supp(min)"
                                          ampm={false}
                                          value={aff.margeheuresuppf}

                                          onChange={(h) => {
                                            setaff({ ...aff, margeheuresuppf: h })
                                            settime({ ...time, margeheuresupp: h.toLocaleTimeString([], { minute: '2-digit' }) })
                                          }}
                                          renderInput={props => <TextField {...props} />}
                                        />
                                      </LocalizationProvider>              </div>
                                    </div>
                                    </div>
                                      
                                
                  </div>



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
                              value={aff.margeretardaf}

                              onChange={(h) => {
                                setaff({ ...aff, margeretardaf: h })
                                settime({ ...time, margeretard: h.toLocaleTimeString([], { minute: '2-digit' }) })
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


                              value={aff.margedepartant}
                              onChange={(h) => {
                                setaff({ ...aff, margedepartant: h })
                                settime({ ...time, margedepartant: h.toLocaleTimeString([], { minute: '2-digit' }) })
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
                              value={aff.debutaf}
                              onChange={(h) => {
                                setaff({ ...aff, debutaf: h })
                                settime({ ...time, debut: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                              value={aff.finaf}
                              onChange={(h) => {
                                setaff({ ...aff, finaf: h })
                                settime({ ...time, fin: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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

                        <FormGroup style={{ marginLeft: 65 }} >
                          <FormControlLabel control={<Checkbox onChange={handleChangesdebut}
                          />} label="Début/Sortie" />
                        </FormGroup>

                      </div>
                    </div>
                  </div>
                  {checkeddebut &&
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <div className="input-group input-group-merge input-group-alternative">
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <MobileTimePicker
                                  label="Début Entrée"
                                  ampm={false}
                                  format="HH:mm"
                                  value={aff.debutentreeaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, debutentreeaf: h })
                                    settime({ ...time, debutentree: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                                  value={aff.finentreeaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, finentreeaf: h })
                                    settime({ ...time, finentree: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                                  value={aff.debutsortieaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, debutsortieaf: h })
                                    settime({ ...time, debutsortie: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                                  value={aff.finsortieaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, finsortieaf: h })
                                    settime({ ...time, finsortie: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
                                  }}


                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>}
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
                  {checked && <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <div className="input-group input-group-merge input-group-alternative">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileTimePicker
                              label="Début pause"
                              ampm={false}
                              format="HH:mm"
                              value={aff.debutpauseaf}
                              onChange={(h) => {
                                setaff({ ...aff, debutpauseaf: h })
                                settime({ ...time, debutpause: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                              value={aff.finpauseaf}
                              onChange={(h) => {
                                setaff({ ...aff, finpauseaf: h })
                                settime({ ...time, finpause: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
                              }}


                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>}

                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                <button type="button" className="btn btn-primary" onClick={handlesubmit}>Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default AjouterdesHoraires;