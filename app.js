const express = require('express') ;
const bodyParser = require('body-parser') ;
const methodOverride = require('method-override')

//handle bars middle ware
const exphbs  = require('express-handlebars');

const mongoose = require('mongoose') ;

//connecting to database
mongoose.connect('mongodb://localhost/projot-dev',{
   // useMongoClient : true  //no longer needed 
}).then(()=>{
console.log("MongoDB connected");
}).catch(err =>{
    console.log(err) ; 
});

//load idea models 
require('./models/Idea');

const Idea = mongoose.model('ideas');


const app = express() ;

//middleware : 
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}
));

app.set('view engine','handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// override with POST having ?_method=DELETE
//also have to add a hidden html input tag 
app.use(methodOverride('_method'))

// app.use(function(req,res,next){
// req.name ='saatvik' ;
// next();
// }
// );


//index route 

app.get('/',(req,res)=>{
const title = 'Wooo' ;
res.render('index',
{
    tit : title
}
) ;
}
) ;

app.get('/about',(req,res)=>{
//console.log(req.name) ;
//res.send('ABOUT') ;
res.render('about') ;
}) ;

app.get('/ideas', (req,res)=>{
Idea.find({})
    .sort({date :'desc'})
    .then(ideas =>{
        res.render('./ideas/index',{
        ideas:ideas  
        }) ;
    })
});


//add ideas
app.get('/ideas/add',(req,res)=>{
  //  console.log("banyunga abhi") ;
    res.render('ideas/add')
});


//process our form 

app.post('/ideas',(req,res)=>{

let errors = [];

if(!req.body.title)
{
    errors.push({text : 'Pls add a title '}) ;
}
if(!req.body.details)
{
    errors.push({text : 'Pls add details '}) ;
}

if(errors.length>0)
{
    res.render('ideas/add',{
        errors:errors ,
        title : req.body.title ,
        details : req.body.details 
    }) ;
}else
{
    const newUser = {
        title:req.body.title ,
        details : req.body.details 
        //user : req.user.id ;  
    }
    new Idea(newUser)
    .save()
    .then(idea =>{
        res.redirect('/ideas') ;
    })
 //   res.send('passed')
}
  //  console.log(errors) ;
   // console.log(req.body) ; //after installing body parser
//res.send("ok") ;
});

//edit form 

app.get('/ideas/edit/:id' , (req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then((idea)=>{
    res.render('./ideas/edit',{
     idea : idea 
    });
    });

});

//edit form process 
//will be using method override , another way to work with this would be to use ajax 
// we cant make a put request from the form like we did for POST 
app.put('/ideas/:id',(req,res)=>{
res.send('PUT');
});

const port = 5010 ;

app.listen(port,() => {
    console.log(`server started on port ${port}`) ; 
})

