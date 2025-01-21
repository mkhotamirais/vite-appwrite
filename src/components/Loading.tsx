import { PiSpinner } from "react-icons/pi";

export default function Loading() {
  return (
    <div className="flex justify-center mt-24">
      <PiSpinner size={32} className="animate-spin" />
    </div>
  );
}
