

import AjouterRole from "./AjouterRole";



import * as React from 'react';
import useFetch from "../useFetch";
import { makeStyles } from '@mui/styles';




import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
function CrudRoles() {
  const url = "http://127.0.0.1:8000/";
  const[view_conge,setViewCongé]=useState(false)
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
  const[view_authorisation,setViewauthorisation]=useState(false)
  const[DRH,setDRH]=useState(false)
  const handleOnChangeAbsence = () => {
    setViewAbsence(!view_absence);
  };
  const handleOnChangeDRH =  () => {
    setDRH(!DRH);
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
  const handleOnChangeauthorisation =()=>{
    setViewauthorisation(!view_authorisation);
  }
   
  const { data: roles = [], isloading, error } = useFetch(url + "role/")
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'


    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const [open, setOpen] = useState(false);
  const [roleIddelete, setroleIddelete] = useState(null)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyle()


  const [rolename, setNomRole] = useState('');

  const [roleId, setRoleId] = useState(null)
  function SelectRole(id) {
    fetch(url + "role/" + id).then((result) => {
      result.json().then((resp) => {
        setNomRole(resp.rolename);
        setRoleId(resp.id)
        setViewCongé(resp.view_conge)
        setViewEmploye(resp.view_employé)
        setViewDepartements(resp.view_departements)
        setViewEspacePdg(resp.view_espacepdg)
        setvieContrats(resp.view_contrats)
        setViewauthorisation(resp.view_authorisation)
        setViewPointeuses(resp.view_pointeuse)
        setViewAbsence(resp.view_absence)
        setViewPlaning(resp.view_planing)
        setViewHoraire(resp.view_horaire)
        setViewRapports(resp.view_rapports)
        setViewMouchard(resp.view_mouchard)
        setViewistorique(resp.view_historique)
        setDRH(resp.DRH);
        console.log(resp.view_departements)
    
      })
    })





  }
  const DeleteRole = (roleId) => {
    fetch(url + 'role/' + roleId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json'
      },
    }).then(() => {
      setOpen(false);
      window.location.reload(false);
    }
    )


  }

  const Updaterole = () => {

    let roleList = { rolename,view_absence,view_conge,view_authorisation,view_contrats,view_departements,view_employé,view_espacepdg,view_horaire,view_planing,view_pointeuse ,view_historique,view_rapports,view_mouchard,DRH}


    fetch(url + 'role/' + roleId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roleList)
    }).then(() => {



    }

    )
  }

  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <AjouterRole />
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Role</th>



                      <th scope="col">Action</th>

                    </tr>
                  </thead>
                  <tbody>

                    {roles.map(role =>
                      <tr key={role.id}>
                        <td>{role.rolename}</td>


                        <td>
                          <div className="row">

                            <div className="col-md-4">

                              <a onClick={() => SelectRole(role.id)} data-toggle="modal" data-target="#modalrole" ><EditIcon
                                className={classes.icon}
                              /></a>
                            </div>
                            <div className="col-md-4">
                              <a onClick={() => { handleClickOpen(); setroleIddelete(role.id); }}  ><DeleteIcon className={classes.icon} /></a>


                            </div>
                            <div className="col-md-4">
                              <a data-toggle="modal" data-target={`#a${role.id}`}><VisibilityIcon className={classes.icon} /></a>

                              <div className="modal fade" id={`a${role.id}`}  role="dialog" aria-labelledby={`a${role.id}`} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title" id="exampleModalLabel">Permissions</h5>
                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="table-responsive">
                                        <table className="table align-items-center table-flush">
                                          <thead className="thead-light">
                                            <tr>

                                              <th scope="col"><h3>Vue</h3></th>
                                              <th scope="col"><h3>Autorisation</h3></th>

                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>Vue d'absences</td>
                                              <td>{role.view_absence ? "oui" : "Non"}</td>

                                            </tr>
                                            <tr>
                                              <td>Vue de congés</td>
                                              <td>{role.view_conge ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de authorisations</td>
                                              <td>{role.view_authorisation ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue d'employés</td>
                                              <td>{role.view_employé ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de départements</td>
                                              <td>{role.view_departements ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue d'espace Pdg</td>
                                              <td>{role.view_espacepdg ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de contrats</td>
                                              <td>{role.view_contrats ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de pointeuse</td>
                                              <td>{role.view_pointeuse ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue d'horaire</td>
                                              <td>{role.view_horaire ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue d'absence</td>
                                              <td>{role.view_absence ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de planing</td>
                                              <td>{role.view_planing ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de Rapports</td>
                                              <td>{role.view_rapports ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue de Mouchard</td>
                                              <td>{role.view_mouchard ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue d'Historique'</td>
                                              <td>{role.view_historique ? "oui" : "Non"}</td>
                                            </tr>
                                            <tr>
                                              <td>Vue DRH</td>
                                              <td>{role.DRH ? "oui" : "Non"}</td>
                                            </tr>

                                          </tbody></table></div>


                                    </div>
                                    <div className="modal-footer">



                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>



                          </div>
                        </td>
                      </tr>
                    )}

                    <Dialog

                      BackdropProps={{ invisible: true }}
                      className={classes.dialog}
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"supprimer un role"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer un role ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteRole(roleIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>



                  </tbody>
                </table>
              </div>
            </div>
            <div>

              <div className="row">
                <div className="col-md-3">



                  <div className="modal fade" id="modalrole" tabindex="-1" role="dialog" aria-labelledby="modalrole" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Modifier Role</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>



                          <div className="form-group">
      <input className="form-control" placeholder="Ajouter un role" value={rolename} name="rolename"  onChange={(e) => setNomRole(e.target.value)} type="text"/>
      </div>
      <div className="form-group">
        
     
        <div className="row">
        <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_pointeuse ? true:false} label='View Pointeuse' value={view_pointeuse} onChange={handleOnChangePointeuses}  />
      
          </div> 
        
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_horaire ? true:false} label='View Horaire' value={view_horaire} onChange={handleOnChangeHoraire} />
          </div>
          <div className="form-check">
           <FormControlLabel control={<Checkbox/>}  checked={view_conge ? true:false} label='View Congés' value={view_conge} onChange={handleOnChangeConge}  /> 
           </div>
           <div className="form-check">
           <FormControlLabel control={<Checkbox/>}  checked={view_authorisation ? true:false} label='View Authorisations' value={view_authorisation} onChange={handleOnChangeauthorisation}  /> 
           </div>
        <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_absence ? true:false} label='View Absence' value={view_absence} onChange={handleOnChangeAbsence}/>
          </div>
         
           <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_contrats ? true:false} label='View Contrats' value={view_contrats} onChange={handleOnChangeContrats} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox /> } checked={view_departements ? true:false} label='View Départements' value={view_departements} onChange={handleOnchangeDepartements}  />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_employé ? true:false}  label='View Employé' value={view_employé} onChange={handleChangeEmploye}  />
          </div>

              
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_espacepdg? true:false}  label='View Espace Pdg' value={view_espacepdg} onChange={handleOnchangeEspacePdg}  />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} checked={view_planing ? true:false}  label='View Planing' value={view_planing} onChange={handleOnChangePlaning} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Historique' value={view_historique} onChange={handleOnChangeHistorique} checked={view_historique ? true:false} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Rapports' value={view_rapports} onChange={handleOnChangeRapports} checked={view_rapports ? true:false} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View Mouchard' value={view_mouchard} onChange={handleOnChangeMouchard} checked={view_mouchard ? true:false} />
          </div>
          <div className="form-check">
          <FormControlLabel control={<Checkbox/>} label='View DRH' value={DRH} onChange={handleOnChangeDRH} checked={DRH ? true:false} />
          </div>
        
     
       </div>
   
      </div>


                            <div className="form-group"><button className="btn btn-primary" onClick={Updaterole}>Valider</button></div>    </form>


                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div></div></div></div></div>
  )
}
export default CrudRoles;
/**
 */