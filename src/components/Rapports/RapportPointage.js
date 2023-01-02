import React, { useState,useRef } from 'react';

import useFetch from '../useFetch';
import JSZip from 'jszip';

//import ReactHTMLTableToExcel from 'react-html-table-to-excel';


import {useStyles} from "./utils";

import Checkbox from "@material-ui/core/Checkbox";

import ScrollContainer from 'react-indiana-drag-scroll'

import { useEffect } from 'react';
import { Form, Field } from "react-final-form";
import {  withStyles } from "@material-ui/core/styles";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@mui/material/TextField';
import { useReactToPrint } from "react-to-print";

import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";

import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5';
import { MultiSelect } from '../MultiSelect';


import $ from "jquery";

export const ComponentPointageToPrint = React.forwardRef((props, ref) => {
  const [selectedd, setSelectedd] = useState([]);
  const arr=[]
  $(document).ready(function () {
    $('#example').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'excel', 'pdf', 'csv','print'
      ]
      ,"bDestroy": true
     } )
  
});
 // const[serarchItem,setSearchItem]=useState('')
  const [employe, setEmploye] = useState([])
  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const classes = useStyles();
  const[users,setUsers]=useState([])
  const [dat, setData] = useState([])
  const [post,setPost]=useState(false)
  const[openn,setOpenn]=useState(false)
  const[loginemploye,setloginemploye]=useState(false)
  const handleToggle = () => {
   setOpenn(true)
  };


  function SelectPointage(date1,date2,e) {
    e.preventDefault();
   if(loginemploye==false){ 
    console.log('ee')
    arr.push(selectedd.map(x=>x.value))
    fetch("http://127.0.0.1:8000/rapportpointage/"+date1+"/"+date2+"/?id="+arr).then((result) => {
      result.json().then((resp) => {
        setPost(true)
      setData(resp)
      setOpenn(false)

      
      })
      .catch(err => {
        alert("Il faut sélectionner au moins un employé ,une date de début et une date de fin!")
      })
}) }
else{
    console.log(localStorage.getItem('id'))
    fetch("http://127.0.0.1:8000/rapportpointage/"+date1+"/"+date2+"/?id="+ localStorage.getItem('id')).then((result) => {
      result.json().then((resp) => {
        setPost(true)
      setData(resp)
      setOpenn(false)

      
      })
      .catch(err => {
        alert("Il faut sélectionner au moins un employé ,une date de début et une date de fin!")
      })
})
    
   
  }
    



}
 
 //departements tree

 
 
 const [expanded, setExpanded] = React.useState([]);
 const [arborescence, setActualSelected] = React.useState([]);
 const [selected, setSelected] = React.useState([]);
 const [parent, setParent] = React.useState([]);
 const { data: data, isloading: zzsx, error: esse } = useFetch("http://127.0.0.1:8000/arbo/")
 const { data: dataadmin, isloading: aae, error: fv } = useFetch("http://127.0.0.1:8000/arbo/")
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
   console.log("id", id);

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

const heures="heures"

  return (
    <div>
  
    <div className="card border-0">
    <div className='card-header' style={{backgroundColor:"#5ac2df"}}>
<h3 style={{color:"white"}}>Importer Rapport de pointage</h3>
</div>
    <Form
        onSubmit={onSubmit}
      
        mutators={{
          setTreeValue: (args, state, utils) => {
            utils.changeValue(state, "tree", () => args);
          }
        }}
        render={({  form}) => (
          <form >
                         
                         <div className='row pt-4 pl-4'>
                                <div className="col-md-3 pt-4">

                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-3 pt-4">

                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="" value={date2} name="date_pointage2" onChange={(e) => setDate2(e.target.value)} type="date" />
                                    </div>
                                  </div>
                                </div>
                            


{loginemploye?   <div className="form-group pt-4"  style={{marginLeft:"45%",marginRight:"55%"}}>
                                <a className="btn btn-primary" style={{color:"white"}} data-dismiss="modal" onClick={(e) => {SelectPointage(date1,date2,e);handleToggle()}}>Afficher</a></div>:<>

<div className='row'>
                             
                             <div className='col-md'>
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
                                                       fetch("http://127.0.0.1:8000/UsersOfChefRHRapports/"+localStorage.getItem("id")+"/?id=" + nodeIds).then((result) => {
                                                        result.json().then((resp) => {
                                                      
                                                          setUsers(resp)
                                                      
                                                        })
                                                        
                                                      })
                                                 
                                                     } else {
                                                       form.mutators.setTreeValue(...nodeIds);
                                                       fetch("http://127.0.0.1:8000/UsersOfChefRHRapports/"+localStorage.getItem("id")+"/?id=" + nodeIds).then((result) => {
                                                        result.json().then((resp) => {
                                                      
                                                          setUsers(resp)
                                                      
                                                        })
                                                        
                                                      })
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
                                 
                                                     <TextField
                           id="outlined-select-currency"
                           select
                           label="Département"
                           helperText="Svp sélectionnez un département"
                           margin='normal'
                           fullWidth > 
                                    {renderTree(treeData)}
                                                       </TextField>
                                                       </div>
                                                   </TreeView>
                                                  
                                                 );
                                               }}
                                             </Field></div></div>
                                  
                                 
                                 <div className='col-md-3 pt-4'>
                                 <MultiSelect options={ users} value={selectedd} onChange={setSelectedd} />
                                      </div>
                                  

                                  <div className="form-group pt-4" style={{marginLeft:"45%",marginRight:"55%"}}>
                                <a className="btn btn-primary" style={{color:"white"}} data-dismiss="modal" onClick={(e) => {SelectPointage( date1,date2,e);handleToggle()}}>Importer</a></div>
                              </>}
                           </div>
                           
                            </form>
        )}/>
              
                <div>



                </div>
              
                </div>
 
              
             <div className="table-responsive">
                          <ScrollContainer className="scroll-container">

                          {openn? <Backdrop  open={openn}>
        <CircularProgress color="primary" style={{position:"absolute",bottom:"50px"}}  />
      </Backdrop>:
                  <div className='card'>
                  <div className='card-header' style={{backgroundColor:"#d1d0d0"}}>
                        <h3 style={{color:"black"}}>Importer Rapport des Pointages de <strong>{date1}</strong> à<strong> {date2}</strong></h3>
                        </div>
                      <hr/>
                  <div className="table-responsive" >

                          <table id="example">
        <thead>
        <tr>
                   
                   <th>Nom et prénom</th>
                   <th>Matricule</th>
                   <th>Date Pointage</th>
                   <th>Heure</th>
                   <th>Nom de pointeuse</th>
                   <th>Planning</th>
                 </tr>
        </thead>
    
      
 
 <tbody>
        {dat.map(pointage=>

        <tr>
                <td>{pointage.user_name }</td>
                <td>{pointage.matricule}</td>
                <td>{pointage.date_pointage}</td>
                <td>{pointage.heure}</td>
                <td>{pointage.nom_pointeuse}</td>
                <td>{pointage.planning}</td>
           </tr>
   )}
         </tbody> 
        
    

    </table></div></div>
    }
      
       </ScrollContainer>
     </div> 
{/**                {post? 
             <div className="table-responsive">
                          <ScrollContainer className="scroll-container">
             <table className="table align-items-center table-flush" id="pointagetoexcel"  ref={ref} >
               <thead className="thead-light">
                 <tr>
                   
                   <th scope="col">Nom et prénom</th>
                   <th scope="col">Matricule</th>
                   <th scope="col">Date Pointage</th>
                   <th scope="col">Heure</th>
                   <th scope="col">Nom de pointeuse</th>
                   <th scope="col">Planning</th>
                 </tr>
               </thead>
               <tbody>
               {dat.filter((pointage)=>{
                  const name=pointage.user_name||''
                  const mat=pointage.mat||''
  if (serarchItem==""){
   return pointage
  }
  else if (name.toLowerCase().includes(serarchItem.toLowerCase()) || mat.toLowerCase().includes(serarchItem.toLowerCase())) {
 
    return pointage
  }
}).map((pointage,key)=>{
  return (
  <>  
    <tr key={pointage.id}>
                <td>{pointage.user_name + " "+pointage.last_name}</td>
                <td>{pointage.matricule}</td>
                <td>{pointage.date_pointage}</td>
                <td>{pointage.heure}</td>
                <td>{pointage.nom_pointeuse}</td>
                <td>{pointage.planning}</td>
           </tr>
 </>
  )
})
       }          </tbody>
       </table>
       </ScrollContainer>
     </div> :<Backdrop  open={openn}>
  <CircularProgress color="inherit" />
</Backdrop>} */}


          </div>
     );
    });
const RapportPointage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
            <div className="container-fluid mt-5">
    <div className="row">
      <div className="col">
      <div className="card shadow">
     
{/**      <button className="btn" style={{width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem",width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem",backgroundColor:'#5ac2df'}} onClick={handlePrint}>PDF</button>
 */}
    <ComponentPointageToPrint ref={componentRef} />
 
    </div>
    </div>
    </div>
    </div>
     
    </div>
  );
};
export default RapportPointage;