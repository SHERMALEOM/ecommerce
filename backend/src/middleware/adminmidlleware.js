    const isAdmin = (req, res, next) => {
    try {

        // check if user exists from verifyToken middleware
        if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
        }

        // check if user role is admin
        if (req.user.role !== "admin") {
         console.log("USER:", req.user);
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only"
            
        });
        }


        // allow request
        next();

    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Server error"
        });
    }
    };

    export default isAdmin;