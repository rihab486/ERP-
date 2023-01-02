import React from 'react'
const Mouchard = (previous,neww,idemploye,idpersonne,objet) => {
    const mouch={previous,neww,idemploye,idpersonne,objet}
       
        fetch('http://127.0.0.1:8000/Mouchardcreate/'+previous +'/'+ neww +'/'+idemploye+'/'+idpersonne+'/'+objet,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mouch)
        }).then(() => {
    
     
            
            
      
        }
    
        )
      }
      export default Mouchard;