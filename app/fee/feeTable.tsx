import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";
import { FC } from "react";

interface Fee {
    firstName: string;
    lastName: string;
    phone: number;
}

interface FeeTableListProps {
    feeAllDetails: Fee[];
}

const FeeTableList: FC<FeeTableListProps> = ({ feeAllDetails }) => {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Amount paid</TableColumn>
        <TableColumn>Academic Session</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        {feeAllDetails?.map((fee, index) => {
            console.log({feePayment: fee?.payments});
          return (
            <TableRow key={index}>
                <TableCell>{fee.student.firstName} {fee.student.lastName}</TableCell>
                <TableCell>{fee.firstName} {fee.lastName}</TableCell>
                <TableCell>{fee.firstName} {fee.lastName}</TableCell>
                <TableCell>Active</TableCell>
            </TableRow>
          )
        })}
        {/* <TableRow key="1">
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Zoey Lang</TableCell>
          <TableCell>Technical Lead</TableCell>
          <TableCell>Paused</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Jane Fisher</TableCell>
          <TableCell>Senior Developer</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>William Howard</TableCell>
          <TableCell>Community Manager</TableCell>
          <TableCell>Vacation</TableCell>
        </TableRow> */}
      </TableBody>
    </Table>
  );
}

export default FeeTableList;
