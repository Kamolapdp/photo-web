const pool = require("../config/db");

const addLike = async (req, res) => {
    try {
      const { user_id, image_id } = req.body;
      const checkLike = await pool.query("SELECT * FROM likes WHERE user_id = $1 AND image_id = $2", [user_id, image_id]);
      if (checkLike.rows.length > 0) {
        await pool.query("DELETE FROM likes WHERE user_id = $1 AND image_id = $2", [user_id, image_id]);
        return res.json({ message: "Like olib tashlandi", liked: false });
      }
      await pool.query("INSERT INTO likes (user_id, image_id) VALUES ($1, $2)", [user_id, image_id]);
      res.status(201).json({ message: "Like qo'shildi", liked: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Serverda xatolik yuz berdi.");
    }
}





module.exports = addLike