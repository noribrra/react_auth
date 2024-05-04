import jwt from "jsonwebtoken";
import { getDbConnection } from "../db.js";

export const updateinfo = {
  path: "/api/users/:userid",
  method: "put",

  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userid } = req.params;

    const updets = ({ haircolor, food, bio }) => ({
      haircolor,
      food,
      bio,
    });
    const updatesdata = updets(req.body);

    if (!authorization) {
      return res.status(401).json({ message: "no authorization " });
    }
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.TWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "uneble verify" });
      const { emailt, id } = decoded;

      if (id !== userid) {
        return res.status(403).json({ message: "not alaod you to updeat" });
      }

      const db = getDbConnection("react-db");
      const result = await db.collection("users").findOneAndUpdate(
        { email: emailt },
        { $set: { info: updatesdata } },
        {
          returnDocument: "after",
        }
      );

      if (!result) return res.status(201).json({ message: "user not foound" });
      const { email, isveryfied, info } = result;

      jwt.sign(
        { id, emailt, isveryfied, info },
        process.env.TWT_SECRET,
        {
          expiresIn: "2d",
        },
        (err, token) => {
          if (err) return res.status(201).json({ message: err });

          res.send(token).status(200);
        }
      );
    });
  },
};
