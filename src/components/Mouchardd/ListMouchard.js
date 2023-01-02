import React from 'react'
import useFetch from '../useFetch';
import { useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import $ from "jquery";
const ListMouchard = () => {
  const[openn,setOpenn]=useState(false)
  const [post,setPost]=useState(false)
  const { data: users = [] } = useFetch("http://127.0.0.1:8000/user/")
  React.useEffect(()=>{

    
    if (mouchard.length==0){
      console.log('eaaa')
    setOpenn(true)
  setPost(false)
  
    }else{
    setOpenn(false)
    setPost(true)}
  }
  ,[openn,post])
  $(document).ready(function () {
   
    $('#datatable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
    const url="http://127.0.0.1:8000/";
    const { data: mouchard = [] } = useFetch(url+"MouchardList/")
    return ( 
        <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
          <div className="card-header border-0">
                  <h3>Archive de modifications</h3>
              </div>

              {post?
        <div className="table-responsive">
        <ScrollContainer className="scroll-container">
        <table className="table align-items-center table-flush" id="datatable">
          <thead className="thead-light">
            <tr>
              
             
              <th scope="col" >Date</th>
              <th scope="col" >personne qui a modifié</th>
              <th scope="col" >Employé</th>
              <th scope="col" >Mat employé</th>
              <th scope="col" >Champ</th>
              <th scope="col" >Ancienne</th>
              <th scope="col" >Nouvelle</th>
             
            </tr>
          </thead>
          <tbody>
        
 
            {mouchard.map(m =>
                    <tr key={m.id}>
                         <td>{m.datenow}</td>
                         <td>   {users.filter(x=>x.id==m.personne_name).map(x=><>{x.user_name} </>)}</td>
                      
                   <td>{m.employe_name}</td>
                   <td>{m.matriculeemploye}</td>
                   <td>{m.objet}</td>
                      <td>{m.anciennevaluer}</td>
                   <td>{m.nouvellevaluer}</td>
                   
                  
                
                
                    </tr>
                  )}
        
             
         
          </tbody>
        </table>
        </ScrollContainer>
        </div> :( <>{mouchard.length==0 ? <Backdrop  open={openn}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>:setPost(true)}</>)
  
  
  } 
        
        </div> 
        </div></div></div>
     );
}
 
export default ListMouchard;