# Filters out past schedules. Depends on collection Schedule (base).
[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        dateTime: {
          $gt: "$currentDate",
        },
      },
  },
]