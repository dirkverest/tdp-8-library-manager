const createError = require('http-errors');

function fourOhFourError(req, res, next) {
    next(createError(404, "We couldn't find the page you were looking for."));
}

function globalError(err, req, res, next) {
    // set locals, only providing error in development
    console.log("ERROR STATUS ===== " + err);

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    if (err.status === 404) {
        err.name = "Page Not Found";
        res.render('page-not-found', {error: err});
    } else if (err.status === 500){
        err.name = "Server Error";
        res.render('error', {error: err});
    } else {
        res.render('error', {error: err});
    }
  }

  module.exports = {fourOhFourError, globalError};