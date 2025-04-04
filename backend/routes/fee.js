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
      console.log('req.body', req.body);
      const { class: academicClass, startDate, endDate, student_id, academicSession } = req.body;
      // if (!academicClass || !student_id) {
      //     return res.status(400).json({ error: "Class is required" });
      // }

      const feeDetails = await Fee.aggregate([
        {
          $match: {
            class: academicClass,
            academic_session: academicSession // assuming this field is in feepayments
          }
        },
        {
          $lookup: {
            from: "users", // join users collection
            localField: "student_id",
            foreignField: "userId",
            as: "student"
          }
        },
        {
          $unwind: "$student" // flatten the joined student data
        },
        {
          $group: {
            _id: "$student_id",
            student: { $first: "$student" },
            payments: {
              $push: {
                payment_date: "$payment_date",
                amount_paid: "$amount_paid",
                class: "$class",
                academic_session: "$academic_session",
                payment_mode: "$payment_mode",
                student_id: "$student_id",
                fee_type: "$fee_type"
              }
            },
            totalAmount: {
              $sum: { $toDouble: "$amount_paid" }
            }
          }
        },
        {
          $project: {
            _id: 0,
            student: {
              userId: "$student.userId",
              firstName: "$student.firstName",
              lastName: "$student.lastName",
              email: "$student.email",
              phone: "$student.phone",
              class_current: "$student.class_current",
              fatherName: "$student.fatherName",
              motherName: "$student.motherName",
              dob: "$student.dob",
              doa: "$student.doa",
              address: "$student.address",
              academic_session: "$student.academic_session"
            },
            payments: 1,
            totalAmount: 1
          }
        }
      ]);      

      res.json(feeDetails);
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

