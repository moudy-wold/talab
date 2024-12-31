"use client";

import { useEffect, useState } from "react";

const StripHtmlTags = ({ htmlString }) => {
    const [strippedString, setStrippedString] = useState("");

    useEffect(() => {
        const stripTags = (str) => {
            if (typeof document !== "undefined") {
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = str;
                return tempDiv.textContent || tempDiv.innerText || "";
            }
            return str;  // في حال عدم وجود document، نعيد النص كما هو
        };
        setStrippedString(stripTags(htmlString));
    }, [htmlString]);  // عندما يتغير htmlString

    return <div>{strippedString}</div>;
};

export default StripHtmlTags;
