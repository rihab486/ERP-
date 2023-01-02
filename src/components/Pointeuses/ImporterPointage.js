
import React from 'react';
import {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from '../Mouchardd/Mouchard';
import useFetch
 from "../useFetch";
function ImporterPointage(){
    const { data: pointeuses, isloading, error } = useFetch("http://127.0.0.1:8000/pointeuse/")
    const { data: employees, isloading: zz, error: ee } = useFetch("http://127.0.0.1:8000/user/")
    const [date_pointage, setDate] = useState('');
  
 
    const [pointeuse,setPointeuse]=useState(null);
    const [employes,setEmployes]=useState('employes');
  
    const handlesubmit = (e) => {
      e.preventDefault()
      const pointage = { date_pointage,employes,pointeuse }
  
      fetch("http://127.0.0.1:8000/createpointage/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(pointage)
        }).then(() => {
          Mouchard("en cours","ajouté",employes,localStorage.getItem('id'),"Ajouter un pointage: "+date_pointage)
          window.location.reload(false);
  
  
        }).catch((e) => {
  
          console.log(pointage)
        })
    }
  
    return(
        <div>

      <div className="row">

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
          Ajouter Pointage
        </button>


        <div className="modal fade" id="ajouterpointage"  role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Pointage</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">



                <form>


                  <div className="row">
                    <div className="col-md-9">

                      <div className="form-group">
                        <div className="input-group input-group-merge input-group-alternative">

                          <input className="form-control" placeholder="" value={date_pointage} name="date_pointage" onChange={(e) => setDate(e.target.value)} type="datetime-local" />
                        </div>
                      </div>
                    </div></div>
                  <div className="row">
                
                    <div className="col-md-9">

                     
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="employe"
                        value={employes}
                        onChange={(e) => {setEmployes (e.target.value) }}
                        helperText="Please select employee"
                        margin='normal'
                        fullWidth
                     
                        
                      >
                        {employees.map((option) => (
                          <MenuItem key={option.user_name} value={option.id}>
                            {option.user_name}
                          </MenuItem>
                        ))}
                      </TextField >
                    </div>
                 
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
    )
}
export default ImporterPointage;