"use client";
import { CircularProgress, Stack } from "@mui/material";
import InspectionPreview from "@/types/InspectionPreview";
import InspectionElement from "@/components/InspectionList/InspectionElement";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InspectionListProps {
  search: string;
  inspectionList: InspectionPreview[];
}

const InspectionList = ({ search, inspectionList }: InspectionListProps) => {
  const [shownList, setShownList] = useState([] as InspectionPreview[]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleInspectionClick = (id: string) => {
    router.push(`/label-data-validation/${id}`);
  };

  useEffect(() => {
    setShownList(
      inspectionList.filter((inspection) => {
        return inspection
          .product_name!.toLowerCase()
          .includes(search.toLowerCase());
      }),
    );
    setLoading(false);
  }, [inspectionList, search]);
  return (
    <Stack spacing={2} className={"overflow-y-auto pl-0 pb-4 h-full" + (loading ? "flex items-center" : "")}>
      {loading ? <CircularProgress color={"secondary"}/> : shownList.map((inspection) => {
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
