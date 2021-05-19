import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import Home from './Home';
import { UserContext } from '../../App';
const Login = () => {
        const { state, dispatch } = useContext(UserContext);
        const [loading, setLoading] = useState(false);
        const history = useHistory();

        const [password, setPassword] = useState("");
        const [email, setEmail] = useState("");


        const postData = () => {
            setLoading(true);
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
                return
            }
            fetch("/signin", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        password: password,
                        email: email
                    })
                })
                .then(resp => resp.json())
                .then(data => {
                    setLoading(false);

                    if (data.error) {


                        M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                    } else {
                        localStorage.setItem("jwt", data.token)
                        localStorage.setItem("user", JSON.stringify(data.user));
                        console.log(data.user);
                        dispatch({ type: 'USER', payload: data.user });
                        M.toast({ html: "Signed in Success", classes: "#00bfa5 teal accent-4" })
                        history.push('/');
                    }




                }).catch(err => {
                    setLoading(false);
                    console.log(err);
                })
        }

        return ( <
            > {
                loading ? < h3 className = "center-align" > Loading!! < /h3>: <div className="mycard"> <
                div className = "card auth-card input-field " >
                <
                h2 > Instagram < /h2>

                <
                input type = "email"
                placeholder = "email"
                value = { email }
                onChange = {
                    (e) => setEmail(e.target.value) }
                /> <
                input type = "password"
                placeholder = "password"
                value = { password }
                onChange = {
                    (e) => setPassword(e.target.value) }
                />

                <
                button className = "btn waves-effect waves-light #64b5f6 blue lighten-2"
                onClick = {
                    () => postData() } >
                SignUp <
                /button> <
                h5 >
                <
                Link to = "/signin" > Already have a account ? < /Link> <
                /h5> <
                h6 >
                <
                Link to = "/reset" > Forgot Password < /Link> <
                /h6> <
                /div> <
                /div>}

                <
                />
            )
        }
        export default Login;