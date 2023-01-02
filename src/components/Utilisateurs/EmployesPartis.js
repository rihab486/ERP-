import React from "react"
import useFetch from "../useFetch";
import UndoIcon from '@mui/icons-material/Undo';
import { useState } from 'react';

import { makeStyles } from '@mui/styles';
import ScrollContainer from 'react-indiana-drag-scroll'


import $ from "jquery";

const EmployesPartis = () => {
  $('#parti').DataTable({
    "dom": 'Blfrtip',
    buttons: [
      'copy', 'excel', 'pdf', 'csv','print'
    ]
    ,"bDestroy": true
   } )
  const [userId, setUserId] = useState(null)
  
  const is_active = false
  const [open, setOpen] = useState(false);
  const [openparti, setOpenparti] = useState(false);



  const ReprisUser = (userId) => {
    fetch('http://127.0.0.1:8000/reprisremploye/' + userId , {
      method: 'get',
      headers: {

        'Content-Type': 'application/json'
      },
    }).then(() => {
      setOpenparti(false);
  

      window.location.reload(false);
    }
    )

  }
  
  
    const { data: users = [], isloading, error } = useFetch("http://127.0.0.1:8000/employespartis/")
    return (  
        <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <div className='row'>

                 
                </div>
              </div>
              <ScrollContainer className="scroll-container"> 
              {users.length==0? <h3>Pas des employés partis</h3>
               :
              <div className="table-responsive">
                <table id="parti" className="display">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Matricule</th>

                      <th scope="col">User Name</th>
                      <th scope="col">Date Parti</th>
                      <th scope="col">Role</th>
                      <th scope="col">Motif</th>
                      <th scope="col">Image</th>
                      <th scope="col">Action</th>
                      

                    </tr>
                  </thead>
                  <tbody>


                    {users.map(user =>
                      <tr key={user.id}>
                        <td>{user.matricule}</td>
                        <td>{user.user_name}</td>
                        <td>{user.dateparti}</td>
                        <td>{user.roles}</td>
                        <td>    {user.motifparti}</td>
                        <td>    <img src={user.image} className="imagepetit" /></td>
                        <td>
                          <a onClick={() => { ReprisUser(user.id) }}> <UndoIcon  /></a>
                        </td>
                  

                     
                      </tr>
                    )}
               
                  </tbody>
                </table>
              </div>}</ScrollContainer>


           

            </div>

          </div></div></div>
    );
}
 
export default EmployesPartis;