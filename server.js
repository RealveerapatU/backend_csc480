const express = require("express");
const sql = require("mssql");
const app = express();
app.use(express.json());
require('dotenv').config({
  path: '.env.production'
})
// SQL Server configuration
var config = {
    "user": process.env.DB_USERNAME, // Database username
    "password": process.env.DB_PASSWORD, // Database password
    "server": process.env.DB_SERVER, // Server IP address
    "database": process.env.DB_NAME, // Database name
    "options": {
         trustServerCertificate: true
        
    }
}

sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});


app.get("/getoperator",async (request, response) => {
   try {
    await sql.connect(config)
     const result = await sql.query(`
      SELECT * FROM operators
    `);
    response.json(result.recordset);
   } catch (error) {
    response.status(500).json({ error: error.message });
   }
});
app.get("/getstudent",async (request, response) => {
   try {
    await sql.connect(config)
     const result = await sql.query(`
      SELECT * FROM student
    `);
    response.json(result.recordset);
  
   } catch (error) {
    response.status(500).json({ error: error.message });
   }
});
app.get("/gettransaction",async (request, response) => {
   try {
    await sql.connect(config)
     const result = await sql.query(`
      SELECT * FROM Transactions
    `);
    response.json(result.recordset);
   } catch (error) {
    response.status(500).json({ error: error.message });
   }
});
app.get("/fixs",async (request, response) => {
   try {
    await sql.connect(config)
     const result = await sql.query(`
      SELECT * FROM fixs
    `);
    response.json(result.recordset);
   } catch (error) {
    response.status(500).json({ error: error.message });
   }
});
/////////get byid
app.post("/getoperator", async (request, response) => {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({ error: "id is required" });
    }

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM operators WHERE operator_id = @id");

    response.json(result.recordset);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});
app.post("/gettransaction", async (request, response) => {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({ error: "id is required" });
    }

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Transactions WHERE id = @id");

    response.json(result.recordset);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

app.post("/getstudent", async (request, response) => {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({ error: "id is required" });
    }

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM student WHERE student_id = @id");

    response.json(result.recordset);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});
app.post("/getfixs", async (request, response) => {
  try {
    const { id } = request.body;
    if (!id) {
      return response.status(400).json({ error: "id is required" });
    }

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM fixs WHERE fix_id = @id");

    response.json(result.recordset);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});
/////////////////////////////////////////////////////////Insert/////////////////////////////////////////
app.post("/addstudent", async (request, response) => {
  try {
     await sql.connect(config)
    const {fname,lname,password} = request.body;
    const sqlrequest = new sql.Request();
    sqlrequest.input('fname', sql.NVarChar, fname);
    sqlrequest.input('lname', sql.NVarChar, lname);
    sqlrequest.input('password', sql.NVarChar,password);
    await sqlrequest.query(`INSERT INTO student (fnames,lnames,passwords) VALUES (@fname,@lname,@password)`)
    response.status(200).json({message:"Insert success"})
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});
app.post("/addtransaction", async (request, response) => {
  try {
     await sql.connect(config)
    const {operator_id,credit_received} = request.body;
    const sqlrequest = new sql.Request();
    sqlrequest.input('operator_id', sql.Int,operator_id);
    sqlrequest.input('credit_received', sql.Float, credit_received);
    await sqlrequest.query(`INSERT INTO Transactions (operator_id,credit_received) VALUES (@operator_id,@credit_received)`)
    response.status(200).json({message:"Insert success"})
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

///
app.post("/addoperator", async (request, response) => {
 try {
     await sql.connect(config)
    const {fname,lname,role,password,rating,category} = request.body;
    const sqlrequest = new sql.Request();
    sqlrequest.input('fname', sql.NVarChar, fname);
    sqlrequest.input('lname', sql.NVarChar, lname);
    sqlrequest.input('role', sql.NVarChar, role);
    sqlrequest.input('password', sql.NVarChar,password);
    sqlrequest.input('rating', sql.Float, rating);
     sqlrequest.input('category', sql.NVarChar, category);
    await sqlrequest.query(`INSERT INTO operators (fnames,lnames,roles,passwords,rating,category) VALUES (@fname,@lname,@role,@password,@rating,@category)`)
    response.status(200).json({message:"Insert success"})
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});
app.post("/addfixs", async (request, response) => {
 try {
     await sql.connect(config)
    const {fixs_name,fixs_detail,fixs_location,fixs_floor,fixs_status,reporter,operator,report_date } = request.body;
    const sqlrequest = new sql.Request();
    sqlrequest.input('fixs_name', sql.NVarChar,fixs_name);
    sqlrequest.input('fixs_detail', sql.NVarChar, fixs_detail);
    sqlrequest.input('fixs_location', sql.NVarChar, fixs_location);
    sqlrequest.input('fixs_floor', sql.NVarChar,fixs_floor);
    sqlrequest.input('fixs_status', sql.NVarChar, fixs_status);
    sqlrequest.input('reporter', sql.Int, reporter);
    sqlrequest.input('operator', sql.Int, operator);
    sqlrequest.input('report_date', sql.Date, report_date);
    await sqlrequest.query(`INSERT INTO fixs (fix_name,fix_detail,fix_location,fix_floor,fix_status,reporter,operator,report_date) VALUES (@fixs_name,@fixs_detail,@fixs_location,@fixs_floor,@fixs_status,@reporter,@operator,@report_date)`)
    response.status(200).json({message:"Insert success"})
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
})

////////////////////////////////////////////////////////////////update
app.put("/updatestatus", async (request, response) => {
  try {
     await sql.connect(config)
    const {id,status,finish_date} = request.body;
    const sqlrequest = new sql.Request();
    sqlrequest.input('id', sql.NVarChar, id);
    sqlrequest.input('status', sql.NVarChar, status);
    sqlrequest.input('finish_date', sql.Date, finish_date);
    await sqlrequest.query(`UPDATE fixs SET  fix_status=@status,finish_date=@finish_date WHERE fix_id=@id`)
    response.status(200).json({message:"Insert success"})
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});