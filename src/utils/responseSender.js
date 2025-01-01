const sendResponse = (res, statusCode, data = null, message = "") => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        statusCode,
        message:
            message ||
            (statusCode >= 200 && statusCode < 300
                ? "Request was successful"
                : "An error occurred"),
        data: data ? data : undefined,
    };

    res.status(statusCode).json(response);
};

module.exports = sendResponse;
