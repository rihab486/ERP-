import React, { useState } from "react"

function UpdatePassword(){
    const [password,setPassword]=useState('')
    const [newpassword,setnewPassword]=useState('')

    function UpdatePass() {
      const passwords = document.getElementById("passwords").value;
      const newpassw = document.getElementById("cnfrm-passwords").value;
      let msg =document.getElementById("message");
      if (msg.length !=0){
        if(passwords==newpassw){
          msg.textContent="Password Match";
          msg.style.backgroundColor= "#00ff00";
        }else{
          msg.textContent="Password don't Match";
          msg.style.backgroundColor=" #ff0000";
        }
      }
    
    
const email=localStorage.getItem('email')
const matricule=localStorage.getItem('matricule')
const user_name=localStorage.getItem('user_name')
const is_active=true
        let userList = {newpassword, password,email,matricule,user_name,is_active}
        console.warn("item", userList)
    
        fetch('http://127.0.0.1:8000/user/' +localStorage.getItem('id') , {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userList)
        }).then((response) =>{
          if(!response.ok) throw new Error(response.status);
         
      }).then(() => {
        window.location.reload(false);
       
        } 
   
        )
      }
    return(
<div>



<div className="modal fade" id={`p${localStorage.getItem('id')}`}  role="dialog" aria-labelledby={`#p${localStorage.getItem('id')}`} aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
  <h5 className="modal-title" id="exampleModalLabel">Modifier votre mot de passe</h5>
  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div className="modal-body">
<form>
<input className="form-control" placeholder="Mot de passe" type="password" id="passwords" value={password} onChange={(e) => setPassword(e.target.value)} />
<div className="form-group">


  <input className="form-control" id="cnfrm-passwords" placeholder="Confirmation Mot de passe" value={newpassword} onChange={(e) => setnewPassword(e.target.value)} type="password" />



<p className="form-control" id="message" ></p>
</div>
<div className="modal-footer">
  <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
  <button className="btn btn-primary" type="button" onClick={UpdatePass} >Valider</button>
</div>

</form>
</div>

</div>
</div>
</div>

</div>
    )
}
export default UpdatePassword;