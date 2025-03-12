// const { Pool } = require("pg")

// const pool = new Pool({
//     user : 'postgres',
//     host : 'localhost',
//     database : 'Yupiter',
//     password : '12345abcd',
//     port : 5432
// })

// module.exports = pool


const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://yupiter_user:BBtmltvF8q9lLpFs3TjxHRwbfoEVzddt@dpg-cv4pkoij1k6c738q2l5g-a.oregon-postgres.render.com/yupiter",
  ssl: {
    rejectUnauthorized: false, 
  },
});

module.exports = pool;