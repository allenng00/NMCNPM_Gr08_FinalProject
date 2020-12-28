exports.renderIndex = (req, res, next) => {
    res.render('./index', { title: 'Home' });
};