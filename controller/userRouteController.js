const { hash, parseJson } = require("../helper/utl");
const { read, create, update, remove } = require("../lib/data");
const tokenController = require("./tokenRouteController");

const controller = {};

controller.userRouteController = (requestedPropereties, callback) => {
  const expectedMethod = ["get", "post", "put", "delete"];
  if (expectedMethod.includes(requestedPropereties.method)) {
    controller._user[requestedPropereties.method](
      requestedPropereties,
      callback
    );
  } else {
    callback(405, {
      msg: "method not allowed",
    });
  }
};

controller._user = {};

// post method

controller._user.post = (requestedPropereties, callback) => {
  const firstName =
    typeof requestedPropereties.body.firstName === "string" &&
    requestedPropereties.body.firstName.trim().length > 0
      ? requestedPropereties.body.firstName
      : false;

  const lastName =
    typeof requestedPropereties.body.lastName === "string" &&
    requestedPropereties.body.lastName.trim().length > 0
      ? requestedPropereties.body.lastName
      : false;

  const phone =
    typeof requestedPropereties.body.phone === "string" &&
    requestedPropereties.body.phone.trim().length === 11
      ? requestedPropereties.body.phone
      : false;

  const password =
    typeof requestedPropereties.body.password === "string" &&
    requestedPropereties.body.password.trim().length > 0
      ? requestedPropereties.body.password
      : false;

  const tosAgreement =
    typeof requestedPropereties.body.tosAgreement === "boolean"
      ? requestedPropereties.body.tosAgreement
      : false;

  const savedUser = {
    firstName,
    lastName,
    phone,
    password: hash(password),
    tosAgreement,
  };

  if (firstName && lastName && phone && password && tosAgreement) {
    create("users", phone, savedUser, (err) => {
      if (!err) {
        callback(200, {
          msg: "data saved is successfull",
        });
      } else {
        callback(500, {
          error: "file already exist",
        });
      }
    });
  } else {
    callback(400, {
      msg: "bad requeset",
    });
  }
};

// get method

controller._user.get = (requestedPropereties, callback) => {
  const phone =
    typeof requestedPropereties.query.phone === "string" &&
    requestedPropereties.query.phone.trim().length === 11
      ? requestedPropereties.query.phone
      : false;
  const tokenId =
    typeof requestedPropereties.headers.tokenid === "string" &&
    requestedPropereties.headers.tokenid.trim().length === 20
      ? requestedPropereties.headers.tokenid
      : false;

  if (phone) {
    tokenController._token.verify(tokenId, phone, (isVarified) => {
      if (isVarified) {
        read("users", phone, (err, data) => {
          if (!err && data) {
            const user = { ...parseJson(data) };
            delete user.password;
            callback(200, {
              data: user,
            });
          } else {
            callback(500, {
              msg: "user not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "forbidden",
        });
      }
    });
  } else {
    callback(400, {
      msg: "bad request",
    });
  }
};

// put method

controller._user.put = (requestedPropereties, callback) => {
  const phone =
    typeof requestedPropereties.query.phone === "string" &&
    requestedPropereties.query.phone.trim().length === 11
      ? requestedPropereties.query.phone
      : false;

  const firstName =
    typeof requestedPropereties.body.firstName === "string" &&
    requestedPropereties.body.firstName.trim().length > 0
      ? requestedPropereties.body.firstName
      : false;

  const lastName =
    typeof requestedPropereties.body.lastName === "string" &&
    requestedPropereties.body.lastName.trim().length > 0
      ? requestedPropereties.body.lastName
      : false;

  const password =
    typeof requestedPropereties.body.password === "string" &&
    requestedPropereties.body.password.trim().length > 0
      ? requestedPropereties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      read("users", phone, (err, data) => {
        const user = { ...parseJson(data) };
        if (!err && data) {
          if (firstName) {
            user.firstName = firstName;
          }
          if (lastName) {
            user.lastName = lastName;
          }
          if (password) {
            user.password = hash(password);
          }

          update("users", phone, user, (err) => {
            if (!err) {
              callback(200, {
                msg: "updated successfull",
              });
            } else {
              callback(500, {
                error: "server side error",
              });
            }
          });
        } else {
          callback(500, {
            msg: "file does not exist",
          });
        }
      });
    } else {
      callback(400, {
        msg: "bad request",
      });
    }
  } else {
    callback(400, {
      msg: "bad request",
    });
  }
};

// delete method

controller._user.delete = (requestedPropereties, callback) => {
  const phone =
    typeof requestedPropereties.query.phone === "string" &&
    requestedPropereties.query.phone.trim().length === 11
      ? requestedPropereties.query.phone
      : false;

  if (phone) {
    remove("users", phone, (err) => {
      if (!err) {
        callback(200, {
          msg: "user delete is successfull",
        });
      } else {
        callback(500, {
          error: "server side error",
        });
      }
    });
  } else {
    callback(400, {
      error: "bad request",
    });
  }
};

module.exports = controller;
