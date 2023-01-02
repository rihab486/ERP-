
import React, { useState,useEffect } from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import { MenuProps, useStyles, options } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MultiSelect } from '../MultiSelect';

function AjouterPlaningByDep() {
    const onSubmit = async (values) => {
        await sleep(300);
        window.alert(JSON.stringify(values, 0, 2));
      };
    const [selectedd, setSelectedd] = useState([]);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const { data: plansemaine = [], isloading, error } = useFetch("http://127.0.0.1:8000/plansemaine/")
    const { data: data, isloading: zzsx, error: esse } = useFetch("http://127.0.0.1:8000/arbo/")
    const [title, setNomPlanningg] = useState('');
    const[users,setUsers]=useState([]);
    const [employe, setEmploye] = useState([]);
    const [start, setStartDate] = useState('');
    const [end, setExipry] = useState('');
    const [motif, setMotif] = useState('');
    const [plantravail, setPlanTravail] = useState('');
    const arr=[]
   
  useEffect(()=>{
    setTreeData(data)
  })
  
    const handlesubmit = (e) => {
        e.preventDefault()
        arr.push(selectedd.map(x=>x.value))
        const planning = { title, start, end, motif,plantravail,arborescence }

        fetch("http://127.0.0.1:8000/CreateplaningByDep/?id="+arr,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(planning)
            }).then(() => {


              window.location.reload(false);

            }).catch((e) => {

                console.log(planning)
            })
    }

    const [expanded, setExpanded] = React.useState([]);
    const [arborescence, setActualSelected] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [parent, setParent] = React.useState([]);
  useEffect(()=>{
    setTreeData(data)
  })
  const useStyles = makeStyles({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 400
    }
  });
  const classes = useStyles();
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
    return (


        <div>
                <Form
        onSubmit={onSubmit}
      
        mutators={{
          setTreeValue: (args, state, utils) => {
            utils.changeValue(state, "tree", () => args);
          }
        }}
        render={({ handleSubmit, form }) => (
            <form onSubmit={handleSubmit}>
           <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouter">
                Ajouter Planning
            </button>

        
                    <div className="modal fade" id="ajouter" role="dialog" aria-labelledby="ajouter" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Ajouter Planning Par département</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="form-group">
        
        
                                                    <input className="form-control" placeholder="Nom de planning" value={title} name="nom" onChange={(e) => setNomPlanningg(e.target.value)} type="text" />
        
                                                </div>
        
                                            </div>
                                       
                                        </div>
                                   
        
                                        <div className='row'>
                                            <div className='col-md-6'>
                                          
                                                <div className="form-group">
                                                    <div className="input-group input-group-merge input-group-alternative">
        
                                                        <input className="form-control" placeholder="date de début" value={start} name="nom" onChange={(e) => setStartDate(e.target.value)} type="date" />
                                                    </div>
                                                </div>
        
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="form-group">
                                                    <div className="input-group input-group-merge input-group-alternative">
        
                                                        <input className="form-control" placeholder="date de fin" value={end} name="nom" onChange={(e) => setExipry(e.target.value)} type="date" />
                                                    </div>
                                                </div>
        
                                            </div>
                                       
                                        </div>
                                        <div className='row'>
                                           
                                             <div className='col-md-6'>
                                                <div className="form-group">
                                                <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Motif"
                                                value={motif}
                                                onChange={(e) => setMotif(e.target.value)}
                                                helperText="Svp sélectionnez motif"
                                                margin='normal'
                                                fullWidth
                                                >
                                                <MenuItem value={"jour"} key="1">Jour</MenuItem>
                                                <MenuItem value={"nuit"} key="2">Nuit</MenuItem>
                                                


                                                </TextField>

                                            </div></div>
                                            <div className='col-md-6'>
          
                                                <TextField
                                                    id="outlined-select-currency"
                                                    select
                                                    label="plan de travail"
                                                    value={plantravail}
                                                    onChange={(e) => { setPlanTravail(e.target.value) }}
                                                    helperText="Please select planning"
                                                    margin='normal'
                                                    fullWidth
                                                >
                                                    {plansemaine.map((option) => (
                                                        <MenuItem key={option.nomsemaine} value={option.id}>
                                                            {option.nomsemaine}
                                                        </MenuItem>
                                                    ))}

                                                </TextField>
                                            </div>
                                                
        
                                       
                                        </div>
        
        
                                               <div className='row'>
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
                                                  
                                                   form.mutators.setTreeValue(...nodeIds);
                                                   fetch("http://127.0.0.1:8000/UsersOfDepartement"+ "/?id=" + nodeIds).then((result) => {
                                                    result.json().then((resp) => {
                                                  
                                                      setUsers(resp)
                                                  
                                                    })
                                                    
                                                  })
                                             
                                                 } else {
                                                   form.mutators.setTreeValue(...nodeIds);
                                                   fetch("http://127.0.0.1:8000/UsersOfDepartement"+"/?id=" + nodeIds).then((result) => {
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
                                                      fullWidth
                                                      
                                                      
                                                    > 
                                                   {renderTree(treeData)}
                                                   </TextField>
                                                   </div>
                                               </TreeView>
                                              
                                             );
                                           }}
                                         </Field> </div>

                            
               
                              
                                    </div>
                                    <div className='row'>
                <div className='col-md-12 pt-0' style={{ marginTop :0,marginBottom : 80 }}>
        <MultiSelect options={ users} value={selectedd} onChange={setSelectedd} />
        </div></div>
        
        
        
                                        <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>  
        
                                </div>
                                <div className="modal-footer">
        
        
        
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
        )}/>
        </div>


    )
}
export default AjouterPlaningByDep;