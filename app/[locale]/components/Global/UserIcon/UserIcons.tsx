import React, { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation"
import { CiLogout } from "react-icons/ci";
import { LogOut } from "@/app/[locale]/api/auth";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { useTranslation } from "@/app/i18n/client";
import { Modal, notification, } from "antd";
import { Languages } from "@/app/[locale]/utils/constant"
import Cookies from 'js-cookie';
import { MyContext } from "@/app/[locale]/context/myContext";
import Notifications from "@/app/[locale]/components/Global/Notifications/Notifications"
type Props = {
  locale: string;
  isLogend: boolean;
}
function UserIcons({ locale, isLogend }: Props) {
  const { t, i18n } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const [openLogOut, setOpenLogOut] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(locale);
  const router = useRouter();
  const currentPathname = usePathname();
  const { setLogined } = useContext(MyContext);


  // Handle Change Language
  const handleLocaleChange = (newLocale: any) => {
    if (!currentPathname) return;
    const pathWithoutLocale = currentPathname.replace(/^\/[^\/]+/, "");
    localStorage.setItem("direction", newLocale === "ar" ? "rtl" : "ltr");
    document.dir = newLocale === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(newLocale);
    router.push(`/${newLocale}${pathWithoutLocale}`);
    // setCurrentLocale(newLocale); // Update the local state
  };



  const handleLogOut = () => {
    setOpenLogOut(false)
    setIsLoading(true)
    LogOut()
      .then(() => {
        notification.success({ message: t("succeffly_logout") });
        localStorage.clear();
        Cookies.remove('token');
        setLogined(false)
        setTimeout(() => {
          window.location.reload();
        }, 100);
        router.push("/auth/login")
      })
      .catch((err) => {
        notification.error({ message: err.response.data.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }









  useEffect(() => {
    // التحقق من دعم المتصفح للإشعارات
    if ("Notification" in window) {
      // التحقق من حالة إذن الإشعارات
      if (Notification.permission === "default") {
        // طلب إذن المستخدم إذا لم يتم قبوله أو رفضه بعد
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("إذن الإشعارات مقبول.");
          } else {
            console.log("تم رفض إذن الإشعارات.");
          }
        });
      }
    } else {
      console.log("المتصفح لا يدعم الإشعارات.");
    }
  }, []);

  // دالة لعرض إشعار
  const showNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("عنوان الإشعار", {
        body: "هذه هي رسالة الإشعار.",
        icon: "/assets/logo.png", // اختياري: أيقونة للإشعار
      });
    }
  };
  return (
    <main className="">
      {isLoading && <Loader />}
      <div className="flex items-center justify-between">
        {/* Start Select */}
        <div className="mx-5">
          <select
            defaultValue={locale}

            onChange={(e) => {
              handleLocaleChange(e.target.value);
            }}
            className=""
          >
            {Languages.map((item: { id: number; title: string; value: string }, index: number) => {
              return (
                <Fragment key={index}>
                  <option value={item.value} key={index + 5}>
                    {item.title}
                  </option>

                </Fragment>
              );
            })}
          </select>
        </div>
        {/* End Select */}

        {/* Start Notificatiom Icon */}
        <Notifications locale={locale} isLogend={isLogend} />
        {/* End Notification Icon */}



        {/* Start Login &&& */}
        <div className="w-24 felx flex-col justify-center items-center relative  !z-[99999999] hover:scale-110 transition-all duration-200 ">
          {isLogend ? <>
            <div className="flex items-center flex-col relative cursor-pointer mt-[2px]" onClick={() => { setOpenLogOut(true) }}>
              <CiLogout className=" text-xl text-[#8c8c8c]" />
              <span className=" hidden lg:block mt-[4px]   text-center text-sm">{t("logout")}</span>
            </div>
          </> : <div className="ml-1">
            <Link href="/auth/login" className="flex flex-col items-center">
              <FaUserAlt className=" text-xl text-[#8c8c8c]" />
              <span className="hidden lg:block mt-[4px] text-center text-sm">{t("login")}</span>
            </Link>
          </div>
          }
        </div>
        {/* End Login &&& */}

        {/* Start LogOut Model */}
        <Modal
          title={t("logout")}
          centered
          open={openLogOut}
          okButtonProps={{}}
          onOk={() => { handleLogOut() }}
          onCancel={() => { setOpenLogOut(false) }}
          width={500}
        >
          <p>{t("are_you_sure_log_out")} </p>
        </Modal>
        {/* End LogOut Model */}


      </div>
    </main>
  );
}

export default UserIcons;
