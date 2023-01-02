import React, { useState } from 'react';

import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { makeStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';

function AjouterDepartement() {


    const { data: users = [] } = useFetch("http://127.0.0.1:8000/user/")
    const [nom, setNom] = useState('');
    const [chef, setChef] = useState('')
    const [rh, setRH] = useState('')
    const parent = "";
    const [children, setchildren] = useState([])
    const useStyle = makeStyles({
        icon: {
            marginRight: 10,
            marginLeft: 10,    
            visibility: 'visible',
            color: '#5ac2df'
      
          },
          hidesubmit: {
            visibility: 'hidden'
          },
          dialog: {
      
            boxShadow: 'none',
          }
    });
    const classes = useStyle()
    const handlesubmit = (e) => {
        e.preventDefault()
        const departement = { nom, parent, children,chef,rh }

        fetch("http://127.0.0.1:8000/arbo/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(departement)
            }).then(() => {

                // history.push('/Utilisateurs')
                window.location.reload(false);


            }).catch((e) => {

                console.log(departement)


            })
    }


    return (
        <div>

            <div className="row">

                <a data-toggle="modal" data-target="#ajouterdep">
                    <AddCircleIcon style={{ width: 50, height: 50 }} className={classes.icon} />
                </a>
            </div>
            <div className="row">
                <div className="container pt-4">

                    <div className="modal fade" id="ajouterdep" role="dialog" aria-labelledby="ajouterdep" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Ajouter Département</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">



                                    <form>


                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder=" " value={parent} name="nom_departement" type="hidden" />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder="Nom de département " value={nom} name="nom_departement" onChange={(e) => setNom(e.target.value)} type="text" />
                                            </div>
                                        </div>
                                        <div className='form-group'>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name +"  " }

   renderInput={(params) => (
     <TextField {...params} label="Chef" variant="outlined" />
   )}
   onChange={(event, value) =>setChef(value.id)} 

 /> 
                                        </div>
                                        <div className='form-group'>
                                      

                                            <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name +"  "}

   renderInput={(params) => (
     <TextField {...params} label="RH" variant="outlined" />
   )}
   onChange={(event, value) =>setRH(value.id)} 

 /> 
                                        </div>

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

        </div>
    )
}
export default AjouterDepartement;