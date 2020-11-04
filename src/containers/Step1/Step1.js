import React from 'react';
import{useParams} from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import LateralBar from '../../components/LateralBar/LateralBar';
import ProgressTool from '../../components/ProgressTool/ProgressTool';
import BtnOutlinedStep from '../../components/BtnOutlinedStep/BtnOutlinedStep';
import BtnStep from '../../components/BtnStep/BtnStep';
import PlaceHolder from '../../components/PlaceHolder/PlaceHolder';


//Todos los imports se coloca   n arriba de este 

import { fb } from '../../utils/firebase'
require('firebase/auth');


function Step1(){

    let {project}= useParams();
    console.log(project);
    const classes = useStyles();
    const [changeClass, setChangeClass] = React.useState(classes.btn);
    const [changeClass2, setChangeClass2] = React.useState(classes.btn);
    const [changeClass3, setChangeClass3] = React.useState(classes.btn);
    
    const [showPlaceHolder, setShowPlaceHolder] = React.useState(false);
    const [isClick, setIsClick] = React.useState(false);
    const [isClick2, setIsClick2] = React.useState(false);
    const [isClick3, setIsClick3] = React.useState(false);
    const [textName, setTextName] = React.useState('');
    const [textSlogan, setTextSlogan] = React.useState('');
    const [optionSelected, setOptionSelected] = React.useState('');
    const [urlNext, setUrlNext] = React.useState('');

    const [value, setValue] = React.useState(0);
    const [disabled, setDisabled] = React.useState(true);


   
    let history = useHistory();

    function handleClick(event){  
        setOptionSelected('Sí');
        setValue(14.2857142857); 
        setDisabled(false);
        setIsClick(prev => !prev);
        setChangeClass(classes.btnClick);
        setShowPlaceHolder(prev => !prev);

        setChangeClass2(classes.btn);
        setIsClick2(false);
        setChangeClass3(classes.btn);
        setIsClick3(false);
        
        if(isClick === true){
         
            setChangeClass(classes.btn);
            setValue(0);
            setDisabled(true);
        }
       
    }

    function handleClick2(event){
        setOptionSelected('No');
        setIsClick2(prev => !prev);
        setDisabled(false);
        setValue(14.2857142857); 
        setShowPlaceHolder(false);
        setChangeClass2(classes.btnClick);
        setIsClick(false);
        setChangeClass(classes.btn);
        setIsClick3(false);
        setChangeClass3(classes.btn);
        
        if(isClick2 === true){
            setChangeClass2(classes.btn);
            setDisabled(true);
            setValue(0);
        } 
  
    }

    function handleClick3(event){
        setOptionSelected('Omitir');
        setIsClick3(prev => !prev);
        setDisabled(false);
        setValue(14.2857142857); 
        setChangeClass3(classes.btnClick);
        setIsClick2(false);
        setShowPlaceHolder(false);
        setChangeClass2(classes.btn);
        setIsClick(false);
        setChangeClass(classes.btn);

        if(isClick3 === true){
            setChangeClass3(classes.btn);
            setValue(0);
            setDisabled(true);
           
        } 

    }

    function handleNextPage(event){
        history.push(urlNext);
        
        let db = fb.firestore();
        fb.auth().onAuthStateChanged(user => {
            db.collection(`${user.email}`).doc(project).collection('Esencia de marca').doc('paso 1').set({
               respuesta: optionSelected,
               nombreMarca:textName,
               tagline:textSlogan
              
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            
            
          
              
                  
        })


    }
      

      function handleBackPage(event){
        history.push(`/dashboard/${project}/intro`);
      } 

    function onChangeName(event){
        setTextName(event.target.value);
        
    }

    function onChangeSlogan(event){
        setTextSlogan(event.target.value);
        
    }


    React.useEffect(() => {
        let isCancelled = false;
        setTextName(textName);
        setTextSlogan(textSlogan);
        console.log(textName);
        if (!isCancelled) {
        let db = fb.firestore();
        fb.auth().onAuthStateChanged(user => {
        var docRef = db.collection(`${user.email}`).doc(project);
        // Set the "capital" field of the city 'DC'
        docRef.update({
            url: '/dashboard/'+project+'/step1_2',
            step:'esenciaMarca_paso2'
        })
        .then(function(db) {
     
            console.log('done');
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log(doc.data().url);
                setUrlNext(doc.data().url);
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
          
              
    })

        }




        return () => {
            isCancelled = true;
        };

    }, [project,textName,textSlogan,urlNext]);




    return (
        <div className={classes.body}>
            <div>
                <TopBar titleProject={project}/>
            </div>
            <div className={classes.content}>
                <LateralBar/>
                <div className={classes.contentRight}>
                    <div className={classes.progressContent}>
                        <ProgressTool
                            className={classes.progress}
                            titleStep='Conociendo tu marca'
                            numStep='1'
                            numTotalStep='7'
                            value={value}
                   

                        />
                    </div>
                    <div className={classes.contentText}>
                       <h1 className={classes.question}> <span className={classes.num}>1.</span> ¿Tienes algún nombre para tu marca, empresa, proyecto o emprendimiento?</h1>
                    </div>
                    <div className={classes.contentBottom}>
                        <div className={classes.options}>
                        <div className={classes.answers}>
                            <button onClick={handleClick} className={changeClass}>Sí</button>
                            <button onClick={handleClick2} className={changeClass2}>No</button>
                            <button onClick={handleClick3} className={changeClass3}>Omitir</button>
                        </div>

                        {showPlaceHolder &&
                            <div className={classes.nameSlogan}>
                                <p className={classes.question}>Ingresa por favor el nombre de tu marca, empresa, proyecto o emprendimiento.</p>
                                <PlaceHolder
                                className={classes.firstPlaceHolder}
                                width='640px'
                                onChange={onChangeName}
                                placeHolder='Nombre de marca'
                                height='60px'
                                />
                                <PlaceHolder
                                width='640px'
                                onChange={onChangeSlogan}
                                placeHolder='Lema, slogan, tagline (opcional)'
                                height='60px'
                                />
                            </div>
                        
                        }
                           
                        </div>


 
                    
                    <div className={classes.actions}>
                        <BtnOutlinedStep
                        width='149px'
                        height='48px'
                        onClick={handleBackPage}
                        />
                        <img className ={classes.tutorial} alt='tutorial'  src={('/images/tutorial.svg')}/>
                        <BtnStep
                        disabled={disabled}
                        content='Continuar'
                        width='149px'
                        height='48px'
                        onClick={handleNextPage}
                        />
                    </div>
                    </div>
                </div>
            </div>
        
            

      </div>
      );

}
      const useStyles = makeStyles(theme => ({
        body:{
            boxSizing: 'border-box',
            display:'flex',
            width: 'auto',
            height: '100vh',
            flexWrap: 'no-wrap',
            backgroundColor:'#FAFAFA',
            overflowY:'hidden',
            flexDirection:'column',
            justifyContent:'flex-start',
            alignContent:'center',
    
        },

        content:{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-around',
            flexWrap:'no-wrap',
        },
        progressContent:{
            display:'flex',
            marginTop:'20px',
            flexWrap:'no-wrap',
            
        },
        progress:{
            display:'flex',
            flexWrap:'no-wrap',         
        },

        contentText:{
            width:'100%',
            display:'flex',
            marginTop:20,
            flexWrap:'no-wrap',
            
         
        },

        contentRight:{
            display:'flex',
            width:'85%',
            marginLeft:'110px',
            flexDirection:'column', 
            alignContent:'flex-start',
            alignItems:'flex-start',
            flexWrap:'no-wrap',
            justifyContent:'flex-start',
            
        },

        titleStep:{
            fontFamily:'Poppins',
            flexWrap:'no-wrap',
            fontWeight:600,
            marginTop:'24px',   
            fontSize:'23px',
        },
        description:{
            fontFamily:'Open Sans',
            flexWrap:'no-wrap',
            marginTop:'18px',   
            fontWeight:400,
            fontSize:'18px',
        },

          contentBottom:{
            display:'flex',
            width:'79%',    
            marginTop:'28px',
            flexDirection:'column',
            flexWrap:'no-wrap',
            alignItems:'flex-start',
            justifyContent:'center'
          },
          
          actions:{
              display:'flex',
              flexDirection:'row',
              flexWrap:'no-wrap',
              alignSelf:'flex-end',
              justifyContent:'space-between',
              width:'100%',
              marginTop:'30px',
 
          },
          tutorial:{
              cursor:'pointer',
          },
          question:{
              fontFamily:'Open Sans',
              color:'#212429',
              fontWeight:400,
              fontSize:'18px'
          },
          num:{
            fontFamily:'Open Sans',
            fontWeight:700,
            fontSize:'18px'
          },

          btn: {
            width: '149px',
            height: '48px',
            cursor:'pointer',
            textTransform: 'none',
            fontFamily: 'Poppins',
            fontSize:'16px',
            color:'#212429',
            marginRight:'74px',
            background: 'white',
            border: 'none',
            boxSizing: 'border-box',
            borderRadius: '15px',
            fontWeight:600,
            outline:'none',
            boxShadow: '2px 8px 16px rgba(61, 62, 66, 0.1)',
  
          '&:hover':{
              background: '#FFD984',
              outline:'none',
          },
              
  
  
      },
  
  
  
      btnClick: {
          width: '149px',
          height: '48px',
          cursor:'pointer',
          textTransform: 'none',
          fontFamily: 'Poppins',
          marginRight:'74px',   
          fontSize:'16px',
          color:'#212429',
          background: '#FFD984',
          border: '1px solid #FFB600',
          boxSizing: 'border-box',
          borderRadius: '15px',
          fontWeight:600,
          outline:'none',
          boxShadow: '2px 8px 16px rgba(61, 62, 66, 0.1)',
  
  
    },

    options:{
        display:'flex',
        flexDirection:'column',
        flexWrap:'no-wrap',
        marginTop:'20px',
        height:'335px',
        
    },

    answers:{
        display:'flex',
        flexDirection:'row',
        flexWrap:'no-wrap',
       
    },
    nameSlogan:{
        marginTop:'40px',
    },

    firstPlaceHolder:{
        marginTop:'12px'
    }

    
    
    }));




export default Step1; 