import React, { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from '@mui/styles';
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function ModifierChild(id){
    const {id:idn}=id;
    const [nom, setNom] = useState('');
    const { data: users = []} = useFetch("http://127.0.0.1:8000/user/")
    const [departementId, setDepartementId] = useState(null)
    const [chef, setChef] = useState('')
    const [rh, setRH] = useState('')
 
    function SelectDepartement(id) {
        console.log(id)
        fetch("http://127.0.0.1:8000/selectArborescence/" + id).then((result) => {
            result.json().then((resp) => {

                setChef(resp.chef)
                setRH(resp.rh)
                setNom(resp.nom);

                setDepartementId(resp.id)

            })
        })
    }  
    const UpdateDepartement = () => {

        let departementList = { nom,chef,rh }


        fetch('http://127.0.0.1:8000/arbo/' + departementId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(departementList)
        }).then(() => {



        }

        )


    }
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
 
return(
    <div>
    <a onClick={() => SelectDepartement(idn)} data-toggle="modal" data-target={`#e${idn}`} ><EditIcon
    className={classes.icon}
/></a>
    
    


            <div className="modal fade" id={`e${idn}`} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modifier Département</h5>
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

                                                <input className="form-control" placeholder="" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />
                                            </div>
                                        </div>
                                    </div>
                                  
                                    </div>
                                    <div className='row'>
                                    <div className="col-md-6">
                                        <div className='form-group'>
                                     
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="RH"
                                                value={rh}
                                                onChange={(e) => { setRH(e.target.value) }}
                                                helperText="Svp sélectionner un RH"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                   {option.user_name }
                                                    </MenuItem>
                                                ))}
                                               <MenuItem key="" value={null}>
                                                       ------
                                                </MenuItem>
                                            </TextField>
                                   {/**  <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name || ""}
value={chef}
   renderInput={(params) => (
     <TextField {...params} label="Chef" variant="outlined" />
   )}
   onChange={(event, value) =>setChef(value.id)} 
 /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className='form-group'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Chef"
                                                value={chef}
                                                onChange={(e) => { setChef(e.target.value) }}
                                                helperText="Svp sélectionner un chef"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                         {option.user_name }
                                                    </MenuItem>
                                                ))}
<MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                     

                                    </div>
                                    </div>



                                <div className="form-group"><button className="btn btn-primary" onClick={UpdateDepartement}>Valider</button></div>    </form>

                        </div>


                    </div>
                </div>
            </div>
        </div>

)
}
export default ModifierChild;