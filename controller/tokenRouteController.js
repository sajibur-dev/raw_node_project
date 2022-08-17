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
          const expires = Date.now() + 60 * 60 * 1000;
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
        callback(404, {
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

controller._token.put = (requestedPropereties, callback) => {
  const tokenId =
    typeof requestedPropereties.query.tokenId === "string" &&
    requestedPropereties.query.tokenId.trim().length === 20
      ? requestedPropereties.query.tokenId
      : false;

  const extend = !!(typeof requestedPropereties.body.extend === "boolean");

  if (tokenId && extend) {
    read("tokens", tokenId, (err, data) => {
      if (!err) {
        const token = { ...parseJson(data) };
        if (token.expires > Date.now()) {
          token.expires = Date.now() + 60 * 60 * 1000;
          update("tokens", tokenId, token, (err) => {
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
          remove("tokens", tokenId, (err) => {
            if (!err) {
              callback(401, {
                erro: "unautorize",
              });
            } else {
              callback(500, {
                error: "server side error",
              });
            }
          });
        }
      } else {
        callback(404, {
          error: "token is not availble",
        });
      }
    });
  } else {
    callback(400, {
      error: "bad request",
    });
  }
};

// delete method

controller._token.delete = (requestedPropereties, callback) => {
  const tokenId =
    typeof requestedPropereties.query.tokenId === "string" &&
    requestedPropereties.query.tokenId.trim().length === 20
      ? requestedPropereties.query.tokenId
      : false;

  if (tokenId) {
    read("tokens", tokenId, (err, data) => {
      if (!err) {
        const token = { ...parseJson(data) };
        if (!(token.expires > Date.now())) {
          remove("tokens", tokenId, (err) => {
            if (!err) {
              callback(200, {
                msg: "deleted is successfull",
              });
            } else {
              callback(500, {
                error: "delteing error",
              });
            }
          });
        } else {
          callback(409, {
            error: "delete is not allowed.because token is valid",
          });
        }
      } else {
        callback(500, {
          error: "token is not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "bad request",
    });
  }
};

// verify token

controller._token.verify = (id, phone, callback) => {
  if (id && phone) {
    read("tokens", id, (err, data) => {
      if (!err && data) {
        const token = { ...parseJson(data) };
        const tokenPhone = token.phone;
        const expires = token.expires;
        if (tokenPhone === phone && expires > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

module.exports = controller;
