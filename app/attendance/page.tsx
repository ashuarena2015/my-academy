"use client";

import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  User, DatePicker, Switch, Input, Button, DateRangePicker, Chip } from "@heroui/react";
import { RootState } from "../api/store"; // Adjust the path to your store file
import { useSelector, useDispatch } from "react-redux";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
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

  const fetchAttendance = async (dateRange: { startDate: string; endDate: string; }) => {
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
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate
        }
      },
    });
    setMarkedAttendanceInfo(response?.data);
  };

  useEffect(() => {
    fetchAttendance({ startDate: selectedDate, endDate: selectedDate });
  }, [selectedDate]);

  // console.log({markedAttendanceInfo});

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
  
  const [isAttendanceSearch, setIsAttendanceSearch] = useState<boolean>(false);

  const [totalSearchDays, setTotalSearchdays] = useState(0);

  const [selectedDateRange, setSelectedDateRange] = useState({})

  const handleDateRange = (event: any) => {
    const { start, end } = event;
    const dateRange = { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') };
    const totalDays = differenceInDays(
      new Date(dateRange?.endDate),
      new Date(dateRange?.startDate)
    ) + 1;
      
    setTotalSearchdays(totalDays);
    setSelectedDateRange(dateRange);
    fetchAttendance(dateRange);
  }

  const renderDateRangeCell = () => {

    let allCellsDateCollumn = [<TableColumn>--</TableColumn>];
    if(Object.keys(selectedDateRange)?.length) {
      const start = parseISO(selectedDateRange?.startDate)    
      const end = parseISO(selectedDateRange?.endDate);
      const totalSearchDays = differenceInDays(end, start) + 1;
      for(let k = 0; k < totalSearchDays; k++) {
        delete allCellsDateCollumn[0];
        const currentDate = addDays(start, k);
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        allCellsDateCollumn.push(<TableColumn key={k}>{formattedDate}</TableColumn>);
      }
    }
    // console.log({markedAttendanceInfo});
    return allCellsDateCollumn;
  }

  const renderAttendanceCell = (studentId: string) => {
    let allCellsAttendance = [];
    if(Object.keys(selectedDateRange)?.length) {
      const start = parseISO(selectedDateRange?.startDate)    
      const end = parseISO(selectedDateRange?.endDate);
      const totalSearchDays = differenceInDays(end, start) + 1;
      for(let k = 0; k < totalSearchDays; k++) {
        const currentDate = addDays(start, k);
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        const getStatus = markedAttendanceInfo?.filter(x => x.date === formattedDate)[0];
        const status = getStatus?.status.filter(x => x.studentId === studentId)[0]?.status;
        allCellsAttendance.push(
          <TableCell key={k}>
            <Chip size="sm" color={status === 'Present' ? "success" : "danger"}>{status || 'No data!'}</Chip>
          </TableCell>
        );
      }
    }
    // console.log({markedAttendanceInfo});
    return allCellsAttendance;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <p>Class: {loginUser?.classTeacherOf}</p>
          <p>Today's date: {format(selectedDate, 'dd MMM, yyyy')}</p>
        </div>
        <div>
          <Button
            color="primary"
            onPress={handleSave}
          >
            Save
          </Button>
          <Button color="secondary" onPress={() => setIsAttendanceSearch((prev) => !prev)} className="ml-2">View attendance</Button>
        </div>
      </div>
      {isAttendanceSearch
      ? <>
          <div className="my-4">
            <DateRangePicker
              defaultValue={{
                start: parseDate(format(new Date(), 'yyyy-MM-dd')),
                end: parseDate(format(new Date(), 'yyyy-MM-dd')),
              }}
              maxValue={parseDate(format(new Date(), 'yyyy-MM-dd'))}
              label="Select date from-to"
              onChange={handleDateRange}
            />
          </div>
          {selectedDateRange?.startDate ? <Table aria-label="Example static collection table">
            <TableHeader>
              <>
                <TableColumn>Name</TableColumn>
                {renderDateRangeCell()}
              </>
            </TableHeader>
            <TableBody>
              {students?.map((stu, i) => {
                return (
                  <TableRow key={i}>
                      <TableCell colSpan={1}>{stu?.firstName} {stu?.lastName}</TableCell>
                      {renderAttendanceCell(stu?.userId)?.length > 1 ? renderAttendanceCell(stu?.userId) : <TableCell colSpan={totalSearchDays || 1}>--</TableCell>}
                      {/* <TableCell colSpan={totalSearchDays || 1}>--</TableCell> */}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table> : null}
          </>
      : (
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Remarks</TableColumn>
          </TableHeader>
          <TableBody>
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
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AttendancePage;
