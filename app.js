const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _=require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_aman:test-1234@cluster0.cst5g.mongodb.net/todolistDB");

const tdlSchema=new mongoose.Schema({
  name:String
})

const tdlitem=mongoose.model("tdlitem",tdlSchema);

const item1=new tdlitem({
  name:"Buy Food"
})
const item2=new tdlitem({
  name:"Cook Food"
})
const item3=new tdlitem({
  name:"Eat Food"
})
const defaulArray=[item1,item2,item3];

const listSchema={
  name:String,
  items:[tdlSchema]
}
const List=mongoose.model("List",listSchema);



app.get("/", function(req, res) {

tdlitem.find({},(err,data)=>{
if(data.length===0){
tdlitem.insertMany(defaulArray,(err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("success");
  }
})
  }
  res.render("list", {listTitle: "Today", newListItems: data});
})

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const item4=new tdlitem({
   name:itemName
  })
  if(listName==="Today"){
    item4.save();
    res.redirect("/");
  }
  else{
  List.findOne({name:listName},(err,data)=>{
   if(!err){
     if(data){
     data.items.push(item4);
     data.save();
     res.redirect('/'+listName);
     }
   }
  })
  }
  
});

app.post('/delete',(req,res)=>{
  let id=req.body.checkbox;
  let listname=req.body.listname;
  if(listname==="Today"){
    tdlitem.findByIdAndRemove(id,(err)=>{
      if(err){
        console.log(err);
      }
    })
    res.redirect('/');
  }
  else{
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:id}}},(err,data)=>{
      if(!err){
        res.redirect('/'+listname);
      }
    })
  }
})

app.get("/:customlist", function(req,res){
  const customlist=_.capitalize(req.params.customlist);
  List.findOne({name:customlist},(err,data)=>{
    if(!err){
      if(!data){
        const list=new List({
          name:customlist,
          items:defaulArray
        })
        list.save();
        res.redirect('/'+customlist);
      }
      else{
      res.render("list",{listTitle:data.name,newListItems:data.items});
    }
  }
  })
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
