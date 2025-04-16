"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Avatar, Button } from "@heroui/react";
import React, { FC, useState, useEffect, useCallback } from "react";
import { RootState } from "../api/store"; // Adjust the path to your store file
import { useSelector, useDispatch } from "react-redux";

const ClassTeachersPage: FC = () => {
  const { classes, subjects, users, classTeachers } = useSelector((state: RootState) => state.users);

  const [classSelect, setClassSelect] = useState<{ class: string }>({ class: "REC-A" });
  const [teacherSelect, setTeacherSelect] = useState<{ subject: string; teacher: string }[]>([])

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>, setState: React.Dispatch<React.SetStateAction<{ subject: string; teacher: string }[]>>, subject: string) => {
      const { value, name } = event.target;
      if (!subject) {
        setState((prev) => ({
          ...prev,
          [name]: value,
        }));
        return true;
      }
      console.log({subject, value, name})
      setState((prev) => [
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

  const handleSubmit = () => {
    dispatch({
      type: "apiRequest",
      payload: {
        url: `user/class-teacher`,
        method: "POST",
        onSuccess: "users/setClassTeachers",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "setClassTeachers",
        body: {
          class: classSelect?.class,
          details: getUpdatedInfo(teacherSelect)
        }
      },
    });
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
  }, []);

  useEffect(() => {
    classSelect?.class && dispatch({
      type: "apiRequest",
      payload: {
        url: `user/class-teacher`,
        method: "GET",
        onSuccess: "users/getClassTeachers",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getClassTeachers",
        params: {
          class: classSelect?.class
        }
      },
    });
  }, [classSelect]);

  const renderRows = () => {
    return (
      subjects?.map((sub, i) => {
        console.log({teacherSelect, classTeachers});
        return (
          <TableRow key={i}>
            <TableCell>{sub?.label}</TableCell>
            <TableCell>
              <Select
                className="max-w-xs"
                items={users}
                placeholder="Select a user"
                name={`teacher_${i}`}
                onChange={(e) => handleSelect(e, setTeacherSelect, sub.key)}
                selectedKeys={classTeachers?.length && classTeachers?.[i]?.teacher ? [classTeachers?.[i].teacher] : ['']}
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

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Select
          className="w-40"
          placeholder="Select class"
          defaultSelectedKeys={[classSelect?.class]}
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
        <TableColumn>Teacher</TableColumn>
      </TableHeader>
      <TableBody>
        {renderRows()}
      </TableBody>
    </Table>
    </div>
  );
}

export default ClassTeachersPage;
