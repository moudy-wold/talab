import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GettStaticits_top_viewed_products(): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab/products/statistics/top-viewed-products`);
}

export async function GettStaticits_top_ordered_products(): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab/products/statistics/top-ordered-products`);
}
