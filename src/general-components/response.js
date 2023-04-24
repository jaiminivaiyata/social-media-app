module.exports.sendCommonResponse = (res, statusCode, responsePayload) => {
    const responseObject = {}

    responsePayload && responsePayload.code ? responseObject.code = responsePayload.code : 1;
    responsePayload && responsePayload.data ? responseObject.data = responsePayload.data : 1;
    responsePayload && responsePayload.message ? responseObject.message = responsePayload.message : 1;

    res.status(statusCode).send(responseObject);
};
