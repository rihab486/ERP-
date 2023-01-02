

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import useFetch from '../useFetch';
import moment from 'moment'
import { DataGrid } from '@mui/x-data-grid';
import {  withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import MuiTreeItem from "@material-ui/lab/TreeItem";

import { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps, useStyles, options } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from '@mui/material/Button';
import AjouterPlaningByDep from "./AjouterPlaningByDep";
import { getWeek, setDayOfYear, setMonth, setWeek, weeksToDays } from "date-fns";
import { CalendarViewMonth, CalendarViewWeek, ViewAgenda, ViewWeek, WeekendRounded, WeekendTwoTone } from "@mui/icons-material";
function CrudPlaning() {
    
    const [open, setOpen] = useState(false);
    const [planingIddelete, setPlaningIddelete] = useState(null)
    const[idplanactuelle,setidplanActuelle]=useState('')
    const[iduseractuelle,setIdUseractuelle]=useState('')
    const[idplanning,setidplanningg]=useState('')
    const DeleteUserbyplanning= (idplanactuelle,iduseractuelle) => {

        fetch('http://127.0.0.1:8000/RemoveUserbyplanning/'+iduseractuelle+"/"+idplanactuelle, {
            method: 'GET',
            headers: {

                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert(' u want to remove planing by user?')
        
           window.location.reload(false);
        }
        )
    }
    const updateUserbyplanning= () => {

      

        {console.log(start)
                fetch('http://127.0.0.1:8000/updateUserbyplanning/'+iduseractuelle+"/"+idplanactuelle +"/?idplanning="+ planningemp , {
                    method: 'GET',
                  
                }).then(() => {
        
        
        
                }) }
                
        
        
            }


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //
    const useStyle = makeStyles({
      root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400
    },
    icon: {
        marginRight: 10,
        marginLeft: 10,
        color: '#5ac2df',
        height:20,
        width:20
        }
    });
    //
    const { data: plannings, isloading: lo, error: err } = useFetch("http://127.0.0.1:8000/planning/")
    const [planningemp, setPlaningEmp] = useState([]);
    const isAllSelected =plannings.length > 0 && planningemp.length === plannings.length;
      
    const handleChange = (event) => {
      const value = event.target.value;
      if (value[value.length - 1] === "all") {
        setPlaningEmp(planningemp.length === plannings.length ? [] : plannings.map(x=>x.id));
        return;
      }
      console.log('rzrzrz',value)
    setPlaningEmp(value);
    };
    
    
    //
    const classes = useStyle()
    const { data: planing = [], isloa, er } = useFetch("http://127.0.0.1:8000/planning/");
    const { data: plansemaine = [], isloading, error } = useFetch("http://127.0.0.1:8000/plansemaine/")
    const [id, setIdPlanning] = useState('')

    const { data: Usersbyplaning = [], isload, ere } = useFetch("http://127.0.0.1:8000/GetUsersbyplanings/" + id );
    const columns = [
      { field: 'matricule', headerName: 'Matricule', width: 130,headerClassName: 'super-app-theme--header',flex:1},
     
      { field: 'user_name', headerName: 'Nom & Prénom', width: 100,headerClassName: 'super-app-theme--header' ,flex:1},
      { field: 'nomplanning', headerName: 'Nom Planning', width: 96 ,headerClassName: 'super-app-theme--header',flex:1},
      {
          field: "action1",
          headerName: "Modification",
          headerClassName: 'super-app-theme--header',
          sortable: false,
          flex:1,
           renderCell: (params) => {
    
   
      
            return <a onClick={() => {setidplanActuelle(params.row.idplanactuelle);setIdUseractuelle(params.row.iduseractuelle)}} data-toggle="modal" data-target="#modalcontrat" ><EditIcon
            className={classes.icon}
          /></a>;
            
      
          },
      
        },
        {
          field: "action2",
          headerName: "Supression",
          headerClassName: 'super-app-theme--header',
          sortable: false,
           flex:1,
           renderCell: (params) => {
    
   
      
            return  <a onClick={() => DeleteUserbyplanning(params.row.idplanactuelle,params.row.iduseractuelle) }  ><DeleteIcon className={classes.icon} /></a>
            
      
          },
      
        }
  ]
    const handleSelectedEvent = (event) => {
        console.log(event.start.toLocaleDateString().split("/").reverse().join("-"))
        setSelectedEvent(event)
        setModalState(true)
        console.log(event)
        setStart(event.start.toLocaleDateString().split("/").reverse().join("-"))
        setEnd(event.end.toLocaleDateString().split("/").reverse().join("-"))
        setTitle(event.title)
        setMotif(event.motif)
        setPlanTravail(event.plantravail)
         setIdPlanning(event.id)
        
     }
     const [selectedEvent, setSelectedEvent] = useState(undefined)
     const[title,setTitle]=useState('')
     const[start,setStart]=useState('')
     const[end,setEnd]=useState('')
     const[motif,setMotif]=useState('')
     const[plantravail,setPlanTravail]=useState('')
     const [modalState, setModalState] = useState(false)
  
     const DeletePlaning = (id) => {

        fetch('http://127.0.0.1:8000/planning/' + id, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json'
            },
        }).then(() => {
            setOpen(false);
            window.location.reload(false);
        }
        )


    }
    
const events=planing.map(plan=>
      ({
        start:new Date((plan.start)),
        end:new Date((plan.end)),
        title:(plan.title).toString(),
        motif:(plan.motif).toString(),
        plantravail:(plan.plantravail),
        id:(plan.id)
      })
      )  
    const UpdatePlaning = () => {

        let planingList = { title, start, end, plantravail,motif }

         console.log(start)
        fetch('http://127.0.0.1:8000/planning/' + selectedEvent.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(planingList)
        }).then(() => {



        })}
    moment.locale('ko', {
        week: {
            dow: 1,
            doy: 1,
        },
    });
    const [selected, setSelected] = React.useState([]);
    const [parent, setParent] = React.useState([]);
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
   
    const localizer = momentLocalizer(moment);
   
    //const localizer = momentLocalizer(moment)
    return (
        <div>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col">
                        <div className="card shadow">
                            <div className="card-header border-0">
                            <div className="row">
                                <AjouterPlaningByDep />

                                {selectedEvent && <div>  
           <div className={`modal-${modalState == true ? 'show' : 'hide'}`}>
       
           <button className="btn btn-primary" onClick={() => { handleClickOpen(); setPlaningIddelete(selectedEvent.id); }} >Supprimer</button>
           <button className="btn btn-primary"  data-toggle="modal" data-target={`#p${selectedEvent.id}`} >Modifier</button>
           <div className="modal fade" id={`p${selectedEvent.id}`}  role="dialog" aria-labelledby={`p${selectedEvent.id}`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



              


              <div className='row'>
                                    <div className='col-md-4'>
                                        <div className="form-group">


                                            <input className="form-control" placeholder="Nom de planning" value={title} name="nom"  type="text" onChange={(e)=>setTitle(e.target.value)}  />

                                        </div>

                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder="date de début" value={start} name="start" type="date"  onChange={(e)=>setStart(e.target.value)} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form-group">
                                       
                                        <div className="input-group input-group-merge input-group-alternative">

                                    <input className="form-control" placeholder="date de fin" value={end} onChange={(e)=>setEnd(e.target.value)} name="end"  type="date" />
                                    </div>

                                            </div></div>
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
                                            
                                        </div>

                                    </div>
                                    <div className='col-md-6'>
                                        <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="plan de travail"
                                            value={plantravail}
                                            onChange={(e)=>setPlanTravail(e.target.value)}
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


                                <div className="form-group"><button className="btn btn-primary" type="submit" onClick={UpdatePlaning}  >Valider</button></div>  </form> 
                             </div> </div>
                                   </div></div></div>  
                                <Dialog

                                    BackdropProps={{ invisible: true }}
                                    className={classes.dialog}
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">
                                        {"supprimer un planing"}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            êtes-vous sûr de vouloir supprimer cet planing?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>non</Button>
                                        <Button onClick={() => { DeletePlaning(planingIddelete) }}>
                                            oui
                                        </Button>
                                    </DialogActions>
                                    </Dialog>
                                            </div>}  

                                 
                                 </div> </div><br/>
                                    <Calendar  localizer={localizer} 
                                    events={events} 
                                    startAccessor="start" 
                                    endAccessor="end"
                                    style={{ height: 500}} 
                                    onSelectEvent={(e) => handleSelectedEvent(e)} />
                                
                  



                        </div><br/>
                        {selectedEvent &&<>
    <div className="">
        <div className="row">
          <div className="col">
          <div className="card shadow">

          <div className="table-responsive">
    <div style={{ height: 400, width: '100%' }}>

<DataGrid
  rows={Usersbyplaning}
  columns={columns}
  pageSize={5}
  rowsPerPageOptions={[5]}
  getRowId={(row) =>  row.matricule+ row.idplanning}
  sx={{
    
    '& .super-app-theme--header': {
      backgroundColor: '#5ac2df'
    },
  }}

/>

</div>
      </div></div></div></div></div></>}


      <div className="modal fade" id="modalcontrat"  role="dialog" aria-labelledby="modalcontrat" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier planning pour un employé</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



              <div className="form-group">
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
              </div>



              <div className="form-group"><button className="btn btn-primary" onClick={updateUserbyplanning}>Valider</button></div>    
              </form>


          </div>

        </div>
      </div>
   

</div>
                        

                    </div></div></div></div>
    )
}
export default CrudPlaning;