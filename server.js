const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://ram:ram123@project1.m3pbh.mongodb.net/prodb?retryWrites=true&w=majority",
  //mongodb+srv://ram:<password>@project1.m3pbh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
  //mongodb+srv://nekha:Nekha123@cluster0.qsuod.mongodb.net/projectmanager?retryWrites=true&w=majority
  //mongodb+srv://nekha:<password>@cluster0.qsuod.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
  //"mongodb+srv://nekha:<password>@cluster0.vv8ki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected");
});
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

//schema

const sch = {
  name: String,
  email: String,
  password: String,
};
const mod = mongoose.model("mod", sch);

//SIGN IN
app.post("/check", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log("safaffa");
  // console.log(req.body);
  const extr = await mod.findOne({ email: email });
  //res.send(extr);
  //console.log(extr);
  if (extr && extr.password === password) {
    res.send("1");
  } else {
    res.send("0");
  }
});

// push data
app.post("/postdata", async (req, res) => {
  // console.log(req.body);
  try {
    let emcheck = req.body.email;
    const ext = await mod.findOne({ email: emcheck });
    if (ext) {
      res.send("0");
    } else {
      const newmod = new mod({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const a = await newmod.save();

      res.send("1");
    }
  } catch (error) {
    console.log(error);
  }
});

//UPCOMING PROJECTS PAGE

const sch2 = {
  projectname: String,
  status: Boolean,
};
const schema = mongoose.model("mod2", sch2, "COLL");

//post
app.post("/postproject", async (req, res) => {
  // console.log("AM IN");
  const Schem = new schema({
    projectname: req.body.projectname,
    status: req.body.status,
  });
  const val = await Schem.save();
  res.json(val);
});

///FETCH
app.get("/getfull", (req, res) => {
  schema.find((err, val) => {
    if (err) {
      console.log(err);
    }
    res.json(val);
  });
});

//DELETE

app.delete("/del/:id", (req, res) => {
  // console.log("AM IN DEL");
  schema.findByIdAndDelete(req.params.id, (err, val) => {
    if (err) {
      console.log(err);
    }
    res.json(val);
  });
});
app.delete("/task/:id", (req, res) => {
  Task_table.deleteMany({ projectId: req.params.id }, (err, val) => {
    if (err) {
      console.log(err);
    }
    // console.log(val);
  });
});

//
//
//
//CREATE AND ONGOING PROJECTS PAGE
//
const ons = mongoose.Schema;
const sche = new ons(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);
const Ongoing = mongoose.model("ongoing", sche, "ONG");

//ADDING DATA

//

app.post("/ongoing/add", (req, res) => {
  const projectName = req.body.projectName;
  const description = req.body.description;
  const newProject = new Ongoing({ projectName, description });
  newProject
    .save()
    .then(() => res.json("Project added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

///
///
/// FETCH ALL

app.get("/ongoing", (req, res) => {
  Ongoing.find()
    .then((ong) => res.json(ong))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/ongoing/:id", (req, res) => {
  Ongoing.findById(req.params.id)
    .then((ong) => res.json(ong))
    .catch((err) => res.status(400).json("Error: " + err));
});

///////

//DELETE

app.delete("/ongoing/:id", (req, res) => {
  // console.log("deleted");
  Ongoing.findByIdAndDelete(req.params.id)
    .then(() => res.json("Project deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/users/:id", async (req, res) => {
  //console.log(req.params.id);
  mod
    .find({ email: req.params.id })
    .then((ong) => {
      res.json(ong[0].name);
      // console.log("hlololo");
      // console.log(JSON.stringify(ong));
      // console.log(ong[0].name);
      //res.json(ong);
      //console.log(ong.data.name);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/tasks/:id", async (req, res) => {
  // console.log(req.params.id);
  Task_table.find({ projectId: req.params.id })
    .then((ong) => {
      res.json(ong);
      //console.log(ong);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

app.post("/tasks/add", async (req, res) => {
  // console.log("inside add task");
  //console.log(req.body.projectName);
  const task_description = req.body.task_description;
  const task_duration = req.body.task_duration;
  const projectId = req.body.projectId;
  const emp_email = req.body.emp_email;
  //const emp_name = req.body.emp_name;
  // const createdAt = req.body.createdAt;
  const newTask = new Task_table({
    projectId,
    // createdAt,
    task_description,
    task_duration,
    emp_email,
  });
  // console.log(JSON.stringify(newTask));
  newTask
    .save()
    .then(() => res.json("Task added!"))
    .catch((err) => {
      console.log(err);
      res.status(400).json("Error: " + err);
    });
});
////
const Schema = mongoose.Schema;

const task_s = new Schema(
  {
    projectId: {
      type: String,
      required: true,
      trim: true,
      //minlength: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    task_description: {
      type: String,
      required: true,
      trim: true,
      //minlength: 5,
    },
    task_duration: {
      type: String,
      required: true,
    },
    emp_email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task_table = mongoose.model("tasks", task_s);
///
///UPDATE

app.post("/ongoing/update/:id", (req, res) => {
  Ongoing.findById(req.params.id)
    .then((ong) => {
      ong.projectName = req.body.projectName;
      ong.description = req.body.description;

      ong
        .save()
        .then(() => res.json("Project updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
//
///

//SUBSCRIPTION TABLE
//
const sub = {
  employeeemail: {
    type: String,
    required: true,
    trim: true,
  },
  projectname: {
    type: String,
    required: true,
    trim: true,
  },
  projectid: {
    type: String,
    required: true,
    trim: true,
  },
};

const subp = mongoose.model("subpro", sub, "SUB");
//
//ADD DATA
//

app.post("/addsub", (req, res) => {
  const employeeemail = req.body.employeeemail;
  const projectname = req.body.projectname;
  const projectid = req.body.projectid;
  const newP = new subp({ employeeemail, projectname, projectid });
  newP
    .save()
    .then(() => res.json("Project added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});
// app.get("/my/tasks/", (req, res) => {
//   console.log("hii");
//   const mail = req.query.mail;
//   const pid = req.query.projectid;
//   Task_table.find({ emp_email: mail }, { projectId: pid }).then((data) => {
//     res.json(data);
//   });
// });
///  ALL SUB
app.get("/getsub/:id", (req, res) => {
  //console.log("email " + req.params.id);
  subp.find({ employeeemail: req.params.id }).then((data) => {
    //console.log(data);
    res.json(data);
  });
});
//
//

//SUB DELETE
//

app.delete("/subdel/:id", (req, res) => {
  subp.deleteMany({ projectid: req.params.id }, (err, val) => {
    if (err) {
      console.log(err);
    }
    // console.log(val);
  });
});
app.post("/ta", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log("safaffa");
  // console.log(req.body);
  const extr = await mod.findOne({ email: email });
  //res.send(extr);
  //console.log(extr);
  if (extr && extr.password === password) {
    res.send("1");
  } else {
    res.send("0");
  }
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

var path = require("path");
const port = process.env.PORT || 3000;

// serve the static files
// var static_location = path.join(__dirname, "../", "client", "build");
// app.use(express.static(static_location));
// app.get("*", (req, res) => {
//   var htmlFilePath = path.join(
//     __dirname,
//     "../",
//     "client",
//     "build",
//     "index.html"
//   );
//   res.sendFile(htmlFilePath);
// });

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`running on port: ${port}`);
});

// app.listen(process.env.PORT || 4000, () => {
//   console.log("on server 4000");
// });
module.exports = mod;
module.exports = subp;
//module.exports = mod;
