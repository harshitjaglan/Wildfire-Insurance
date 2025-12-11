import { t } from "../i18n";

const helperTexts = {
     brand: t("formHelper.text.brand"),
     serialNumber: t("formHelper.text.serial"),
     purchasePrice: t("formHelper.text.price"),
     detailedDescription: t("formHelper.text.description"),
     photos: t("formHelper.text.photos"),
} as const;

export const FormHelperText = ({
     field,
}: {
     field: keyof typeof helperTexts;
}) => {
     return <p className="text-gray-600 text-sm mt-1">{helperTexts[field]}</p>;
};
