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
  console.log({feeAllDetails});
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Class / Academic Session</TableColumn>
        <TableColumn>Fee type</TableColumn>
        <TableColumn>Amount paid</TableColumn>
        <TableColumn>Payment date</TableColumn>
        <TableColumn>Payment mode</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        {feeAllDetails?.map((fee, index) => {
          return (
            <TableRow key={index}>
                <TableCell>{fee.class}</TableCell>
                <TableCell>{fee.fee_type}</TableCell>
                <TableCell>{fee.amount_paid}</TableCell>
                <TableCell>{fee.payment_date}</TableCell>
                <TableCell>{fee.payment_mode}</TableCell>
                <TableCell>{fee.status}</TableCell>
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
