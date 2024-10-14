import React, { useEffect, useState } from "react";
import Image from "next/image";

function GlobalRating({average_rating}:any) {
    const [ratingMarge, setRatingMarge] = useState([false, false, false, false, false])    
    useEffect(() => {
        const updatedMarge = ratingMarge.map((_, index) => index < average_rating);
        setRatingMarge(updatedMarge);
    }, [])
    return (
        <div>
            <ul className="flex gap-1 ">
                {ratingMarge?.map((item: any) => (

                    <li className="">

                        {item ?
                            <Image alt="star" src="/assets/svg/fullStar.svg" width={17} height={17} className="" />
                            :
                            <Image alt="star" src="/assets/svg/emptyStar.svg" width={15} height={15} className="" />
                        }
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default GlobalRating;