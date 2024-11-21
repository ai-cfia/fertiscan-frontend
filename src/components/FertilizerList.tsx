"use client"
import { useEffect, useState } from "react";
import { Card, Stack, Typography } from "@mui/material";
import fertilizerPreview from "@/types/FertilizerPreview";
import Image from "next/image";

const FertilizerList = ()=>{

  const [fertiList, setFertiList] = useState([] as fertilizerPreview[])

  useEffect(() => {
    setFertiList([...fertiList, {id: 1, finished: false, name: "Fertilizer 1", image: null}])
  }, []);

  return <Stack>
    {fertiList.map((fertilizer, index) => {
      return <Card key={index} className={"p-2"}>
        <Stack direction={"row"}>
          <Image className={"!relative h-2/6 max-w-fit p-1"} src={"/img/image.png"} alt={"fertilizer image"} fill={true}></Image>
          <Typography component={"h2"}>{fertilizer.name}</Typography>
        </Stack>
      </Card>
    })}
  </Stack>
}

export default FertilizerList