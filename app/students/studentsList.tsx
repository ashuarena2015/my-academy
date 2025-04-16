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
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { RootState } from "../api/store";

import { classes } from '../profile/common';
import { useRouter } from "next/navigation";
import AddNewUser from "../components/AddNewUserModal";

export const columns = [
  { name: "Roll", uid: "userId" },
  { name: "Name", uid: "name" },
  { name: "Gender", uid: "gender" },
  { name: "Class", uid: "class" },
  { name: "Parents", uid: "parents" },
  { name: "Address", uid: "address" },
  { name: "DOB", uid: "dob" },
  { name: "Phone", uid: "phone" },
  { name: "Email", uid: "email" },
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
  class_current: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dob: string;
}

interface StudentsListProps {
  noTableWrapper?: boolean;
}

const StudentsList: React.FC<StudentsListProps> = ({ noTableWrapper }) => {

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
      class_current: user.class_current || "",
      fatherName: user.fatherName || "",
      motherName: user.motherName || "",
      dob: user.dob || "",
      gender: user.gender || ""
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
          <AddNewUser title={'Add new student'} userTypeForm="student" />
        </div>
        <Table isHeaderSticky removeWrapper>
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
                <TableCell colSpan={10}>No records found!</TableCell>
              </TableRow>
              : 
              students?.map((student: UserType, i) => {
                return (
                  <TableRow key={i} className="border-b-1">
                    <TableCell>#{student.userId}</TableCell>
                    <TableCell>
                      <div>
                        <User
                          as="button"
                          avatarProps={{
                            isBordered: true,
                            src: student?.profilePhoto ? `http://localhost:3001/uploads/${student?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`,
                            size: "md",
                          }}
                          className="text-left"
                          name={
                            student?.firstName
                              ? <p style={{ maxWidth: '280px', whiteSpace: 'nowrap' }}>{student?.firstName} {student?.lastName}</p>
                              : <p style={{ maxWidth: '280px', whiteSpace: 'nowrap' }}>{student?.email}</p>
                          }
                          onClick={() => router.push(`/users/${student.userId}`)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.class_current}</TableCell>
                    <TableCell>{student.fatherName}, {student.motherName}</TableCell>
                    <TableCell>{student.address}</TableCell>
                    <TableCell>{student.dob}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.email}</TableCell>
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
