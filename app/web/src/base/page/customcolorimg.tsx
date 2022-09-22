import { page } from 'web-init'
import {useEffect, useRef, useState} from "react";
import Navbar from "src/components/Navbar";
import WindahFace from "src/assets/images/WindahFace.png";
import Fotoku from "src/assets/images/Fotoku_2.png";
import OpenCVLogo from "src/assets/logo/opencv-logo-small.png";
//@ts-ignore
import InjectScript from "src/utils/InjectScript";
import "mirada";


export default page({
  url: '/customcolorimg',
  component: ({}) => {
    const img = useRef(null);
    const [openCVLoaded, setOpenCVLoaded] = useState(false);
    const [imgSrcLoaded, setImgSrcLoaded] = useState(false);

    useEffect(()=> {
        if (!openCVLoaded){
            const script = InjectScript("opencv","https://docs.opencv.org/4.5.2/opencv.js");
            script.then(()=>{
                cv['onRuntimeInitialized'] = () => {
                    setOpenCVLoaded(true);
                }
            }).catch(()=>{
                console.log("error");
            })
        }
    }, [])

    useEffect(()=>{
        if (openCVLoaded && imgSrcLoaded){
            const src = cv.imread(img.current!);
            const dst = new cv.Mat();
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            cv.imshow('canvasOutput1', dst);
            src.delete();
            dst.delete();
        }
    }, [openCVLoaded, imgSrcLoaded])

    useEffect(()=>{
        if (openCVLoaded &&imgSrcLoaded){
            const src = cv.imread(img.current!);
            const dst = new cv.Mat();
            const low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
            const high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
// You can try more different parameters
            cv.inRange(src, low, high, dst);
            cv.imshow('canvasOutput2', dst);
            src.delete(); dst.delete(); low.delete(); high.delete();
        }
    }, [openCVLoaded, imgSrcLoaded])

      useEffect(()=>{
        if (openCVLoaded &&imgSrcLoaded){
            let src = cv.imread(img.current!);
            let dst = new cv.Mat();
            cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
// You can try more different parameters
            cv.Canny(src, dst, 50, 100, 3, false);
            cv.imshow('canvasOutput3', dst);
            src.delete(); dst.delete();
        }
    }, [openCVLoaded, imgSrcLoaded])


    return (
        <>
          <Navbar/>
          <div className="bg-blue w-full bg-cover px-6 lg:px-0 min-h-screen flex flex-col items-center ">

              <div className="text-6xl text-white my-16 font-bold flex">
                  <img width={60}  src={OpenCVLogo} className="mr-3"></img>
                  OpenCV JS
              </div>
              <div className="flex justify-between justify-center">
                  <div className="grid mx-4 border-gray border-8 rounded-xl p-4">
                      <div className="text-white font-bold text-2xl text-center pb-2">
                          Original Image
                      </div>
                      <img className="rounded-md" id="src" ref={img} src={WindahFace} onLoad={()=>setImgSrcLoaded(true)}/>
                  </div>

                  <div className="grid mx-4 border-gray border-8 rounded-xl p-4">
                      <div className="text-white font-bold text-2xl text-center pb-2">
                          Grayscale
                      </div>
                      <canvas className="rounded-md" id="canvasOutput1" width="200" ></canvas>
                  </div>

                  <div className="grid mx-4 border-gray border-8 rounded-xl p-4">
                      <div className="text-white font-bold text-2xl text-center pb-2">
                          Image InRange
                      </div>
                      <canvas className="rounded-md" id="canvasOutput2" width="200" ></canvas>
                  </div>
                  <div className="grid mx-4 border-gray border-8 rounded-xl p-4">
                      <div className="text-white font-bold text-2xl text-center pb-2">
                          Canny Edge Detection
                      </div>
                      <canvas className="rounded-md" id="canvasOutput3" width="200" ></canvas>
                  </div>
              </div>

          </div>
        </>
    );
  }
})