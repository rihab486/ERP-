import React, {  useState } from "react";
import Form from "react-validation/build/form";

import { useNavigate } from "react-router-dom";
import axiosInstance from './axios';

import { makeStyles } from '@mui/styles';

export default function SignIn(){


const navigate=useNavigate();

const intialFormData=Object.freeze({
  email:'',
  password:''
})
const [formData,updateFormData]=useState(intialFormData);
const handleChange=(e)=>{
  updateFormData({
    ...formData,
    [e.target.name]:e.target.value.trim(), 
  })
}
const handleSubmit = (e) => {
  e.preventDefault();
  console.log(formData);

  axiosInstance
    .post(`token/`, {
      email: formData.email,
      password: formData.password,
    })
    .then((res) => {
    
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      axiosInstance.defaults.headers['Authorization'] =
        'JWT ' + localStorage.getItem('access_token');
        console.log(res.data)
      localStorage.setItem('id',res.data.id)
      localStorage.setItem('view_absence',res.data.view_absence)
      localStorage.setItem('email',res.data.email)
      localStorage.setItem('view_conge',res.data.view_conge)
      localStorage.setItem('view_pointeuse',res.data.view_pointeuse)
      localStorage.setItem('view_contrats',res.data.view_contrats)
      localStorage.setItem('view_departements',res.data.view_departements)
      localStorage.setItem('view_employé',res.data.view_employé)
      localStorage.setItem('view_espacepdg',res.data.view_espacepdg)
      localStorage.setItem('view_horaire',res.data.view_horaire)
      localStorage.setItem('view_horaire',res.data.view_horaire)
      
      localStorage.setItem('view_planing',res.data.view_planing)
      localStorage.setItem('view_rapports',res.data.view_rapports)
      localStorage.setItem('view_mouchard',res.data.view_mouchard)
      localStorage.setItem('view_historique',res.data.view_historique)
      localStorage.setItem('user_name',res.data.user_name)
      
      localStorage.setItem('rolename',res.data.rolename)
      localStorage.setItem('matricule',res.data.matricule)
      localStorage.setItem('solde',res.data.solde)
      localStorage.setItem('last_name',res.data.last_name)     
      localStorage.setItem('view_teletravail',res.data.view_teletravail)   
      localStorage.setItem('iddep',res.data.iddep)   
      localStorage.setItem('admin',res.data.admin)   
      localStorage.setItem('view_mission',res.data.view_mission)
      localStorage.setItem('view_autorisation',res.data.view_autorisation)
localStorage.setItem('teletravail_aujourdhui',res.data.teletravail_aujourdhui)
localStorage.setItem('view_authorisation',res.data.view_authorisation)
  
      navigate('/home');
    
     // setAuth(res.data)
    
  
      
    }).catch((err) =>{
      alert('vos données ne sont pas correctes')
    });};
    const useStyle = makeStyles({
      image: {
     
       // backgroundImage:`url("./Employee-recognition.png")`
        
   
      },
    });
    const classe = useStyle()
    return (
      <section  className="h-100 gradient-form" style={{backgroundColor:"#eee"}}>
      <div  className="container py-10 h-100">
        <div  className="row d-flex justify-content-center align-items-center h-100">
          <div  className="col-xl-10">
            <div  className="card rounded-3 text-black">
              <div  className="row g-0">
                <div  className="col-lg-6">
                  <div  className="card-body p-md-5 mx-md-4">
    
                    <div  className="text-center">
                      <img src="./logo2-removebg-preview.png"
                   style={{width:"185px"}}     alt="logo"/>
                      <h4  className="mt-1 mb-5 pb-1">Veuillez vous connecter à votre compte</h4>
                    </div>
    
                    <Form>
                  
    
                      <div className="form-outline mb-4">
                        <input type="email"   name="email"
                  id="email"  className="form-control"
                          placeholder="email address"  onChange={handleChange} />
            
                      </div>
    
                      <div  className="form-outline mb-4">
                        <input type="password"   name="password"
                  id="password"  className="form-control" placeholder="Mot de passe"  onChange={handleChange} />
                     
                      </div>
    
                      <div  className="text-center pt-1 mb-5 pb-1">
                        <button  className="btn btn-primary btn-block fa-lg  mb-3" type="submit" onClick={handleSubmit}>Connexion</button>
                     
                      </div>
    
                      <div  className="d-flex align-items-center justify-content-center pb-4">
             
                      </div>
    
                    </Form>
    
                  </div>
                </div>
                <div  className="col-lg-6 d-flex align-items-center" style={{backgroundColor:"rgb(2,0,36)",background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(90,194,223,1) 35%, rgba(0,212,255,1) 100%)"}}>
                  <div  className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4  className="mb-4">Votre solution de gestion de temps</h4>
                    <p  className="small mb-0">
                      IPS-TIME est un logiciel de pointage <div><hr/>
C’est le logiciel qui traite les données recueillies par la pointeuse, et vous permet ensuite d’y accéder et d’organiser ces données comme vous le souhaitez. Le logiciel agit comme une interface entre la pointeuse, et vous.  Sans celui-ci, difficile d’envisager comment tirer des avantages des solutions de gestion du temps mises en place.
               <hr/></div>
               Visitez notre site IP-SOFT :<br/>  <a href="http://www.ip-soft.tn/" target="_blank" style={{color:"white"}}> http://www.ip-soft.tn/</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
  }