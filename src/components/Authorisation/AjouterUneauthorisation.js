import React, { useState } from 'react'
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Mouchard from '../Mouchardd/Mouchard'
function AjouterUneauthorisation() {
  const { data: listemploye=[], isloading: zzsx, error: esse } = useFetch("http://127.0.0.1:8000/UsersOfDepartChef/" +"?id=" + localStorage.getItem('id'))

  //const { data: motifs = [], isloading, error } = useFetch("http://127.0.0.1:8000/motif/")
  const [justif, setJustif] = useState('');
  const [contact, setContact] = useState('');
  const [adresse, setadress] = useState('');
  const [employes, setEmployes] = useState('');
  const [heure_debut, setHeureDebut] = useState('');
  const [heure_fin, setHeurefin] = useState('');
  const [etat_abs, setEtatAbs] = useState('en_attente');
  const [date_autorisation, setDateAutorisation] = useState('')

  const is_active = true
 
  const handlesubmit = (e) => {
    e.preventDefault()

    const conge = {  justif,contact, adresse, employes,  date_autorisation, heure_debut,employes, heure_fin,is_active }

    fetch("http://127.0.0.1:8000/demendeconges/" + localStorage.getItem('id') + "/"+"autorisation/"+date_autorisation+"/"+date_autorisation+"/"+employes,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(conge)
      }).then(() => {
        
           Mouchard("-","encours",employes,localStorage.getItem('id'),"Demande  d'une autorisation en "+date_autorisation+"de "+heure_debut+"au "+heure_fin)
        
           window.location.reload(false);



      }).catch((e) => {

        alert('error!!')
      })
  }

  return (
    <div><div className="row">

      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterautor">
        Demander Une autorisation
      </button>


      <div className="modal fade" id="ajouterautor" role="dialog" aria-labelledby="ajouterautor" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Demander Une autorisation</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">



              <form>


                <>  <div className="row">
                                  <div className='col-md-6'>
                                  <div className="form-group">
                                  <Autocomplete
                            
                            options={listemploye}
                            getOptionLabel={(option) => option.user_name }
                            multiple={true}
                            renderInput={(params) => (
                              <TextField {...params} label="Employés" variant="outlined" />
                            )}
                            onChange={(event, value) => setEmployes(value.map(x=>x.id).toString())} 
                            
                                  />

                                 </div> </div>
                                 <div className="col-md-6">
                    <div className="form-group">


                      <input className="form-control" placeholder="Contact" value={contact} name="contact" onChange={(e) => setContact(e.target.value)} type="text" />

                       </div>

                       </div> </div>
                
                <div className="row">
                 
                  <div className="col-md-6">
                    <div className="form-group">

                      <input className="form-control" placeholder="Adresse" value={adresse} name="adresse" onChange={(e) => setadress(e.target.value)} type="text" />

                    </div>


                  </div>
                  <div className='col-md-6'>
                      <div className="form-group">


                        <input className="form-control" placeholder="" value={date_autorisation} name="date_autorisation" onChange={(e) => setDateAutorisation(e.target.value)} type="date" />

                      </div>

                    </div>
                  
                  </div>
                  
                  
                  <div className='row'>
                   
                    <div className='col-md-6'>
                      




                    </div>
                  </div>
                  <div className="row">
                   

                  
                  </div></>



                <div className='row'>
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
                </div>
                <div  className='row'>
                <div className='col-md-6'>
                <div className="col-md">
                                  <textarea placeholder='commentaire' className="form-control" value={justif} onChange={(e) => setJustif(e.target.value)} rows="4" ></textarea>
</div>
                                  
             

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
    </div></div>



  )
}
export default AjouterUneauthorisation;