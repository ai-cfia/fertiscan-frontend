"use client";
import { Stack } from "@mui/material";
import InspectionPreview from "@/types/InspectionPreview";
import { InspectionElement,LoadingInspectionElement } from "@/components/InspectionList/InspectionElement";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InspectionListProps {
  search: string;
  inspectionList: InspectionPreview[];
}

const InspectionList = ({ search, inspectionList }: InspectionListProps) => {
  const [shownList, setShownList] = useState([] as InspectionPreview[]);

  const router = useRouter();

  const handleInspectionClick = (id: string) => {
    router.push(`/label-data-validation/${id}`);
  };

  const LoadingList = [
    <LoadingInspectionElement key={0}/>,
    <LoadingInspectionElement key={1}/>,
    <LoadingInspectionElement key={2}/>,
  ]

  useEffect(() => {
    setShownList(
      inspectionList.filter((inspection) => {
        return inspection
          .product_name!.toLowerCase()
          .includes(search.toLowerCase());
      }),
    );
  }, [inspectionList, search]);
  return (
    <Stack spacing={2} className={"overflow-y-auto pl-0 pb-4 h-full"}>
      {inspectionList.length == 0 ? LoadingList : shownList.map((inspection) => {
        return (
          <InspectionElement
            inspection={inspection}
            key={inspection.id}
            handleClick={() => handleInspectionClick(inspection.id)}
          />
        );
      })}
    </Stack>
  );
};

export default InspectionList;
