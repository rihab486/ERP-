
import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Checkbox from "@material-ui/core/Checkbox";

function AjouterRole() {

  const [arbore, setArbores] = React.useState([]);
  const[view_conge,setViewCongé]=useState(false)
  const[view_authorisation,setViewAuthorisation]=useState(false)
  const[view_employé,setViewEmploye]=useState(false)
  
  const[view_departements,setViewDepartements]=useState(false)
  const[view_espacepdg,setViewEspacePdg]=useState(false)
  const[view_contrats,setvieContrats]=useState(false)
  const[view_pointeuse,setViewPointeuses]=useState(false)
  const[view_absence,setViewAbsence]=useState(false)
  const[view_planing,setViewPlaning]=useState(false)
  const[view_horaire,setViewHoraire]=useState(false)
  const[view_historique,setViewistorique]=useState(false)
  const[view_mouchard,setViewMouchard]=useState(false)
  const[view_rapports,setViewRapports]=useState(false)
  const[DRH,setDRH]=useState(false)
  const handleOnChangeAbsence = () => {
    setViewAbsence(!view_absence);
  };
  const handleOnChangeDRH =  () => {
    setDRH(!DRH);
  }
  const handleOnChangeAuthor= () =>{
    setViewAuthorisation(!view_authorisation);
  }
  const handleOnChangeConge = () => {
    setViewCongé(!view_conge);
  };
  
  const handleChangeEmploye = () => {
    setViewEmploye(!view_employé);
  };
  const handleOnchangeDepartements = () => {
    setViewDepartements(!view_departements);
  };
  const handleOnchangeEspacePdg = () => {
    setViewEspacePdg(!view_espacepdg);
  };
  const handleOnChangePlaning = () => {
    setViewPlaning(!view_planing);
  };
  const handleOnChangeHoraire = () => {
    setViewHoraire(!view_horaire);
  };
  const handleOnChangePointeuses = () => {
    setViewPointeuses(!view_pointeuse);
  };
  const handleOnChangeContrats = () => {
    setvieContrats(!view_contrats);
  };
  const handleOnChangeHistorique = () => {
    setViewistorique(!view_historique);
  };
  const handleOnChangeRapports = () => {
    setViewRapports(!view_rapports);
  };
  const handleOnChangeMouchard = () => {
    setViewMouchard(!view_mouchard);
  };
   
  const [rolename, setRoleName] = useState('');

 

  const handlesubmit = (e) =>{
    e.preventDefault()
    const role = {rolename,view_absence,view_authorisation,view_conge,view_contrats,view_departements,view_employé,view_espacepdg,view_horaire,view_planing,view_pointeuse,view_historique,view_rapports,view_mouchard ,DRH}
  
    fetch("http://127.0.0.1:8000/role/" , 
    {
      method : "POST" , 
      headers : {
       "Content-Type" : "application/json" 
      },
      body : JSON.stringify(role)
    }).then(() =>{
      console.log("new blog added")
       
    window.location.reload(false)

  }).catch((e)=>{
  
    console.log(role)
  })
  } 
  

  
        return(
          <div>

          <div className="row">

            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterrole">
        Ajouter un role
</button>


  <div className="modal fade" id="ajouterrole" role="dialog" aria-labelledby="#ajouterrole" aria-hidden="true">
   <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Ajouter Role</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <form>

      <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="Role"
                                            value={rolename}
                                            onChange={(e) => setRoleName(e.target.value)}
                                            helperText=""
                                            margin='normal'
                                            fullWidth
                                        >
                                         
                                                <MenuItem key="10" value="Chef">
                                                Chef
                                                </MenuItem>
                                                <MenuItem key="11" value="Rh">
                                                  Rh
                                                </MenuItem>
                                                <MenuItem key="12" value="Employé">
                                                  Employé
                                                </MenuItem>
                                                <MenuItem key="13" value="Directeur">
                                                 Directeur
                                                </MenuItem>
                                                <MenuItem key="10" value="Chef">
                                                 Admin
                                                </MenuItem>

                                     

                                        </TextField>
 
      <div className="form-group">
        
     
        <div className="row">
        <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Pointeuse' value={view_pointeuse} onChange={handleOnChangePointeuses} />
      
          </div> 
        
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Horaire' value={view_horaire} onChange={handleOnChangeHoraire} />
          </div>
          <div className="form-check">
           <FormControlLabel control={<Checkbox/>} label='View Congés' value={view_conge} onChange={handleOnChangeConge} /> 
           </div>
           <div className="form-check">
           <FormControlLabel control={<Checkbox/>} label='View Authorisations' value={view_authorisation} onChange={handleOnChangeAuthor} /> 
           </div>
        <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Absence' value={view_absence} onChange={handleOnChangeAbsence} />
          </div>
         
           <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Contrats' value={view_contrats} onChange={handleOnChangeContrats} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Départements' value={view_departements} onChange={handleOnchangeDepartements} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Employé' value={view_employé} onChange={handleChangeEmploye} />
          </div>

              
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Espace Pdg' value={view_espacepdg} onChange={handleOnchangeEspacePdg} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Planing' value={view_planing} onChange={handleOnChangePlaning} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Historique' value={view_historique} onChange={handleOnChangeHistorique} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Rapports' value={view_rapports} onChange={handleOnChangeRapports} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Mouchard' value={view_mouchard} onChange={handleOnChangeMouchard} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View DRH' value={DRH} onChange={handleOnChangeDRH} />
          </div>
        
     
       </div>
   
      </div>
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



export default AjouterRole;