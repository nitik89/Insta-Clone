import React,{useState,useEffect,useContext} from 'react'
import { UserContext } from '../../App';
import {Link} from 'react-router-dom';
const  SubscribeUserPosts=()=> {
    const [data,setData]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const [loading,setLoading]=useState(false);
        useEffect(()=>{
            setLoading(true);
        fetch("/getsubpost",{
            headers:{
                'Authorization':"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setLoading(false)
            console.log(result);
           
            setData(result)
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
           const newData=data?.map(item=>{
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
        fetch(`/deletepost/${postid}`,{
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
{loading?<h3 className="center-align">Loading!!</h3>:
     <div className="home">
     {
         data?.map(item=>{
         return(
             <div className="card home-card" key={item._id}>
             <h5> <Link to={item.postedBy._id != state._id ?"/profile/"+item.postedBy._id:"/profile "}>{item.postedBy.name}</Link>{item.postedBy._id == state._id ? <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i> : null }  </h5>
             <div className="card-image">
                 <img src={item.photo} alt="wallpaper"/>
             </div>
             <div className="card-content">
             <i className="material-icons" style={{color:"red"}}>favorite</i>
             {item.likes.includes(state._id)?  <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>  :  <i className="material-icons" onClick={()=>{likePost(item._id)}} >thumb_up</i>}
        
            
                <h6>{item.likes.length} likes</h6>
                 <h6>{item.title}</h6>
                 <h5>Comments:</h5>
                 {
                                 item.comments.map(record=>{
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

export default SubscribeUserPosts
