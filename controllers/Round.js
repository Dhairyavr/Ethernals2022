const Redis = require("ioredis");
const RoundDetails = require("../models/RoundDetails");
require("dotenv").config();

const redis_get = new Redis({
  port: 10922,
  host: `${process.env.REDIS_HOST}`,
  password: `${process.env.REDIS_PASSWORD}`,
});

exports.SetRoundDate = async (req, res) => {
  console.log("date", req.body);
  await redis_get.set("round_time_cron", req.body.cron);
  await redis_get.set("round_time_date", req.body.date);
  let ans = new Date(await redis_get.get("round_time_date"));
  //let ans1 = await redis_get.get("round_time_date");
  // let ans1 = new Date();
  console.log("ans", ans, typeof ans);
  let installment_start_3 = [];
  let installment_start_5 = [];
  let installment_start_7 = [];

  // let installment_end_3_days = [];
  // let installment_end_5_days = [];
  // let installment_end_7_days = [];

  let voting_end_3 = [];
  let voting_end_5 = [];
  let voting_end_7 = [];

  for (let index = 1; index <= 7; index++) {
    if (index <= 3) {
      if (installment_start_3.length > 0) {
        var x = new Date(
          `${installment_start_3[installment_start_3.length - 1]}`
        );
      } else {
        var x = new Date(ans);
      }
      x.setMinutes(x.getMinutes() + 30);
      //x.setHours(x.getHours() + 1);
      //x.setDate(x.getDate() + 1); //50
      //1 day in sec=1*86400
      let time = 35 * parseInt(index) * 60;
      installment_start_3.push(x.toString());
      await redis_get.setex(
        `installment_3_${index}`,
        time,
        `installment_3_${index}`
      ); //53
      //x.setDate(x.getDate() + 6);
      x.setMinutes(x.getMinutes() + 30);
      voting_end_3.push(x.toString());
      let time1 = 65 * parseInt(index) * 60;
      await redis_get.setex(`voting_3_${index}`, time1, `voting_3_${index}`);
    }

    if (index <= 5) {
      if (installment_start_5.length > 0) {
        var x = new Date(
          `${installment_start_5[installment_start_5.length - 1]}`
        );
      } else {
        var x = new Date(ans);
      }
      x.setMinutes(x.getMinutes() + 20);

      //x.setDate(x.getDate() + 2); //40
      let time = 25 * parseInt(index) * 60;
      await redis_get.setex(
        `installment_5_${index}`,
        time,
        `installment_5_${index}`
      ); //43
      installment_start_5.push(x.toString());
      //x.setDate(x.getDate() + 6);
      x.setMinutes(x.getMinutes() + 20);
      voting_end_5.push(x.toString());
      let time1 = 45 * parseInt(index) * 60;
      await redis_get.setex(`voting_5_${index}`, time1, `voting_5_${index}`);
    }

    if (index <= 7) {
      if (installment_start_7.length > 0) {
        var x = new Date(
          `${installment_start_7[installment_start_7.length - 1]}`
        );
      } else {
        var x = new Date(ans);
      }
      x.setMinutes(x.getMinutes() + 10);
      console.log("index", index);
      //x.setDate(x.getDate() + 3); //30
      let time = 15 * index * 60;

      await redis_get.setex(
        `installment_7_${index}`,
        time,
        `installment_7_${index}`
      ); //33
      installment_start_7.push(x.toString());
      //x.setDate(x.getDate() + 6);
      x.setMinutes(x.getMinutes() + 10);
      voting_end_7.push(x.toString());
      let time1 = 25 * parseInt(index) * 60;
      await redis_get.setex(`voting_7_${index}`, time1, `voting_7_${index}`);
    }
  }

  console.log(installment_start_3, installment_start_5, installment_start_7);
  console.log(voting_end_3, voting_end_5, voting_end_7);

  const rounddetails = new RoundDetails({
    installment_start_3,
    installment_start_5,
    installment_start_7,
    voting_end_3,
    voting_end_5,
    voting_end_7,
  });

  await rounddetails.save();

  res.send({ msg: "Success", ans });
};
