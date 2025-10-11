"use client";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { type Navigation } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";

const DotIcon = <FiberManualRecordIcon sx={{ fontSize: 8, ml: 1 }} />;

const accountNavigation: Navigation = [
  {
    kind: "header",
    title: "Main Items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "User",
    icon: <EditCalendarIcon />,
    children: [
      {
        title: "Users",
        segment: "dashboard/users",
        icon: <>{DotIcon}</>,
      },
    ],
  },
];

export default accountNavigation;
