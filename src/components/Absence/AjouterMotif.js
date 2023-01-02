import React from 'react';
import { useState } from 'react';

import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
 function AjouterMotif(){
    const [motif, setMotifName] = useState('');
 
 const[motifConge,setmotifConge]=useState(false)
 
    const handleChangeMotifCongé = () => {
      setmotifConge(!motifConge)
    };
 

    const handlesubmit = (e) =>{
      e.preventDefault()
      const motiff = {motif,motifConge}
    
      fetch("http://127.0.0.1:8000/motif/" , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" 
        },
        body : JSON.stringify(motiff)
      }).then(() =>{
        console.log("new blog added")
        window.location.reload(false);
      
  
    }).catch((e)=>{
    
      console.log(motiff)
    })
    } 
return (
    <div>

    <div className="row">

      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajoutermotif">
Ajouter une motif
</button>


<div className="modal fade" id="ajoutermotif"  role="dialog" aria-labelledby="#ajoutermotif" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
  <h5 className="modal-title" id="exampleModalLabel">Ajouter une motif</h5>
  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div className="modal-body">
<form>
<input className="form-control" placeholder="nom de motif" value={motif} name="motif"  onChange={(e) => setMotifName(e.target.value)} type="text"/>


<div className="modal-footer">
  <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
  <button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button>
</div>

</form>
</div>

</div>
</div>
</div>
</div>
</div>

)
 }
 export default AjouterMotif;