import {page} from 'web-init'
import {useEffect, useRef, useState} from "react";
import Navbar from "src/components/Navbar";
import WallInteriorImg from "src/assets/images/walldesign_1.jpg";
import Fotoku from "src/assets/images/Fotoku_2.png";
import OpenCVLogo from "src/assets/logo/opencv-logo-small.png";
//@ts-ignore
import InjectScript from "src/utils/InjectScript";
import "mirada";


export default page({
    url: '/customcolorimg',
    component: ({}) => {
        const img = useRef<HTMLCanvasElement>(null);
        const imgOutput = useRef<HTMLCanvasElement>(null);
        const [openCVLoaded, setOpenCVLoaded] = useState(false);
        const [imgSrcLoaded, setImgSrcLoaded] = useState(false);
        const [fileUploaded, setFileUploaded] = useState<File>();
        const [color, setImgSrc] = useState<string>();

        useEffect(() => {
            if (fileUploaded != undefined) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        const image = new Image();
                        image.src = e.target.result.toString();
                        image.onload = () => {
                            const canvas = img.current!
                            canvas.width = image.width;
                            canvas.height = image.height;
                            const context2D = canvas.getContext('2d')!;
                            context2D.drawImage(image, 0, 0);

                            const canvas2 = imgOutput.current!
                            canvas2.width = image.width;
                            canvas2.height = image.height;
                            const context2D2 = canvas2.getContext('2d')!;
                            context2D2.drawImage(image, 0, 0);
                            setImgSrcLoaded(true);
                        }
                    }
                }
                reader.readAsDataURL(fileUploaded);
            }
        }, [fileUploaded]);

        imgOutput.current?.addEventListener('mousedown', (e) => {
            const rect = imgOutput.current?.getBoundingClientRect();
            const scaleX = imgOutput.current!.width! / rect!.width!;
            const scaleY = imgOutput.current!.height! / rect!.height!;
            const x = (e.clientX - rect!.left!) * scaleX;
            const y = (e.clientY - rect!.top!) * scaleY;

            const imgProc = cv.imread(imgOutput.current!);
            const rgbImg = new cv.Mat();
            cv.cvtColor(imgProc, rgbImg, cv.COLOR_RGBA2RGB);
            const grayImg = new cv.Mat();
            cv.cvtColor(rgbImg, grayImg, cv.COLOR_RGB2GRAY);
            const cannyGrey = new cv.Mat();
            cv.Canny(grayImg, cannyGrey, 30, 75, 3);
            const mask = cv.matFromArray(3, 3, cv.CV_8U, [0, -1, 0, -1, 5, 11, 0, -1, 0]);

            const hsvImg = new cv.Mat();
            cv.cvtColor(rgbImg, hsvImg, cv.COLOR_RGB2HSV);
            const list = new cv.MatVector();
            cv.split(hsvImg, list);
            const schannel = new cv.Mat();
            const slist = new cv.MatVector();
            slist.push_back(list.get(1));
            cv.merge(slist, schannel);
            cv.medianBlur(schannel, schannel, 3);

            const cannyS = new cv.Mat();
            cv.Canny(schannel, cannyS, 30, 75, 3);
            cv.addWeighted(cannyS, 0.5, cannyGrey, 0.5, 0, cannyS);
            cv.dilate(cannyS, cannyS, mask, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());


            const coordinateSeedPoint = new cv.Point(x, y);
            cv.resize(cannyS, cannyS, new cv.Size(cannyS.cols + 2, cannyS.rows + 2));
            cv.floodFill(rgbImg, cannyS, coordinateSeedPoint, new cv.Scalar(255, 255, 255), new cv.Rect(), new cv.Scalar(20, 20, 20), new cv.Scalar(20, 20, 20), 4);

            cv.imshow("canvasOutput3", rgbImg);
            imgProc.delete();
        });



        useEffect(() => {
            if (!openCVLoaded) {
                const script = InjectScript("opencv", "https://docs.opencv.org/4.6.0/opencv.js");
                script.then(() => {
                    cv['onRuntimeInitialized'] = () => {
                        setOpenCVLoaded(true);
                    }
                }).catch(() => {
                    console.log("error");
                })
            }
        }, [])

//         useEffect(() => {
//             if (openCVLoaded && imgSrcLoaded) {
//                 let src = cv.imread(img.current!);
//                 let dst = new cv.Mat();
//                 cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
// // You can try more different parameters
//                 cv.Canny(src, dst, 50, 100, 3, false);
//                 cv.imshow('canvasOutput3', dst);
//                 src.delete();
//                 dst.delete();
//             }
//         }, [openCVLoaded, imgSrcLoaded])



        return (
            <>
                <Navbar/>
                <div className="bg-blue w-full bg-cover px-6 lg:px-0 min-h-screen flex flex-col items-center ">

                    <div className="text-6xl text-white my-16 font-bold flex">
                        <img width={60} src={OpenCVLogo} className="mr-3"></img>
                        OpenCV JS
                    </div>
                    <div className="grid mb-8">
                        <input type="file" onChange={(e) => {
                            setFileUploaded(e.target.files![0]);
                        }}/>
                    </div>
                    <div className="flex justify-between justify-center">
                        <div className="grid w-1/2 mx-4 border-gray border-8 rounded-xl p-4">
                            <div className="text-white font-bold text-2xl text-center pb-2">
                                Original Image
                            </div>
                            <canvas className="rounded-md object-contain w-full" id="src" ref={img}/>
                        </div>

                        <div className="grid w-1/2 mx-4 border-gray border-8 rounded-xl p-4">
                            <div className="text-white font-bold text-2xl text-center pb-2">
                                Canny Edge Detection
                            </div>
                            <canvas className="rounded-md object-contain w-full" id="canvasOutput3" ref={imgOutput}/>
                        </div>
                    </div>

                </div>
            </>
        );
    }
})