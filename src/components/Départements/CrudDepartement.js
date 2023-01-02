import useFetch from '../useFetch';

import React from 'react';

import AjouterDepartement from './AjouterDépartement';


import Tree from './Tree'



function CrudDepartement() {
  const { data: departements } = useFetch("http://127.0.0.1:8000/arbo/")
 

  return (
    <div>
    <div className="container-fluid mt-5">
  <div className="row">
    <div className="col">
    <div className="card shadow">
<div className="card-header border-0">

            <AjouterDepartement />
       
         
            <Tree data={departements} />  
           </div></div> </div></div></div></div>)
     }
export default CrudDepartement;