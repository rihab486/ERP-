import React,{Component} from 'react';

import { useState } from 'react';
function ImporterPointeuse(){
   
    const [nom_pointeuse, setNomPointeuse] = useState('');
    const [adresse_ip, setAdresseIP] = useState('');
    const [port, setPort] = useState('');
    
    const [SIV, setSIV] = useState('');
    const handlesubmit = (e) =>{
      e.preventDefault()
      const pointeuse = {nom_pointeuse , adresse_ip ,SIV,port }
    
      fetch("http://127.0.0.1:8000/pointeuse/" , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" 
        },
        body : JSON.stringify(pointeuse)
      }).then(() =>{
      
       // history.push('/Pointeuses')
       window.location.reload();
  
    }).catch((e)=>{
    
      console.log(pointeuse)
    })
    } 


    return(
        <div>
               
            <div className="row">
       



 <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointeuse">Ajouter Pointeuse</button>

<div className="modal fade" id="ajouterpointeuse" role="dialog" aria-labelledby="ajouterpointeuse" aria-hidden="true">
 

    <div className="modal-dialog modal- modal-dialog-centered modal-sm" role="document">
        <div className="modal-content">
        	
            <div className="modal-body p-0">

<div className="card bg-secondary border-0 mb-0">
    <div className="card-header bg-transparent pb-5">
        <div className="text-muted text-center mt-2 mb-3"><small>Pointeuse</small></div>
        
          
        
          
        
    </div>
    <div className="card-body px-lg-5 py-lg-5">
      
        <form role="form">
            <div className="form-group mb-3">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Nom de Pointeuse" value={nom_pointeuse} name="nom_pointeuse"  onChange={(e) => setNomPointeuse(e.target.value)} type="text"/>
                </div>
            </div>
            <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Adresse IP" type="text" value={adresse_ip} name="adresse_ip"  onChange={(e) => setAdresseIP(e.target.value)} />
                </div>
            </div>
            <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Port" type="text" value={port} name="port"  onChange={(e) => setPort(e.target.value)}/>
                </div>
            </div>
            <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="SIV" type="text" value={SIV} name="SIV"  onChange={(e) => setSIV(e.target.value)}/>
                </div>
            </div>
            
            <div className="custom-control custom-control-alternative custom-checkbox">
                <input className="custom-control-input" id=" customCheckLogin" type="checkbox"/>
                
            </div>
            <div className="text-center">
                <button type="button" className="btn btn-primary my-4" onClick={handlesubmit}>Enregistrer</button>
            </div>
        </form>
    </div>
  </div>
</div>
</div></div></div></div>


</div>


    )
}




export default ImporterPointeuse;