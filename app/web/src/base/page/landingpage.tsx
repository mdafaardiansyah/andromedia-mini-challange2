import { page } from 'web-init'
import Navbar from "src/components/Navbar";

export default page({
  url: '/landingpage',
  component: ({}) => {

    return (
        <>

        <Navbar/>
        <div className="bg-blue w-full bg-cover px-6 lg:px-0 min-h-screen flex flex-col justify-center items-center ">

        </div>
        </>
        )
  }
})