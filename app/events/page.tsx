"use client";

import React from "react";
import {
  Card,
  CardBody,
  Divider,
} from "@heroui/react";

import { format } from "date-fns";

const EventsPage = () => {

  // Sample events
  const events = [
    {
      id: 1,
      title: 'Math Exam - Grade 6',
      date: new Date(2025, 3, 15, 9, 0),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis leo ac est placerat, quis ullamcorper arcu bibendum. Pellentesque nec lectus mi.",
      isImportant: false
    },
    {
      id: 2,
      title: 'Parent Teacher Meeting',
      date: new Date(2025, 3, 17, 14, 0),
      description: "quis efficitur nibh efficitur. Vivamus bibendum massa nec nisi",
    },
    {
      id: 3,
      title: 'Science Fair',
      date: new Date(2025, 3, 20, 10, 0),
      description: "condimentum et diam. Donec dapibus eget"
    },
    {
      id: 4,
      title: 'Math Exam - Grade 6',
      date: new Date(2025, 3, 15, 9, 0),
      description: "Duis elementum, felis sed bibendum lacinia, ante lorem venenatis erat, at ullamcorper velit augue vel lectus. ",
      isImportant: true
    },
    {
      id: 5,
      title: 'Parent Teacher Meeting',
      date: new Date(2025, 3, 17, 14, 0),
      description: "Aliquam pulvinar turpis id accumsan sodales. Vestibulum ante ipsum primis in faucibus"
    },
    {
      id: 6,
      title: 'Science Fair',
      date: new Date(2025, 3, 20, 10, 0),
      description: "Nunc augue ex, egestas eu dolor in, malesuada placerat libero. "
    },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-5 gap-4">
        {events?.map((item, i) => {
          return (
            <Card key={i}>
              <CardBody className={`${item?.isImportant ? 'bg-primary-300' : ''}`}>
                <div className="flex">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>
                  <span className="mb-2 ml-1 text-lg font-semibold">{format(item.date, 'dd MMMM yyyy')}</span>
                </div>
                <p>{item.title}</p>
                <Divider />
                <p className="text-sm mt-2">{item.description}</p>
              </CardBody>
          </Card>
          )
        })}
      </div>
    </div>
  );
}

export default EventsPage;
