import React, { useState, useRef } from "react";
import "./Carousel.css"
interface CarouselProps{
    imgs:{
        url:string;
        title:string;
    }[]
}

class imgObject{
    index:number;
    ref:React.MutableRefObject<HTMLImageElement|null>;
    url:string;
    title:string;
    constructor(index:number, ref:React.MutableRefObject<HTMLImageElement|null>,url:string,title:string){
        this.index=index;
        this.ref=ref;
        this.url=url;
        this.title=title;
    }
}





const Carousel:React.FC<CarouselProps> = ({imgs})=>{    
    let tempList:imgObject[] = []
    imgs.forEach((imgData,index)=>{
        const imgRef = useRef<HTMLImageElement | null>(null);
        tempList.push(new imgObject(index,imgRef,imgData.url,imgData.title))
    })

    const [currImg, setCurrImg] = useState<number>(0)
    const [imgList, setImgList] = useState<imgObject[]>(tempList)


    const selectImg = (idx:number)=>{
        if(imgList.length==1) return setCurrImg(0);
        if(idx<0){
            while(idx<0){
                idx=imgList.length+idx;
            }
        }
        if(idx>imgList.length-1){
            idx%=imgList.length;
        }
        setCurrImg(idx);
    }

    return (
        <div className="carousel-wrapper">
            <div className="curr-img">
                <a className="prev" onClick={()=>selectImg(currImg-1)}>&#10094;</a>
                <img
                    id="main-img"
                    src={imgList[currImg].url}
                    alt={imgList[currImg].title}
                ></img>
                <a className="next" onClick={()=>selectImg(currImg+1)}>&#10095;</a>
            </div>
            <div className="carousel">
                {imgList.map((img: imgObject) => {
                    return <img 
                        src={img.url} 
                        className={"carousel-img"+(img.index==currImg?" current":" ")} 
                        ref={img.ref}
                        alt={imgList[currImg].title}
                        key={img.index}
                        onClick={()=>selectImg(img.index)}
                    ></img>;
                })}
            </div>
        </div>
    )
}

export default Carousel;