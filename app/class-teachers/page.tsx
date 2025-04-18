"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Avatar,
  Button,
  User,
  Chip
} from "@heroui/react";
import React, { FC, useState, useEffect, useMemo } from "react";
import { RootState } from "../api/store"; // Adjust the path to your store file
import { useSelector, useDispatch } from "react-redux";

const ClassTeachersPage: FC = () => {
  const { classes, subjectsClasses, users, classTeachers } = useSelector((state: RootState) => state.users);

  const [classSelect, setClassSelect] = useState<string>('REC-A');
  const [teacherSelect, setTeacherSelect] = useState<{ subject: string; teacher: string }[]>([])

  const [classTeacherIs, setClassTeacherIs] = useState('')
  const [updatedClassTeacherIs, setUpdatedClassTeacherIs] = useState<boolean>(false);

  const handleRadioChange = (e: any) => {
    const { name, value } = e.target;
    console.log({name, value});
    setClassTeacherIs(value);
    setUpdatedClassTeacherIs(false);
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>, setState: any, subject: string) => {
      const { value, name } = event.target;
      if (!subject) {
        setState(value);
        return true;
      }
      setState((prev: any) => [
        ...prev,
        {
          subject,
          teacher: value
        }
      ]);
    }

  const getUpdatedInfo = (data: any) => {
    const map = new Map();
    for (const item of data) {
      map.set(item.subject, item);
    }
    const result = Array.from(map.values());
    return result;
  }

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const response = await dispatch({
      type: "apiRequest",
      payload: {
        url: `user/class-teacher`,
        method: "POST",
        onSuccess: "users/setClassTeachers",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "setClassTeachers",
        body: {
          class: classSelect,
          details: getUpdatedInfo(teacherSelect),
          classTeacherIs: classTeacherIs
        }
      },
    });
    setUpdatedClassTeacherIs(response?.isClassTeachersUpdate);
  }

  useEffect(() => {
    dispatch({
      type: "apiRequest",
      payload: {
        url: `user`,
        method: "POST",
        onSuccess: "users/getAllUsers",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getAllUsers",
        body: {
          userAll: 1,
          userType: 'teacher',
        }
      },
    });
  }, [updatedClassTeacherIs]);

  useEffect(() => {
    classSelect && dispatch({
      type: "apiRequest",
      payload: {
        url: `user/class-teacher`,
        method: "GET",
        onSuccess: "users/getClassTeachers",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getClassTeachers",
        params: {
          class: classSelect
        }
      },
    });
  }, [classSelect]);

  useEffect(() => {
    setTeacherSelect(classTeachers);
  }, [classTeachers]);

  const getTeacherInfo = (classTeachers: any[], i: number, subject: string) => {
    console.log({classTeachers, subject});
    if(!classTeachers) {
      return '---';
    }
    const id = classTeachers.filter(x => x.subject === subject)[0]?.teacher;
    console.log({id});
    const resoponse = users.filter(x => x.userId === id)[0];
    return (
      <>
        <User
          avatarProps={{
            src: `http://localhost:3001/uploads/${resoponse?.profilePhoto}`,
          }}
          description={resoponse ? resoponse?.designation : '---'}
          name={resoponse ? `${resoponse?.firstName} ${resoponse?.lastName}` : 'Not assigned yet'}
        />
        {resoponse ? <p>
          {resoponse?.classTeacherOf === classSelect ? (
            <Chip size="sm" color="success">Class teacher</Chip>
          ) : (<label className="flex items-center text-xs">
            <input value={resoponse?.userId} type="radio" name="class_teacher_of" onChange={handleRadioChange} />
            <span className="ml-1">set as class teacher</span>
          </label>)}
        </p> : null}
      </>
    )
  }

  const renderRows = () => {
    return (
      subjectsClasses?.filter(x => x.classes.includes(classSelect?.split('-')[0]))[0]?.subjects?.map((sub: string, i: number) => {
        return (
            <TableRow>
              <TableCell>{sub}</TableCell>
              <TableCell>
                {getTeacherInfo(classTeachers, i, sub)}
              </TableCell>
              <TableCell>
                <Select
                  className="max-w-xs"
                  items={users}
                  placeholder="Select a user"
                  name={`teacher_${i}`}
                  onChange={(e) => {
                    handleSelect(e, setTeacherSelect, sub);
                  }}
                >
                  {(user) => (
                    <SelectItem key={user.userId} textValue={`${user.firstName} ${user.lastName}`}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={user.firstName}
                          className="flex-shrink-0"
                          size="sm"
                          src={`http://localhost:3001/uploads/${user.profilePhoto}`}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{user.firstName} {user.lastName}</span>
                          <span className="text-tiny text-default-400">{user.email}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </TableCell>
            </TableRow>
        )
      })
    )
  };

  const rows = useMemo(() => renderRows(), [classTeachers, users, subjectsClasses]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Select
          className="w-40"
          placeholder="Select class"
          defaultSelectedKeys={[classSelect]}
          onChange={(e) => handleSelect(e, setClassSelect, '')}
          name="class"
        >
          {classes?.map((classItem) => (
            <SelectItem key={classItem?.key}>{classItem?.label}</SelectItem>
          ))}
        </Select>
        <Button onPress={handleSubmit} color="primary">Save</Button>
      </div>
      <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Subject</TableColumn>
        <TableColumn>Assigned Teacher</TableColumn>
        <TableColumn>New Teacher</TableColumn>
      </TableHeader>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
    </div>
  );
}

export default ClassTeachersPage;
