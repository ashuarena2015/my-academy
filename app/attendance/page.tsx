"use client";

import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  User, DatePicker, Switch, Input, Button, DateRangePicker, Chip, Tooltip } from "@heroui/react";
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

  const [ todayAttendanceMarked, setTodayAttendanceMarked] = useState<boolean>(false);

  console.log({todayAttendanceMarked});

  // console.log({markedAttendanceInfo});

  const handleSave = async () => {
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

    const response = await dispatch({
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

    setMarkedAttendanceInfo(response?.data);

  }

  const defaultStatusText = (student: { userId: string } | any) => statusText[`status_${student.userId}`] !== undefined ? statusText[`status_${student.userId}`] : 'Absent'
  
  const [isAttendanceSearch, setIsAttendanceSearch] = useState<boolean>(false);
  const [totalSearchDays, setTotalSearchdays] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState({})
  const [isAttendanceEdit, setIsAttendanceEdit] = useState<boolean>(false);

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
        allCellsDateCollumn.push(<TableColumn key={k}>
          <div className="flex items-center">
          <p>{formattedDate}</p>
          <Button
            className="bg-none border-none"
            variant="faded"
            size="sm"
            isIconOnly
            onPress={() => {
              setSelectedDate(formattedDate);
              setTodayAttendanceMarked(false);
              setIsAttendanceSearch(false);
              setIsAttendanceEdit(true)
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
            </svg>
          </Button>
          </div>
        </TableColumn>);
      }
    }
    // console.log({markedAttendanceInfo});
    return allCellsDateCollumn;
  }

  const renderAttendanceCell = (studentId: string): React.JSX.Element[] => {
    let allCellsAttendance = [];
    if(Object.keys(selectedDateRange)?.length) {
      const start = parseISO(selectedDateRange?.startDate)    
      const end = parseISO(selectedDateRange?.endDate);
      const totalSearchDays = differenceInDays(end, start) + 1;
      for(let k = 0; k < totalSearchDays; k++) {
        const currentDate = addDays(start, k);
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        const getStatusRemarks = markedAttendanceInfo?.filter(x => x.date === formattedDate)[0]?.status?.filter(x => x.studentId === studentId)[0];
        const { remarks, status } = getStatusRemarks || {};
        allCellsAttendance.push(
          <TableCell key={k}>
            <div className="flex items-center">
              <Chip size="sm" color={status === 'Present' ? "success" : "danger"}>{status ? (status === 'Present' ? 'P' : 'A') : 'No data'}</Chip>
              {remarks ? <Tooltip content={remarks}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              </Tooltip> : null}
            </div>
          </TableCell>
        );
      }
    }
    // console.log({markedAttendanceInfo});
    return allCellsAttendance;
  }

  useEffect(() => {
    if (markedAttendanceInfo[0]?.date === selectedDate && !isAttendanceEdit) {
      // setIsAttendanceSearch(true);
      setSelectedDateRange({
        startDate: selectedDate,
        endDate: selectedDate
      })
      setTodayAttendanceMarked(true);
    }
  }, [markedAttendanceInfo, isAttendanceEdit]);

  console.log({markedAttendanceInfo});

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <p>Class: {loginUser?.classTeacherOf}</p>
          <p>Today's date: {format(selectedDate, 'iiii dd MMM, yyyy ')}</p>
        </div>
        <div>
        {!todayAttendanceMarked ? <>
          {!isAttendanceSearch && <Button
            color="primary"
            onPress={handleSave}
          >
            Save
          </Button>}
          <Button
          color="secondary"
          onPress={() => setIsAttendanceSearch((prev) => !prev)}
          className="ml-2">
            {!isAttendanceSearch ? 'View attendance' : 'Back'}
        </Button></>
          : null
          }
        </div>
      </div>
      {isAttendanceSearch || todayAttendanceMarked
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
              className="max-w-64"
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
                        {renderAttendanceCell(stu?.userId)}
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
            {students?.map((student, i) => {
              return (
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
                      defaultSelected={markedAttendanceInfo[0]?.status.filter(x => x.studentId === student.userId)[0]?.status === 'Present'}
                    >
                      <p className="w-20">
                        {markedAttendanceInfo[0]?.status.filter(x => x.studentId === student.userId)[0]?.status === 'Present' ? 'Present' : defaultStatusText(student)}
                      </p>
                    </Switch>
                  </TableCell>
                  <TableCell>
                    <Input
                      name={`remarks_${student.userId}`} 
                      placeholder="Any remarks..."
                      onChange={(e) => handleChange(e, 'remarks')}
                      value={markedAttendanceInfo[0]?.status.filter(x => x.studentId === student.userId)[0]?.remarks}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AttendancePage;
