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
    url:string;
    title:string;
    constructor(index:number,url:string,title:string){
        this.index=index;
        this.url=url;
        this.title=title;
    }
}





const Carousel:React.FC<CarouselProps> = ({imgs})=>{    
    const [currImg, setCurrImg] = useState<number>(0)
    
    let imgList:imgObject[] = []
    imgs.forEach((imgData,index)=>{
        imgList.push(new imgObject(index,imgData.url,imgData.title))
    })

    


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
                    src={imgList.length>0 ? imgList[currImg].url:""}
                    alt={imgList.length>0 ? imgList[currImg].title:"No picture"}
                ></img>
                <a className="next" onClick={()=>selectImg(currImg+1)}>&#10095;</a>
            </div>
            <div className="carousel">
                {imgList.map((img: imgObject) => {
                    return <img 
                        src={img.url} 
                        className={"carousel-img"+(img.index==currImg?" current":" ")}
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