exports.check = (req, res) => {
    const Username = req.body.textUsername;
    const Password = req.body.textPassword;
    if (Username == "admin" && Password == "123") {
        return 1;
    } else {
        return 0;
    }
}