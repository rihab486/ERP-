import React, { useState } from 'react'
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from "../Mouchardd/Mouchard"
import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';

function Ajoutercongé() {
  const { data: listemploye=[], isloading: zzsx, error: esse } = useFetch("http://127.0.0.1:8000/UsersOfDepartChef/" +"?id=" + localStorage.getItem('id'))
  //const { data: motifs = [], isloading, error } = useFetch("http://127.0.0.1:8000/motif/")
  const [motif_abs, setType] = useState('');
  const [datedebut, setDateDebut] = useState('');
  const [datefin, setdatefin] = useState('');
  const [contact, setContact] = useState('');
  const [adresse, setadress] = useState('');
  const [employes, setEmploye] = useState('');
  
  const is_active = true
  const dates = [moment(new Date(datedebut)), moment(new Date(datefin))];

  //const [heure_debut, setHeureDebut] = useState(null);
 // const [heure_fin, setHeurefin] = useState(null);
  const [justif, setJustif] = useState('');
  function workday_count(start,end) {
    const first = start.clone().endOf('week');
    const last = end.clone().startOf('week');
    const days = last.diff(first,'days') * 5 / 7;
    const wfirst = first.day() - start.day();
    if(start.day() === 0) --wfirst;
    const wlast = end.day() - last.day();
    if(end.day() === 6) --wlast;
    return wfirst + Math.floor(days) + wlast;
  }
  const startDate = dates[0];
  const endDate = dates[1];

    const nbjours = workday_count(startDate.startOf('day'), endDate.startOf('day'));
    
   
  const handlesubmit = (e) => {
    e.preventDefault()
    const conge = { nbjours,justif, datedebut, datefin, contact, adresse, employes,is_active}

    fetch("http://127.0.0.1:8000/demendeconges/" +localStorage.getItem('id') + "/"+"congé/"+datedebut+"/"+datefin+"/"+employes,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(conge)
      }).then(() => {
          Mouchard("-","encours",employes,localStorage.getItem('id'),"Demande  de congé de " +datedebut+"au "+datefin)
          window.location.reload(false)
       
      }).catch((e) => {

        alert('error!!')
      })
  }
  const handleChange = (event) => {
    setChecked(!checked);
  };
 
  const [checked, setChecked] = React.useState(false);
  return (
    <div>
    
    <div className="row">
    
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
                Demander Un Congé
              </button>


              <div className="modal fade" id="ajouterpointage" role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">    Demander Un Congé</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">



<form>
{/**   {checked ? "" : */}

    <>
    <div className="row">
        <div className='col-md-6'>

        <Autocomplete
  
  options={listemploye}
  getOptionLabel={(option) => option.user_name }
  multiple={true}
  renderInput={(params) => (
    <TextField {...params} label="Employés" variant="outlined" />
  )}
  onChange={(event, value) => setEmploye(value.map(x=>x.id).toString())} 
  
        />

        </div>
       

       
      </div>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group">


          <input className="form-control" placeholder="Contact" value={contact} name="contact" onChange={(e) => setContact(e.target.value)} type="text" />

        </div>

      </div>
      <div className="col-md-6">
        <div className="form-group">

          <input className="form-control" placeholder="Adresse" value={adresse} name="adresse" onChange={(e) => setadress(e.target.value)} type="text" />

        </div>


      </div></div>
      <div className='row'>
        <div className='col-md-6'>
          <div className="form-group">


            <input className="form-control" placeholder="" value={datedebut} name="date_debut" onChange={(e) => setDateDebut(e.target.value)} type="date" />

          </div>

        </div>
        <div className='col-md-6'>
          <div className="form-group">


            <input className="form-control" placeholder="" value={datefin} name="date_fin" onChange={(e) => setdatefin(e.target.value)} type="date" />

          </div>

        </div>
      </div>
      <div className='row'>
      <div className="col-md-6">
        <div className="form-group">
          
        <input placeholder="nb jours"  value={nbjours} className="form-control"  type="DISABLED"   />
</div>
          </div>   
      
      </div>
      <div className='row'>
      <div className='col-md-6'>

      <div className="col-md">
                                  <textarea placeholder='commentaire' className="form-control" value={justif} onChange={(e) => setJustif(e.target.value)} rows="4" ></textarea>
</div>

</div>


      </div>
      <div>
      

        
        </div>                                
     </>

 {/**} */} 


{/**     {checked ?  <div className='row'>
    <div className='col-md-6'>
      <div className="form-group">


        <input className="form-control" placeholder="" value={heure_debut} name="heure_debut" onChange={(e) => setHeureDebut(e.target.value)} type="time" />

      </div>

    </div>
    <div className='col-md-6'>
      <div className="form-group">


        <input className="form-control" placeholder="" value={heure_fin} name="heure_fin" onChange={(e) => setHeurefin(e.target.value)} type="time" />

      </div>

    </div>
  </div> : ""} */}




  <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>

{/**  <FormControlLabel control={<Checkbox onChange={handleChange}
  />} label="demender une autorisation" />
*/}
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
export default Ajoutercongé;