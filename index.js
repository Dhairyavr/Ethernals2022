const express = require("express"); // using express
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const Redis = require("ioredis");
//------------------------------------------------------
const userDetails = require("./models/userDetails");
const ProjectDetails = require("./models/ProjectDetails");
const InstallmentUpdates = require("./models/InstallmentUpdates");
const { SetRoundDate } = require("./controllers/Round");
const RoundDetails = require("./models/RoundDetails");

//---------------------------------------------------------------------
const { SetData } = require("./publisher");

require("dotenv").config();

const app = express();
const redis = new Redis({
  port: 10922,
  host: `${process.env.REDIS_HOST}`,
  password: `${process.env.REDIS_PASSWORD}`,
  connectTimeout: 10000,
});

const redis_get = new Redis({
  port: 10922,
  host: `${process.env.REDIS_HOST}`,
  password: `${process.env.REDIS_PASSWORD}`,
  connectTimeout: 10000,
});

// redis_get.flushall();

const db = async () => {
  mongoose.connect(
    `${process.env.MONGO_URL}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("DB connected");
    }
  );
};
// redis.del("round_time_cron");
db();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let server = http.createServer(app);
let io = socketIO(server);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("socket ", socket.id, " disconnected");
  });
});

//----------------------------------------------------------------------------

app.get("/", async (req, res) => {
  const val = await redis_get.get("round_time_cron");
  const val1 = await redis_get.get("round_time_date");

  const installment_voting_dates = await RoundDetails.find();
  console.log(val, val1);
  if (val) {
    //req.query.date.toString()
    let x = new Date(val1);
    x.setDate(x.getDate() - 16);
    let sponsor_cron = `${x.getMinutes()} ${x.getHours()} ${x.getDate()} ${
      x.getMonth() + 1
    } *`;
    console.log(sponsor_cron, x);

    res.send({
      message: "Round currently active",
      date: val1,
      installment_voting_dates,
    });
    // }
  } else {
    res.send({
      message: "No active fundraising round",
      date: null,
      installment_voting_dates: null,
    });
  }
});

//----------------------------------------------------------------------------

app.post("/setrounddate", SetRoundDate);

//----------------------------------------------------------------------------

app.get("/userinfo", async (req, res) => {
  let response;
  console.log(req.query);
  try {
    response = await userDetails.find({
      wallet_address: req.query.wallet_address,
    });
    console.log("response", response);
    if (response.length == 0) {
      const user = new userDetails({
        wallet_address: req.query.wallet_address,
        profile_img:
          "https://ipfs.moralis.io:2053/ipfs/QmQ9xPRnXUqQr2GXuTXH8p4W3rVfawK3p4wFKqetJPq3g6",
        fname: "Bob",
        lname: "Smith",
        email: "abcd@gmail.com",
        website: "https://google.com",
        description: "hello everyone",
      });
      const resp = await user.save();
      console.log(resp);
      res.send({ response: resp });
    }
    res.send({ response });
    console.log(response);
  } catch (e) {
    console.log(e);
  }
});

//----------------------------------------------------------------------------

app.post("/setuserinfo", async (req, res) => {
  console.log(req.body, "1");

  try {
    await userDetails.findOneAndReplace(
      { wallet_address: req.body.wallet_address },
      req.body,
      { upsert: true }
    );
  } catch (error) {
    console.log(error);
    return;
  }
  res.send("success");
});

//----------------------------------------------------------------------------

app.post("/setprojectdata", async (req, res) => {
  console.log("setprojectdata", req.body);

  const project = new ProjectDetails({
    round_id: req.body.round_id,
    project_id: req.body.project_id,
    owner: req.body.owner,
    status: req.body.status,
    approved_installments: [],
    updated_installments: [],
    no_of_installments: req.body.no_of_installments,
  });

  project.save((err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("success");
  });
});

//----------------------------------------------------------------------------

app.get("/getprojectdata", async (req, res) => {
  console.log(req.query.round_id);
  const response = await ProjectDetails.find({
    round_id: `${req.query.round_id.toString()}`,
  }).populate("owner");
  console.log(response);
  res.send({ response });
});

//----------------------------------------------------------------------------

app.get("/dashboarddata", async (req, res) => {
  console.log(req.query);

  const ownerDetails = await ProjectDetails.find({
    project_id: { $in: req.query.project_ids },
  }).populate("owner");

  console.log(ownerDetails);
  res.send({ ownerDetails });
});

//----------------------------------------------------------------------------

app.post("/setInstallmentData", async (req, res) => {
  console.log(req.body);
  const { project_id, round_id, installment_id, image, video, description } =
    req.body;

  const installment = new InstallmentUpdates({
    project_id,
    round_id,
    installment_id,
    image_url: image,
    video_url: video,
    description,
  });

  const resp = await installment.save();
  console.log(resp);

  await ProjectDetails.updateOne(
    { project_id },
    { $push: { updated_installments: { $each: [`${installment_id}`] } } }
  );

  res.send({ resp });
});

//----------------------------------------------------------------------------

app.post("/setvote", async (req, res) => {
  console.log(req.body);

  if (req.body.choice === "yes") {
    await InstallmentUpdates.updateOne(
      {
        installment_id: req.body.installment_id,
        project: req.body.project_id,
      },
      { $inc: { yes: 1 } }
    );
  } else {
    await InstallmentUpdates.updateOne(
      {
        installment_id: req.body.installment_id,
        project: req.body.project_id,
      },
      { $inc: { no: 1 } }
    );
  }
  res.send("success");
});
//----------------------------------------------------------------------------

app.get("/getinstallmentdata", async (req, res) => {
  console.log(req.query);

  const resp = await InstallmentUpdates.find({
    project_id: req.query.project_id,
  });

  console.log(resp);
  res.send({ details: resp });
});

//----------------------------------------------------------------------------

server.listen(8000, () => {
  console.log("server started");
});

//----------------------------------------------------------------------------

redis.config("SET", "notify-keyspace-events", "Ex");

redis.on("connect", function () {
  console.log("Hello");
});

// redis_get.flushall();

redis.subscribe("__keyevent@0__:expired");
redis.on("message", async function (channel, message) {
  console.log(message);
  var type = message;
  console.log(type.split("_")[0]);
  console.log(type);
  switch (type.split("_")[0]) {
    case "installment":
      console.log(
        "In switch case installment",
        type.split("_")[1],
        type.split("_")[2]
      );

      if (type.split("_")[2] === "1") {
        let arr = await ProjectDetails.updateMany(
          {
            $expr: { $eq: [{ $size: "$updated_installments" }, 0] },
            no_of_installments: `${type.split("_")[1]}`,
          },
          {
            status: "Disqualified",
          }
        );
        console.log("Modified array ", arr);
      } else {
        let arr = await ProjectDetails.updateMany(
          {
            $expr: {
              $eq: [
                { $last: "$updated_installments" },
                `${parseInt(type.split("_")[2]) - 1}`,
              ],
            },
            no_of_installments: `${type.split("_")[1]}`,
          },
          { status: "Disqualified" }
        );
        console.log("Modified array ", arr);
      }

      break;
    case "voting":
      console.log(
        "In switch case voting",
        type.split("_")[1],
        type.split("_")[2]
      );

      const arr = await InstallmentUpdates.find(
        {
          installment_id: `${type.split("_")[2]}`,
          $expr: { $gt: ["$no", "$yes"] },
        },
        { project_id: 1, _id: 0 }
      );
      const ids = arr.map((val) => val.project_id);
      console.log(ids);
      const res = await ProjectDetails.updateMany(
        { project_id: { $in: ids } },
        { status: "Disqualified" }
      );
      break;
  }

  console.log("Finish");
});
