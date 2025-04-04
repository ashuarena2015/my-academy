import { FC, useEffect, useState } from "react"
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Card, CardBody, Link} from "@heroui/react";

interface FeeAmountProps {
    academicSession: string;
    academicClass: string;
    setAnnualFeeInfo: Function;
}

interface getFeeAmountData {
    class: string;
    session: string;
    annualFee: number;
}

const FeeAmount: FC<FeeAmountProps> = ({ academicSession, academicClass, setAnnualFeeInfo }) => {
    console.log({academicSession, academicClass, newCl: academicClass.split("-")[0]});
    // It should be also stored in DB

    const [getFeeAmount, setFeeAmount] = useState<getFeeAmountData | null>(null);

    const data = [
        { class: "REC", session: "2024/25", annualFee: 139200 },
        { class: "REC", session: "2025/26", annualFee: 143400 },
        { class: "PP1", session: "2024/25", annualFee: 147600 },
        { class: "PP1", session: "2025/26", annualFee: 152400 }
    ];

    useEffect(() => {
        const foundItem = data.find(
            (item) => item.class === academicClass.split("-")[0] && item.session === academicSession
        );
        setFeeAmount(foundItem || null);
        setAnnualFeeInfo(foundItem);
    }, [academicClass, academicSession]);
      

    return (
        <div>
            <div>
                <Table removeWrapper={true} aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Class</TableColumn>
                        <TableColumn>Academic session</TableColumn>
                        <TableColumn>Annual fee</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell>{getFeeAmount?.class}</TableCell>
                            <TableCell>{getFeeAmount?.session}</TableCell>
                            <TableCell>{getFeeAmount?.annualFee}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>                   
            </div>
        </div>
    )
}

export default FeeAmount;