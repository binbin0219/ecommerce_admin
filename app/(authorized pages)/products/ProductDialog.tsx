import Dialog from "@/components/Dialog"
import InputField from "@/components/InputField/InputField";
import { useState } from "react";

type Props = {
  isOpen: boolean
  isEdit: boolean;
  onClose: () => void;
}

type FormData = {
    username: string | null;
}

export default function ProductDialog({isOpen, isEdit, onClose}: Props) {
    const [formData, setFormData] = useState<FormData>({
        username: null,
    })
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <p className="text-lg font-medium">
                {isEdit ? "Edit Product" : "Add Product"}
            </p>
            <div className="">
                <p>Name</p>
                <InputField
                value={formData.username}
                setter={(value) => setFormData(prev => ({ ...prev, username: value }))}/>
            </div>
        </Dialog>
    )
}