export const ReturnStatus = [
  {
    value: "pending",
    id: "1",
    label: "قيد الانتظار",
  },
  {
    value: "accepted",
    id: "2",
    label: "تم القبول",
  },
  {
    value: "rejected",
    id: "3",
    label: "مرفوض",
  },
  {
    value: "money_and_product_refunded",
    id: "4",
    label: "تم استرداد المال والمنتج",
  },
];

export const OrderStatus = [
  {
    value: "pending",
    id: "1",
    label: "قيد الدراسة",
  },
  {
    value: "preparing",
    id: "2",
    label: "جاري التجهيز",
  },
  {
    value: "in_shipping",
    id: "3",
    label: "في الشحن",
  },
  {
    value: "done",
    id: "4",
    label: "تم التسليم",
  },
  {
    value: "refound",
    id: "5",
    label: "إعادة",
  },
  {
    value: "cancelled",
    id: "6",
    label: "تم التسليم",
  },
];
// {
//   value: "pending_cancellation",
//   id: "4",
//   label: "تم التسليم"
// },
export const CategoriesList = [
  {
    id: 1,
    value: "الشاشات",
  },
  {
    id: 2,
    value: "سوكة الشحن",
  },
  {
    id: 3,
    value: "آيسيات",
  },
  {
    id: 4,
    value: "إكسسوارات",
  },
  {
    id: 5,
    value: "بطاريات",
  },
  {
    id: 6,
    value: "لزقات حماية",
  },
  {
    id: 7,
    value: "لمس",
  },
  {
    id: 8,
    value: "سماعات",
  },
];

export const Languages = [
  { id: 1, title: "AR", value: "ar" },
  { id: 2, title: "EN", value: "en" },
  { id: 3, title: "TR", value: "tr" },
];

export const Currencies = [
  { id: 1, label: "₺ Türk Lirası", value: "tr" },
  { id: 2, label: "$ Dollar", value: "dolar" },
];
