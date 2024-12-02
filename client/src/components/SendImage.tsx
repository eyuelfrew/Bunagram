import { MdOutlineAttachFile } from "react-icons/md";
import PreviewComponent from "./Modals/PreviewComponent";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { EncryptMessageToServer } from "../utils/EncryptionService";
import { SendCaption } from "../apis/Chat";

const SendImage = () => {
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const [isLoading, setIsLoading] = useState(false);
  const Recever = useSelector((state: Root_State) => state.ReceiverReducer);
  const [image, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [caption, setCaption] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setIsLoading(false);
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };
  const handleClosePreview = () => {
    setSelectedFile(null);
    setPreview("");
    setCaption("");
  };
  const handleSend = async () => {
    if (image) {
      setIsLoading(true);
      const formData = new FormData();
      const cypherText = await EncryptMessageToServer(caption);
      if (caption.trim() != "") {
        formData.append("text", cypherText);
      } else {
        formData.append("text", "");
      }
      formData.append("reciver_id", Recever.recever_id);

      formData.append("image", image);
      const response = await SendCaption(formData);
      if (response.success) {
        setIsLoading(false);
        setSelectedFile(null);
        setPreview("");
        setCaption("");
      }
    }
  };
  return (
    <>
      <label
        htmlFor="send_pic"
        className="hover:bg-slate-800 p-2 cursor-pointer rounded-full"
      >
        <MdOutlineAttachFile
          size={30}
          className={`${darkMode ? "text-[#fefefe]" : ""}`}
        />
        <input
          className="hidden"
          onChange={handleImageChange}
          type="file"
          id="send_pic"
          accept="image/*"
        />
      </label>
      {image && (
        <PreviewComponent
          preview={preview}
          file={image}
          caption={caption}
          onCaptionChange={setCaption}
          onClose={handleClosePreview}
          onSend={handleSend}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default SendImage;
