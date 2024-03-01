import express from "express";
import cors from "cors";
import { z } from "zod";
import fs from "fs/promises";

const app = express();

app.use(cors());
app.use(express.json());

const UserSchema = z.object({
    email: z.string(),
    password: z.string()
})

type UsersType = {
    userID: string,
    email: string,
    password: string
}

const loadDB = async (filename: string) => {
  try {
    const rawData = await fs.readFile(
      `${__dirname}/../database/${filename}.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData);
    return data as UsersType[];
  } catch (error) {
    return null;
  }
};

const saveDB = async (filename: string, data: any) => {
  try {
    const fileContent = JSON.stringify(data, null, 2);
    await fs.writeFile(
      `${__dirname}/../database/${filename}.json`,
      fileContent
    );
    return true;
  } catch (error) {
    return false;
  }
};

app.post("/api/users/registration", async (req, res) => {
    const result = UserSchema.safeParse(req.body)
    if (!result.success)
        return res.status(400).json(result.error.issues)

    const newUser = result.data

    const existUsers = await loadDB("users")
    if (!existUsers)
      return res.sendStatus(500)

    const checkThatIsExist = existUsers.find(user => user.email === newUser.email)

    if (checkThatIsExist !== undefined) {
        res.json("this email already exists")
        return
    }
    const id = Math.random()
    const isSuccessful = await saveDB("users", [ ...existUsers, { id , ...newUser } ])

  if (!isSuccessful)
    return res.sendStatus(500)

  res.json({ ...newUser, id })
})


app.listen(3000)