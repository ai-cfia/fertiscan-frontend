"use client"
import { Stack } from "@mui/material";
import InspectionPreview from "@/types/InspectionPreview";
import InspectionElement from "@/components/InspectionList/InspectionElement";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface InspectionListProps {
  search: string;
}

const InspectionList = ({search}:InspectionListProps)=>{

  const [inspectList, setInspectList] = useState([] as InspectionPreview[])
  const [shownList, setShownList] = useState([] as InspectionPreview[])

  const router = useRouter();

  const handleInspectionClick = (id: string) => {
    router.push(`/label-data-validation/${id}`);
  }

  useEffect(() => {
    const username = atob(Cookies.get("token") ?? "");
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    axios.get("/api/inspections",
      {
      headers: {
        Authorization: authHeader
      },
    }).then((response) => {
      setInspectList(response.data);
      setShownList(response.data);
    });
  }, []);
  useEffect(() => {
    setShownList(inspectList.filter((inspection) => {
      return inspection.product_name!.toLowerCase().includes(search.toLowerCase());
    }));
  }, [inspectList, search]);
  return <Stack spacing={2} className={"h-[80vh] overflow-y-scroll p-5 pl-0"}>
    {shownList.map((inspection) => {
      return <InspectionElement inspection={inspection} key={inspection.id} handleClick={()=>handleInspectionClick(inspection.id)}/>
    })}
  </Stack>
}

export default InspectionList