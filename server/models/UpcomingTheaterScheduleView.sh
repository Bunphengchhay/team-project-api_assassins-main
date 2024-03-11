# Use the Aggregation Builder to test any view you intend to create/modify. Export the pipeline you created.
# Then on mongosh, call db.createView('your view', 'your collection', 'aggregation pipeline') to create a view
# If you are updating a view, make sure to drop it first.

# Returns a list of theaters, with information regarding upcoming movie showings included.
# Depends on collections Theater (base), UpcomingScheduleView (view), Movie, and Booking.
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
        from: "UpcomingScheduleView",
        localField: "_id",
        foreignField: "theater",
        as: "schedule",
      },
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
        localField: "schedule.movie",
        foreignField: "_id",
        as: "movies",
      },
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
        from: "Booking",
        localField: "schedule._id",
        foreignField: "moviePass.movieScreening",
        as: "bookings",
      },
  },
  {
    $set:
      /**
       * field: The field name
       * expression: The expression.
       */
      {
        movies: {
          $reduce: {
            input: "$movies",
            initialValue: [],
            in: {
              $concatArrays: [
                "$$value",
                [
                  {
                    _id: "$$this._id",
                    title: "$$this.title",
                    genre: "$$this.genre",
                    year: "$$this.year",
                    cast: "$$this.cast",
                    runtime: "$$this.runtime",
                    trailer: "$$this.trailer",
                    poster: "$$this.poster",
                    schedule: {
                      $getField: {
                        field: "result",
                        input: {
                          $reduce: {
                            input: "$schedule",
                            initialValue: {
                              movieId:
                                "$$this._id",
                              result: [],
                            },
                            in: {
                              movieId:
                                "$$value.movieId",
                              result: {
                                $cond: {
                                  if: {
                                    $eq: [
                                      "$$this.movie",
                                      "$$value.movieId",
                                    ],
                                  },
                                  then: {
                                    $concatArrays:
                                      [
                                        "$$value.result",
                                        [
                                          {
                                            _id: "$$this._id",
                                            room: {
                                              $getField:
                                                {
                                                  field:
                                                    "result",
                                                  input:
                                                    {
                                                      $reduce:
                                                        {
                                                          input:
                                                            "$rooms",
                                                          initialValue:
                                                            {
                                                              scheduleId:
                                                                "$$this._id",
                                                              result:
                                                                "$$this.room",
                                                            },
                                                          in: {
                                                            scheduleId:
                                                              "$$value.scheduleId",
                                                            result:
                                                              {
                                                                $cond:
                                                                  {
                                                                    if: {
                                                                      $eq: [
                                                                        "$$value.result",
                                                                        "$$this.name",
                                                                      ],
                                                                    },
                                                                    then: {
                                                                      name: "$$this.name",
                                                                      seat_count:
                                                                        "$$this.seat_count",
                                                                      seats:
                                                                        {
                                                                          $getField:
                                                                            {
                                                                              field:
                                                                                "result",
                                                                              input:
                                                                                {
                                                                                  $reduce:
                                                                                    {
                                                                                      input:
                                                                                        {
                                                                                          $objectToArray:
                                                                                            "$$this.seats",
                                                                                        },
                                                                                      initialValue:
                                                                                        {
                                                                                          scheduleId:
                                                                                            "$$value.scheduleId",
                                                                                          result:
                                                                                            [],
                                                                                        },
                                                                                      in: {
                                                                                        scheduleId:
                                                                                          "$$value.scheduleId",
                                                                                        result:
                                                                                          {
                                                                                            $concatArrays:
                                                                                              [
                                                                                                "$$value.result",
                                                                                                {
                                                                                                  $getField:
                                                                                                    {
                                                                                                      field:
                                                                                                        "result",
                                                                                                      input:
                                                                                                        {
                                                                                                          $reduce:
                                                                                                            {
                                                                                                              input:
                                                                                                                "$$this.v",
                                                                                                              initialValue:
                                                                                                                {
                                                                                                                  scheduleId:
                                                                                                                    "$$value.scheduleId",
                                                                                                                  result:
                                                                                                                    [],
                                                                                                                },
                                                                                                              in: {
                                                                                                                scheduleId:
                                                                                                                  "$$value.scheduleId",
                                                                                                                result:
                                                                                                                  {
                                                                                                                    $concatArrays:
                                                                                                                      [
                                                                                                                        "$$value.result",
                                                                                                                        [
                                                                                                                          {
                                                                                                                            id: "$$this",
                                                                                                                            reserved:
                                                                                                                              {
                                                                                                                                $in: [
                                                                                                                                  "$$this",
                                                                                                                                  {
                                                                                                                                    $getField:
                                                                                                                                      {
                                                                                                                                        field:
                                                                                                                                          "result",
                                                                                                                                        input:
                                                                                                                                          {
                                                                                                                                            $reduce:
                                                                                                                                              {
                                                                                                                                                input:
                                                                                                                                                  "$bookings",
                                                                                                                                                initialValue:
                                                                                                                                                  {
                                                                                                                                                    scheduleId:
                                                                                                                                                      "$$value.scheduleId",
                                                                                                                                                    result:
                                                                                                                                                      [],
                                                                                                                                                  },
                                                                                                                                                in: {
                                                                                                                                                  scheduleId:
                                                                                                                                                    "$$value.scheduleId",
                                                                                                                                                  result:
                                                                                                                                                    {
                                                                                                                                                      $cond:
                                                                                                                                                        {
                                                                                                                                                          if: {
                                                                                                                                                            $eq: [
                                                                                                                                                              "$$value.scheduleId",
                                                                                                                                                              "$$this.moviePass.movieScreening",
                                                                                                                                                            ],
                                                                                                                                                          },
                                                                                                                                                          then: {
                                                                                                                                                            $concatArrays:
                                                                                                                                                              [
                                                                                                                                                                "$$value.result",
                                                                                                                                                                "$$this.moviePass.tickets.assignedSeat",
                                                                                                                                                              ],
                                                                                                                                                          },
                                                                                                                                                          else: "$$value.result",
                                                                                                                                                        },
                                                                                                                                                    },
                                                                                                                                                },
                                                                                                                                              },
                                                                                                                                          },
                                                                                                                                      },
                                                                                                                                  },
                                                                                                                                ],
                                                                                                                              },
                                                                                                                          },
                                                                                                                        ],
                                                                                                                      ],
                                                                                                                  },
                                                                                                              },
                                                                                                            },
                                                                                                        },
                                                                                                    },
                                                                                                },
                                                                                              ],
                                                                                          },
                                                                                      },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                    else: "$$value.result",
                                                                  },
                                                              },
                                                          },
                                                        },
                                                    },
                                                },
                                            },
                                            dateTime:
                                              "$$this.dateTime",
                                            duration:
                                              "$$this.duration",
                                            price:
                                              "$$this.price",
                                          },
                                        ],
                                      ],
                                  },
                                  else: "$$value.result",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              ],
            },
          },
        },
        schedule: "$$REMOVE",
        bookings: "$$REMOVE",
      },
  },
]