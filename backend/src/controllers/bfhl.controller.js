// bfhl.controller.js for handling the /bfhl endpoint logic
const { processGraphData } = require('../services/bfhl.service');
const handleBfhlRequest = (req, res, next) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input format" });
        }

       
        const result = processGraphData(data);

        
        res.status(200).json({
            user_id: process.env.USER_ID || "err from env",
            email_id: process.env.EMAIL_ID || "err from env",
            college_roll_number: process.env.COLLEGE_ROLL_NUMBER || "err from env",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleBfhlRequest
};