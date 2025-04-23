import { FC } from "react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User } from '@heroui/react';

import { useSelector } from "react-redux";
import { RootState } from "../api/reducers";

const UpcomingBirthday: FC = () => {

    const { birthdays }  = useSelector((state: RootState) => state.users);

    console.log({birthdays});
    return (
        <div>
        <h2 className="text-2xl pb-4">Upcoming birthdays</h2>
        <Table aria-label="Example static collection table">
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>DOB</TableColumn>
                <TableColumn>Send wishes</TableColumn>
            </TableHeader>
            <TableBody>
                {birthdays?.map((user, i) => {
                    return <TableRow key={i}>
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
                              <p className="text-xs text-default-400">{user.userType === 'student' ? user.class_current : user.designation  }</p>
                            </div>
                          }
                        />
                    </TableCell>
                    <TableCell>{user.dob}</TableCell>
                    <TableCell>--</TableCell>
                </TableRow> })}
            </TableBody>
        </Table>
        </div>
    )
}

export default UpcomingBirthday;
