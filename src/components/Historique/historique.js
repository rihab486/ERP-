import React, { useState } from 'react'
import useFetch from '../useFetch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { makeStyles } from '@mui/styles';
import ScrollContainer from 'react-indiana-drag-scroll'
import $ from "jquery";
const Historique = () => {
  $(document).ready(function () {
    $('#example').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
    const url="http://127.0.0.1:8000/";
    const { data: Historiques= [], isloading, error } = useFetch(url+"HistoriqueList/")
    const[nom,setNomdep]=useState('')
    const[date,setDate]=useState('')
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
   const[historr,setHistoriques]=useState([])
    function SelectHistorique(id) {
     
  
   fetch(url+"HistoriqueById/" + id).then((result) => {
        result.json().then((resp) => {
       setHistoriques(resp)
          
  
        })
      })
   
  
  
    }
    const classes=useStyle()
    return (
        
        <div className="container-fluid mt-5">
      <div className="row">
        <div className="col">
        <div className="card shadow">
    <div className="card-header border-0">
      <h3>Historique de départements pour les employés</h3>
    </div>
    <ScrollContainer className="scroll-container">   
    {Historiques.length==0? <h4>Pas d'historique</h4>
                    :  
    <div className="table-responsive">
      <table id = "example" className="table align-items-center table-flush">
        <thead className="thead-light">
          <tr>
          <th scope="col">Nom utilisateur</th>
     
            <th scope="col">Historique</th>
           
          
          </tr>
        </thead>
        <tbody>

          {Historiques.map(hist =>
         
                  <tr key={hist.id}>
                    <td>{hist.user_name}</td>
                  
                 <td>   <a data-toggle="modal" data-target="#historique" onClick={()=>{SelectHistorique(hist.employe)}}><VisibilityIcon className={classes.icon} /></a>

                 </td>
                    
                 
                  </tr>
       
 
 )}   

        </tbody>
      </table>
    </div>}</ScrollContainer>
    <div className="container">

<div className="row">
  <div className="col-md-3">

    <div className="modal fade" id="historique" role="dialog" aria-labelledby="historique" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Historique</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="table-responsive">
          <table className="table align-items-center table-flush">
            <thead className="thead-light">
              <tr>

                <th scope="col"><h3>Département</h3></th>
                <th scope="col"><h3>Date</h3></th>

              </tr>
            </thead>
            <tbody>
           
              
              {historr.map(hi=>
              <tr>
               <td>{hi.nom}</td>
               <td>{hi.date}</td>
               </tr>
               )
              }

           
            

            </tbody></table></div>


      </div>
      <div className="modal-footer">



      </div>
    </div>
  </div>
</div></div></div></div>
 
        </div>
      </div>
      </div>
    </div>
      );
}
 
export default Historique;