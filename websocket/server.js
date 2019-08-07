var app = require("express")();
var mysql = require("mysql");
var http = require("http").Server(app);
var io = require("socket.io")(http);
const dotenv = require("dotenv");
dotenv.config({ path: '../api/.env'});

/* Creating POOL MySQL connection.*/
var pool = mysql.createPool({
  connectionLimit: 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  debug: process.env.APP_DEBUG
});
/*  This is auto initiated event when Client connects to Your Machine.  */
io.on("connection", function(socket) {  
  socket.on("get_total_users", function() {
    getTotalUsers(function(res) {
      if (res) {
        console.log("total users count from socket event callback getTotalUsers() : " + formatNumber(res));
        io.emit("update_user_count", formatNumber(res));
      } else {
        io.emit("error");
      }
    });
  });

  socket.on("get_total_sticky_reviews", function() {
    getTotalStickyReviews(function(res) {
      if (res) {
        io.emit("update_sticky_reviews_count", formatNumber(res));
      } else {
        io.emit("error");
      }
    });
  });

  socket.on("get_total_reviews_from_review_link", function() {
    getTotalReviewsFromReviewLink(function(res) {
      if (res) {
        io.emit("update_reviews_from_review_link_count", formatNumber(res));
      } else {
        io.emit("error");
      }
    });
  });

  socket.on("get_total_subscribed_emails", function() {
    getTotalSubscribedEmails(function(res) {
      if (res) {
        io.emit("update_subscribed_email_count", formatNumber(res));
      } else {
        io.emit("error");
      }
    });
  });
});

// function to format a number using comma
var formatNumber = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

var getTotalUsers = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      callback(false);
      return;
    }
    connection.query(
      "SELECT count(*) as `total` FROM users WHERE deleted_at IS NULL",
      function(err, rows) {
        var count = 0;
        var string = JSON.stringify(rows);
        var json = JSON.parse(string);
        connection.release();
        if (!err) {
          if (json.length) {
            count = json[0].total;
            console.log("total user count is : " + count);
          }
          callback(count);
        }
      }
    );
    connection.on("error", function() {
      return;
    });
  });
};

var getTotalStickyReviews = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      return;
    }
    connection.query(
      "SELECT count(*) as `total` FROM sticky_reviews WHERE deleted_at IS NULL",
      function(err, rows) {
        var count = 0;
        var string = JSON.stringify(rows);
        var json = JSON.parse(string);
        connection.release();
        if (!err) {
          if (json.length) {
            count = json[0].total;
          }
          callback(count);
        }
      }
    );
    connection.on("error", function() {
      return;
    });
  });
};

var getTotalReviewsFromReviewLink = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      return;
    }
    connection.query(
      "SELECT count(*) as `total` FROM sticky_reviews WHERE review_link_id IS NOT NULL AND deleted_at IS NULL",
      function(err, rows) {
        var count = 0;
        var string = JSON.stringify(rows);
        var json = JSON.parse(string);
        connection.release();
        if (!err) {
          if (json.length) {
            count = json[0].total;
          }
          callback(count);
        }
      }
    );
    connection.on("error", function() {
      return;
    });
  });
};

var getTotalSubscribedEmails = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      return;
    }
    connection.query(
      "SELECT count(*) as `total` FROM subscribed_emails",
      function(err, rows) {
        var count = 0;
        var string = JSON.stringify(rows);
        var json = JSON.parse(string);
        connection.release();
        if (!err) {
          if (json.length) {
            count = json[0].total;
          }
          callback(count);
        }
      }
    );
    connection.on("error", function() {
      return;
    });
  });
};

// lift the node server on port 3000
// http.listen(process.env.PORT, function() {
//   console.log("Listening on " + process.env.PORT);
// });

http.listen(3000, function() {
  console.log("Listening on 3000");
});

app.get('/api/v1/update-user-count', (req, res) => {
  getTotalUsers(function(res) {
    if (res) {
      console.log("total users count from socket event callback getTotalUsers() : " + formatNumber(res));
      io.emit("update_user_count", formatNumber(res));
    } else {
      io.emit("error");
    }
  });
  res.status(200).send({
    success: true,
    message: 'Total count has been updated successfully',
  })
});

app.get('/api/v1/update-sticky-reviews-count', (req, res) => {
  getTotalStickyReviews(function(res) {
    if (res) {
      io.emit("update_sticky_reviews_count", formatNumber(res));
    } else {
      io.emit("error");
    }
  });
  res.status(200).send({
    success: true,
    message: 'Total count has been updated successfully',
  })
});

app.get('/api/v1/update-reviews-from-review-link-count', (req, res) => {
  getTotalReviewsFromReviewLink(function(res) {
    if (res) {
      io.emit("update_reviews_from_review_link_count", formatNumber(res));
    } else {
      io.emit("error");
    }
  });
  getTotalStickyReviews(function(res) {
    if (res) {
      io.emit("update_sticky_reviews_count", formatNumber(res));
    } else {
      io.emit("error");
    }
  });
  res.status(200).send({
    success: true,
    message: 'Total count has been updated successfully',
  })
});

app.get('/api/v1/update-subscribed-emails-count', (req, res) => {
  getTotalSubscribedEmails(function(res) {
    if (res) {
      io.emit("update_subscribed_email_count", formatNumber(res));
    } else {
      io.emit("error");
    }
  });
  res.status(200).send({
    success: true,
    message: 'Total count has been updated successfully',
  })
});