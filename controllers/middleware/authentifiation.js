exports.authantification = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        console.log(token);

        if (!token){
          return res.status(404).json({ message: "Token berilmadi" });
        }
        
        const isvalidKey = jwt.verify(token, "Men Senga bir gap aytaman hech kim bilmasin")
        console.log(isvalidKey);
    } catch (error) {
        console.log(error.message);
        res.ststus(500).json({
            message: error.message
        })
    }
}