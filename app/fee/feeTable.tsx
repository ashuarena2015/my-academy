"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Card, CardBody, Link, Chip} from "@heroui/react";
import { FC, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../api/store";
import { useParams } from "next/navigation";
import { academicSessions, classes } from "../profile/common";
import FeeAmount from "./feeAmount"

const FeeTableList: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const params = useParams();
  const { id } = params;

  const { feeAllDetails } = useSelector((state: RootState) => state.fee);

  const [academicSession, setAcademicSession] = useState<string>(academicSessions()[0]?.key || "");
  const [classCurrent, setClassCurrent] = useState<string>(classes()[0]?.key || "");
  const [studentId, setStudentId] = useState<string>(typeof id === 'string' ? id : '');
  const [annualFeeInfo, setAnnualFeeInfo] = useState(null);

  console.log({annualFeeInfo});
  const [academicYear, setAcademicYear] = useState({
    startDate: "2025-04-01",
    endDate: "2026-03-31"
  })

  const getFinancialYearDates = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const financialYear = event.target.value;
      setAcademicSession(financialYear);
      const [startYear, endYear] = financialYear.split("/").map(Number);
      setAcademicYear({
        startDate: `${startYear}-04-01`,
        endDate: `20${endYear}-03-31`
      });
    }

  const handleSelect = (e: any) => {
    const { name, value } = e.target;
    setClassCurrent(value);
  }

  const fetchData = useCallback(() => {
    dispatch({
      type: "apiRequest",
      payload: {
        url: `fee`,
        method: "POST",
        onSuccess: "getAllFeeDetails",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getAllFeeDetails",
        body: {
          student_id: studentId,
          class: classCurrent,
          startDate: academicYear?.startDate,
          endDate: academicYear?.endDate,
          academicSession: academicSession
        },
      },
    });
  }, [studentId, classCurrent, academicYear]); // Ensure fetchData doesn't change on re-renders

  useEffect(() => {
    fetchData();
  }, [studentId, classCurrent, academicYear]); // Run only once

  const getDueAmount = (annualFee: number, totalPaidAmount: number) => {
    let amountNode = <Chip color="default" size="sm">--</Chip>;
    if(annualFee === totalPaidAmount) {
      return <Chip color="success" size="sm">Paid</Chip>;
    }
    return <Chip color="danger" size="sm" className="text-xs px-2">{annualFee - totalPaidAmount}</Chip>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Card>
          <CardBody>
            <div className="flex gap-2 mb-4">
              {!studentId ?
                <Select
                  className="w-40"
                  defaultSelectedKeys={[classes()[0]?.key]}
                  name="academicClass"
                  onChange={handleSelect}
                >
                  {classes().map((data) => (
                    <SelectItem key={data.key}>{data.label}</SelectItem>
                  ))}
                </Select>
              : null }
              <Select
                className="w-40"
                defaultSelectedKeys={[academicSessions()[0]?.key]}
                name="academicYear"
                onChange={getFinancialYearDates}
              >
                {academicSessions().map((data) => (
                  <SelectItem key={data.key}>{data.label}</SelectItem>
                ))}
              </Select>
            </div>
            <Table aria-label="Example static collection table" removeWrapper={true}>
              <TableHeader>
                <TableColumn>Student name</TableColumn>
                <TableColumn>Annual fee</TableColumn>
                <TableColumn>Amount paid</TableColumn>
                <TableColumn>Amount Due</TableColumn>
              </TableHeader>
              <TableBody>
                {feeAllDetails?.map((fee, i) => {
                  return (
                    <TableRow key={i}>
                        <TableCell>               
                          <Link showAnchorIcon color="foreground" size="sm" href={`/students/${fee.student.userId}`} className="font-semibold">
                              {fee.student.firstName} {fee.student.lastName}
                          </Link>
                          <p className="text-xs">{fee.student.email} / {fee.student.userId}</p>
                        </TableCell>
                        <TableCell>{annualFeeInfo?.annualFee}</TableCell>
                        <TableCell>{fee.totalAmount }</TableCell>
                        <TableCell>{getDueAmount(annualFeeInfo?.annualFee, fee.totalAmount)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
      <div className="col-span-1">
        <FeeAmount academicSession={academicSession} setAnnualFeeInfo={setAnnualFeeInfo} academicClass={classCurrent} />
      </div>
    </div>
  );
}

export default FeeTableList;
