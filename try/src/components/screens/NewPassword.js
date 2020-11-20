import React,{useState,useContext} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';


const NewPassword = () => {
   
    const history=useHistory();
    const {token}=useParams();
   
    const [password,setPassword]=useState("");
   
  
    
    const postData=()=>{
     
fetch("http://localhost:5000/new-password",{
    method:"post",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        
        password:password,
        token
    
    })
})
.then(resp=>resp.json())
.then(data=>{
    console.log(data);
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

    return (
        <div className="mycard">
        <div className="card auth-card input-field ">
            <h2>Instagram</h2>
         
          
            <input type="password" placeholder="Enter a new password"value={password} onChange={(e)=>setPassword(e.target.value)}/>
            
<button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>postData()} >
  Changepossword
</button>
<h5>
<Link to="/signin">Already have a account?</Link>
   </h5>
    </div>
    </div>
    )
}
export default NewPassword;


