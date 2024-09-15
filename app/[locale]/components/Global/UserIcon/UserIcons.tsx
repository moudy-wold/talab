import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation" 
import { CiLogin } from "react-icons/ci";
import { LogOut } from "@/app/[locale]/api/auth";
import { toast } from 'react-toastify';
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
 
function UserIcons() {
  const router = useRouter();
  const path = usePathname()
  const [isLoading, setIsLoading] = useState(false);
 
  const [id, setId] = useState("")
  const [isLoggend, setIsLoggend] = useState<any>() 

  const handleLogOut = () => {
    setIsLoading(true)
    LogOut()
      .then((res) => {
        toast.success("تم تسجيل الخروج");
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 100);
        router.push("/")
      })
      .catch((err) => {
        toast.error( "لقد حدث خطأ");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
 
   
  return (
    <main className="">
      {isLoading && <Loader />}
      <div className="flex items-center justify-between">

        <div className="w-16 felx flex-col justify-center items-center relative  !z-[99999999] hover:scale-110 transition-all duration-200 ">
          {isLoggend ? <>
            <div
              className="flex items-center flex-col relative cursor-pointer mt-[2px]">
              
            
            </div>
          </> : <div className="ml-1">
            <Link href="/auth/login" className="flex flex-col items-center">
              <FaUserAlt className=" text-xl text-[#8c8c8c]" />
              <span className=" hidden lg:block mt-[4px] text-center text-sm">تسجيل الدخول</span>
            </Link>
          </div>
          }
        </div>
        
        
        
        
      </div>
    </main>
  );
}

export default UserIcons;
