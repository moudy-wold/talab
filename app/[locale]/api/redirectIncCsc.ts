import { redirect } from "next/navigation";


export default async function RedirectInCsc() {
    console.log("works")
    if (typeof window === 'undefined') {
            redirect("/auth/login");
    } else {
        window.location.href = "/auth/login";
    }
}
