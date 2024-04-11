export default function SearchRoutes(app) {
    
    // For testing, delete later
    const sampleResponse = 
    [ {
        "resource_state" : 2,
        "athlete" : {
          "id" : 134815,
          "resource_state" : 1
        },
        "name" : "Happy Friday",
        "distance" : 24931.4,
        "moving_time" : 4500,
        "elapsed_time" : 4500,
        "total_elevation_gain" : 0,
        "type" : "Ride",
        "sport_type" : "MountainBikeRide",
        "workout_type" : null,
        "id" : 154504250376823,
        "external_id" : "garmin_push_12345678987654321",
        "upload_id" : 987654321234567891234,
        "start_date" : "2018-05-02T12:15:09Z",
        "start_date_local" : "2018-05-02T05:15:09Z",
        "timezone" : "(GMT-08:00) America/Los_Angeles",
        "utc_offset" : -25200,
        "start_latlng" : null,
        "end_latlng" : null,
        "location_city" : "Boston",
        "location_state" : "Massachusetts",
        "location_country" : "United States",
        "achievement_count" : 0,
        "kudos_count" : 3,
        "comment_count" : 1,
        "athlete_count" : 1,
        "photo_count" : 0,
        "map" : {
          "id" : "a12345678987654321",
          "summary_polyline" : null,
          "resource_state" : 2
        },
        "trainer" : true,
        "commute" : false,
        "manual" : false,
        "private" : false,
        "flagged" : false,
        "gear_id" : "b12345678987654321",
        "from_accepted_tag" : false,
        "average_speed" : 5.54,
        "max_speed" : 11,
        "average_cadence" : 67.1,
        "average_watts" : 175.3,
        "weighted_average_watts" : 210,
        "kilojoules" : 788.7,
        "device_watts" : true,
        "has_heartrate" : true,
        "average_heartrate" : 140.3,
        "max_heartrate" : 178,
        "max_watts" : 406,
        "pr_count" : 0,
        "total_photo_count" : 1,
        "has_kudoed" : false,
        "suffer_score" : 82
      }, {
        "resource_state" : 2,
        "athlete" : {
          "id" : 167560,
          "resource_state" : 1
        },
        "name" : "Bondcliff",
        "distance" : 23676.5,
        "moving_time" : 5400,
        "elapsed_time" : 5400,
        "total_elevation_gain" : 0,
        "type" : "Ride",
        "sport_type" : "MountainBikeRide",
        "workout_type" : null,
        "id" : 1234567809,
        "external_id" : "garmin_push_12345678987654321",
        "upload_id" : 1234567819,
        "start_date" : "2018-04-30T12:35:51Z",
        "start_date_local" : "2018-04-30T05:35:51Z",
        "timezone" : "(GMT-08:00) America/Los_Angeles",
        "utc_offset" : -25200,
        "start_latlng" : null,
        "end_latlng" : null,
        "location_city" : null,
        "location_state" : null,
        "location_country" : "United States",
        "achievement_count" : 0,
        "kudos_count" : 4,
        "comment_count" : 0,
        "athlete_count" : 1,
        "photo_count" : 0,
        "map" : {
          "id" : "a12345689",
          "summary_polyline" : null,
          "resource_state" : 2
        },
        "trainer" : true,
        "commute" : false,
        "manual" : false,
        "private" : false,
        "flagged" : false,
        "gear_id" : "b12345678912343",
        "from_accepted_tag" : false,
        "average_speed" : 4.385,
        "max_speed" : 8.8,
        "average_cadence" : 69.8,
        "average_watts" : 200,
        "weighted_average_watts" : 214,
        "kilojoules" : 1080,
        "device_watts" : true,
        "has_heartrate" : true,
        "average_heartrate" : 152.4,
        "max_heartrate" : 183,
        "max_watts" : 403,
        "pr_count" : 0,
        "total_photo_count" : 1,
        "has_kudoed" : false,
        "suffer_score" : 162
      } ]

    const matchesParams = (activity, parameters) => {
        // Check if given attribute values are included in corresponding activity attribute values
        for (const attribute of ["name","location_city","location_state","location_country"]) {
            if (parameters[attribute] && !activity[attribute]?.toLowerCase().includes(parameters[attribute])) {
                console.log(`False for: ${attribute}`)
                console.log(parameters[attribute])
                console.log(activity[attribute])
                return false;
            }
        }
        if (parameters["sport_type"] && activity["sport_type"]?.toLowerCase() !== parameters["sport_type"]) {
            return false;
        }
        if (parameters["trainer"]) {
            const stringAsBoolean = parameters["trainer"] === "true";
            if (activity["trainer"] !== stringAsBoolean) {
                return false;
            }
        }
        if (parameters["min_distance"] && activity["distance"] < parseFloat(parameters["min_distance"])) {
            return false;
        }
        if (parameters["max_distance"] && activity["distance"] > parseFloat(parameters["max_distance"])) {
            return false;
        }
        if (parameters["date_before"] && activity["start_date"] > Date(parameters["dateBefore"])) {
            return false;
        }
        if (parameters["date_after"] && activity["start_date"] < Date(parameters["dateAfter"])) {
            return false;
        }
        return true;
    }

    app.get("/api/search", (req, res) => {
        const parameters = req.query;
        // Make API call to Strava and get all activities for current athlete
        const athleteActivities = sampleResponse;
        // Filter activities based on search term
        const searchResults = athleteActivities.filter(activity => matchesParams(activity, parameters));
        res.send(searchResults);
    });
}