"use client";

import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Switch, Input, Button } from "@heroui/react";
import { RootState } from "../api/store"; // Adjust the path to your store file
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { parseDate } from "@internationalized/date";

const AttendancePage = () => {

  const { loginUser, students } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "apiRequest",
      payload: {
        url: `user`,
        method: "POST",
        onSuccess: "users/getAllStudents",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getAllStudents",
        body: {
          class_current: loginUser?.classTeacherOf
        }
      },
    });
  }, [loginUser]);

  const [statusText, setStatusText] = useState<Record<string, string>>({})
  const [remarksText, setRemarksText] = useState<Record<string, string>>({})

  const handleChange = (event: any, type: string) => {
    const { name, value } = event.target;
    if(type === 'remarks') {
      setRemarksText((prev) => ({
        ...prev,
        [name]: value
      }))
    }
    setStatusText((prev) => ({
      ...prev,
      [name]: event.target.checked ? 'Present' : 'Absent'
    }));
  }

  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const [markedAttendanceInfo, setMarkedAttendanceInfo] = useState([]);

  const handleDateChange = (event: any) => {
    setSelectedDate(format(event, 'yyyy-MM-dd'))
  }

  useEffect(() => {
    const fetchAttendance = async () => {
      const response = await dispatch({
        type: "apiRequest",
        payload: {
          url: `user/attendance`,
          method: "GET",
          onSuccess: "users/getStudentAttendance",
          onError: "GLOBAL_MESSAGE",
          dispatchType: "getStudentAttendance",
          params: {
            class: loginUser?.classTeacherOf,
            date: selectedDate
          }
        },
      });
      setMarkedAttendanceInfo(response?.data);
    };
    fetchAttendance();
  }, [selectedDate]);

  console.log({markedAttendanceInfo});

  const handleSave = () => {
    let data: { status: { studentId: string; status: string; remarks: string; }[]; date: string; class: string; classTeacherIs: string; } = {
      status: [],
      date: selectedDate,
      class: loginUser?.classTeacherOf,
      classTeacherIs: loginUser?.userId
    };
    for(let k = 0; k < students?.length; k++) {
      data.status.push({
        studentId: statusText[`status_${students[k].userId}`] ? Object.keys(statusText)[k].split("_")[1] : students[k].userId,
        status: statusText[`status_${students[k].userId}`] ? statusText?.[Object.keys(statusText)[k]] : 'Absent',
        remarks: statusText[`status_${students[k].userId}`] ? (remarksText[`remarks_${Object.keys(statusText)[k].split("_")[1]}`] || '') : remarksText[`remarks_${students[k].userId}`]
      })
    }

    dispatch({
      type: "apiRequest",
      payload: {
        url: `user/attendance`,
        method: "POST",
        onSuccess: "users/setStudentAttendance",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "setStudentAttendance",
        body: {
          ...data
        }
      },
    });

  }

  const defaultStatusText = (student: { userId: string } | any) => statusText[`status_${student.userId}`] !== undefined ? statusText[`status_${student.userId}`] : 'Absent'
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p>Class: {loginUser?.classTeacherOf}</p>
        <DatePicker
          className="max-w-[284px]"
          label="Attendance date"
          maxValue={parseDate(format(new Date(), 'yyyy-MM-dd'))}
          onChange={handleDateChange}
          defaultValue={parseDate(selectedDate)}
        />
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Remarks</TableColumn>
        </TableHeader>
        <TableBody>
          <>
            {students?.map((student, i) => (
              <TableRow key={i}>
                <TableCell>
                  <User
                    avatarProps={{
                      src: `http://localhost:3001/uploads/${student?.profilePhoto}`,
                    }}
                    name={`${student?.firstName} ${student?.lastName}`}
                    description={`#${student?.userId}`}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    size="sm"
                    onChange={(e) => handleChange(e, '')}
                    color="success"
                    name={`status_${student.userId}`}
                  >
                    <p className="w-20">
                      {defaultStatusText(student)}
                    </p>
                  </Switch>
                </TableCell>
                <TableCell>
                  <Input
                    name={`remarks_${student.userId}`} 
                    placeholder="Any remarks..."
                    onChange={(e) => handleChange(e, 'remarks')}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                <Button
                  color="primary"
                  onPress={handleSave}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          </>
        </TableBody>
      </Table>
    </div>
  );
}

export default AttendancePage;
