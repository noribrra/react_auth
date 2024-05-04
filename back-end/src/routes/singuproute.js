import { getDbConnection } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const singuproute = {
  path: "/api/singup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;
    const db = getDbConnection("react-db");

    const user = await db.collection("users").findOne({ email });

    if (user) {
      res.sendStatus(409);
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const startinginfouser = {
      haircolor: "",
      food: "",
      bio: "",
    };

    const result = await db.collection("users").insertOne({
      email,
      hashpassword,
      info: startinginfouser,
      isveryfied: false,
    });

    const { insertedId } = result;

    jwt.sign(
      {
        id: insertedId,
        emailt: email,
        info: startinginfouser,
        isveryfied: false,
      },

      process.env.TWT_SECRET,
      {
        expiresIn: "2d",
      },
      (err, token) => {
        if (err) {
          return res.sendStatus(500).send(err);
        }
        res.json({ token });
      }
    );
  },
};
