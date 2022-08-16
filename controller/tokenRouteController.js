const { hash, parseJson, createRandomStr } = require("../helper/utl");
const { read, create, update, remove } = require("../lib/data");

const controller = {};

controller.tokenRouteController = (requestedPropereties, callback) => {
  const expectedMethod = ["get", "post", "put", "delete"];
  if (expectedMethod.includes(requestedPropereties.method)) {
    controller._token[requestedPropereties.method](
      requestedPropereties,
      callback
    );
  } else {
    callback(405, {
      msg: "method not allowed",
    });
  }
};

controller._token = {};

// post method

controller._token.post = (requestedPropereties, callback) => {
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

  if (phone && password) {
    read("users", phone, (err, data) => {
      if (!err && data) {
        const user = { ...parseJson(data) };
        const userPassword = user.password;
        const givenPassword = hash(password);
        if (userPassword === givenPassword) {
          const tokenId = createRandomStr(20);
          const expires = Date.now() * 60 * 60 * 1000;
          const tokenObj = {
            id: tokenId,
            phone,
            expires,
          };

          create("tokens", tokenId, tokenObj, (err) => {
            if (!err) {
              callback(200, tokenObj);
            } else {
              callback(500, {
                error: "server side error",
              });
            }
          });
        } else {
          callback(401, {
            error: "unauthorize",
          });
        }
      } else {
        callback(204, {
          error: "user not found",
        });
      }
    });
  } else {
    callback(405, {
      error: "bad request",
    });
  }
};

// get method

controller._token.get = (requestedPropereties, callback) => {
  const tokenId =
    typeof requestedPropereties.query.tokenId === "string" &&
    requestedPropereties.query.tokenId.trim().length === 20
      ? requestedPropereties.query.tokenId
      : false;

  if (tokenId) {
    read("tokens", tokenId, (err, data) => {
      if (!err && data) {
        const token = { ...parseJson(data) };
        callback(200, {
          data: token,
        });
      } else {
        callback(500, {
          msg: "token not found",
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

controller._token.put = (requestedPropereties, callback) => {};

// delete method

controller._token.delete = (requestedPropereties, callback) => {};

module.exports = controller;
