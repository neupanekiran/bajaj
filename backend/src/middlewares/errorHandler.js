// errorHandler.js for handling errors globally in the Express app
const errorHandler = (err, req, res, next) => {
    
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
    }
    
 
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;