const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let secretKey =
  "2a6a9868c6286f999469f046ebb866cbfdc6f4e72078f038ab3e52cf7c6f36db958df66665e82e0d27fefc22146f5347fc831cc82c1c7269e840305effe3b2e50a13f5283ba8b62fa5ec4509035bf688fb181a9a097d501a7e86ae19ff8cd7ca5510322e7ced08e24671481446a69f0a00bcc44620831990f3532393993ac144eeb03438f48618ea2097afb5c9fc9dc04b3af054b9a1ac85efa69e4ca8081ec515fa35f8d9979bdb08a756889953a1d6c85c71a11b22eda9cb9dca55237ac9ab0314775cd56e0575aeb94b34ebc201412b985f827c82c24a96468cd789aa7123d72985b93d30f4ddaaf137ccb225e818e120fe0142ca7c1581013b27aa49e213";
const users = [
  {
    email: "lokesh@gmail.com",
    username: "ch_lokesh",
    id: "1111",
    password: "Lokesh@1234",
    role: "User"
  },
  {
    email: "jwt@gmail.com",
    username: "jwt_12",
    id: "2222",
    password: "123456",
    role : "User"
  },
  {
    email: "user@gmail.com",
    username: "user_21",
    id: "3333",
    password: "123456",
    role: "User"
  },
  { email: "ntl@gmail.com", username: "NTL", id: "4444", password: "123456" , role:"Admin" },
];

app.get("/api", (req, res) => {
  res.json({ message: "Hello" });
});

app.post("/api/login", (req, res) => {
  users.filter((user) => {
    if (user.email === req.body.email) {
      if (user.password === req.body.password) {
        const payLoad = {
          username: user.username,
          id: user.id,
          email:user.email,
          role:user.role
        };
        jwt.sign(payLoad, secretKey, { expiresIn: "1h" }, (err, token) => {
          res.json({
            token: token,
          });
        });
      }
    }
  });
});
const validateToken = (req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else
    {
        res.sendStatus(403);
    }
}
app.post('/api/posts',validateToken,(req,res)=>
{
    jwt.verify(req.token,secretKey,(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            res.json({
                message:"Logged In",
                authData:authData
            })
        }
    });
});



app.listen(8080, () => {
  console.log("Server Started");
});
