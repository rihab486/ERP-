import React, { useState } from 'react'
import useFetch from '../useFetch';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'


import { useEffect } from 'react';
import { Form, Field } from "react-final-form";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps, useStyles } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TextField from '@mui/material/TextField';
import { MultiSelect } from '../MultiSelect';
ChartJS.register(
  BarElement, CategoryScale, LinearScale
)
const IndicateursAutomatique = () => {



  const [arbo, setArbores] = useState([])
  const [selectedd, setSelectedd] = useState([]);
  const arr=[]

  const [employe, setEmploye] = useState([])
  const [users, setUsers] = useState([])

  const isAllSelected = users.length > 0 && employe.length === users.length;
  const classes = useStyles();
  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setEmploye(employe.length === users.length ? [] : users.map(x => x.id));
      return;
    }
    setEmploye(value);
  };
  //departements tree


  const [expanded, setExpanded] = React.useState([]);
  const [arborescence, setActualSelected] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [parent, setParent] = React.useState([]);
  const { data: data } = useFetch("http://127.0.0.1:8000/arbo/")
  useEffect(() => {
    setTreeData(data)

  })
  const [treeData, setTreeData] = React.useState([]);


  const [id, setId] = useState('')


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
  const [idss, setIds] = useState([])

  const getParentById = (nodes, id) => {
    console.log("selected", selected);
    console.log("id", id);

    setId(id)

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

  const [char, setCharts] = useState([])

  const [show, setShow] = useState(false)
  const _onClick = async () => {
    arr.push(selectedd.map(x=>x.value))
    await fetch(`http://127.0.0.1:8000/ChartParJournee/` + date1 + "/" + date2 + "/" + nbaa + "/" + nbcc + "/" + nbabse + "/?id=" + arr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',


      }
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            setShow(true)
            setCharts(json)
            console.log(json)
            
            

          });
        }
      
      }).catch((error) => {
        console.log(error);
      });
  };



  console.log(char)
  const dataa = {

    labels: char.map(x => x.name),
    datasets: [{
      label: char.map(x => x.nombre),
      data: char.map(x => x.nombre),
      backgroundColor: [
        'rgba(152, 251,152, 0.2)',
        'rgba(139, 0, 0, 0.2)',
        'rgba(255, 0, 0, 0.2)',
        'rgba(240, 230, 140, 0.2)',
        'rgba(190, 148, 240, 0.2)',
        'rgba(103, 157, 229, 0.2)'
      ],
      borderColor: [
        'rgba(152, 251,152, 1)',
        'rgba(139, 0, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(240, 230, 140, 1)',
        'rgba(190, 148, 240,1)',
        'rgba(103, 157, 229,1)'
      ],
     
      borderWidth: 1
    }]
  }

  var optionss = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    legend: {
      labels: {
        fontSize: 26

      }
    }
  }

  //jour

  const [nbaa, Setnombreauth] = useState(false)
  
  const [nbcc, Setnombrecongess] = useState(false)
  

  const [nbabse, setNombreAbsenceJournee] = useState(false)
  const [date1, setDate] = useState('')
  const [date2, setDate2] = useState('')
  const handleOnChangeAuth = () => {
    Setnombreauth(!nbaa);
  };
  const handleOnChangeCongess = () => {
    Setnombrecongess(!nbcc);
  };

 

  const handleOnChangeAbsenceJournne = () => {
    setNombreAbsenceJournee(!nbabse)
  }

  const [idep, setIddepartement] = useState([])
  return (

    <div>
      
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <div className="row">


                  <button data-toggle="modal" data-target="#ajouterindiateurjour" className="btn btn-primary">
                   Choisir Un Indicateur
                  </button>


               

                </div>
              </div>
              <div >

                <div className="modal fade" id="ajouterindiateurjour"  role="dialog" aria-labelledby="ajouterindiateurjour" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Indicateur par journée </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                  
                        <Form
                          onSubmit={onSubmit}

                    
                          render={({ form }) => (

                            <form >
                              <div className='row'>

                                <div className='col-md-6'>
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="" value={date1} name="date" onChange={(e) => setDate(e.target.value)} type="date" />
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-6'>
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="" value={date2} name="date" onChange={(e) => setDate2(e.target.value)} type="date" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre de jours des authorisations' value={nbaa} onChange={handleOnChangeAuth} />

                                </div>
                              </div>
                              <div className="row">
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre de jours des congés' value={nbcc} onChange={handleOnChangeCongess} />
                                </div>
                              </div>

                         
                              <div className='row'>
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre des absences' value={nbaa} onChange={handleOnChangeAbsenceJournne} />
                                </div>
                              </div>
                            
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
                                          console.log("arborr", nodeIds)
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

                                           // form.mutators.setTreeValue(...nodeIds);


                                            fetch("http://127.0.0.1:8000/UsersOfChefRHRapports/"+localStorage.getItem("id")+"/?id=" + nodeIds).then((result) => {
                                              result.json().then((resp) => {

                                                setUsers(resp)

                                              })

                                            })

                                          } else {
                                           // form.mutators.setTreeValue(...nodeIds);

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
                       fullWidth
                       
                       
                     > 

                                            {renderTree(treeData)}
                                            </TextField>
                                          </div>
                                        </TreeView>

                                      );
                                    }}
                                  </Field>
                                  <div className='col-md-6'>
                                  <div className="form-group">
                                 <MultiSelect options={ users} value={selectedd} onChange={setSelectedd} />
                                      </div></div>
                               
                             



                              <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={() => { _onClick() }}>Importer</button>

                              </div>
                            </form>
                          )} />
                    
                      </div>
                      <div className="modal-footer">



                      </div>
                    </div>
                  </div>
                </div>
              </div>  {show ?
                <div className="container">




                  <div className="card">


                    <Bar
                      data={dataa}
                      height={80}
                      options={optionss}
                      label={char.map(x => x.nombre)}

                    />

                  </div>
                </div> :
                null
              }


            </div>
          </div>
        </div></div></div>

  );
}


const Indi = ({ data, nba, nbc, nbauth }) => {
  console.log(data)

  return (
    <div>



      {data.map(tree =>
        <Tree node={tree} id={tree.id} nba={nba} nbc={nbc} nbauth={nbauth} />
      )}

    </div>
  );
}


const Tree = ({ node, id, nba, nbc, nbauth }) => {
  const [active, setActive] = useState(false)
  const [charts, setCharts] = useState([])
  console.log('nodee', node.children)
  useEffect(() => {

    const SelectCharts = async () => {
      await fetch(`http://127.0.0.1:8000/Chartdynamiquedep/` + id + "/" + nba + "/" + nbc + "/" + nbauth, {
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
        }).catch((error) => {
          console.log(error);
        });
    };
    SelectCharts(id)
  }, [])





  console.log(charts)
  const data = {
    labels: charts.map(x => x.name),
    datasets: [{
      label: charts.map(x => x.number),
      data: charts.map(x => x.number),
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
      borderWidth: 1
    }]
  }
  var options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    legend: {
      labels: {
        fontSize: 26
      }
    }
  }

  return (

    <div className="container">








      <div className="card">

        <div className="view overlay">
          <Bar
            data={data}
            height={80}
            options={options}
          /> <a>

          </a>
        </div>




        <div className="card-body">


          <h4 className="card-title">{node.nom}</h4>
          <button className="btn btn-danger" onClick={() => setActive(true)} data-toggle="modal" data-target={`#a${node.id}`}>Plus de détails  </button>
          <hr />



        </div>
      </div>





      <div className="modal fade" id={`a${node.id}`} role="dialog" aria-labelledby={`a${node.id}`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel"></h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {active === true && <Indi data={node.children} nba={nba} nbc={nbc} nbauth={nbauth} />}
            </div></div></div>
      </div>




    </div>

  );
}

export default IndicateursAutomatique;