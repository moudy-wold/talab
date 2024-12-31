import React, { useEffect, useState } from "react";
import { DeleteAllNotifications, DeleteNotoficationById, GetAllNotifications, SetAllNotoficationAsRead, SetNotoficationAsReadById } from "@/app/[locale]/api/notifications";
import { IoNotificationsOutline } from "react-icons/io5";
import { Menu, notification, Pagination, Space, Spin } from "antd";
import { useTranslation } from "@/app/i18n/client";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import {  useRouter } from "next/navigation"
import { MdDeleteForever, MdOutlineDone } from "react-icons/md";
import Link from "next/link";
import { SlOptions } from "react-icons/sl"
import { IoIosNotificationsOff } from "react-icons/io";
import useEcho from "@/app/[locale]/api/echo";

function Notifications({ locale, isLogend }: any) {
    const { t } = useTranslation(locale, "common");
    const router = useRouter();
    const [isHoveredOnNotificationIcon, setIssHoveredOnNotificationIcon] = useState(false);
    const [notificationsLength, setNotificationsLength] = useState<any>(0);
    const [isLoadingOnAllNotificationAsRead, setIsLoadingOnAllNotificationAsRead] = useState(false)
    const [notificatioItems, setNotificatioItems] = useState([]);
    const [isLoadingOnNotificationAsRead, setIsLoadingOnNotificationAsRead] = useState(false)
    const [isLoadingForPagination, setIsLoadingForPagination] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState<any>(0);


    // useEffect(() => {
    //     const isLogend: any = localStorage.getItem("isLogend");
    //     if (isLogend == "true") {
    //         getNotificationData();
    //     }
    // }, [isLogend]);

    const handlePageChange = async (page: any) => {
        setIsLoadingForPagination(true);
        try {
            const res = await GetAllNotifications(page);
            setTotalItems(res.data.pagination.total);
            setPageSize(res.data.pagination.per_page);
            setCurrentPage(page)
            setNotificatioItems(res?.data?.data)
            setNotificationsLength(res.data.data[0].unread_count)
        } catch (err: any) {
            notification.error({
                message: err.response.data.message,
            });
        } finally {
            setIsLoadingForPagination(false);
        }

    };

    // Fetch Notification Data In First 
    const getNotificationData = async () => {
        try {
            const res = await GetAllNotifications(1);
            setTotalItems(res.data.pagination.total);
            setPageSize(res.data.pagination.per_page);
            setNotificatioItems(res?.data?.data)
            setNotificationsLength(res?.data?.data[0]?.unread_count)
        } catch (err: any) {
            console.log(err)
        }
    }
    const handleMouseEnterOnNotificationsIcon = () => {
        setIssHoveredOnNotificationIcon(true);
    };

    const handleMouseLeaveOnNotificationsIcon = () => {
        setIssHoveredOnNotificationIcon(false);
    };

    const SetAllNotificationAsRed = async () => {
        setIsLoadingOnAllNotificationAsRead(true);
        try {
            const res = await SetAllNotoficationAsRead()
            console.log(res)
            setNotificationsLength(0)
            notification.success({
                message: t("set_all_notification_as_readed")
            })
            router.refresh()
        }
        catch (err: any) {
            console.log(err)
        } finally {
            setIsLoadingOnAllNotificationAsRead(false);

        }
    }

    const DeleteAllNotification = async () => {
        setIsLoadingOnAllNotificationAsRead(true);
        try {
            const res = await DeleteAllNotifications()
            console.log(res)
            notification.success({
                message: t("set_all_notification_as_readed")
            })
            setNotificationsLength(0)
            setNotificatioItems([])
            router.refresh()
        }
        catch (err: any) {
            console.log(err)
        } finally {
            setIsLoadingOnAllNotificationAsRead(false);

        }
    }
    const SetNotificationAsReadOnClic = async (id: string) => {
        try {
            await SetNotoficationAsReadById(id);
            setNotificationsLength(notificationsLength - 1)
            router.refresh();

        } catch (err: any) {
            console.log(err.response)

        }
    }
    const SetNotificationAsRead = async (id: string) => {
        setIsLoadingOnNotificationAsRead(true);
        try {
            const res = await SetNotoficationAsReadById(id);
            console.log(res.data)
            notification.success({
                message: t("set_notification_as_readed")
            })
            setNotificationsLength(notificationsLength - 1)
            router.refresh()
        } catch (err: any) {
            console.log(err.response)
            notification.error({
                message: err.response.data.message
            })
        } finally {
            setIsLoadingOnNotificationAsRead(false);
        }
    }

    const DeleteNotificationById = async (id: string) => {
        setIsLoadingOnNotificationAsRead(true);
        try {
            const res = await DeleteNotoficationById(id);
            console.log(res.data)
            notification.success({
                message: t("set_notification_as_readed")
            })
            router.refresh()
            setNotificatioItems(prevData => prevData.filter((item: any) => item.id !== id));
        } catch (err: any) {
            console.log(err.response)
            notification.error({
                message: err.response.data.message
            })
        } finally {
            setIsLoadingOnNotificationAsRead(false);
        }
    }
    const echo: any = useEcho();

    useEffect(() => {
        const user_id = localStorage.getItem("userId");
        if (user_id != undefined && user_id != "undefined") {

            if (echo) {
                // console.log('Echo connection success:', echo);
                var userID = JSON.parse(user_id); // Replace the following with the current user's ID from authentication

                const channelName = `notifications.${userID}`;

                const channel = echo.private(channelName)
                    .listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', async (event: any) => {
                        console.log('Notification received:', event);
                        // your code funtions or logic here write for notify web socket
                    })
                    .error((error: any) => {
                        console.error('Error in channel subscription:', error);
                    });


                // test channel test
                echo.channel('new').listen('NewEvent', async (e: any) => {
                    console.log(e);
                });

                // can u use the const chaneel or the down code channel_1 for listen notifications
                // *******************************

                // const channel_1 = echo.private(channelName).notification((notification) => {
                //     console.log('notify',notification);
                // })
                // .error((error) => {
                //     console.error('Error in channel subscription:', error);
                // });

                // console.log(channel);

                return () => {
                    channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
                    echo.leaveChannel(`private-notifications.${userID}`);
                    // echo.leave(`notifications.${userID}`);
                };

            } else {
                console.log('WebSocket not connected');
            }
        }

    }, [echo]);

    return (
        <div>
            <div
                className={`${isLogend ? "flex" : "hidden"} !flex-col justify-center items-center mx-5 mt-1 relative !z-[99999999] shadow-2xl hover:scale-110 transition-all duration-200`}
                onMouseEnter={handleMouseEnterOnNotificationsIcon}
                onMouseLeave={handleMouseLeaveOnNotificationsIcon}
            >
                <span className={`${notificationsLength > 0 ? "flex" : "hidden"} absolute -top-[5px] left-[16%] cursor-pointer bg-[#006496] text-[9px] text-center text-white rounded-lg p-[2px] px-[6px] pr-[7px]`}>
                    {notificationsLength}
                </span>
                <IoNotificationsOutline className="text-xl cursor-pointer  text-[#8c8c8c]" />
                <p className="hidden lg:block mt-1 text-sm text-center cursor-pointer  ">
                    {t("notifications")}
                </p>
                <div className={`absolute !z-[99999999] top-[70px] -left-[126px] w-[320px] p-2 bg-gray-50 rounded-md transition-all duration-300  before:block before:absolute before:border-8 before:border-t-transparent before:border-r-transparent before:border-b-[#f1f1f1] before:border-l-transparent before:-top-[15px] before:right-[46%] ${isHoveredOnNotificationIcon ? "opacity-100 visible" : "opacity-0 invisible"} `}>
                    <ul className={`max-h-[402px] overflow-auto pt-3`}>
                        <li className={`mb-3 px-3`} >
                            <div className={`${notificationsLength > 0 ? "justify-between" : "justify-end"} flex items-center  `}>
                                <button onClick={() => { SetAllNotificationAsRed() }} className={`${notificationsLength > 0 ? "flex" : "hidden"} border-0 border-b-[1px] border-b-[#006496] text-[#006496] text-xs hover:scale-105 transitin-all duration-150`}>
                                    {t("set_all_as_readed")}
                                    {isLoadingOnAllNotificationAsRead &&
                                        <Space size="small" className="mx-1">
                                            <Spin size="small" />
                                        </Space>}
                                </button>
                                <button onClick={() => { DeleteAllNotification() }} className={`${notificatioItems.length > 0 ? "flex" : "hidden"} items-center gap-2 border-0 border-b-[1px] border-b-[#006496] text-[#006496] text-xs hover:scale-105 transitin-all duration-150 `}>
                                    {t("delete_all")}
                                    <MdDeleteForever className="text-lg" />
                                    {isLoadingOnAllNotificationAsRead &&
                                        <Space size="small" className="mx-1">
                                            <Spin size="small" />
                                        </Space>}
                                </button>
                            </div>
                        </li>
                        {notificatioItems.length ? (notificatioItems?.map((item: any, index: number) => (
                            <li key={index} className="bg-white rounded-md my-3 py-1 px-3">
                                <Link
                                    className="relative"
                                    onClick={() => { SetNotificationAsReadOnClic(item.id) }}
                                    href={item.data.title === "new_order" ? "/dashboard/orders" : item.data.title === "new_question" ? `/dashboard/products/edit/${item?.data?.data?.id}` : item.data.title === "commission_weekly" ? `/dashboard/accounting` : item.data.title === " distributor_product" ? `/dashboard/products/edit/${item?.data?.data?.id}` : "#"}
                                >
                                    <span className={`${item.read_at != "" ? "hidden" : "block"} w-2 h-2 bg-red-600 rounded-full absolute top-1 -right-[6px] `}></span>
                                    <p className="mr-2 text-sm  transition-all duration-200 hover:scale-105">
                                        {item.data.message}  {item.data.title == "product" || item.data.title == "order" && `${t("from"), item.data.data.customer_name}`}
                                        {item.data.title == "order_status" && `${t("to"), item.data.data.status} `}
                                    </p>
                                </Link>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-xs text-[#8c8c8c] ">{item.created_at}</span>
                                    <Menu
                                        className="!m-0 notification-menu"
                                        mode="horizontal"
                                        items={[{
                                            label: '',
                                            key: 'option',
                                            icon: <SlOptions />,
                                            children: [
                                                {
                                                    type: 'group',
                                                    label: <button onClick={() => { SetNotificationAsRead(item.id) }} disabled={item.read_at != "" ? true : false} className={`${item.read_at != "" ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-between  gap-2 text-sm text-black  border-[#8c8c8c] p-[2px] rounded-md hover:text-[#006496] hover:border-[#006496] transition-all duration-150`}>
                                                        <MdOutlineDone className="text-lg" />
                                                        <p>{t("set_as_readed")}</p>

                                                    </button>,
                                                },
                                                {
                                                    type: 'group',
                                                    label: <button onClick={() => { DeleteNotificationById(item.id) }} className={`flex items-center justify-between  gap-2 text-sm text-black  border-[#8c8c8c] p-[2px] rounded-md hover:text-[#006496] hover:border-[#006496] transition-all duration-150`}>
                                                        <MdDeleteForever className="text-lg" />
                                                        <p>{t('delete_notification')}</p>

                                                    </button>,
                                                },
                                            ],
                                        },]}
                                    />

                                </div>

                            </li>
                        ))) : (
                            <li className="m-2 p-3  rounded-lg ">
                                <IoIosNotificationsOff className="mx-auto text-2xl text-[#8c8c8c]" />
                                <p className="w-fit mx-auto text-[#8c8c8c]">{t("there_ara_no_notification_yet")}</p>
                            </li>)}
                    </ul>
                    {isLoadingForPagination &&
                        <div className="flex items-center justify-center">
                            <Space size="large" >
                                <Spin size="large" />
                            </Space>
                        </div>
                    }
                    {/* Start Pagination */}
                    <div className={`${notificationsLength > 0 ? "block" : "hidden"}  mt-5 [&>ul]:flex [&>ul]:items-center [&>ul>li]:border-[1px] [&>ul>li]:!pb-[3px] [&>ul>li]:border-[#006496] [&>ul>li]:rounded-md] [&>ul]:w-full notification-pagination`}>
                        <Pagination
                            current={currentPage}
                            total={totalItems}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            simple
                        />

                    </div>
                    {/* End Pagination */}
                </div>
            </div>
        </div>
    )
}

export default Notifications