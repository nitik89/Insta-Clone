import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
const Navbar=()=> {
  const searchModel=useRef(null);
  const sidenav=useRef(null);
  const {state,dispatch} = useContext(UserContext);
  const [search,setSearch]=useState('');
  const [userData,setuserData]=useState([]);
const history=useHistory();
useEffect(()=>{
M.Modal.init(searchModel.current);
M.Sidenav.init(sidenav.current)
},[])
  const renderList=()=>{
    if(state){
      return[
        <div>
          <li><i data-target="modal1"className="large material-icons modal-trigger" style={{color:"black",cursor:"pointer"}}>search</i></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/create">Create</Link></li>
        <li><Link to="/myfollowerpost">My following Posts</Link></li>
        <li>
        <button className="btn #c62828 red darken-3" onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('/signin')
        }
          } >
  Logout
</button>
        </li>
        </div>
      ]
    }
    else{
      return(
      <div>
         <li><Link to="/signin">Login</Link></li>
        <li><Link to="/signup">SignUp</Link></li>
      </div>
      )
    }
  }
  const fetchUsers=(query)=>{
    setSearch(query);
    fetch('http://localhost:5000/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json",
       
      },
      body:JSON.stringify({
        query
      })
    })
    .then(res=>res.json())
    .then(results=>{
     setuserData(results.user)
    })

  }
    return (
      <div>
        <nav>
    <div class="nav-wrapper white">
      <Link to={state?"/":"/signin"} class="brand-logo"> Instagram</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
      {renderList()}
      </ul>
    </div>
  </nav>

  <ul class="sidenav" id="mobile-demo" ref={sidenav}>
  {renderList()}
  </ul>
          
     
      <div id="modal1" class="modal" ref={searchModel}>
        <div className="modal-content" style={{color:"black"}} >
       
        <input
          type="text"
          placeholder="search users"
          value={search}
          onChange={(e)=>fetchUsers(e.target.value)}
          />
           <ul className="collection">
               {userData.map(item=>{
                 return <Link to={item?._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModel.current).close()
                   setSearch('')
                 }}><li className="collection-item" style={{width:"100%"}}>{item.email}</li></Link> 
               })}
               
              </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
        </div>
      </div>
      </div>
   
    )
}

export default Navbar
