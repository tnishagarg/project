var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
let app = express();
app.listen(2024, function () {
    console.log("server started(2024):");
})
app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());
// let config = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "Tni#1607sha@garg",
//     database: "project",
//     dateStrings: true
// }
let config = {
    host: "bmirvdrfrmu1yyxmeswf-mysql.services.clever-cloud.com",
    user: "upkgzupmwru4uwnk",
    password: "7ERSUE2LXJJgzmaOBWA5",
    database: "bmirvdrfrmu1yyxmeswf",
    dateStrings: true,
    keepAliveInitialDelay:10000,
    enableKeepAlive:true,
}
var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("Connected To Database Successfulllyyyy");
    else
        console.log(err.message + "  ########");

})
app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);

})
app.get("/signup-process", function (req, resp) {

    //console.log(req.query);
    mysql.query("insert into users values(?,?,?,?)", [req.query.txtemail, req.query.txtpwd, req.query.txtutype, 1], function (err) {
        if (err == null) {
            var to = req.query.txtemail;
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                port: 465,
                auth: {
                    user: 'tgarg1607@gmail.com',
                    pass: "fmpr lrpw pgbw ogxb",
                }
            });

            var mailOptions = {
                from: 'tgarg1607@gmail.com',
                to: to,
                subject: 'Welcome',
                text: "Welcome to Connectra!! Thanks for signing up..",
            };

            transporter.sendMail(mailOptions, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ');
                }
            });
            resp.send("Signed up successfully");
            //console.log(result);
        }
        else
            resp.send(err.message);
    })

})

app.get("/login-process", function (req, resp) {
    //console.log(req.query);
    mysql.query("select * from users where email=? and pwd=?", [req.query.txtemaill, req.query.txtpwdd], function (err, result) {
        //console.log(result[0]);
        if (err != null) {
            resp.send(err.message); return;
        }
        if (result.length == 0) {
            resp.send("invalid id or password"); return;
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype); return;
        }
        else {
            resp.send("You are blocked!!");
            return;
        }
    })

})

app.get("/infl-dash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);
})
app.post("/infl-save-process", function (req, resp) {

    let filename = "";
    let fields = req.body.fields;
    if (req.files != null) {
        filename = req.files.pic.name;
        let path = __dirname + "/public/uploads/" + filename;
        req.files.pic.mv(path);
    }
    else
        filename = "nopic.jpg";
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.email, req.body.txtname, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.contact, fields.toString(), req.body.insta, req.body.fb, req.body.youtube, req.body.other, filename], function (err) {

        if (err == null)
            resp.redirect("inflsaved.html");
        else
            resp.send(err.message);
    })

})

app.post("/infl-update-process", function (req, resp) {

    let filename = "";
    //let fields=req.body.fields;
    if (req.files != null) {
        filename = req.files.pic.name;
        let path = __dirname + "/public/uploads/" + filename;
        req.files.pic.mv(path);
    }
    else { filename = req.body.hdn; }
    mysql.query("update iprofile set name=?,gender=?,dob=?,address=?,city=?,contact=?,fields=?,insta=?,fb=?,youtube=?,others=?,picpath=? where emailid=?", [req.body.txtname, req.body.gender, req.body.dob, req.body.address, req.body.city, req.body.contact, req.body.fields.toString(), req.body.insta, req.body.fb, req.body.youtube, req.body.other, filename, req.body.email], function (err, result) {

        if (err == null) {
            if (result.affectedRows >= 1)
                resp.redirect("influpdate.html");
            else
                resp.send("Invalid email id");
        }
        else
            resp.send(err.message);
    })

})

app.get("/inf-profile", function (req, resp) {
    let path = __dirname + "/public/inf-profile.html";
    resp.sendFile(path);
})
app.get("/find-details", function (req, resp) {
    let email = req.query.email;
    mysql.query("select * from iprofile where emailid=?", [email], function (err, jsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(jsonAry);
        resp.send(jsonAry);
    })


})
app.get("/postevent", function (req, resp) {
    //console.log(req.query);
    mysql.query("insert into events values(null,?,?,?,?,?,?)", [req.query.txtemail, req.query.txtevent, req.query.txtdate, req.query.txttime, req.query.txtcity, req.query.txtvenue], function (err) {
        if (err == null)
            resp.send("event posted");
        else
            resp.send(err.message);
    })
})
app.get("/mailsend", function (req, resp) {

    mysql.query("select pwd from users where email=?", [req.query.txtemaill], function (err, result) {
        if (err != null)
            resp.send(err.message);
        else {
            var nodemailer = require('nodemailer');
            var to = req.query.txtemaill;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                port: 465,
                auth: {
                    user: 'tgarg1607@gmail.com',
                    pass: "fmpr lrpw pgbw ogxb",
                }
            });

            var mailOptions = {
                from: 'tgarg1607@gmail.com',
                to: to,
                subject: 'Forgot password?',
                text: "your password is " + result[0].pwd,
            };

            transporter.sendMail(mailOptions, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ');
                }
            });
            resp.send(result);
            //console.log(result);
        }
    })
})

app.get("/updatepassword", function (req, resp) {
    if (req.query.pwdnew != req.query.pwdrepeat) {
        resp.send("New and repeat password doesn't match");
        return;
    }

    mysql.query("update users set pwd=? where email=? and pwd=?", [req.query.pwdnew, req.query.txtemaill, req.query.pwdold], function (err, result) {

        if (err == null) {
            if (result.affectedRows >= 1)
                resp.send("Password updated");
            else
                resp.send("Invalid email or old password");
        }
        else
            resp.send(err.message);
    })

})
app.get("/admintnisha123", function (req, resp) {
    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
})
app.get("/adminusers", function (req, resp) {
    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);
})
app.get("/fetch-users", function (req, resp) {
    mysql.query("Select email,utype,status from users", function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})
app.get("/del", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted");
    })
});
app.get("/block", function (req, resp) {
    mysql.query("update users set status=0 where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.messsage);
            return;
        }
        resp.send("Blocked");
    })
})
app.get("/resume", function (req, resp) {
    mysql.query("update users set status=1 where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.messsage);
            return;
        }
        resp.send("Resumed");
    })
})
app.get("/adminallinflu", function (req, resp) {
    let path = __dirname + "/public/admin-all-influ.html";
    resp.sendFile(path);
})
app.get("/show-all-influ", function (req, resp) {
    mysql.query("Select emailid,name,city,contact,fields,picpath from iprofile", function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})
app.get("/influ-finder", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
})
app.get("/show-cities", function (req, resp) {
    let fields = "%" + req.query.fields + "%";

    mysql.query("select distinct city from iprofile where fields like ?", [fields], function (err, result) {

        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
});
app.get("/show-all-cities", function (req, resp) {
    mysql.query("select distinct city from iprofile", function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);

    })
});
app.get("/find1", function (req, resp) {

    let fields = "%" + req.query.fields + "%";
    mysql.query("select * from iprofile where fields like ? and city = ?", [fields, req.query.city], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
        //console.log(result);
    })
})
app.get("/find2", function (req, resp) {
    let name = req.query.name;
    mysql.query("select * from iprofile where name=?", [name], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(result);
    })
})
app.get("/event-manager", function (req, resp) {
    let path = __dirname + "/public/event-manager.html";
    resp.sendFile(path);
})
app.get("/get-events", function (req, resp) {
    mysql.query("select * from events where emailid=? and doe>=current_date ", [req.query.emailid], function (err, result) {
        if (err != null) {
            resp.send(err.message)
            return;
        }
        //console.log(req.query.emailid);
        resp.send(result);
       
    })
})
app.get("/delevent", function (req, resp) {
    mysql.query("delete from events where rid=?", [req.query.rid], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted");
    })
})
app.get("/client-profile", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})
app.get("/find-cdetails", function (req, resp) {
    let email = req.query.email;
    mysql.query("select * from cprofile where email=?", [email], function (err, jsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(jsonAry);
        resp.send(jsonAry);
    })


})
app.post("/client-save-process", function (req, resp) {

    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [req.body.email, req.body.txtname,req.body.txtcity,req.body.txtstate, req.body.org,req.body.contact], function (err) {

        if (err == null)
            resp.redirect("clientsave.html");
        else
            resp.send(err.message);
    })

})

app.post("/client-update-process", function (req, resp) {

    
    mysql.query("update cprofile set name=?,city=?,state=?,org=?,mobile=? where email=?", [req.body.txtname,req.body.txtcity,req.body.txtstate, req.body.org,req.body.contact,req.body.email], function (err, result) {

        if (err == null) {
            if (result.affectedRows >= 1)
                resp.redirect("client-update.html");
            else
                resp.send("Invalid email id");
        }
        else
            resp.send(err.message);
    })

})
app.get("/infldash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);

})
app.get("/clientdash", function (req, resp) {
    let path = __dirname + "/public/client-dash.html";
    resp.sendFile(path);

})
app.get("/check-client-acc",function(req,resp){
    let cemail=req.query.email;
    mysql.query("select * from cprofile where email=?",[cemail],function(err,result){
        if(err){
            resp.send(err.message);
        }
        else
        resp.send(result);
    })
})
app.get("/check-infl-acc",function(req,resp){
    let iemail=req.query.email;
    mysql.query("select * from iprofile where emailid=?",[iemail],function(err,result){
        if(err){
            resp.send(err.message);
        }
        else
        resp.send(result);
    })
})