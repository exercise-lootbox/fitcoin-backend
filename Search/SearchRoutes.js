export default function SearchRoutes(app) {
    app.get("/api/search/:searchterm", (req, res) => {
        const { searchterm } = req.params;
        // Make API call to Strava, get all activities for current athlete, then filter out
        // results based on given searchterm.
        res.send(["testing", "search", "results", searchterm]);
    });
}