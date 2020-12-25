const express = require('express')
const mongoose = require('mongoose')
const app = express();
const port = process.env.PORT || 3001;
const {MONGOURI} = require('./config/keys')

mongoose.set('useFindAndModify', false);

mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () =>{
    console.log('connected to mongo DB');
})

mongoose.connection.on('error', (err) =>{
    console.log('error connecting mongo DB', err);
})

require('./models/users')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV == "production"){//if application is deplyoing
    app.use(express.static('client/build'))//html,css files
    const path = require('path')
    app.get('*',(req,res) => {//if client is making a request, send response to index.html
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port,()=> console.log('server runnig on', port))