import { AddAnswer} from "@/app/[locale]/api/products";
import { useTranslation } from "@/app/i18n/client";
import { Button, Form, Input, notification, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import moment from "moment";
import { useRouter } from "next/navigation";
type Props = {
    locale: any,
    product_id: string,
    questions: any
    store?: any,
}


function ProductQuestion({ locale, product_id, questions, store }: Props) {
    const { t } = useTranslation(locale, "common");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [openAnswer, setOpenAnswer] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [question_id, setQuestion_id] = useState("")
    

    const onFinishAnswer = async () => {
        setIsLoading(true)
        try {
            const res = await AddAnswer(question_id, answer)
            notification.success({
                message: t("sent_question_successfully")
            })
            setAnswer("");
            setOpenAnswer(false);
        } catch (err: any) {
            console.log(err)
            notification.error({
                message: err.response.data.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const userRole: any = localStorage.getItem("userRole");
        const pareUserRole = JSON.parse(userRole);
        setUserRole(pareUserRole)
    }, [])

    return (
        <div className="py-7 px-5 border-t-2 border-gray-300 ">
            {isLoading && <Loader />}
            {/* Start Title */}
            <div>
                <h1 className="w-fit border-b-[1px] border-black text ">{t("ask_question")}</h1>
            </div>
            {/* End Title */}

            {/* Start Show Qewstion */}
            {questions?.length == 0 && <p className="mt-2">{t("no_questions_yet")}</p>}
            <div className="flex flex-col gap-3 my-3 p-3 min-h-16">
                {questions?.map((ques: any) => (
                    <div className="min-w-[220px] !max-w-[350px] my-3">
                        <div className=" bg-[#f0f2f5] p-2 px-3 rounded-lg">
                            {/* Start Name */}
                            <p className="">{ques.user_name}</p>
                            {/* End Name */}

                            {/* Start Question */}
                            <p>{ques.question}</p>
                            {/* End Question */}
                        </div>

                        <div className="flex items-center gap-4 p-[2px]">
                            {!store && ques.answer == "" && userRole != "customer" &&
                                <button onClick={() => { setOpenAnswer(true); setQuestion_id(ques.id) }} className="text-sm text-[#006496] cursor-pointer hover:scale-105 hover:text-black"  >{t("answer")}</button>
                            }
                            <span className="text-[13px]">{moment(ques.created_at).locale("en").format("DD/MM/YYYY HH:mm")}</span>
                        </div>
                        {/* Start Answer */}
                        {ques.answer != "" && 
                            <div className={`bg-[#f0f2f5] p-1 px-3 rounded-lg mx-3 mt-2`}>
                                <p className=" text-[#006496] text-sm ">{t("seller_answer")}</p>
                                <p className="mt-1">{ques.answer}</p>
                            </div>
                        }
                        {/* End Answer */}


                        {openAnswer &&question_id == ques.id &&
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="!py-2 mx-3 outline-none focus:border-[1px] focus:!border-[#006496] "
                                    placeholder={t("write_your_answer")}
                                />
                                <Button
                                    className={`!py-5 border-[1px] border-[#006496] text-base text-[#006496] bg-white transition-all  ${answer.trim() !== '' ? 'hover:bg-[#006496] hover:text-white  ' : 'opacity-50 cursor-not-allowed'} `}
                                    disabled={answer.trim() === ''}
                                    onClick={() => { answer.trim() !== '' ? onFinishAnswer() : null }}
                                >
                                    {t("answer")}</Button>
                            </Space.Compact>
                        }
                    </div>
                ))}
            </div>
            {/* End Show Qewstion */}
 
        </div>
    )
}
export default ProductQuestion;