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
  userType?: string; // Added userType property
  designation: string;
}

const UsersList: React.FC = () => {

  const dispatch = useDispatch();
  const router = useRouter();

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
      profilePhoto: user.profilePhoto || "",
      userType: user.userType || "",
      designation: user.designation || "",
    }))
  );

  const { roleTypes } = useSelector((state: RootState) => state.users);

  interface UserFilter {
    designation?: string;
  }
  
  const [userFilter, setUserFilter] = useState<UserFilter>({
    designation: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
    
      setUserFilter({
        ...userFilter,
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
            userAll: 1,
            designation: userFilter?.designation,
          }
        },
      });
    }, [userFilter]); // Run only once
  
  const getStatus = (status: boolean) => {
    return <Chip color={status ? "success" : "danger"} size="sm">
      <span className="text-green-100">Active</span>
    </Chip>
  }

  const getDesignation = (designation: string) => {
    return (designation.replace("_", " ") || designation)?.toUpperCase();
  }

  const columns = [
    { name: "Name", uid: "name" },
    { name: "Phone", uid: "phone" },
    { name: "Address", uid: "address" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Select
          className="w-48 mb-1"
          // label={userFilter?.userType || "Select type"}
          // labelPlacement=" "
          placeholder="All"
          name="designation"
          onChange={handleChange}
        >
          {roleTypes.map((data) => (
            <SelectItem key={data.key}>{data.label}</SelectItem>
          ))}
        </Select>
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
          {!users?.length ? 
            <TableRow>
              <TableCell colSpan={3}>No records found!</TableCell>
            </TableRow>
            : 
            users?.map((user: UserType, i) => {
              return (
                <TableRow key={i} className="border-b-1">
                  <TableCell>
                    <User
                      as="button"
                      avatarProps={{
                        src: user?.profilePhoto ? `http://localhost:3001/uploads/${user?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`,
                        className: 'min-w-14 min-h-14'
                      }}
                      className="text-left"
                      name={
                        <div>
                          {user?.firstName
                            ? <p style={{ maxWidth: '180px', whiteSpace: 'nowrap' }}>{user?.firstName} {user?.lastName}</p>
                            : <p style={{ maxWidth: '180px', whiteSpace: 'nowrap' }}>{user?.email}</p>}
                          <p className="text-xs text-default-400">{getDesignation(user.designation)}</p>
                          <p className="text-xs text-default-400">{user.email}</p>
                        </div>
                      }
                      onClick={() => router.push(`/users/${user.userId}`)}
                    />
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="min-w-52">{user.address}</TableCell>
                </TableRow>
              )  
            })
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
