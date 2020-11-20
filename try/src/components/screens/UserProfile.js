import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../../App';
import {useParams} from 'react-router-dom'
 
const  UserProfile=()=> {
    const [userProfile,setProfile]=useState(null);
    const {userid}=useParams();
    const {state,dispatch}=useContext(UserContext);
    const [showFollow,setShowFollow] = useState(state?.following.includes(userid)?false:true);
    
setTimeout(()=>{
    setShowFollow(state?.following.includes(userid)?false:true);
},5)
    
  
    useEffect(()=>{
        fetch(`http://localhost:5000/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            
            
          
             setProfile(result)
        })
       
        setShowFollow((state?.following.includes(userid)?false:true))
        console.log(showFollow)
     },[])

     const followUser = ()=>{
        fetch('http://localhost:5000/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             console.log(data);
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('http://localhost:5000/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
    return (
        <>
        {userProfile ? <div style={{maxWidth:"55rem",margin:"0px auto"}}>
            <div className="row"  style={{margin:"1.8rem 0rem",borderBottom:"1px solid grey"}}>
            <div className="col s12 m12 l7 image-block center-align"> 
                <img style={{height:"19rem",width:"19rem",margin:"1rem",borderRadius:"60%"}} alt="person" src={userProfile.user.pic}/>
            </div>
            <div className="col s12 m12 l5">
                <div className="row">
                <h4>{userProfile.user.name}</h4>
                <h4>{userProfile.user.email}</h4>
                <div className="col s4">
                    <h6>{userProfile.posts.length} posts</h6>
                    </div>
                    <div className="col s4">
                    <h6>{userProfile.user.followers.length} followers</h6>
                    </div>
                    <div className="col s4">
                    <h6>{userProfile.user.following.length} following</h6>
                    </div>
                   
           
                {showFollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                </div>
                </div>
            </div>
            
            <div className="gallery row">
            {userProfile.posts.map(item=>{
                return(
                    <div className="col s12 m6 l4">
                  <img key={item._id} class="item"  style={{width:"190px" ,height:"190px"}} alt={item.title} src={item.photo}/>
                  </div>
                )

            })}
          
          
            </div>
        </div>
: <h2 className="center-align">loading...!!!</h2>}
                </>
    )
}

export default UserProfile
