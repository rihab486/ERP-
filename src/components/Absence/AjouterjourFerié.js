
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
function AjouterjourFerié() {


    const [nom, setNom] = useState('');
    const [etat_jour, setetatJour] = useState('');
    const [date, setDate] = useState('');
    const [datefin, setDateFin] = useState('');

    const handlesubmit = (e) => {
        e.preventDefault()

        const JourFerie = { nom, etat_jour, date, datefin }

        fetch("http://127.0.0.1:8000/JourFerie/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(JourFerie)
            }).then(() => {


                window.location.reload(false);

            }).catch((e) => {

                console.log(JourFerie)
            })
    }

    return (
        <div>

            <div className="row">

                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterjourferié">
                    Ajouter Un Jour Ferié
                </button>


                <div className="modal fade" id="ajouterjourferié" role="dialog" aria-labelledby="ajouterjourferié" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Une Jour Ferié</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                             
                                <form>

                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-group">


                                                <input className="form-control" placeholder="nom jour Ferié" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />

                                            </div>

                                        </div>
                                        <div className='col-md-6'>
                                        <div className="form-group">


<input className="form-control" placeholder="Type de  jour Ferié" value={etat_jour} name="nom"  onChange={(e) => { setetatJour(e.target.value) }} type="text" />

</div>
                                        </div>
                                    </div>




                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                                <input className="form-control" value={date} onChange={(e) => setDate(e.target.value)} id="date" placeholder="date" type="datetime-local"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="form-group">


                                                <input className="form-control" placeholder="nombre de jours feriés" value={datefin} name="datefin" onChange={(e) => setDateFin(e.target.value)} type="datetime-local" />

                                            </div>
                                        </div>
                                    </div>
                                  
                                    <div className="form-group">
                                        <button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button>
                                        </div>
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
export default AjouterjourFerié;