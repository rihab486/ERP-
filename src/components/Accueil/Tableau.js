import useFetch from '../useFetch';
import React,{useState,useRef} from 'react'
import { useEffect } from 'react';
import  { Bar } from 'react-chartjs-2'
import { useReactToPrint } from "react-to-print";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const Tableau= () => {
  const[openn,setOpenn]=useState(false)
  const [post,setPost]=useState(false)
useEffect(()=>{

    
    if (tableau.length==0){
      console.log('eaaa')
    setOpenn(true)
  setPost(false)
  
    }else{
    setOpenn(false)
    setPost(true)}
  }
  ,[openn,post])
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
 
 const [idcongeretriev,setIdcongeRetrieve]=useState('')
    const url="http://127.0.0.1:8000/";
    const { data: tableau = []} = useFetch(url+"accuiel/"+localStorage.getItem('id'))
    const { data: retreiveconge = []} = useFetch(url+"AcceuilHistoriqueCongeparchef/"+localStorage.getItem('id'))
    const { data: historiqueconges = []} = useFetch(url+"AcceuilHistoriqueCongeparchef/"+localStorage.getItem('id'))
    const[charts,setCharts]=useState([])
    useEffect(()=>{
      const  id=localStorage.getItem('id')
      const SelectchartHeures=async()=> {
     
          await fetch(`http://127.0.0.1:8000/HeuresDeTravailJours/`+id, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                
              
              }
            })
              .then((response) => {
              if (response.ok) {
                response.json().then((json) => {
                 
                  setCharts(json)
                  console.log(json)
                });
              }
            }
              ).catch((error) => {
                console.log(error);
              });
          };
          SelectchartHeures(id)
        }, [])
        const data = {
          labels:charts.map(x=>x.day),
          datasets: [{
              
              label: charts.map(x=>x.heuretravail),
              data: charts.map(x=>x.heuretravail),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1,
            
          }]
      }
      var options= {
          scales: {
              y: {
                  beginAtZero: true,
                  max:12
                  
              }
          },
          legend:{
              labels:{
                  fontSize:26
              }
          },
          
      }
   
    return ( 
      <div>
      <div className="container-fluid mt-5">
    <div className="row">
      <div className="col">
      <div className="card shadow">
      <div className='row'> 
      
        <div className='col-md-6 '   >
     
      
        <div className="table-responsive"  style={{boxShadow :"  0 0 8px 0px" , marginTop : 40 }}>
        
        <table className="table align-items-center table-flush">
          <thead className="thead-dark">
            <tr>
              
              <th scope="col">Jour</th>
              <th scope="col">Date</th>
              <th scope="col">Pointages</th>
            
            </tr>
          </thead>
          
        
          <tbody >
    
          {post ?
         <>   
             {tableau.map(ta =>
              <tr key={ta.idemploye}>
                <td>{ta.day}</td>
                <td>{ta.date}</td>
                 {ta.absent ? <td className='table-primary'>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td>: 
                 ta.conge ? <td style={{ backgroundColor: "#EEE8AA"}}>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td>
                 : ta.present ? <td className='table-danger'>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td> :
                 ta.absencejustifie ?<td className='table-info'>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td>:
                 ta.absencenonjustifie ?<td style={{backgroundColor:"#F45984"}}>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td> 
                 :ta.authorisation?<td style={{backgroundColor: "#679DE5"}}>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td>
                 :ta.ferie?<td style={{backgroundColor:"#BE94F0"}}>{ta.heurestravail}<br></br><small>{ta.pointages}</small></td>:
                 
                 ta.repos?<td style={{backgroundColor:"#0089F3"}}></td>: ""}
              </tr>
            )}
            </> 
            :( <>{tableau.length==0 ? <Backdrop  open={openn}>
              <CircularProgress  style={{color:"yellow"}} />
              </Backdrop>:setPost(true)}</>)
              
            }
        
    
   

             
         
          </tbody>


        </table>
      
      </div>
    
        </div>  
       
 <div className='col-md-6'>
 <div className="card-header border-0" style={{marginTop:"20px"}}>
      <div className='row'>
    
        <div className="table-responsive">
        <table className="table align-items-center table-flush" style={{ backgroundColor: "#EEE8AA"}}>
          <thead className="thead-dark">
      
            <tr>
            <th scope="col">Id</th>
            <th scope="col">Nom employé</th>
              <th scope="col">date début</th>
              <th scope="col">date fin</th>
              
              <th scope="col">Solde</th>
              <th scope="col">Motif </th>
              <th scope="col">Etat RH</th>
              <th scope="col">Etat Directeur</th>
              <th scope="col">Imprimer</th>
            
            </tr>
          </thead>
          <tbody>
           
             
            {historiqueconges.filter(x=>x.date_autorisation==null ).map(hi =>
                    <tr key={hi.idconge}>
                      <td>{hi.idconge}</td>
                      <td>{hi.user_name}</td>
                      <td>{hi.datedebut}</td>
                      <td>{hi.datefin}</td>
                      
                   
                      <td >{hi.solde}</td>
                      <td>{hi.motif ? "Congé":""}</td>
                      <td >{hi.etat_absrh}</td>
                      <td >{hi.etat_abs}</td>
                      <td > <button onClick={()=>{setIdcongeRetrieve(hi.idconge)}} type="button" className="btn btn-primary" data-toggle="modal" data-target={`#a${hi.idconge}`} >Imprimer</button></td>
                      <div className="modal fade" id={`a${hi.idconge}`} role="dialog" aria-labelledby={`a${hi.idconge}`} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
             
              <div className="modal-body">
        
     <div className='conatiner-fluid' ref={componentRef}>
     <h1 className='text-center'>Demande de congé</h1>
     <br/>
     <table class="table table-dark">
     <thead class="thead-dark">
    
  </thead>
  <tbody>
  {retreiveconge.filter(x=>x.date_autorisation==null ).map(x=>
  <>
<tr>
<th scope="row"><h2>Id congé </h2></th> 
<td><h2> {x.idconge}</h2></td>
</tr>
    <tr>
    <th scope="row"><h2>Nom d'employé </h2></th> 
<td><h2> {x.user_name}</h2></td>
</tr>

<tr>
<th scope="row"><h2>Matricule </h2></th> 
<td><h2> {x.matricule}</h2></td>
</tr>
<tr>
<th scope="row"><h2>Date début de congé </h2></th> 
<td><h2> {x.datedebut}</h2></td>
</tr>
<tr>
<th scope="row"><h2>Date fin de congé </h2></th> 
<td><h2> {x.datefin}</h2></td>
</tr>

<tr>
<th scope="row"><h2>Motif de congé</h2></th> 
<td><h2> {x.motif? "Congé" : "Authorisation"}</h2></td>
</tr>
<tr>
<th scope="row"><h2>Solde d'employé</h2></th> 
<td><h2> {x.solde}</h2></td>
</tr>
<tr>
<th scope="row"><h2>Nombre de jours</h2></th> 
<td><h2> {x.nbjours}</h2></td>
</tr>

<tr>
<th scope="row"><h2>Commentaire</h2></th> 
<td><h2> {x.justif}</h2></td>
</tr>

<tr>
<th scope="row"><h2>Avis Directeur</h2></th> 
<td><h2> {x.etat_abs}</h2></td>
</tr>
<tr>
<th scope="row"><h2>Avis Rh</h2></th> 
<td><h2> {x.etat_absrh}</h2></td>
</tr>

    </>
  )}
  </tbody>

</table>
  <h2 className='text-right' style={{marginRight:"60px"}}>Signature et caché</h2>

     </div>
     <button onClick={   handlePrint} className="btn btn-primary">Imprimer</button>
     </div></div></div></div>
                    </tr>
                  )}
   

             
         
          </tbody>
        </table>
      
        </div>
      </div>
      </div>
      <div className="card-header border-0">
      <div className='row'>
    
        <div className="table-responsive">
        <table className="table align-items-center table-flush"  style={{backgroundColor: "#679DE5"}}>
          <thead className="thead-dark">
      
            <tr>
            <th scope="col">Id</th>
            <th scope="col">Nom employé</th>
              <th scope="col">date d'authorisation</th>
              <th scope="col">heure debut</th>
              <th scope="col">heure fin</th>
              <th scope="col">Motif</th>
              <th scope="col">Etat RH</th>
              <th scope="col">Etat Directeur</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {historiqueconges.filter(x=>x.date_autorisation!==null ).map(hi =>
                    <tr key={hi.id}>
                      
                      <td>{hi.idconge}</td>
                      <td>{hi.user_name}</td>
                      <td>{hi.date_autorisation}</td>
                      <td>{hi.heure_debut}</td>
                      <td>{hi.heure_fin}</td>
                      <td><td>{hi.motif ? "Authorisation":""}</td></td>
                      <td>{hi.etat_absrh}</td>
                      <td>{hi.etat_abs}</td>
                    
                    </tr>
                  )}
   

             
         
          </tbody>
        </table>
     
        </div>
      </div>
      </div>
 </div>

        </div>
<br/>
        <div className='row'>
        <div className='col-md-3'>
         
         <div className="table-responsive table-sm"  style={{boxShadow :"  0 0 12px 0px"}}>
         <table className="table align-items-center table-flush" style={{  boxShadow :"  0 0 8px 0px"
 }}>
         <thead className="thead-dark">
             <tr style={{   
 }}>
               
               <th scope="col">état</th>
               <th scope="col">couleur</th>
             
             </tr>
           </thead>
           <tbody>
     
              
          
                     <tr  >
                       <td>Absent</td>
                       <td className='table-primary'></td>
                   
                     </tr>
                     <tr>
                       <td>Présent</td>
                       <td className='table-danger'></td>
                   
                     </tr>
                     <tr>
                       <td>Absence Justifié</td>
                       <td className='table-info'></td>
                   
                     </tr>
                     <tr>
                       <td>Absence Non Justifié</td>
                       <td style={{backgroundColor:"#F45984"}}></td>
                   
                     </tr>
                     <tr>
                       <td>Congé</td>
                       <td style={{ backgroundColor: "#EEE8AA"}}></td>
                   
                     </tr>
                     <tr>
                       <td>Authorisation</td>
                       <td style={{backgroundColor: "#679DE5"}}></td>
                       </tr>
                       <tr>
                       <td>Jour Ferié</td>
                       <td style={{backgroundColor:"#BE94F0"}}></td>
                       </tr>
                      
                  <tr>
                   <td>Repos</td>
                   <td style={{backgroundColor:"#0089F3"}}></td>
                  </tr>
    
 
              
          
           </tbody>
         </table>
       
       </div>
         </div>
              <div className='col-md-9'>
              <div  className="container" style={{  boxShadow :"  0 0 8px 0px" 
}}>
              <h3>Heures de travail par jour</h3>
                <Bar 
                data={data}
                height={100}
                options={options}
                
                />
              </div>
              </div>
                    </div>
   
      </div></div></div>
    
      </div>
       </div>
     );
}
 
export default Tableau;
