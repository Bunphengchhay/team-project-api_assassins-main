# Use the Aggregation Builder to test any view you intend to create/modify. Export the pipeline you created.
# Then on mongosh, call db.createView('your view', 'your collection', 'aggregation pipeline') to create a view
# If you are updating a view, make sure to drop it first.
#
# This view depends on collections Booking (base) and ScheduleView (view).
[
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "ScheduleView",
        localField: "moviePass.movieScreening",
        foreignField: "_id",
        as: "movieScreening",
      },
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$movieScreening",
        preserveNullAndEmptyArrays: true,
      },
  },
  {
    $set:
      /**
       * field: The field name
       * expression: The expression.
       */
      {
        moviePass: {
          $cond: {
            if: {
              $gt: ["$moviePass", undefined],
            },
            then: {
              $mergeObjects: [
                "$moviePass",
                {
                  movieScreening:
                    "$movieScreening",
                },
              ],
            },
            else: "$$REMOVE",
          },
        },
        movieScreening: "$$REMOVE",
      },
  },
]