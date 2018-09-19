var appRouter = function (app) {
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }
  
  module.exports = appRouter;