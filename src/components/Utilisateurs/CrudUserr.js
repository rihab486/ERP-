

import useFetch from '../useFetch';


import * as React from 'react';

import moment from "moment";
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AjouterUtilisateur from './AjouterUtilisateur';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutboundIcon from '@mui/icons-material/Outbound';

import { DataGrid } from '@mui/x-data-grid';
import { Form, Field } from "react-final-form";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { useEffect } from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from 'axios';
import Mouchard from '../Mouchardd/Mouchard';



import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps, useStyles, options } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


import ScrollContainer from 'react-indiana-drag-scroll'


import $ from "jquery";
import JSZip from 'jszip';
window.JSZip = JSZip;

function ListeUtilisateurs() {


  $(document).ready(function () {
    $('#example').DataTable({
      "dom": 'Blfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
  const [showw, setShoww] = useState(false)
  const [activite, setActivite] = useState(false)
  const [site, setSite] = useState('')
  

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (values) => {
    await sleep(300);

  };



  const TreeItem = withStyles({
    root: {
      "&.Mui-selected > .MuiTreeItem-content": {
        color: "red"
      },
      "& > .MuiTreeItem-content": {
        flexDirection: "row-reverse"
      }
    }
  })(MuiTreeItem);
  useEffect(() => {
    setTreeData(data)
  })
  const [treeData, setTreeData] = React.useState([]);

  const dfs = (node, term, foundIDS) => {
    console.log("dfs");

    let isMatching = node.nom && node.nom.indexOf(term) > -1;
    console.log("isMatching 1", isMatching);

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        const hasMatchingChild = dfs(child, term, foundIDS);
        console.log("hasMatchingChild", hasMatchingChild);
        isMatching = isMatching || hasMatchingChild;
        console.log(
          "isMatching 2:",
          isMatching,
          "child:",
          child,
          "term",
          term,
          "foundIDS:",
          foundIDS
        );
      });
    }

    // We will add any item if it matches our search term or if it has a children that matches our term
    if (isMatching && node.id) {
      console.log("found id", node.id);
      foundIDS.push(node.id);
    }

    return isMatching;
  };

  const filter = (data, matchedIDS) => {

    return data
      .filter((item) => matchedIDS.indexOf(item.id) > -1)
      .map((item) => ({
        ...item,
        children: item.children ? filter(item.children, matchedIDS) : []
      }));
  };

  const search = (event) => {
    const term = event.target.value;

    const dataNode = {
      children: data
    };

    const matchedIDS = [];

    dfs(dataNode, term, matchedIDS);

    setTreeData(filter(data, matchedIDS));
  };

  const getParentCheckboxStatus = (tree, id, parents) => {

    let array = [];
    tree.forEach((nodes) => {
      if (parents.includes(nodes.id)) {
        const getAllChild = (node) => {

          if (node.children && node.children.length > 1) {
            array = [...array, { id: node.id, intermidiate: true }];
          } else if (
            (node.children && node.children.length === 1) ||
            !node.children
          ) {
            array = [...array, { id: node.id, intermidiate: false }];
          }

          if (Array.isArray(node.children)) {
            node.children.forEach((node) => {
              if (parents.includes(node.id)) {
                getAllChild(node);
              }
            });
          }
        };
        getAllChild(nodes);
      }
    });
    return array;
  };

  const getParentsHelper = (tree, id, parents) => {

    if (tree.id === id) {
      return {
        found: true,
        parents: parents
      };
    }
    var result = {
      found: false
    };
    if (Array.isArray(tree.children)) {
      tree.children.forEach((node) => {

        var maybeParents = [...parents];
        if (tree.id !== undefined) {
          maybeParents.push(tree.id);
        }
        var maybeResult = getParentsHelper(node, id, maybeParents);
        if (maybeResult.found) {
          result = maybeResult;
          return false;
        }
      });
    }
    return result;
  };

  const getPossibleId = (tree, id, parentContender) => {

    if (tree.id === id) {
      return {
        found: true,
        id: parentContender
      };
    }
    var result = {
      found: false,
      id: id
    };
    if (Array.isArray(tree.children)) {
      let maybeParentContender = parentContender;
      tree.children.forEach((node) => {
        if (node.id === id) {
          console.log("maybeParentContender", maybeParentContender);
        }
        var maybeResult = getPossibleId(node, id, node);

        if (maybeResult.found) {
          result = maybeResult;
          return false;
        }
      });
    }
    return result;
  };

  const getParentById = (nodes, id) => {
    console.log("selected", selected);
    console.log("id", id);

    var tree = {
      id: undefined,
      children: nodes
    };

    if (selected.length > 0) {
      console.log("possibleId", getPossibleId(tree, id, id));
    }



    return getParentsHelper(tree, id, []);
  };

  const getChildById = (nodes, id) => {
    let array = [];

    const getAllChild = (nodes) => {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    };

    const getNodeById = (nodes, id) => {
      let slectedNode = nodes.map((node) => {
        const getChildNodeById = (node, id) => {
          if (node.id === id) {
            return node;
          } else if (Array.isArray(node.children)) {
            let result = null;
            node.children.forEach((node) => {
              if (!!getChildNodeById(node, id)) {
                result = getChildNodeById(node, id);
              }
            });
            return result;
          }
        };
        return getChildNodeById(node, id);
      });

      function filter_array_values(arr) {
        arr = arr.filter(isEligible);
        return arr;
      }

      function isEligible(value) {
        if (value !== false || value !== null || value !== 0 || value !== "") {
          return value;
        }
      }
      return filter_array_values(slectedNode)[0];
    };
    return getAllChild(getNodeById(nodes, id));
  };

  const getOnChange = (checked, nodes) => {

    const parentNode = getParentById(treeData, nodes.id);

    const allParentNodes = getParentCheckboxStatus(
      treeData,
      nodes.id,
      parentNode.parents
    );

    const allNodes = getChildById(treeData, nodes.id);

    let array = checked
      ? [...selected, ...allNodes]
      : selected.filter((value) => !allNodes.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);


    setSelected(array);

    let parentArray = checked
      ? [...parent, ...allParentNodes]
      : parent.filter(
        (value) => !allParentNodes.map((node) => node.id).includes(value.id)

      );

    console.log("parentArray", parentArray);
  };
  const [newpassword, setnewPassword] = useState('')
  const [expanded, setExpanded] = React.useState([]);
  const [arborescence, setActualSelected] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const renderTree = (treeItems) => {
    console.log("treeItems", treeItems)
    console.log("selected", arborescence)
    return treeItems.map((node) => {
      let children = null;
      if (Array.isArray(node.children)) {
        children = renderTree(node.children);
      }
      return (
        <TreeItem
          key={node.id}
          nodeId={String(node.id)}
          label={
            <FormControlLabel
              control={
                <Checkbox
                  indeterminate={parent.some(
                    (item) => item.id === node.id && item.intermidiate === true
                  )}
                  checked={
                    selected.some((item) => item === node.id) ||
                    parent.some(
                      (item) =>
                        item.id === node.id && item.intermidiate === false
                    )
                  }
                  onChange={(event) =>
                    getOnChange(event.currentTarget.checked, node)
                  }


                />
              }
              label={node.nom}
              key={node.id}

            />
          }
          children={children}
        />
      );
    });
  };
  const [parent, setParent] = React.useState([]);
  //
  const { data: users = [], isloading, error } = useFetch("http://127.0.0.1:8000/UsersOfChef/" +"?id=" + localStorage.getItem('id'))

  const [open, setOpen] = useState(false);
  const [openparti, setOpenparti] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenparti = () => {
    setOpenparti(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseparti = () => {
    setOpenparti(false);
  };
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'






      ,

    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const classes = useStyle()

  const { data: roles, isloading: hh, error: hr } = useFetch("http://127.0.0.1:8000/role/")
  const { data: data, isloading: zz, error: ee } = useFetch("http://127.0.0.1:8000/arbo/")
  const { data: plannings, isloading: lo, error: err } = useFetch("http://127.0.0.1:8000/planning/")
  const { data: TypesContrat = [], ll, oo } = useFetch('http://127.0.0.1:8000/contrats/')
  const [user_name, setUser] = useState('');
  const [matricule, setMatricule] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const[dateparti,setDateParti]=useState('');

  const [motifparti, setMotifParti] = useState('')
  const [userId, setUserId] = useState(null)
  const [sex, setSexe] = useState('');
  const [planningemp, setPlaningEmp] = useState([]);
  const [matriculecnss, setMatriculeCNSS] = useState('')

  const [userIddelete, setUserIddelete] = useState(null)
  const [userIddeleteparti, setUserIddeleteparti] = useState(null)
  const [datedemarrage, setDateDémarrage] = useState('');
  const [datefin, setDatefin] = useState('');
  const [rappel1, setRappel1] = useState('');
  const [rappel2, setRappel2] = useState('');
  const [démarrageContrat, setDémarrageContrat] = useState('');
  const [datedenaissance, setdateDeNaissance] = useState('');
  const [CIN, setCIN] = useState('');
  const [nbEnfants, setNbenfants] = useState('');
  const [tel, setTel] = useState('');
  const [idcontrat, setIdContrat] = useState('');
  const [password, setPassword] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [validite_preavis, setValidtePreavis] = useState('');
  const [teletravail, setTeltravail] = useState('');
  const [situation_sociale, setSituationSociale] = useState('');
  const [solde, setSoldee] = useState('')
  
  const [image, setImage] = useState(null);
  const is_active = true
  const [arboresence_historique, setArboHistorique] = useState('')
  function SelectUser(id) {
    fetch("http://127.0.0.1:8000/GetUserById/" + id).then((result) => {
      result.json().then((resp) => {

        setUser(resp.user_name);
        setEmail(resp.email);
        setActualSelected(resp.arborescence);
        setMatricule(resp.matricule);
        setRole(resp.role);
        setUserId(resp.id);
        setPlaningEmp(resp.planningemp);
        setMatriculeCNSS(resp.matriculecnss)
        setSexe(resp.sex);
        setDateDémarrage(resp.datedemarrage);
        setDatefin(resp.datefin);
        setRappel1(resp.rappel1);
        setRappel2(resp.rappel2);
        setDémarrageContrat(resp.démarrageContrat);
        setdateDeNaissance(resp.datedenaissance);
        setCIN(resp.CIN);
        setNbenfants(resp.nbEnfants);
        setTel(resp.tel);
        setIdContrat(resp.idcontrat);
        setPassword(resp.password);
        setCommentaire(resp.commentaire);
        setValidtePreavis(resp.validite_preavis);
        setTeltravail(resp.teletravail);
        setSituationSociale(resp.situation_sociale);
        setSoldee(resp.solde)
        setImage(resp.image)
        setSldeSelected(resp.solde)
        setRoleSelect(resp.rolename)
        setMail(resp.email)
        setPlan(resp.nomplaning)
        setTelephone(resp.tel)
        setTypeC(resp.nomcontrat)
        setTeletrav(resp.teletravail)
        setArboHistorique(resp.arborescence)
        setMatricnss(resp.matriculecnss)
        setName(resp.user_name)
        setMatric(resp.matricule)
        setCi(resp.CIN)
        setNBenfan(resp.nbEnfants)
        setSexee(resp.sex)
        setSituation(resp.situation_sociale)

        setdatnai(resp.datedenaissance)
        setcomm(resp.commentaire)
        setDatedema(resp.datedemarrage)
        setRap1(resp.rappel1)
        setRap2(resp.rappel2)
        setdemcontrat(resp.démarrageContrat)

      })
    })
  }
  const isAllSelected = plannings.length > 0 && planningemp.length === plannings.length;

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setPlaningEmp(planningemp.length === plannings.length ? [] : plannings.map(x => x.id));
      return;
    }
    console.log('rzrzrz', value)
    setPlaningEmp(value);
  };
  const DeleteUser = (userId) => {
    fetch('http://127.0.0.1:8000/userdelete/' + userId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json'
      },
    }).then(() => {
      setOpen(false);
      Mouchard("en cours ", "Employé Supprimé", userId, localStorage.getItem('id'), "Suppression de l'employé")
      window.location.reload(false);
    }
    )


  }
  const [selectdatedemmarge, setSelectedatedemaarge] = useState('')
  const PartiUser = (userId,motif,datepart) => {
    console.log(selectdatedemmarge)
    fetch('http://127.0.0.1:8000/quitteremploye/' + userId +"/"+motif+"/"+datepart, {
      method: 'get',
      headers: {

        'Content-Type': 'application/json'
      },
    }).then(() => {
      setOpenparti(false);
  
      Mouchard("du "+selectdatedemmarge,"au "+moment().format("DD-MM-YYYY hh:mm:ss"),userId,localStorage.getItem('id'),"Parti employé"  +"le" + datepart )

     window.location.reload(false);
    }
    )

  }
  const [soldeselect, setSldeSelected] = useState('')
  const [roleselect, setRoleSelect] = useState('')
  const [R, setR] = useState('')
  const [mail, setMail] = useState('')
  const [plan, setPlan] = useState('tt')
  const [planselect, setPlanselect] = useState('')
  const [telph, setTelephone] = useState('rien')
  const [type, setTypeC] = useState('')
  const [nomcontrat, setNomContrat] = useState('')
  const [teletr, setTeletrav] = useState('')
  const [matr_cnss, setMatricnss] = useState('')
  const [name, setName] = useState('')
  const [matric, setMatric] = useState('')
  const [ci, setCi] = useState('')
  const [nbenf, setNBenfan] = useState('')
  const [sexee, setSexee] = useState('')
  const [situ, setSituation] = useState('')
  const [datnai, setdatnai] = useState('')
  const [comm, setcomm] = useState('')
  const [datdema, setDatedema] = useState('')
  const [rap1, setRap1] = useState('')
  const [rap2, setRap2] = useState('')
  const [demcontrat, setdemcontrat] = useState('')
  const UpdateUser  = (e) => {
    console.log(image)
  const formdata=new FormData()
  formdata.append("email",email)
  formdata.append("user_name",user_name)
  formdata.append("matricule",matricule)
  formdata.append("role",role)
  formdata.append("arborescence",arborescence)
  
  formdata.append("matriculecnss",matriculecnss)
  formdata.append("sex",sex)
  formdata.append("datedemarrage",datedemarrage)
  formdata.append("datefin",datefin)
  formdata.append("rappel1",rappel1)
  formdata.append("rappel2",rappel2)
  formdata.append("démarrageContrat",démarrageContrat)
  formdata.append("datedenaissance",datedenaissance)
  formdata.append("CIN",CIN)
  formdata.append("nbEnfants",2)
  formdata.append("tel",tel)
  formdata.append("idcontrat",idcontrat)
  formdata.append("password",password)
  formdata.append("commentaire",commentaire)
  formdata.append("teletravail",teletravail)
  formdata.append("situation_sociale",situation_sociale)
  formdata.append("solde",20)
  formdata.append("newpassword",newpassword)
 
  formdata.append("is_active",true)

  if (image === null) {
  } else {
    formdata.append("image",image)
  }
  
  console.log(typeof image)
      e.preventDefault()
      fetch('http://127.0.0.1:8000/user/' + userId, {
        method: 'PUT',
      
        body: formdata
      }).then((response) =>{

        console.log('test')
        if(!response.ok) throw new Error(response.status);
       
    }).then(() => {

      
      if (arboresence_historique!=formdata.arborescence){
      Historique(userId, formdata.arborescence)
      }
      console.log(teletr)
      if (teletr!=teletravail){
      Mouchard(teletr,teletravail,userId,localStorage.getItem('id'),"Modifier :Télétravail")
      }
      if(type!=nomcontrat){
      Mouchard(type,nomcontrat,userId,localStorage.getItem('id'),"Modifier :Type de Contrat")
      }
      if(telph!=tel){
      Mouchard(telph,tel,userId,localStorage.getItem('id'),"Modifier :Numéro de téléphone")
      }
      if(plan!=planselect){
      Mouchard(plan,planselect,userId,localStorage.getItem('id'),"Modifier :Nom Planing")
      }
      if(mail!=email){
      Mouchard(mail,email,userId,localStorage.getItem('id'),"Modifier : Email")
      }
      if(soldeselect!=solde){
      Mouchard(soldeselect,solde,userId,localStorage.getItem('id'),"Modifier :Solde")
      }
      if(roleselect!=R){
      Mouchard(roleselect,R,userId,localStorage.getItem('id'),"Modifier :Nom de Role")
      }
      if(matr_cnss!=matriculecnss){
      Mouchard(matr_cnss,matriculecnss,userId,localStorage.getItem('id'),"Modifier Matricule CNSS")
      }
      if(name!=user_name){
        console.log(localStorage.getItem('id'))
        Mouchard(name,user_name,userId,localStorage.getItem('id'),"Modifier Le nom de l'employé")
      }
      if(matric!=matricule){
        Mouchard(matric,matricule,userId,localStorage.getItem('id'),"Modifier La matricule")
      }
      if(ci!=CIN){
        Mouchard(ci,CIN,userId,localStorage.getItem('id'),"Modifier La CIN")
      }
      if(nbenf!=nbEnfants){
        Mouchard(nbenf,nbEnfants,userId,localStorage.getItem('id'),"Modifier Le nombre d'enfants")
      } 
      if (sexee!=sex){
        Mouchard(sexee,sex,userId,localStorage.getItem('id'),"Modifier Le sexe")
      }
      if (situation_sociale!=situ){
        Mouchard(situ,situation_sociale,userId,localStorage.getItem('id'),"Modifier La situation sociale")
      }
      if (datnai!=datedenaissance){
        Mouchard(datnai,datedenaissance,userId,localStorage.getItem('id'),"Modifier La date de naissance")
      }
     
      if (comm!=commentaire){
        Mouchard(comm,commentaire,userId,localStorage.getItem('id'),"Modifier La commentaire")
      }
      if (datdema!=datedemarrage){
        Mouchard(datdema,datedemarrage,userId,localStorage.getItem('id'),"Modifier La date de démarrage")
      }
      if (rap1!=rappel1){
        Mouchard(rap1,rappel1,userId,localStorage.getItem('id'),"Modifier La date de rappel 1")
      }
      if (rap2!=rappel2){
        Mouchard(rap2,rappel2,userId,localStorage.getItem('id'),"Modifier La date de rappel2")
      }
      if (demcontrat!=démarrageContrat){
        Mouchard(demcontrat,démarrageContrat,userId,localStorage.getItem('id'),"Modifier La date de démarrage contrat")
      }
    
     
window.location.reload(false)
     
    
      
    }

    ).catch((e)=>{
      alert('il faut choisir le contrat , le role et l image!')
    })

}

  const Historique = (id, dep) => {
    const hist = { id, dep }

    fetch('http://127.0.0.1:8000/Historique/' + id + '/' + dep, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hist)
    }).then(() => {

      //window.location.reload(false);



    }

    )
  }
{/**  const ExportToExcel = async () => {
    await axios({
      url: 'http://127.0.0.1:8000/exportemploye/',
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.xls'); //or any other extension
      document.body.appendChild(link);
      link.click();
    });

  } */}
  /** 
  const[saisonier,setSaisonier]=useState(false)
    
    const handleOnChangeSaisonnier = () => {
      setSaisonier(!saisonier);
    }; 
   */
  //const[serarchItem,setSearchItem]=useState('')
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <div className='row'>

                  <AjouterUtilisateur />


               
                </div>
              </div>
              <div >

              </div>
              
     <ScrollContainer className="scroll-container"> 
     {users.length==0? <h3>Pas des utilisateurs</h3>
                    :        
<div className="table-responsive" >


<table  id="example" className="display" >
    <thead className="thead-light">
   <tr>
   <th>Matricule</th>
    <th>Nom et Prénom de l'employé</th>
    <th>Role</th>
    <th>Departement</th>
    <th>Date Repris</th>
    <th>Image</th>
    <th>Action</th>
   </tr>
    </thead>       
    <tbody>
      
    {users.map(us=>
      
<>  
<tr>
<td>{us.matricule}</td>

<td>{us.user_name} </td>
<td>{us.role}</td>
<td>{us.Nomarbo}</td>
<td>{us.daterepris}</td>
<td><img src={`http://127.0.0.1:8000/media/${us.image}`} className="imagepetit" /></td>
<td>
<div className="row">
        <div className="col-md-2">

          <a onClick={() => SelectUser(us.id)} data-toggle="modal" data-target="#getuserhistorique" ><EditIcon
            className={classes.icon}
          /></a>
        </div>
        <div className="col-md-2">
  
          <a onClick={() => { handleClickOpenparti(); setUserIddeleteparti(us.id);setSelectedatedemaarge(us.datedemarrage)  }}  ><OutboundIcon className={classes.icon} /></a>


        </div>
        <div className="col-md-2">
          <a onClick={() => { handleClickOpen(); setUserIddelete(us.id)}}  ><DeleteIcon className={classes.icon} /></a>
        </div>
      </div>
</td>
</tr>

</>
)
}


    </tbody>


   
  </table>
            <Dialog

          BackdropProps={{ invisible: true }}
          className={classes.dialog}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
            {"supprimer un employé"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              êtes-vous sûr de vouloir supprimer cet employé?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>non</Button>
            <Button onClick={() => { DeleteUser(userIddelete) }}>
              oui
            </Button>
          </DialogActions>
          </Dialog>
          <Dialog

          BackdropProps={{ invisible: true }}
          className={classes.dialog}
          open={openparti}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
            {"licencier un employé"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              êtes-vous sûr de partir cet employé ?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Motif"
              type="text"
              fullWidth
              variant="standard"
              value={motifparti}
              onChange={(e)=>{setMotifParti(e.target.value)}}
            />
                <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Date Parti"
              type="date"
              fullWidth
              variant="standard"
              value={dateparti}
              onChange={(e)=>{setDateParti(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseparti}>non</Button>
            <Button onClick={() => { PartiUser(userIddeleteparti,motifparti,dateparti) }}>
              oui
            </Button>
          </DialogActions>
          </Dialog>
           
</div>}  </ScrollContainer> 

              <div >


                <div className="modal fade" id="getuserhistorique" role="dialog" aria-labelledby="ajouteruser" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modifier Utilisateur</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">


                      <Form
                          onSubmit={onSubmit}

                          mutators={{
                            setTreeValue: (args, state, utils) => {
                              utils.changeValue(state, "tree", () => args);
                            }
                          }}
                          render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit}>


                              <div className="row">
                              <div className="col-md-4">
                  <div className='row'>
<div className='col-md-6'>  <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Nom" value={user_name } name="user_name" onChange={(e) => setUser(e.target.value)} type="text"  />
                     
                     </div>
                   </div></div>
                   <div className='col-md-6'> 
                  
                   </div></div>
                 </div><div className="col-md-4">
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="Email" name="email" value={email}
                                        onChange={(e) => setEmail(e.target.value)} type="text" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="matricule" value={matricule}
                                        onChange={(e) => setMatricule(e.target.value)}  />


                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="row">



                                <div className="col-md-4">
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="matricule CNSS" value={matriculecnss}
                                        onChange={(e) => setMatriculeCNSS(e.target.value)} type="text" />


                                    </div>
                                  </div>
                                </div>

                                <div className='col-md-4'>
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="N Télephone" value={tel} onChange={(e) => setTel(e.target.value)} type="text" />


                                    </div>
                                  </div>

                                </div>
                                <div className='col-md-4'>
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="Solde d congé" value={solde} onChange={(e) => setSoldee(e.target.value)} type="number" />


                                    </div>
                                  </div>

                                </div>

                              </div>


                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="CIN" value={CIN} onChange={(e) => setCIN(e.target.value)} type="text" />


                                    </div>
                                  </div>

                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="Nombre d'enfants" value={nbEnfants} type="number" onChange={(e) => setNbenfants(e.target.value)} />


                                    </div>
                                  </div>

                                </div>
                                <div className="col-md-4">
                                  <div className='row'>
                         <div className='col-md-6'>
                         <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control"  placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />


                                    </div>
                                  </div>
                         </div>
                         <div className='col-md-6'>
                         <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control"  placeholder="Confirmation Mot de passe" value={newpassword} onChange={(e) => setnewPassword(e.target.value)} type="password" />


                                    </div>
                                  </div>
                         </div></div>

                                </div>

                              </div>

                              <div className="row">
                                <div className="col-md-4">
                                  <Field name="tree" extra="">
                                    {({ input, meta }) => {
                                      const onNodeSelect = (event, nodeIds) => {
                                        // console.log("onNodeSelect", nodeIds);
                                        event.persist();
                                        let iconClicked = event.target.closest(
                                          ".MuiTreeItem-iconContainer"
                                        );
                                        if (!iconClicked) {
                                          setActualSelected(nodeIds);
                                          // console.log("form", form.getFieldState("tree"));
                                          if (form.getFieldState("tree").value !== undefined) {
                                            nodeIds.push(...form.getFieldState("tree").value);
                                            const uncheckedId = nodeIds.filter(
                                              (nodeId, index) => nodeIds.indexOf(nodeId) !== index
                                            );
                                            // console.log("uncheckedId", uncheckedId);
                                            if (uncheckedId.length > 0) {
                                              nodeIds = nodeIds.filter((node) => {
                                                return node !== uncheckedId[0];
                                              });
                                              // console.log("nodeIds after removing", nodeIds);
                                            }
                                            console.log("nodeIds", nodeIds);
                                            form.mutators.setTreeValue(...nodeIds);
                                          } else {
                                            form.mutators.setTreeValue(...nodeIds);
                                          }
                                        }
                                      };

                                      const onNodeToggle = (event, nodeIds) => {
                                        // console.log("onNodeToggle", nodeIds);
                                        event.persist();
                                        let iconClicked = event.target.closest(
                                          ".MuiTreeItem-iconContainer"
                                        );
                                        if (iconClicked) {
                                          setExpanded(nodeIds);
                                        }
                                      };

                                      return (

                                        <TreeView
                                          className={classes.root}
                                          defaultCollapseIcon={<ExpandMoreIcon />}
                                          defaultExpandIcon={<ChevronRightIcon />}
                                          multiSelect

                                          expanded={expanded}
                                          selected={arborescence}
                                          onNodeToggle={onNodeToggle}
                                          onNodeSelect={onNodeSelect}
                                          

                                        >
                                           <TextField
                       id="outlined-select-currency"
                       select
                       label="Département"
                       value={arborescence}
                       helperText="Svp sélectionnez un département"
                       margin='normal'
                       fullWidth
                  
                       
                     > 
                                          {renderTree(treeData)}
                                          </TextField>
                                        </TreeView>         

                                      );
                                    }}
                                  </Field>
                                </div>
                                <div className='col-md-4'>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="role"
                                    value={role}
                                    onChange={(e) => { setRole(e.target.value) }}
                                    helperText="Svp sélectionnez un role"
                                    margin='normal'
                                    fullWidth
                                  >
                                    {roles.map((option) => (
                                      <MenuItem key={option.rolename} value={option.id} onClick={(e)=>{setR(e.target.innerText)}}>
                                        {option.rolename}
                                      </MenuItem>
                                    ))}
                                  </TextField >

                                </div>
                      {/*          <div className='col-md-4'>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="mutiple-select-label">Sélectionnez des planings</InputLabel>
                                    <Select
                                      labelId="mutiple-select-label"
                                      multiple
                                      value={planningemp}
                                      onChange={handleChange}
                                      renderValue={ (selected)=>selected.map(obj =>plannings.find(o => o.id=== obj).title).join(", ")} 
                                      MenuProps={MenuProps}
                                    >
                                      <MenuItem
                                        value="all"
                                        classes={{
                                          root: isAllSelected ? classes.selectedAll : ""
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Checkbox
                                            classes={{ indeterminate: classes.indeterminateColor }}
                                            checked={isAllSelected}
                                            indeterminate={
                                              planningemp.length > 0 && planningemp.length < plannings.length
                                            }
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          classes={{ primary: classes.selectAllText }}
                                          primary="Select All"
                                        />
                                      </MenuItem>
                                      {plannings.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                          <ListItemIcon>
                                            <Checkbox checked={planningemp.indexOf(option.id) > -1} />
                                          </ListItemIcon>
                                          <ListItemText primary={option.title} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    </FormControl>
               

                                </div>*/}
                              </div>
                              <div className='row'>

                                <div className='col-md-4'>
                                  <div className="form-group">
                                    <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Sexe"
                                      value={sex}
                                      onChange={(e) => setSexe(e.target.value)}
                                      helperText="Svp sélectionnez sexe"
                                      margin='normal'
                                      fullWidth
                                    >
                                      <MenuItem value={"femme"}>Femme</MenuItem>
                                      <MenuItem value={"homme"}>Homme</MenuItem>


                                    </TextField>

                                  </div>
                                </div>
                                <div className='col-md-4'>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="situation sociale"
                                    value={situation_sociale}
                                    onChange={(e) => setSituationSociale(e.target.value)}
                                    helperText="Svp sélectionnez une situation sociale"
                                    margin='normal'
                                    fullWidth
                                  >
                                    <MenuItem value={"Marié(e)"}>Marié(e)</MenuItem>
                                    <MenuItem value={"Divorcé(e)"}>Divorcé(e)</MenuItem>
                                    <MenuItem value={"Célibatair(e)"}>Célibatair(e)</MenuItem>
                                    <MenuItem value={"Veuf(ve)"}>Veuf(ve)</MenuItem>
                                  </TextField>

                                </div>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="naissance">Date de naissance</label>
                                    <input className="form-control" id="naissance" placeholder="datedenaissance" value={datedenaissance} onChange={(e) => setdateDeNaissance(e.target.value)} type="datetime-local"
                                    />



                                  </div>



                                </div>
                              </div>

                              <div className='row'>

                                <div className='col-md-4'>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Téletravail"
                                    value={teletravail}
                                    onChange={(e) => setTeltravail(e.target.value)}
                                    helperText="Svp sélectionnez un choix"
                                    margin='normal'
                                    fullWidth
                                  >
                                    <MenuItem value={"Oui"}>Oui</MenuItem>
                                    <MenuItem value={"Non"}>Non</MenuItem>


                                  </TextField>

                                </div>
                                <div className='col-md-4'>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="TypeDeContrat"
                                    value={idcontrat}
                                    onChange={(e) => setIdContrat(e.target.value)}
                                    helperText="Svp sélectionnez un type de contrat"
                                    margin='normal'
                                    fullWidth
                                  >
                                    {TypesContrat.map((option) => (
                                      <MenuItem key={option.nom}  value={option.id} onClick={(e)=>{setNomContrat(e.target.innerText)}}>
                                        {option.contratname}
                                      </MenuItem>
                                    ))}

                                  </TextField>

                                </div>
{/**<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='Saisonier' checked={saisonier ? true:false} value={saisonier} onChange={handleOnChangeSaisonnier}  />
</div>  */}
                              </div>
                              <div className='row'>
                                <div className='col-md'>
                                  <textarea placeholder='commentaire' value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" className="form-control"></textarea>
                                </div>
                              </div>
                            
                              <div className='row'>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="Datededémarrage">Démarrage</label>
                                    <input className="form-control" id="Datededémarrage"  onChange={(e) => setDateDémarrage(e.target.value)} placeholder="Date de démarrage" type="datetime-local" />



                                  </div>
                                </div>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="rappel1">Date Rappel 1</label>
                                    <input className="form-control" id="rappel1" onChange={(e) => setRappel1(e.target.value)} type="datetime-local" />



                                  </div>
                                </div>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="démarragedecontrat">Date Rappel 2</label>
                                    <input className="form-control" id="rappel2"  onChange={(e) => setRappel2(e.target.value)} type="datetime-local" />



                                  </div>
                                </div>


                              </div>
                              <div className='row'>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="dateFin">Date Fin</label>
                                    <input className="form-control" id="dateFin"  onChange={(e) => setDatefin(e.target.value)} type="datetime-local" />



                                  </div>
                                </div>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="démarragedecontrat">Démarrage De Contrat</label>
                                    <input className="form-control" id="démarragedecontrat" value={démarrageContrat} onChange={(e) => setDémarrageContrat(e.target.value)} type="datetime-local" />


                                  </div>
                                </div>
                               
                                  <div className='col-md-4 '>
                                  <input type="file"  name="myImage" onChange={(event)=>{setImage(event.target.files[0])}}/>
                                   <img src={image}  value={image} className="imagepetit" />
                              
  
                            </div> 

                              </div>









                              <div className="form-group"><button className="btn btn-primary" onClick={UpdateUser}>Valider</button></div>    </form>
                          )} />


                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div></div></div>
    </div>
  )
}
export default ListeUtilisateurs;