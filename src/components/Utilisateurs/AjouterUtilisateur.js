import React, { useEffect, useState } from 'react';

import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Form, Field } from "react-final-form";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiTreeItem from "@material-ui/lab/TreeItem";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps, useStyles, options } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Grid } from 'antd';

import { doc, setDoc } from "firebase/firestore"; 

const AjouterUtilisateur = () => {
 
  const { data: roles, isloading, error } = useFetch("http://127.0.0.1:8000/role/")
  
 

  const { data: TypesContrat = [], ll, oo } = useFetch('http://127.0.0.1:8000/contrats/')
  const [user_name, setUser] = useState('');
  const [matricule, setMatricule] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
 
  const [sex, setSexe] = useState('');
  
  const [matriculecnss, setMatriculeCNSS] = useState('')

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
 
  const [teletravail, setTeltravail] = useState('');
  const [situation_sociale, setSituationSociale] = useState('');
  const[solde,setSolde]=useState('')
  const[image,setImage]=useState('')

  //t preview image
  const [preview, setPreview] = useState()
  useEffect(() => {
    if (!image) {
        setPreview(undefined)
        return
    }
    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)
  
    return () => URL.revokeObjectURL(objectUrl)
}, [image]) 
  const { data: data, isloading: zzsx, error: esse } = useFetch("http://127.0.0.1:8000/arbo/")
 
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  console.log('succes')
 
};

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  },
  imageemploye:{
    height:80,
    width:80
  }
});
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
//form data pour insérer image
  var  object;
  const handlesubmit = (e) => {
  
    
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
   formdata.append("nbEnfants",nbEnfants)
   formdata.append("tel",tel)
   formdata.append("idcontrat",idcontrat)
   formdata.append("password",password)
   formdata.append("commentaire",commentaire)
   formdata.append("teletravail",teletravail)
   formdata.append("situation_sociale",situation_sociale)
   formdata.append("solde",solde)
  
   formdata.append("is_active",true)
 //formdata.append("saisonier",saisonier)
 if (image === null) {
} else {
  formdata.append("image",image)
}
console.log(typeof image)
    e.preventDefault()
    
    fetch("http://127.0.0.1:8000/create/",
      {
        method: "POST",
       
    
        body: formdata
      }).then((response) =>{
        if(!response.ok) throw new Error(response.status);
  else{
    response.json().then(user =>{
      Historique(user.id,user.arborescence)
      window.location.reload(false)
       
    })
  }
  
    }).catch((e)=>{
        alert("il faut ajouter un email et une matricule uniques! un mot de passe et un Nom non vides  et un département")
      })
 }
  
   

/*
 const handlesubmit = () => {
  const is_active=true


   const userList = { email,user_name,last_name, matricule, role, arborescence, planningemp, matriculecnss, sex, datedemarrage, datefin, rappel1, rappel2, démarrageContrat, datedenaissance, CIN, nbEnfants, tel, idcontrat, password, commentaire,  teletravail, situation_sociale, solde, is_active}
    console.warn("item", userList)
  
    fetch('http://127.0.0.1:8000/create/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userList)
    }).then((response) =>{
      if(!response.ok) throw new Error(response.status);
else{
  response.json().then(user =>{
    Historique(user.id,user.arborescence)
    window.location.reload(false)
     
  })
}

  }).catch((e)=>{
      alert(e)
    })
  }*/
  const Historique = (id,dep) => {
    const hist={id,dep}
       
        fetch('http://127.0.0.1:8000/Historique/'+id +'/'+dep , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hist)
        }).then(() => {
    
     
            
            
      
        }
    
        )
      }
  
  const classes = useStyles();
  ///select département and insert it 
  const [expanded, setExpanded] = React.useState([]);
  const [arborescence, setActualSelected] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [parent, setParent] = React.useState([]);

useEffect(()=>{
  setTreeData(data)
})
  const [treeData, setTreeData] = React.useState([]);

 

 //dfs_filter

  
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

  const renderTree = (treeItems) => {
    return treeItems.map((node) => {
      let children = null;
      if (Array.isArray(node.children)) {
        children = renderTree(node.children);
      }
      return (
   /**   <div className='row ' style={{marginLeft:"30px"}}> */
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
                // onClick={(e) => e.stopPropagation()}
              />
            }
            label={node.nom}
            key={node.id}
          />
         
        }
        
        children={children}
        // onLabelClick={(event) => {
        //   event.preventDefault();
        // }}
      />
   
      );
    });
  };

/** const[saisonier,setSaisonier]=useState(false)
  const handleOnChangeSaisonnier = () => {
    setSaisonier(!saisonier);
  };  
 */
 { /*const isAllSelected =plannings.length > 0 && planningemp.length === plannings.length;
      
        const handleChange = (event) => {
          const value = event.target.value;
          if (value[value.length - 1] === "all") {
            setPlaningEmp(planningemp.length === plannings.length ? [] : plannings.map(x=>x.id));
            return;
          }
          console.log('rzrzrz',value)
        setPlaningEmp(value);
        };*/}
  return (
    <div>

      <div>
    
 
 
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouteruser">
          Ajouter Un Employé
        </button>
      
        <div className="modal fade" id="ajouteruser" role="dialog" aria-labelledby="ajouteruser" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Un Employé</h5>
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

                       <input className="form-control" placeholder="Nom et prenom" value={user_name} name="user_name" onChange={(e) => setUser(e.target.value)} type="text"  />
                     
                     </div>
                   </div></div>
                  </div>
                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">
                       
                       <input className="form-control" placeholder="Email" name="email" value={email}
                         onChange={(e) => setEmail(e.target.value)} type="text"  id="email"/>
                     </div>
                   </div>
                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="matricule" value={matricule}
                         onChange={(e) => setMatricule(e.target.value)} type="text" />


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

                       <input className="form-control" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />


                     </div>
                   </div>

                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Nombre d'enfants" value={nbEnfants}  type="number" onChange={(e) => setNbenfants(e.target.value)} />


                     </div>
                   </div>

                 </div>

               </div>
               <div className="row">
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

                       <input className="form-control" placeholder="Solde d congé" type="number" step="0.5" value={solde} onChange={(e)=>{setSolde(e.target.value)}} />


                     </div>
                   </div>

                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="matricule CNSS" value={matriculecnss}
                         onChange={(e) => setMatriculeCNSS(e.target.value)} type="text" />


                     </div>
                   </div>
                 </div>
               </div>
               <div className="row">
                 <div className="col-md-4">
           
                 <div>
          
          <div>
          
            <Field name="tree" extra="">
              {({ input, meta }) => {
                const onNodeSelect = (event, nodeIds) => {
                  // console.log("onNodeSelect", nodeIds);
                  event.persist();
                  let iconClicked = event.target.closest(
                    ".MuiTreeItem-iconContainer"
                  );
                  if (!iconClicked) {
                    console.log('aaa',nodeIds)
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
                    <div>

                    <TextField
                       id="outlined-select-currency"
                       select
                       label="Département"
                       helperText="Svp sélectionnez un département"
                       margin='normal'
                       fullWidth
                       selected={arborescence}
                       
                     > 
                  {/** <div className='row'> */}
                      {renderTree(treeData)}
              </TextField>
                      </div>
                  </TreeView>
                 
                );
              }}
            </Field>
          </div>
        </div>
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
                       <MenuItem key={option.id} value={option.id}>
                         {option.rolename}
                       </MenuItem>
                     ))}
                   </TextField >

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
                       <MenuItem key={option.id} value={option.id}>
                         {option.contratname}
                       </MenuItem>
                     ))}

                   </TextField>

                 </div>
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
                       <MenuItem value={"femme"} key="1">Femme</MenuItem>
                       <MenuItem value={"homme"} key="2">Homme</MenuItem>


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
                     <MenuItem value={"Marié(e)"} key="3">Marié(e)</MenuItem>
                     <MenuItem value={"Divorcé(e)"} key="4">Divorcé(e)</MenuItem>
                     <MenuItem value={"Célibatair(e)"} key="5">Célibatair(e)</MenuItem>
                     <MenuItem value={"Veuf(ve)"} key="6">Veuf(ve)</MenuItem>
                   </TextField>

                 </div>
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
                     <MenuItem value={"Oui"} key="7">Oui</MenuItem>
                     <MenuItem value={"Non"} key="8">Non</MenuItem>


                   </TextField>

                 </div>

               </div>


               <div className='row'>
                 <div className='col-md'>
                   <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
                 </div>
               </div>
               <div className='row'>
                
               
                
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="naissance">Date de naissance</label>
                     <input className="form-control" id="naissance" placeholder="datedenaissance" value={datedenaissance} onChange={(e) => setdateDeNaissance(e.target.value)} type="datetime-local"
                     />



                   </div>



                 </div>
               
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="démarragedecontrat">Démarrage De Contrat</label>
                     <input className="form-control" id="démarragedecontrat" value={démarrageContrat} onChange={(e) => setDémarrageContrat(e.target.value)} type="datetime-local" />



                   </div>
                 </div>
            {    /**<div className='col-md-4'>

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

                     <label htmlFor="Datededémarrage">Date De Recrutement</label>
                     <input className="form-control" id="Datededémarrage" value={datedemarrage} onChange={(e) => setDateDémarrage(e.target.value)} placeholder="Date de démarrage" type="datetime-local" />



                   </div>
                 </div>
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="rappel1">Date Rappel 1</label>
                     <input className="form-control" id="rappel1" value={rappel1} onChange={(e) => setRappel1(e.target.value)} type="datetime-local" />
=
                   </div>
                 </div>
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="démarragedecontrat">Date Rappel 2</label>
                     <input className="form-control" id="rappel2" value={rappel2} onChange={(e) => setRappel2(e.target.value)} type="datetime-local" />

                   </div>
                 </div>

               </div>
               <div className='row'>
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="dateFin">Fin De Contrat</label>
                     <input className="form-control" id="dateFin" value={datefin} onChange={(e) => setDatefin(e.target.value)} type="datetime-local" />

                   </div>
                 </div>
                 <div className='col-md-4  pt-2'>
               
               <input type="file"  name="myImage" onChange={(event)=>{setImage(event.target.files[0])}}/>
               {image &&  <img src={preview} className={classes.imageemploye} /> }
               </div> 
                
               </div>

               <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button> </div>



             </form>


        )}/>

              </div>

              <div className="modal-footer">



              </div>

            </div>
          </div>
        </div>
     
      
      </div >


    </div >
  )
}
export default AjouterUtilisateur;