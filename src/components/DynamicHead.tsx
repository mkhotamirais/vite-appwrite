import { Helmet } from "react-helmet-async";

interface DynamicHeadProps {
  title?: string;
  description?: string;
}

export default function DynamicHead({ title, description }: DynamicHeadProps) {
  return (
    <Helmet>
      <title>{title || "Vite Appwrite"}</title>
      <meta name="description" content={description || "Description Vite Appwrite"} />
    </Helmet>
  );
}
