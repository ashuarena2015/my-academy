import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Select,
  SelectItem,
  Card,
  CardBody,
  Link,
} from "@heroui/react";
import { RootState } from "../api/store";

import { classes } from '../profile/common';

export const columns = [
  { name: "ID", uid: "id" },
  { name: "Admission date", uid: "doa" },
  { name: "Name", uid: "name" },
  { name: "Phone", uid: "phone" },
  { name: "Address", uid: "address" },
  { name: "Status", uid: "status" },
];

export interface UserType {
  id: number;
  userId: number; // Added userId property
  name: string;
  phone: string;
  address: string;
  doa: string;
  firstName: string; // Added firstName property
  lastName: string;  // Added lastName property
  email: string;     // Added email property
  status: boolean;   // Added status property
}

const StudentsList: React.FC = () => {

  const dispatch = useDispatch();

  const users: UserType[] = useSelector((state: RootState) =>
    state.users.users.map((user) => ({
      id: Number(user.id) || 0,
      userId: user.userId || user.id, // Map userId or fallback to id
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone || "",
      address: user.address || "",
      doa: user.doa || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      status: user.status || false,
    }))
  );

  interface StudentFilter {
    class_current?: string;
  }
  
  const [studentFilter, setStudentFilter] = useState<StudentFilter>({
    class_current: "REC-A"
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
    
      setStudentFilter({
        ...studentFilter,
        [name]: value,
      });
    };
  
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
            class_current: studentFilter.class_current,
          }
        },
      });
    }, [studentFilter]); // Run only once
  
  const getStatus = (status: boolean) => {
    return <Chip color={status ? "success" : "danger"} size="sm">
      <span className="text-green-100">Active</span>
    </Chip>
  }
  return (
    <Card className="flex flex-col shadow-none border-1 p-2">
      <CardBody>
        <Select
          className="w-48 mb-4"
          label={studentFilter?.class_current || `Select Class`}
          labelPlacement=" "
          name="class_current"
          onChange={handleChange}
        >
          {classes().map((data) => (
            <SelectItem key={data.key}>{data.label}</SelectItem>
          ))}
        </Select>
        <Table className="shadow-none border-0">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {!users?.length ? 
              <TableRow>
                <TableCell colSpan={6}>No records found!</TableCell>
              </TableRow>
              : 
              users?.map((student: UserType, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{student.userId}</TableCell>
                    <TableCell>{student.doa}</TableCell>
                    <TableCell>
                      <div>
                        <Link showAnchorIcon color="foreground" size="sm" href={`/students/${student.userId}`} className="font-semibold">
                          {student.firstName} {student.lastName}
                        </Link>
                      </div>
                      <small className="text-slate-600">{student.email}</small>
                    </TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell><address>{student.address}</address></TableCell>
                    <TableCell>{getStatus(student.status)}</TableCell>
                  </TableRow>
                )  
              })
            }
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default StudentsList;
