let requestCount = 0;

const requestCounter = (req, res, next) => {
    requestCount++;
    console.log(`Total login requests received: ${requestCount}`);
    next();
};

module.exports = requestCounter;
