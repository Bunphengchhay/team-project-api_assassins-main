# Use the Aggregation Builder to test any view you intend to create/modify. Export the pipeline you created.
# Then on mongosh, call db.createView('your view', 'your collection', 'aggregation pipeline') to create a view
# If you are updating a view, make sure to drop it first.
#
# This view depends on collections Schedule (base), Theater, and Movie.
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
        from: "Theater",
        localField: "theater",
        foreignField: "_id",
        as: "theater",
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
      "$theater",
  },
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
        from: "Movie",
        localField: "movie",
        foreignField: "_id",
        as: "movie",
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
      "$movie",
  },
  {
    $unset:
      /**
       * Provide the field name to exclude.
       * To exclude multiple fields, pass the field names in an array.
       */
      ["theater.rooms", "movie.cast"],
  },
]