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

import { staffs } from '../profile/common';
import { useRouter } from "next/navigation";
import AddNewUser from "../components/AddNewUserModal";

export const columns = [
  { name: "Name", uid: "name" },
  { name: "Designation", uid: "designation" }
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
  userType?: string; // Added userType property
  designation: string;
}

interface UsersListProps {
  userTypeProp: string; // Define the expected type for userTypeProp
  noTableWrapper: boolean
}

const UsersList: React.FC<UsersListProps> = ({ userTypeProp, noTableWrapper }) => {

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

  interface UserFilter {
    userType?: string;
  }
  
  const [userFilter, setUserFilter] = useState<UserFilter>({
    userType: "all"
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
            userType: userFilter?.userType,
          }
        },
      });
    }, [userFilter]); // Run only once
  
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
          label={userFilter?.userType || "Select type"}
          labelPlacement=" "
          name="userType"
          onChange={handleChange}
        >
          {staffs().map((data) => (
            <SelectItem key={data.key}>{data.label}</SelectItem>
          ))}
        </Select>
        <AddNewUser title={'Add new staff'} userTypeForm="" />
      </div>
      <Table isHeaderSticky className="shadow-none border-0" removeWrapper={noTableWrapper}>
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
              <TableCell colSpan={2}>No records found!</TableCell>
            </TableRow>
            : 
            users?.map((user: UserType, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <User
                      as="button"
                      avatarProps={{
                        isBordered: true,
                        src: user?.profilePhoto ? `http://localhost:3001/uploads/${user?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`,
                      }}
                      className="text-left"
                      description={<>
                        <p>{user?.email} / {user.userId}</p>
                        <p>{user?.phone}</p>
                        </>}
                      name={
                        user?.firstName
                          ? `${user?.firstName} ${user?.lastName}`
                          : user?.email
                      }
                      onClick={() => router.push(`/users/${user.userId}`)}
                    />
                  </TableCell>
                  {/* <TableCell>{user?.designation}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell><address>{user.address}</address></TableCell> */}
                  <TableCell>{getStatus(user.status)}</TableCell>
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
