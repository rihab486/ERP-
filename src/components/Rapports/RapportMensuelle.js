

import { useReactToPrint } from "react-to-print";
import React, { useState , useRef} from 'react';

import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps, useStyles, options } from "./utils";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";


import { useEffect } from 'react';
import { Form, Field } from "react-final-form";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollContainer from 'react-indiana-drag-scroll'
export const ComponentMensuelleToPrint = React.forwardRef((props, ref) => {
    const[employe,setEmploye]=useState([])
    const[date1,setDate1]=useState('')
    const[date2,setDate2]=useState('')
 
    const[dat,setData]=useState([])
    const[users,setUsers]=useState([])
    const [post,setPost]=useState(false)
    const[openn,setOpenn]=useState(false)
    const handleToggle = () => {
     setOpenn(!openn)
    };
    function SelectRapportMensuelle(employes,date1,date2) {
      
      
            fetch("http://127.0.0.1:8000/RapportMensuelle/" + date1 + "/" + date2 + "/?id=" + employes).then((result) => {
                result.json().then((resp) => {
                  setPost(true)
                setData(resp)
                
                })
            .catch(err =>{
                alert('Erreur')
            })
          })}
         
    
          const classes = useStyles();

          const isAllSelected =users.length > 0 && employe.length === users.length;
        
          const handleChange = (event) => {
            const value = event.target.value;
            if (value[value.length - 1] === "all") {
              setEmploye(employe.length === users.length ? [] : users.map(x=>x.id));
              return;
            }
            setEmploye(value);
          };
  //departemnts
   
 const [expanded, setExpanded] = React.useState([]);
 const [arborescence, setActualSelected] = React.useState([]);
 const [selected, setSelected] = React.useState([]);
 const [parent, setParent] = React.useState([]);

useEffect(()=>{
 setTreeData(data)

})
 const [treeData, setTreeData] = React.useState([]);



 
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
 const[idss,setIds]=useState([])
 const getParentById = (nodes, id) => {
   console.log("selected", selected);
   idss.push(id)
  
     
    
   
   
 
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
 const { data: data, isloading: zzsx, error: esse } = useFetch("http://127.0.0.1:8000/arbo/")
 
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
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
///
    return ( 
        <div>
      
    <div className="card-header border-0">
    <div className="row">

<button data-toggle="modal" data-target="#ajouterdep" className="btn btn-primary">
   Importer Rapport Mensuelle
</button>
                     <ReactHTMLTableToExcel
                              
                              className='btn btn-default'
                              table="absencestoexcel"
                              filename="Rapport d'absences"
                              sheet="tablexls"
                              buttonText="Excel"
                              /> 
</div>
        <div>

    
      
                <div className="modal fade" id="ajouterdep" role="dialog" aria-labelledby="ajouterdep" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Importer un rapport de mois</h5>
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
        render={({  form}) => (


                                <form>


                                <div className="row">
    <div className="col-md-6">

      <div className="form-group">
        <div className="input-group input-group-merge input-group-alternative">

          <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
        </div>
      </div>
    </div>
    <div className="col-md-6">

<div className="form-group">
<div className="input-group input-group-merge input-group-alternative">

<input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date" />
</div>
</div>
</div>
    
    </div>
    <div className="row">
<div className='col-md-6'>
                             

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
                                                   fetch("http://127.0.0.1:8000/UsersOfChefRHRapports/"+localStorage.getItem("id")+"/" + nodeIds).then((result) => {
                                                    result.json().then((resp) => {
                                                  
                                                      setUsers(resp)
                                                  
                                                    })
                                                    
                                                  })
                                                   form.mutators.setTreeValue(...nodeIds);
                                                 } else {
                                                  fetch("http://127.0.0.1:8000/UsersOfChefRHRapports/"+localStorage.getItem("id")+"/" + nodeIds).then((result) => {
                                                    result.json().then((resp) => {
                                                  
                                                      setUsers(resp)
                                                  
                                                    })
                                                    
                                                  })
                                                   form.mutators.setTreeValue(...nodeIds);
                                                 }
                                               }
                                      
                                             };
                             
                                             const onNodeToggle = (event, nodeIds) => {
                                               //pour afficher les enfants
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
                                               
                                                 defaultCollapseIcon={<ExpandMoreIcon />}
                                                 defaultExpandIcon={<ChevronRightIcon />}
                                                 multiSelect
                                                 expanded={expanded}
                                                 selected={arborescence}
                                                 onNodeToggle={onNodeToggle}
                                                 onNodeSelect={onNodeSelect}
                                                 
                                               
                                               >
                                                 <div>
                             
                                            
                                                   {renderTree(treeData)}
                                                   </div>
                                               </TreeView>
                                              
                                             );
                                           }}
                                         </Field>
                             
                                                           </div>

                                                  
</div>
                              <div className='row'> 
                             <div className="col-md-6">
                              <FormControl className={classes.formControl}>
                                    <InputLabel id="mutiple-select-label">Sélectionnez des employés</InputLabel>
                                    <Select
                                      labelId="mutiple-select-label"
                                      multiple
                                      value={employe}
                                      onChange={handleChange}
                                     
                                      MenuProps={MenuProps}
                                      renderValue={ (selected)=>selected.map(obj => users.find(o => o.id=== obj).user_name).join(", ")} 
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
                                              employe.length > 0 && employe.length < users.length
                                            }
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          classes={{ primary: classes.selectAllText }}
                                          primary="Select All"
                                        />
                                      </MenuItem>
                                      {users.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                          <ListItemIcon>
                                            <Checkbox checked={employe.indexOf(option.id) > -1} />
                                          </ListItemIcon>
                                          <ListItemText primary={option.user_name} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  </div>
                                   </div>

                                    <div className="form-group">
                                        <a className="btn btn-primary" data-dismiss="modal"   onClick={()=>{SelectRapportMensuelle(employe,date1,date2);handleToggle()}}>Importer</a></div>
                                </form>
        )}/>
                            </div>
                            <div className="modal-footer">



                            </div>
                        </div>
                    </div>
              
        </div>

    </div>
    </div>
    {post? 
             <div className="table-responsive">
                   <ScrollContainer className="scroll-container">
             <table className="table align-items-center table-flush" id="absencestoexcel" ref={ref}>
             {Object.values(dat).map(({list,htheorique_total,heffective_total,htravail_direct,htravail_indirect,deficit_totale,earlysoriteTotal,retardminutestotale}, i)=>
             <>
               <thead className="thead-light">
                 <tr>
                   <th scope="col"></th>
                   <th scope="col">Nom Employé</th>
                   <th scope="col">Matricule</th>
                   <th scope="col">Debut de mois</th>
                   <th scope="col">Fin de mois</th>
                   <th scope="col">heures effectives </th>
                   <th scope="col">heures effectives direct </th>
                   <th scope="col">heures effectives indrect</th>
                   <th scope="col">Présence théorique</th>
                   <th scope="col">heures de retards</th>
               <th scope="col">Heures avant sortie</th>
               <th scope="col">deficit</th>
               <th scope="col">Absence de déficit</th>
                 </tr>
               </thead>
               <tbody>
             
             
              
             
               {list.map(ab=>
              <tr key={ab.iduser}>
                <td></td>
                <td>{ab.user_name}</td>
                <td>{ab.matricule}</td>
                <td>{ab.debutmois}</td>
                <td>{ab.finmois}</td>
                <td>{ab.presencereele}</td>
                <td>{ab.heuretravailindirect}</td>
                <td>{ab.heuredtravaildirect}</td>
                <td>{ab.presencenormal}</td>
                <td>{ab.retardEntree}</td>
                <td>{ab.heureavantsortie}</td>
                <td>{ab.deficit}</td>
 <td>{ab.absence_defi}</td>
                </tr>
               )}
                  
                
              
              
           
           
            
         
              
               </tbody>
               <tr className="table-danger">
                 <td >Somme</td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td>{heffective_total}</td>
                     <td>{htravail_indirect}</td>
                     <td>{htravail_direct}</td>
                     <td>{htheorique_total}</td>
                     <td>{retardminutestotale}</td>
                     <td>{earlysoriteTotal}</td>
                     <td>{deficit_totale}</td>
                
                     </tr>
               </>
                  )}
             
             </table>
             </ScrollContainer>
           </div> :<Backdrop  open={openn}>
        <CircularProgress color="inherit" />
      </Backdrop>}
 
    </div>
     );
  });


const RapportMensuelle = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
  

<div>
<div className="container-fluid mt--7">
<div className="row">
<div className="col">
<div className="card shadow">

<button className="btn btn-danger" style={{width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem"}} onClick={handlePrint}>PDF</button>
<ComponentMensuelleToPrint ref={componentRef} />

</div>
</div>
</div>
</div>

</div>
  );
};
export default RapportMensuelle;