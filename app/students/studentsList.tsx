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
  Button
} from "@heroui/react";
import { RootState } from "../api/store";

import { classes } from '../profile/common';
import { useRouter } from "next/navigation";

export const columns = [
  { name: "Name", uid: "name" },
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
  profilePhoto: string;
}

const StudentsList: React.FC = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const students: UserType[] = useSelector((state: RootState) =>
    state.users.students.map((user) => ({
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
      profilePhoto: user.profilePhoto || "",
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
          onSuccess: "users/getAllStudents",
          onError: "GLOBAL_MESSAGE",
          dispatchType: "getAllStudents",
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
    <div>
        <div className="flex justify-between items-center mb-2">
          <Select
            className="w-48 mb-1"
            label={studentFilter?.class_current || "Select class"}
            labelPlacement=" "
            name="class_current"
            onChange={handleChange}
          >
            {classes().map((data) => (
              <SelectItem key={data.key}>{data.label}</SelectItem>
            ))}
          </Select>
          <Button color="primary">Add new student</Button>
        </div>
        <Table isHeaderSticky className="shadow-none border-0" removeWrapper>
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
            {!students?.length ? 
              <TableRow>
                <TableCell colSpan={2}>No records found!</TableCell>
              </TableRow>
              : 
              students?.map((student: UserType, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <User
                        as="button"
                        avatarProps={{
                          isBordered: true,
                          src: student?.profilePhoto ? `http://localhost:3001/uploads/${student?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`,
                        }}
                        className="text-left"
                        description={<>
                          <p>{student?.email} / {student.userId}</p>
                          <p>{student?.phone}</p>
                          </>
                        }
                        name={
                          student?.firstName
                            ? `${student?.firstName} ${student?.lastName}`
                            : student?.email
                        }
                        onClick={() => router.push(`/students/${student.userId}`)}
                      />
                    </TableCell>
                    {/* <TableCell>{student.doa}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell><address>{student.address}</address></TableCell> */}
                    <TableCell>{getStatus(student.status)}</TableCell>
                  </TableRow>
                )  
              })
            }
          </TableBody>
        </Table>
      </div>
  );
};

export default StudentsList;
