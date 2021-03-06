import React,{useState,useEffect} from 'react'
import {Link,Redirect,useLocation,useHistory} from 'react-router-dom';
import M from 'materialize-css'
import Home from './Home';
const SignUp = () => {
    const history=useHistory();
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined);
 
    
useEffect(() => {
    if(url){
        uploadFields();
    }
}, [url])  
const uploadPic=()=>{
    const data=new FormData();
    if(!image){
       return M.toast({html: "Please provide image",classes:"#c62828 red darken-3"})
       return
        
    }
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
        M.toast({html: err,classes:"#c62828 red darken-3"})
      
    })
}    
const uploadFields=()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
        return
    }
fetch("/signup",{
method:"post",
headers:{
    "Content-Type":"application/json"
},
body:JSON.stringify({
    name:name,
    password:password,
    email:email,
    pic:url
})
})
.then(resp=>resp.json())
.then(data=>{
if(data.error){


M.toast({html:data.error,classes:"#c62828 red darken-3"})
}
else {
M.toast({html:data.message,classes:"#00bfa5 teal accent-4"})
history.push('/signin');
}




}).catch(err=>{
console.log(err);
})

}
    const postData=()=>{
        if(Image){
            uploadPic();
        }
        else{
            uploadFields();

        }
       
    }

    return (
        <div className="mycard">
        <div className="card auth-card input-field ">
            <h2>Instagram</h2>
            <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="password"value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <div className="file-field input-field">
             <div className="btn #64b5f6 blue darken-1">
                 <span>Uplaod Pic</span>
                 <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
             </div>
             <div className="file-path-wrapper">
                 <input className="file-path validate" type="text" />
             </div>
             </div>
           
             <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>postData()} >
  SignUp
</button>
<h5>
<Link to="/signin">Already have a account?</Link>
   </h5>
   
 
        </div>
            

    </div>
         
    )
}
export default SignUp;
