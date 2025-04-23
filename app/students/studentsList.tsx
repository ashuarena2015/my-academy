import React, { useEffect, useState } from "react";
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
} from "@heroui/react";
import { RootState } from "../api/store";
import { useRouter } from "next/navigation";

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
  listCompact?: boolean;
}

const StudentsList: React.FC<StudentsListProps> = ({ listCompact }) => {

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

  const { classes } = useSelector((state: RootState) => state.users);

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

  const columns = listCompact ? [
    { name: "Name", uid: "name" },
    { name: "Phone", uid: "phone" },
    { name: "Address", uid: "address" },
  ]: [
    { name: "Name", uid: "name" },
    { name: "Parents", uid: "parents" },
    { name: "Address", uid: "address" },
    { name: "Phone", uid: "phone" },
  ];

  return (
    <div>
        <div className="flex justify-between items-center mb-2">
          <Select
            className="w-48 mb-1"
            placeholder="REC-A"
            name="class_current"
            onChange={handleChange}
          >
            {classes?.map((data) => (
              <SelectItem key={data.key}>{data.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div>
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
                  <TableCell colSpan={listCompact ? 3 : 4}>No records found!</TableCell>
                </TableRow>
                : 
                listCompact ? students?.map((student: UserType, i) => {
                  return (
                    <TableRow key={i} className="border-b-1">
                      <TableCell>
                        <div>
                          <User
                            as="button"
                            avatarProps={{
                              src: student?.profilePhoto ? `http://localhost:3001/uploads/${student?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`,
                              className: 'min-w-14 min-h-14'
                            }}
                            className="text-left"
                            name={
                              <div>
                                {student?.firstName
                                  ? <p style={{ maxWidth: '180px', whiteSpace: 'nowrap' }}>{student?.firstName} {student?.lastName}</p>
                                  : <p style={{ maxWidth: '180px', whiteSpace: 'nowrap' }}>{student?.email}</p>}
                                <p className="text-xs text-default-400">#{student.userId}</p>
                                <p className="text-xs text-default-400">{student.email}</p>
                              </div>
                            }
                            onClick={() => router.push(`/users/${student.userId}`)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell className="min-w-52">{student.address}</TableCell>
                    </TableRow>
                  )  
                }) : students?.map((student: UserType, i) => {
                  return (
                    <TableRow key={i} className="border-b-1">
                      <TableCell>
                        <div>
                          <User
                            as="button"
                            avatarProps={{
                              src: student?.profilePhoto ? `http://localhost:3001/uploads/${student?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`,
                              className: 'min-w-14 min-h-14'
                            }}
                            className="text-left"
                            name={
                              <div>
                                {student?.firstName
                                  ? <p style={{ maxWidth: '180px', whiteSpace: 'nowrap' }}>{student?.firstName} {student?.lastName}</p>
                                  : <p style={{ maxWidth: '180px', whiteSpace: 'nowrap' }}>{student?.email}</p>}
                                <p className="text-xs text-default-400">#{student.userId}</p>
                                <p className="text-xs text-default-400">{student.email}</p>
                              </div>
                            }
                            onClick={() => router.push(`/users/${student.userId}`)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{student.fatherName}, {student.motherName}</TableCell>
                      <TableCell className="min-w-52">{student.address}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                    </TableRow>
                  )  
                })
              }
            </TableBody>
          </Table>
        </div>
      </div>
  );
};

export default StudentsList;
