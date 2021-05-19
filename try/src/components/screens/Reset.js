import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import Home from './Home';
import { UserContext } from '../../App';
const Reset = () => {

    const history = useHistory();

    6
    const [email, setEmail] = useState("");


    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/reset-password", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                if (data.error) {


                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                } else {

                    M.toast({ html: data.message, classes: "#00bfa5 teal accent-4" })
                    history.push('/signin');
                }




            }).catch(err => {
                console.log(err);
            })
    }

    return ( <
        div className = "mycard" >
        <
        div className = "card auth-card input-field " >
        <
        h2 > Instagram < /h2>

        <
        input type = "email"
        placeholder = "email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value) }
        />


        <
        button className = "btn waves-effect waves-light #64b5f6 blue lighten-2"
        onClick = {
            () => postData() } >
        Reset Password <
        /button>

        <
        /div> <
        /div>
    )
}
export default Reset;