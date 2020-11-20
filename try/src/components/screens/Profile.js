import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../../App';

//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

const  Profile=()=> {
    const [myPics,setPics]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const[localstate,setlocalstate]=useState(state);
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined); 


  
useEffect(()=>{
    const user=localStorage.getItem("user");
    
    dispatch({type:'USER',payload:JSON.parse(user)})
},[])
    useEffect(() => {

    fetch('/mypost',{
    headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }
})
    .then(res=>res.json())
    .then(result=>{
   
        setPics(result.mypost);
       
       
    })
    }, [])
    useEffect(() => {
        if(image){
            
            const data=new FormData();
            data.append("file",image);
            data.append("upload_preset","my-new");
            data.append("cloud_name","dr3v7tatn");
            
           
        
            fetch("	https://api.cloudinary.com/v1_1/dr3v7tatn/image/upload",{
              method:"post",
              body:data
            })
            .then(res=>res.json())
            .then(result=>{
                
            
        
    
          
                fetch('/updatepic',{
                    method:'put',
                    headers:{
                        "Content-Type":'application/json',
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:result.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result);
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            
              
            })
            .catch(err=>{
              console.log(err);
              

            })
        }
        
    }, [image])

    const updatePic=(file)=>{
        setImage(file);
      
    }
    return (
        <>
        {state? <div   style={{maxWidth:"55rem",margin:"0px auto"}}>
            <div className="row" style={{margin:"1.8rem 0rem",borderBottom:"1px solid grey"}}>
            <div className="col s12 m12 l7 image-block center-align"> 
            
                <img  alt="person" style={{height:"19rem",width:"19rem",margin:"1rem",borderRadius:"60%"}} src={state?state.pic:"loading!"}/>
             
            </div>
            <div className="col s12 m12 l5" >
              
                
                <div className="row">
                <h3>{state?state.name:'loading'}</h3>
                <h4>{state?state.email:'loading'}</h4>
                <div className="col s4">
                    <h6>{myPics.length} posts</h6>
                    
                </div>
                <div className="col s4">
                    <h6>{state?state.followers.length:"0"} followers</h6>
                    
                </div>
                <div className="col s4 ">
                    <h6>{state?state.following.length:"0"} following</h6>
                    
                </div>
                </div>
                </div>
                
                
                <div className="file-field input-field">
             <div className="btn #64b5f6 blue darken-1">
                 <span>Update Pic</span>
                 <input type="file" onChange={(e)=>updatePic(e.target.files[0])} />
             </div>
             <div className="file-path-wrapper">
                 <input className="file-path validate" type="text" />
             </div>
             </div>
            </div>
            
            <div className="gallery row">
            {myPics.map(item=>{
                return(
                    <div className="col s12 m6 l4">
                  <img key={item._id} class="item"  style={{width:"100%" ,height:"12rem"}} alt={item.title} src={item.photo}/>
                  </div>
                )

            })}
          
          
            </div>
        </div>  :<h3>Loading!!</h3>}
       
        </>
    )
}

export default Profile
