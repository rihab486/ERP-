import React, { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import useFetch from '../useFetch';
function AddDepByChild(id){
    const [nom, setNomm] = useState('');
    const {id:parent}=id;
    const [chef, setChef] = useState('')
    const [rh, setRH] = useState('')
    const [children, setchildren] = useState([])
    const { data: users = [], isl, er } = useFetch("http://127.0.0.1:8000/user/")
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
      const handlesubmitt = (e) => {
          e.preventDefault()
         
          const departement = { nom, parent,children,chef,rh }
     
        
          console.log(parent)
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
  
    return(
    <div>
         <a  data-toggle="modal" data-target={`#t${parent}`}>
                <AddCircleIcon   className={classes.icon}/>
                </a>


                <div className="modal fade" id={`t${parent}`} role="dialog" aria-labelledby="ajouterdepartement" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="ajouterdepartement">Ajouter Département</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">



                                <form>


                                <div className="form-group">
                                        <div className="input-group input-group-merge input-group-alternative">

                                            <input className="form-control" placeholder=" " value={parent}  name="parent"  type="hidden" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group input-group-merge input-group-alternative">

                                            <input className="form-control" placeholder="Nom de département " value={nom} name="nom_departement" onChange={(e) => setNomm(e.target.value)} type="text" />
                                        </div>
                                    </div>

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
                                                        {option.user_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div>
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
                                                        {option.user_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div>
                             
                                    <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmitt} >Valider</button></div>
                                </form>

                            </div>
                            <div className="modal-footer">



                            </div>
                        </div>
                    </div>
                </div>
    </div>
    )
}
export default AddDepByChild;