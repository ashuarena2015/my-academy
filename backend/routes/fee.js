/* eslint-disable padding-line-between-statements */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
const express = require('express');
const routerFee = express.Router();
const Fee = require('./schema/Fee/fee');
const { User } = require('./schema/Users/user');

routerFee.post("/", async (req, res) => {
    try {
        const { class: academicClass, startDate, endDate } = req.body;
        if (!academicClass) {
            return res.status(400).json({ error: "Class is required" });
        }
        const studentDetails = await User.find({ class_current: academicClass });
        console.log({studentDetails});
        // const feeDetails = await Fee.aggregate([
        //     { $match: { class: academicClass } }, // Find Fee by class
        //     {
        //       $lookup: {
        //         from: "feepayments", // Other collection (Payments)
        //         localField: "class", // Field from Fee
        //         foreignField: "class", // Matching field in Payments
        //         as: "paymentDetails",
        //       },
        //     },
        //     { $unwind: "$paymentDetails" }, // Flatten results
        //     { $match: { "paymentDetails.student_id": studentId } }, // Filter by student_id
        //   ]);
      
        // res.status(201).json({ message: "Fee details fetched!", feeDetails });
        const students = await User.aggregate([
            {
              $match: { class_current: academicClass }, // Match users by class
            },
            {
              $lookup: {
                from: "feepayments", // Collection to join
                localField: "userId", // Field from Users
                foreignField: "student_id", // Matching field in FeePayments
                as: "payments",
              },
            },
            {
              $unwind: { path: "$payments", preserveNullAndEmptyArrays: true } // Flatten payments array
            },
            {
              $match: {
                "payments.payment_date": { $exists: true }, // Ensure payment_date exists
                $expr: {
                  $and: [
                    {
                      $gte: [
                        {
                          $dateFromString: {
                            dateString: { 
                              $concat: [
                                { $substr: ["$payments.payment_date", 6, 4] }, "-",  // Extract year
                                { $substr: ["$payments.payment_date", 3, 2] }, "-",  // Extract month
                                { $substr: ["$payments.payment_date", 0, 2] }   // Extract day
                              ]
                            }
                          }
                        },
                        new Date(startDate) // Start date
                      ],
                    },
                    {
                      $lte: [
                        {
                          $dateFromString: {
                            dateString: { 
                              $concat: [
                                { $substr: ["$payments.payment_date", 6, 4] }, "-",  // Extract year
                                { $substr: ["$payments.payment_date", 3, 2] }, "-",  // Extract month
                                { $substr: ["$payments.payment_date", 0, 2] }   // Extract day
                              ]
                            }
                          }
                        },
                        new Date(endDate) // End date
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$userId", // Group by userId
                studentDetails: { $first: "$$ROOT" }, // Include all student details
                payments: { $push: "$payments" }, // Push all payments into an array
                totalAmount: { $sum: { $toDouble: "$payments.amount_paid" } } // Convert Int32 to Double and sum
              },
            },
            {
              $project: {
                _id: 0,
                student: "$studentDetails", // Alias for student details
                payments: 1, // Include all payments
                totalAmount: 1
              },
            },
          ]);
          
                    
          console.log({students});
          res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerFee.post("/update", async (req, res) => {
    try {
        if (!req.body.feeInfo?.student_id) {
            return res.status(400).json({ error: "Student id is required" });
        }
        // 🔹 Create and Save Student
        const feeDetails = await Fee.insertOne({ ...req.body.feeInfo });
        console.log({feeDetails});
        res.status(201).json({ message: "Fee details saved!", feeDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { routerFee };

