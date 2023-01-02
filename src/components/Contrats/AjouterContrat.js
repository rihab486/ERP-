import React from 'react';
import { useState } from 'react';
import { makeStyles, withStyles } from "@material-ui/core/styles";

function AjouterContrat() {
    const [contratname, setContratName] = useState('');
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
      const classes = useStyle()



    const handlesubmit = (e) => {
        e.preventDefault()
        const contrat = { contratname }

        fetch("http://127.0.0.1:8000/contrats/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contrat)
            }).then((data) => {
            
            window.location.reload(false);
        
    
            }).catch((e) => {

                console.log(contrat)
            })
    }


    return (
        <div>

            <div className="row">

                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajoutercontrat">
                    Ajouter Un Contrat
                </button>


                <div className="modal fade" id="ajoutercontrat"  role="dialog" aria-labelledby="#ajoutercontrat" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Un Contrat</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <input className="form-control" placeholder="Ajouter Un Contrat" value={contratname} name="contratname" onChange={(e) => setContratName(e.target.value)} type="text" />
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
export default AjouterContrat;