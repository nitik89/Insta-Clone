import React,{useState,useEffect,useContext} from 'react'
import { UserContext } from '../../App';
import {Link} from 'react-router-dom';
const  Home=()=> {
    const [data,setData]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        setLoading(true);
        fetch("/allpost",{
            headers:{
                'Authorization':"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setLoading(false)
            setData(result.posts)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    const likePost=(id)=>{
     
        fetch('/like',{
             method:"put",
             headers:{
                "Content-Type":"application/json",
                'Authorization':"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
  
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id == result._id){
                    console.log('result',result);
                    return result;
                }
                else{
                    console.log('item',item)
                    return item;
                }
            })
            setData(newData);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const unlikePost=(id)=>{
        fetch('/unlike',{
             method:"put",
             headers:{
                "Content-Type":"application/json",
                'Authorization':"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })

        })
        .then(res=>res.json())
        .then(result=>{
           const newData=data.map(item=>{
               if(item._id == result._id){
                   return result;
               }
               else{
                   return item;
               }
           })
           setData(newData);
        })
    }
    const commentPost = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postid)=>{
        console.log(postid);
        fetch(`http://localhost:5000/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <>
        {loading?<h3 className="text-center">loading!!</h3>:
         <div className="home">
         {
             data.map(item=>{
             return(
                 <div className="card home-card" key={item._id}>
                 <h5 style={{padding:"2rem",textTransform:"Uppercase",textDecoration:"underline"}}> <Link to={item.postedBy._id != state._id ?"/profile/"+item.postedBy._id:"/profile "}>{item.postedBy.name}</Link>{item.postedBy._id == state._id ? <i className="material-icons" style={{float:"right",cursor:"pointer"}} onClick={()=>deletePost(item._id)}>delete</i> : null }  </h5>
                 <div className="card-image">
                     <img src={item.photo} alt="wallpaper"/>
                 </div>
                 <div className="card-content">
                     
           
                 {item.likes.includes(state._id)?  <i className="material-icons"  style={{color:"red",cursor:"pointer"}} onClick={()=>{unlikePost(item._id)}}>favorite</i>  :  <i className="material-icons"  style={{cursor:"pointer"}} onClick={()=>{likePost(item._id)}} >favorite_border</i>}
            
                
                    <h6>{item.likes.length} likes</h6>
                     <h6>{item.title}</h6>
                     <h5>Comments:</h5>
                     {
                                     item.comments?.map(record=>{
                                         return(
                                         <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                         )
                                     })
                                 }
                                 <form onSubmit={(e)=>{
                                     e.preventDefault()
                                     commentPost(e.target[0].value,item._id)
                                 }}>
                                   <input type="text" placeholder="add a comment" />  
                                 </form>
                 </div>
             </div>
 
 
             )
         })}
            
             
             
         </div>
        }
</>
       
    )
}

export default Home
