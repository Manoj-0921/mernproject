const express = require("express")
const users = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


  

app.get("/",cors(),(req,res)=>{
  return "hello"

})


app.post("/",async(req,res)=>{
    const{email,password}=req.body

    try{
        const user=await users.findOne({email:email})

        if(user){
            res.json({message:"exist",user:user})
            console.log(user)
        }
        else{
            res.json({message:"notexist"})
        }

    }
    catch(e){
        res.json({message:"Error occured when connecting to db"})
    }

})



app.post("/signup", async (req, res) => {
    const { email, password, gender, age } = req.body;

    const data = {
        email: email,
        password: password,
        gender: gender,
        age: age,
    };

    try {
        const check = await users.findOne({ email: email });

        if (check) {
            res.send("exist");
        } else {
            await users.create(data); 
            res.send("notexist");
        }
    } catch (e) {
        console.error(e);
        res.send("fail");
    }
});
app.get("/user/:id", cors(), async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await users.findOne({ email: userId });
      if (user) {
        res.json({ message: "success", user: user });
      } else {
        res.json({ message: "user not found" });
      }
    } catch (e) {
      res.json({ message: "fail" });
    }
  });
  app.put("/user/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const { age } = req.body;
console.log(userId)
      const updatedUser = await users.findOneAndUpdate(
        { email: userId },
        { $set: { age: age } },
        { new: true }
      );
    console.log(updatedUser )
      if (updatedUser) {
        res.json({ status: "success", user: updatedUser });
      } else {
        res.json({ status: "notfound" });
      }
    } catch (e) {
      res.status(500).json({ status: "fail" });
    }
  });


 

app.listen(8000,()=>{
    console.log("port connected");
})