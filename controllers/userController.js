const pool = require("../config/db");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")









const signup = async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body;
  
        // Check if user exists (securely)
        const checkUser = await pool.query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json("Bunday foydalanuvchi mavjud");
        }
  
        const salt = await bcrypt.genSalt(10);
        const  encrypttoPassword = await bcrypt.hash(password, salt);
       
        // Insert user safely
        const result = await pool.query(
            "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [firstname, lastname, username, encrypttoPassword]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Serverda xatolik yuz berdi.");
    }
  }


  const login = async (req,res) => {
    try {
        const {username, password} = req.body
        const result = await pool.query(`SELECT * FROM users WHERE username = '${username}' LIMIT 1`);

        if(result.rows.length === 0){
           return res
           .status(400)
           .json("Bunday foydalanuvchi mavjud emas");
        }
      
        const user = result.rows[0];

        const isvaluePassword = await bcrypt.compare(password, user.password);
        if(!isvaluePassword){
            return res
            .status(400)
            .json({message: "Incorrect username or password"});
        }
               
        
       const token = jwt.sign(
        {
            user_id: user.id,
            username: user.username
        },
        "Men Senga bir gap aytaman hech kim bilmasin",
        {expiresIn: "10m"}
       )

        res.status(200).json({user, token});
        console.log(result.rows);

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi");
    }
}


module.exports = {login, signup}