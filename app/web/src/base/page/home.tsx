import { page } from 'web-init'
import axios from 'axios';
import {
  BsThermometer,
  BsEye,
  BsWind,
  BsTropicalStorm,
  BsCloudDrizzleFill,
  BsCloudHaze2Fill,
  BsWater
} from "react-icons/bs";
import {ImSpinner9} from "react-icons/im";
import {IoMdRainy, IoMdSunny, IoMdCloudy, IoMdThunderstorm, IoMdSnow, IoMdSearch} from "react-icons/io";
import {TbTemperatureCelsius, TbMist, TbCloudFog, TbTornado} from "react-icons/tb";
import {ChangeEvent, MouseEvent, useEffect, useState} from "react";
import {WeatherData} from "types/weather";

export default page({
  url: '/',
  component: ({}) => {
    const [data, setData] = useState<WeatherData>();
    const [input, setInput] = useState('');
    const [city, setCity] = useState('Sidoarjo');

    //initiating variable for API Key
    const APIKey = '722cf3cab03dd7cd2782b7c6963d3078';

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    }
    // console.log(input);
    const searchHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      if (input !== '') {
        setCity(input);
      }
      e.preventDefault();
    }

    useEffect(() => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
      axios.get(url).then((res) => {
        setData(res.data);
        console.log(res.data);
      });
    }, []);

    useEffect(() => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
      axios.get(url).then((res) => {
        setData(res.data);
      });
    }, [city]);

    const WeatherIcon = (props : any) => {
      console.log(props);
      switch (props.data.weather[0].main) {
        case 'Thunderstorm':
          return <IoMdThunderstorm {...props}/>
        case 'Drizzle':
          return <BsCloudDrizzleFill {...props}/>;
        case 'Rain':
          return <IoMdRainy {...props}/>;
        case 'Snow':
          return <IoMdSnow {...props}/>;
        case 'Haze':
          return <BsCloudHaze2Fill {...props}/>;
        case 'Clear':
          return <IoMdSunny {...props}/>;
        case 'Clouds':
          return <IoMdCloudy {...props}/>;
        case 'Mist':
          return <TbMist {...props}/>;
        case 'Smoke':
          return <TbMist {...props}/>;
        case 'Dust':
          return <IoMdRainy {...props}/>;
        case 'Fog':
          return <TbCloudFog {...props}/>;
        case 'Sand':
          return <TbMist {...props}/>;
        case 'Ash':
          return <TbMist {...props}/>;
        case 'Squall':
          return <BsTropicalStorm {...props}/>;
        case 'Tornado':
          return <TbTornado {...props}/>;
        default:
          return <></>;
      }
    }

    const date = new Date();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = weekday[date.getDay()];

    return (
        <>
          <div
              className="bg-blue w-full bg-cover px-6 lg:px-0 min-h-screen flex flex-col justify-center items-center ">
            <div className="text-6xl text-white my-4 font-bold">
              SIDICA
            </div>
            <form
                className="h-16 bg-black/[.2] w-full max-w-[48-px] lg:max-w-2xl rounded-3xl backdrop-blur-[40px] mb-4">
              <div className="flex text-2xl items-center py-3 pl-12 pr-3 relative h-full ">
                <input onChange={(e) => inputHandler(e)} type="text" placeholder="Search a City or Country"
                       className="flex flex-1 bg-transparent placeholder:text-gray text-white outline-none "/>

                <button onClick={(e) => searchHandler(e)}
                        className="w-32 h-12 flex justify-center items-center hover:bg-[#5dbea3] transition bg-[#33b249] text-center rounded-3xl">
                  <IoMdSearch size={32} color={"white"}/>
                </button>
              </div>
            </form>

            <div
                className="w-full max-w-[480px] lg:max-w-2xl bg-black/[.2] min-h-[584px] text-white backdrop-blur-[40px] rounded-3xl py-8 px-12">
              {!data ? (
                  //Bisa jadi Component
                  <div className="min-h-[500px] flex justify-center items-center ">
                    <div>
                      <ImSpinner9 className="text-4xl animate-spin"/>
                    </div>
                  </div>
              ) : (
                  <div className="">
                    <div>
                      <div className="flex gap-x-8">
                        <div>
                          <WeatherIcon size={140} color={"white"} data={data}/>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div
                              className="text-white text-3xl font-semibold">{data.name}, {data.sys.country}</div>
                          <div className="text-white text-2xl font-light">
                            {day} , {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center my-4">
                        <div className="flex">
                          <div className="text-white text-9xl font-normal leading-none">
                            {data.main.temp}
                          </div>
                          <div>
                            <TbTemperatureCelsius size={28} color={"white"}/>
                          </div>
                        </div>
                        <div className="text-2xl font-light capitalize text-center">
                          {data.weather[0].description}
                        </div>
                      </div>

                      <div className="flex flex-col max-w-[576px] mx-1 my-12 gap-y-6 justify-center">
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-x-2">
                            <div className="mx-4 "><BsThermometer size={42} color={"white"}/></div>
                            <div className="mr-3 text-[24px] font-thin flex-none lg:flex">
                                                <span className="hidden sm:block">
                                                    Feels like
                                                </span>
                              <div
                                  className="flex items-center ml-2 flex font-normal text-[16px] sm:text-[24px]">
                                {data.main.feels_like}
                                <TbTemperatureCelsius size={26} color={"white"}/>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-x-2">
                            <div className="mx-4 "><BsEye size={42} color={"white"}/></div>
                            <div className="mr-3 text-[24px] font-thin flex-none lg:flex ">
                                                <span className="hidden sm:block">
                                                    Visibility
                                                </span>
                              <span className="ml-2 font-normal text-[16px] sm:text-[24px]">
                                                    {(data.visibility) / 1000} km
                                                </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <div className="flex items-center gap-x-2">
                            <div className="mx-4 "><BsWind size={42} color={"white"}/></div>
                            <div className="mr-3 text-[24px] font-thin flex-none lg:flex">
                                                <span className="hidden sm:block">
                                                    Wind
                                                </span>
                              <span className="ml-1 font-normal w-full text-[16px] sm:text-[24px]">
                                                    {data.wind.speed}
                                <span className="ml-1 text-xl">m/s</span>
                                                </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-x-2">
                            <div className="mx-4 "><BsWater size={42} color={"white"}/></div>
                            <div className="mr-3 text-[24px] font-thin flex-none lg:flex">
                                                <span className="hidden sm:block">
                                                    Humidity
                                                </span>
                              <span className="ml-2 font-normal text-[16px] sm:text-[24px]">
                                                    {data.main.humidity} %
                                                </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </>
    );
  }
})