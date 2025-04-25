import { ToastContainer } from "react-toastify";
import FileUpload from "./FileUpload";

export default function App() {
  return (
    <div className="p-8">
      <FileUpload />
      <ToastContainer />
    </div>
  );
}
