import React, { useState } from "react";
import { IProduct } from "../../types";
import { collProductBucketId, collProductId, databases, dbId, storage } from "../../config";
import { toast } from "sonner";

interface ProductModalDelProps {
  i: number;
  product: IProduct;
  openModalDel: number | null;
  setOpenModalDel: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ProductModalDel({ i, product, openModalDel, setOpenModalDel }: ProductModalDelProps) {
  const [pending, setPending] = useState(false);

  const onDelete = () => {
    setPending(true);

    const deleteData = () => {
      databases
        .deleteDocument(dbId, collProductId, product.$id)
        .then(() => {
          toast.success(`Delete ${product.name} success`);
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => setPending(false));
    };

    if (product.imageId) {
      storage
        .deleteFile(collProductBucketId, product.imageId)
        .then(() => {
          deleteData();
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => setPending(false));
    } else {
      deleteData();
    }
  };

  return (
    <div
      onClick={() => setOpenModalDel(null)}
      className={`${
        openModalDel === i ? "opacity-100 visible" : "opacity-0 invisible"
      } transition-all duration-300 fixed inset-0 px-4 z-50 bg-gray-500/5`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          openModalDel === i ? "translate-y-0" : "-translate-y-8"
        } transition-all max-w-lg w-full border rounded-lg mx-auto bg-white mt-32 p-6`}
      >
        <div>
          <p>Delete {product?.name}, Are you sure?</p>
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onDelete} className="text-red-500 hover:underline">
              {pending ? "Deleting..." : "Delete"}
            </button>
            <button type="button" className="hover:underline" onClick={() => setOpenModalDel(null)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
