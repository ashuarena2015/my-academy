import { FC } from "react";
import React from "react";
import { Form, Input, Button, RadioGroup, Radio } from "@heroui/react";

const AddFeeForm: FC = () => {
    return (
        <div className="w-96">
        <Form className="gap-4" id="register_form">
            <Input
            errorMessage="Error message"
            name="email"
            placeholder="Enter your email"
            type="email"
            />
            <div className="flex justify-between w-full">
            <Input
                errorMessage="Error message"
                name="password"
                placeholder="Enter your password"
                type="password"
            />
            </div>
            <div className="w-full flex justify-between">
            <Button className="w-full" color="primary" type="submit">
                Login
            </Button>
            </div>
        </Form>
    </div>
    )
}