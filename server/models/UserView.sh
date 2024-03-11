# Includes a list of all bookings for each user. Depends on User (base) and BookingView (view).
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
        from: "BookingView",
        localField: "_id",
        foreignField: "buyerId",
        as: "bookings",
      },
  },
  {
    $unset:
      /**
       * Provide the field name to exclude.
       * To exclude multiple fields, pass the field names in an array.
       */
      "bookings.buyerId",
  },
]