import React, { useState } from 'react';
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
function AjouterAbsence() {


    const { data: users = [] } = useFetch("http://127.0.0.1:8000/user/")
    const { data: motifs = []} = useFetch("http://127.0.0.1:8000/motif/")
    const [employes,setemployes] =useState(2);
    const [raison, setRaison] = useState('');
    const [datedebut, setDateDebut] = useState('');
    const [datefin, setDatefin] = useState('');
    const [motif_abs, setMotifabsence] = useState('')
    const[justifie,setJustifie]=useState(false)
   
    const handleChangeJustifie = () => {
       setJustifie(!justifie)
      };
    const handlesubmit = (e) => {
        e.preventDefault()

        const absence = { employes, raison, datedebut, datefin, motif_abs,justifie }

        fetch("http://127.0.0.1:8000/Absence/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(absence)
            }).then((response) =>{
                if(!response.ok) throw new Error(response.status);
                else window.location.reload(false)
          
            }).catch((e) => {

             alert("Il faut Sélectionnez un employé ,date début et date fin !")
            })
    }


    return (
        <div>

            <div className="row">

                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterabsence">
                    Ajouter Une Absence
                </button>


                <div className="modal fade" id="ajouterabsence"role="dialog" aria-labelledby="ajouterabsence" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Une Absence</h5>
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
                                                     {option.user_name }
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
                                                {motifs.filter(x=>x.motifConge==false).map((option) => (
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
                                                <input className="form-control" value={datedebut} onChange={(e)=>setDateDebut(e.target.value)} id="datedebut" placeholder="datedebut" type="datetime-local"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                        <div className="form-group">
                                                <input className="form-control" id="datefin" placeholder="datefin" type="datetime-local" value={datefin} onChange={(e)=>setDatefin(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
               
                  
                </div>
                                    <div className='row'>
                                        
                                    <div className='col-md-6'>
                                              <textarea className='form-control' placeholder='Raison' rows="4" cols="40" value={raison} onChange={(e)=>setRaison(e.target.value)}></textarea>
                                    </div>
                                    
                                    <div className='col-md-6'>
                                
          <FormControlLabel control={<Checkbox/>} label='Justifié' value={justifie} onChange={handleChangeJustifie} />
        
                                    </div>
                                    </div>
                                    <br/>
                                    <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>
                                </form>

                            </div>
                            <div className="modal-footer">



                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default AjouterAbsence;