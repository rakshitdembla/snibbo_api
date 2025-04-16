export const serverError = (res, e) => {
    res.status(500).json({
        success: false,
        message: 'Oops! Something went wrong.',
        error: e.toString()
    });
};
