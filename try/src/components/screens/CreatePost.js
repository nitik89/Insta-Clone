import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'

const CreatePost=()=> {
  const history=useHistory();
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const[loading,setLoading]=useState(false);
  const [image,setImage]=useState("");
  const [url,setUrl]=useState("");
  useEffect(() => {
    if(url){
      fetch("/createPost",{
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            
            title,
            body,
            pic:url
        })
    })
    .then(resp=>resp.json())
    .then(data=>{
    if(data.error){
    
     setLoading(false);
        M.toast({html:data.error,classes:"#c62828 red darken-3"})
    }
    else {
      setLoading(false);
        M.toast({html:"Created Post Successfully",classes:"#00bfa5 teal accent-4"})
        history.push('/');
    }
       
       
        
    
    }).catch(err=>{
        console.log(err);
    })



    }
  }, [url])
  
  
  const postDetails=()=>{
    setLoading(true)
    if(!image){
      setLoading(false);
      M.toast({html:"Provide image!",classes:"#c62828 red darken-3"})
      return
    }
    const data=new FormData();
    data.append("file",image);
    data.append("upload_preset","my-new");
    data.append("cloud_name","dr3v7tatn");
    
   

    fetch("	https://api.cloudinary.com/v1_1/dr3v7tatn/image/upload ",{
      method:"post",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
      
      setUrl(data.url);
    })
    .catch(err=>{
      
      console.log(err);
    })
   
      }
  
      return (
        <>
        {loading?<h3 className="center-align">Loading!!</h3>:<div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}
        >
            <input 
            type="text"
             placeholder="title"
             value={title}
             onChange={(e)=>setTitle(e.target.value)}
             />
            <input
             type="text"
              placeholder="body"
              value={body}
             onChange={(e)=>setBody(e.target.value)}
              />
            <div className="file-field input-field">
             <div className="btn #64b5f6 blue darken-1">
                 <span>Uplaod Image</span>
                 <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
             </div>
             <div className="file-path-wrapper">
                 <input className="file-path validate" type="text" />
             </div>
             </div>
             <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
             onClick={()=>postDetails()}
             
             >
                 Submit post
             </button>
 
        </div>}
        </>
      )
  }
  export default CreatePost;