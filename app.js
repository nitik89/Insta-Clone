const express=require('express');
const app=express();
const mongoose=require('mongoose');
const PORT=process.env.PORT || 5000;
const {MONGOURI}=require('./config/keys');




mongoose.connect(MONGOURI,{
    useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false
});

mongoose.connection.on('connected',()=>{
    console.log('connected to the server yeah!')
});
mongoose.connection.on('error',(err)=>{
    console.log('err connecting ',err);
})

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/user'));
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('try/build'))
    const path=require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"try","build","index.html"))
    })
}


app.listen(PORT,()=>{
    console.log('server is running on',PORT);
})