import useFetch from "../useFetch";
import React from "react";
import ScrollContainer from 'react-indiana-drag-scroll'
import $ from "jquery";
const Contratss = () => {
  $(document).ready(function () {
    $('#contrat').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
    const url="http://127.0.0.1:8000/";
  const { data: Contrats = [], isloading, error } = useFetch(url+"UsersOfChef/" +"?id=" +localStorage.getItem("id"))
    return ( 
        <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
          <div className="card-header border-0">
                  
              </div>
        <ScrollContainer className="scroll-container">  
        {Contrats.length==0? <h3>Pas de Contrats</h3>
                    : 
        <div className="table-responsive">
        <table id= "contrat" className="display">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Email Employé</th>
              <th scope="col">Date début de contrat</th>
              <th scope="col">Date fin de contrat</th>
              <th scope="col">Date de démarrage</th>
              <th scope="col">Rappel 1</th>
              <th scope="col">Rappel 2</th>
             
            </tr>
          </thead>
          <tbody>
        
            {Contrats.map(contrat =>
                    <tr key={contrat.id}>
                      <td>{contrat.email}</td>
                   <td>{contrat.démarrageContrat}</td>
                   <td>{contrat.datefin}</td>
                   <td>{contrat.datedemarrage}</td>
                   <td>{contrat.rappel1}</td>
                   <td>{contrat.rappel2}</td>
                
                    </tr>
                  )}
        
         
          </tbody>
        </table>
        </div>}</ScrollContainer> 
        
        </div> 
        </div></div></div>
     );
}
 
export default Contratss;