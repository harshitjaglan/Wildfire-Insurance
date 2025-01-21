const helperTexts = {
  brand: "Specifying brand name helps ensure like-quality replacement",
  serialNumber: "Important for electronics and high-value items",
  purchasePrice: "Helps establish item value for insurance claims",
  detailedDescription: "Include specific features, materials, and condition",
  photos: "Visual proof of ownership and condition",
} as const;

export const FormHelperText = ({
  field,
}: {
  field: keyof typeof helperTexts;
}) => {
  return <p className="text-gray-600 text-sm mt-1">{helperTexts[field]}</p>;
};
