import { getDbConnection } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginroute = {
  path: "/api/login",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;
    const db = getDbConnection("react-db");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "the user is not fond" });
    }

    const { _id: id, isveryfied, hashpassword, info } = user;

    const iscorrect = await bcrypt.compare(password, hashpassword);

    if (iscorrect) {
      jwt.sign(
        {
          id,
          emailt: email,
          info,
          isveryfied,
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
    } else {
      res.status(401).json({ message: "the passowrd is rong" });
    }
  },
};
