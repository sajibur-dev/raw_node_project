const { hash, parseJson, createRandomStr } = require("../helper/utl");
const { read, create, update, remove } = require("../lib/data");
const { _token } = require("./tokenRouteController");

const controller = {};

controller.checksRouteController = (requestedPropereties, callback) => {
  const expectedMethod = ["get", "post", "put", "delete"];
  if (expectedMethod.includes(requestedPropereties.method)) {
    controller._checks[requestedPropereties.method](
      requestedPropereties,
      callback
    );
  } else {
    callback(405, {
      msg: "method not allowed",
    });
  }
};

controller._checks = {};

// post method

controller._checks.post = (requestedPropereties, callback) => {
  const expectedProtocol = ["http", "https"];
  const exectedMethod = ["get", "post", "put", "delete"];

  const protocol =
    typeof requestedPropereties.body.protocol === "string" &&
    expectedProtocol.includes(requestedPropereties.body.protocol)
      ? requestedPropereties.body.protocol
      : false;

  const method =
    typeof requestedPropereties.body.method === "string" &&
    exectedMethod.includes(requestedPropereties.body.method)
      ? requestedPropereties.body.method
      : false;

  const url =
    typeof requestedPropereties.body.url === "string" &&
    requestedPropereties.body.url.trim().length > 0
      ? requestedPropereties.body.url
      : false;

  const successCode =
    typeof requestedPropereties.body.successCode === "object" &&
    requestedPropereties.body.successCode instanceof Array
      ? requestedPropereties.body.successCode
      : false;

  const timeOutSeconds =
    typeof requestedPropereties.body.timeOutSeconds === "number" &&
    requestedPropereties.body.timeOutSeconds % 1 === 0 &&
    requestedPropereties.body.timeOutSeconds >= 1 &&
    requestedPropereties.body.timeOutSeconds <= 5
      ? requestedPropereties.body.timeOutSeconds
      : false;

  const tokenId =
    typeof requestedPropereties.headers.tokenid === "string" &&
    requestedPropereties.headers.tokenid.trim().length === 20
      ? requestedPropereties.headers.tokenid
      : false;

  if (protocol && method && url && successCode && timeOutSeconds) {
    if (tokenId) {
      read("tokens", tokenId, (err, data) => {
        if (!err && data) {
          const tokenPhone = { ...parseJson(data) }.phone;
          read("users", tokenPhone, (err, data) => {
            const user = { ...parseJson(data) };
            const userPhone = user.phone;
            _token.verify(tokenId, userPhone, (isVarified) => {
              if (isVarified) {
                const userChecks =
                  typeof user.checks === "object" &&
                  user.checks instanceof Array
                    ? user.checks
                    : [];
                if (userChecks.length < 5) {
                  const checksId = createRandomStr(20);
                  const checksObj = {
                    id: checksId,
                    phone: userPhone,
                    protocol,
                    method,
                    url,
                    successCode,
                    timeOutSeconds,
                  };

                  create("checks", checksId, checksObj, (err) => {
                    if (!err) {
                      user.checks = userChecks;
                      user.checks.push(checksId);
                      update("users", userPhone, user, (err) => {
                        if (!err) {
                          callback(200, checksObj);
                        } else {
                          callback(500, {
                            error: "user updated error",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "checks does not created",
                      });
                    }
                  });
                } else {
                  callback(500, {
                    error: "you can not add checks",
                  });
                }
              } else {
                callback(403, {
                  error: "forbidden",
                });
              }
            });
          });
        } else {
          callback(404, {
            error: "token not found",
          });
        }
      });
    } else {
      callback(401, {
        error: "unauthorize",
      });
    }
  } else {
    callback(405, {
      error: "bad request",
    });
  }
};

// get method

controller._checks.get = (requestedPropereties, callback) => {
  const checksId =
    typeof requestedPropereties.query.checksId === "string" &&
    requestedPropereties.query.checksId.trim().length === 20
      ? requestedPropereties.query.checksId
      : false;

  const tokenId =
    typeof requestedPropereties.headers.tokenid === "string" &&
    requestedPropereties.headers.tokenid.trim().length === 20
      ? requestedPropereties.headers.tokenid
      : false;

  if (checksId) {
    if (tokenId) {
      read("checks", checksId, (err, data) => {
        if (!err && data) {
          const checks = { ...parseJson(data) };
          const checksPhone = checks.phone;
          _token.verify(tokenId, checksPhone, (isVarified) => {
            if (isVarified) {
              callback(200, checks);
            } else {
              callback(403, {
                error: "forbidden",
              });
            }
          });
        } else {
          callback(404, {
            error: "checks not found",
          });
        }
      });
    } else {
      callback(401, {
        error: "unauthorize",
      });
    }
  } else {
    callback(405, {
      error: "bad request",
    });
  }
};

// put method

controller._checks.put = (requestedPropereties, callback) => {
  const expectedProtocol = ["http", "https"];
  const exectedMethod = ["get", "post", "put", "delete"];

  const checksId =
    typeof requestedPropereties.query.checksId === "string" &&
    requestedPropereties.query.checksId.trim().length === 20
      ? requestedPropereties.query.checksId
      : false;

  const protocol =
    typeof requestedPropereties.body.protocol === "string" &&
    expectedProtocol.includes(requestedPropereties.body.protocol)
      ? requestedPropereties.body.protocol
      : false;

  const method =
    typeof requestedPropereties.body.method === "string" &&
    exectedMethod.includes(requestedPropereties.body.method)
      ? requestedPropereties.body.method
      : false;

  const url =
    typeof requestedPropereties.body.url === "string" &&
    requestedPropereties.body.url.trim().length > 0
      ? requestedPropereties.body.url
      : false;

  const successCode =
    typeof requestedPropereties.body.successCode === "object" &&
    requestedPropereties.body.successCode instanceof Array
      ? requestedPropereties.body.successCode
      : false;

  const timeOutSeconds =
    typeof requestedPropereties.body.timeOutSeconds === "number" &&
    requestedPropereties.body.timeOutSeconds % 1 === 0 &&
    requestedPropereties.body.timeOutSeconds >= 1 &&
    requestedPropereties.body.timeOutSeconds <= 5
      ? requestedPropereties.body.timeOutSeconds
      : false;

  const tokenId =
    typeof requestedPropereties.headers.tokenid === "string" &&
    requestedPropereties.headers.tokenid.trim().length === 20
      ? requestedPropereties.headers.tokenid
      : false;

  if (checksId) {
    if (protocol || method || url || successCode || timeOutSeconds) {
      read("checks", checksId, (err, data) => {
        if (!err && data) {
          const checks = { ...parseJson(data) };
          const checksPhone = checks.phone;
          _token.verify(tokenId, checksPhone, (isVarified) => {
            if (isVarified) {
              if (protocol) {
                checks.protocol = protocol;
              }
              if (method) {
                checks.method = method;
              }
              if (url) {
                checks.url = url;
              }
              if (successCode) {
                checks.successCode = successCode;
              }
              if (timeOutSeconds) {
                checks.timeOutSeconds = timeOutSeconds;
              }

              update("checks", checksId, checks, (err) => {
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
              callback(403, {
                error: "forbidden",
              });
            }
          });
        } else {
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

controller._checks.delete = (requestedPropereties, callback) => {
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
        callback(403, {
          error: "forbidden",
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
